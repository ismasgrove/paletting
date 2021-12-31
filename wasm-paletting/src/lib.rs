mod utils;

// #[cfg(feature = "parallel")]
use rayon::prelude::*;

// #[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;

use std::{cmp::Ordering, convert::TryInto};

#[allow(unused_imports)]
use image::{
    DynamicImage, EncodableLayout, GenericImageView, ImageBuffer, ImageFormat, ImageOutputFormat,
    Rgba,
};
use palette::{ColorDifference, FromColor, GetHue, Hsva, IntoColor, Lab, Srgba};

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

macro_rules! partial_cmp {
    ($a:expr, $b:expr) => {
        $a.partial_cmp(&$b).unwrap()
    };
}

macro_rules! hue_deg {
    ($hsv:expr) => {
        $hsv.get_hue().unwrap_or(0.0.into()).to_positive_degrees()
    };
}

macro_rules! rgba2hsva {
    ($srgba:expr) => {
        Hsva::from_color(Srgba::new(
            $srgba[0] as f32 / 255.,
            $srgba[1] as f32 / 255.,
            $srgba[2] as f32 / 255.,
            $srgba[3] as f32 / 255.,
        ))
    };
}

macro_rules! color_extractor {
    ($p:expr, $colors:expr, $min_dist:expr) => {{
        let rgb: [u8; 4] = [$p[0], $p[1], $p[2], $p[3]];
        if !$colors
            .iter()
            .any(|other| ImageView::color_diff(&rgb, other) < $min_dist)
        {
            $colors.push(rgb);
        }
    }};
}

#[wasm_bindgen]
#[derive(PartialEq, Copy, Clone)]
pub enum SortMode {
    HUE,
    SATURATION,
    BRIGHTNESS,
    NONE,
}

#[allow(dead_code)]
#[wasm_bindgen]
pub struct ImageView {
    state: Vec<u8>,
    sort_mode: SortMode,
    img: DynamicImage,
    sorted_img: Option<DynamicImage>,
    pixel_img: Option<DynamicImage>,
    pixel_palette: Vec<[u8; 4]>,
    format: ImageFormat,
}

#[wasm_bindgen]
impl ImageView {
    #[wasm_bindgen(constructor)]
    pub fn new(buf: &[u8]) -> ImageView {
        utils::set_panic_hook();

        let img = image::load_from_memory(buf).expect("Buffer wasn't loaded correctly");
        let format = image::guess_format(buf).expect("Unsupported format");

        // let mut resize_buf = Vec::<u8>::new();
        // if img.width() > 800 || img.height() > 800 {
        // img.resize(800, 800, image::imageops::FilterType::Nearest);
        // img.write_to(&mut resize_buf, ImageOutputFormat::Png)
        // .unwrap();
        // }

        ImageView {
            state: buf.to_vec(),
            sort_mode: SortMode::NONE,
            img,
            sorted_img: None,
            pixel_img: None,
            pixel_palette: vec![],
            format,
        }
    }

    pub fn size(&self) -> usize {
        self.state.len()
    }

    pub fn buffer_ptr(&self) -> *const u8 {
        self.state.as_ptr()
    }

    pub fn get_copy(&self) -> Vec<u8> {
        self.state.clone()
    }

    #[allow(dead_code)]
    fn get(&self) -> &Vec<u8> {
        &self.state
    }

    pub fn reset_pixelation(&mut self) {
        self.pixel_palette.clear();
        self.pixel_img = None;

        let mut buf = Vec::<u8>::new();

        let img = match &self.sorted_img {
            Some(sorted_img) => sorted_img,
            None => &self.img,
        };

        img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();

        self.state = buf;
    }

    pub fn reset(&mut self) {
        self.pixel_palette.clear();
        self.pixel_img = None;
        self.sorted_img = None;

        let mut buf = Vec::<u8>::new();

        self.img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();

        self.state = buf;
    }

    // #[cfg(feature = "parallel")]
    pub fn sort_buffer(&mut self, mode: SortMode) {
        if mode == SortMode::NONE {
            return;
        }

        let img = match &self.pixel_img {
            Some(pixel_img) => pixel_img,
            None => &self.img,
        }
        .to_rgba8();

        let mut chunks: Vec<_> = img.pixels().copied().collect();

        let hsva_sorter = |a: Hsva, b: Hsva| -> Ordering {
            match mode {
                SortMode::HUE => partial_cmp!(hue_deg!(a), hue_deg!(b)),
                SortMode::SATURATION => partial_cmp!(a.saturation, b.saturation),
                SortMode::BRIGHTNESS => partial_cmp!(a.value, b.value),
                SortMode::NONE => Ordering::Equal, // should never happen, handled in TS
            }
        };

        chunks.par_sort_unstable_by(|a, b| hsva_sorter(rgba2hsva!(a.0), rgba2hsva!(b.0)));

        let mut image_buffer: ImageBuffer<Rgba<u8>, _> =
            ImageBuffer::new(img.width(), img.height());

        for j in 0..img.height() {
            for i in 0..img.width() {
                image_buffer.put_pixel(i, j, chunks[(i + j * img.width()) as usize]);
            }
        }

        let img = DynamicImage::ImageRgba8(image_buffer);

        let mut buf = vec![];

        img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();

        self.sorted_img = Some(img);
        self.state = buf;
        self.sort_mode = mode;
    }

    // #[cfg(feature = "parallel")]
    pub fn pixelate(&mut self, factor: f32) {
        self.pixel_palette.clear();

        let img = match &self.sorted_img {
            Some(sorted_img) => sorted_img,
            None => &self.img,
        }
        .to_rgba8();

        let mut image_buffer: ImageBuffer<Rgba<u8>, _> =
            image::ImageBuffer::new(img.width(), img.height());

        let mut pixel_palette: Vec<[u8; 4]> = vec![];

        let (x_factor, y_factor): (u32, u32) = (
            (factor * img.width() as f32).floor() as u32,
            (factor * img.height() as f32).floor() as u32,
        );

        (0..img.width()).step_by(x_factor as usize).for_each(|x| {
            (0..img.height()).step_by(y_factor as usize).for_each(|y| {
                let (mut ar, mut ag, mut ab, mut aa): (u32, u32, u32, u32) = (0, 0, 0, 0);
                let (max_x, max_y) = (
                    (x + x_factor).min(img.width()),
                    (y + y_factor).min(img.height()),
                );

                (x..max_x).for_each(|x_inner| {
                    (y..max_y).for_each(|y_inner| {
                        let pixel = img.get_pixel(x_inner, y_inner);
                        ar += pixel.0[0] as u32;
                        ag += pixel.0[1] as u32;
                        ab += pixel.0[2] as u32;
                        aa += pixel.0[3] as u32;
                    })
                });

                ar /= (max_x - x) * (max_y - y);
                ag /= (max_x - x) * (max_y - y);
                ab /= (max_x - x) * (max_y - y);
                aa /= (max_x - x) * (max_y - y);

                let (ar, ag, ab, aa): (u8, u8, u8, u8) = (
                    ar.try_into()
                        .expect("Overflow error while calculating averages!"),
                    ag.try_into()
                        .expect("Overflow error while calculating averages!"),
                    ab.try_into()
                        .expect("Overflow error while calculating averages!"),
                    aa.try_into()
                        .expect("Overflow error while calculating averages!"),
                );

                if aa >= 100 {
                    pixel_palette.push([ar, ag, ab, aa]);
                }

                (x..max_x).for_each(|x_inner| {
                    (y..max_y).for_each(|y_inner| {
                        image_buffer.put_pixel(
                            x_inner,
                            y_inner,
                            Rgba {
                                0: [ar, ag, ab, aa],
                            },
                        );
                    })
                });
            })
        });

        let img = DynamicImage::ImageRgba8(image_buffer);

        let mut buf = Vec::<u8>::new();

        img.write_to(&mut buf, ImageOutputFormat::Png).unwrap();

        // buf
        self.pixel_img = Some(img);
        self.pixel_palette = pixel_palette;
        self.state = buf;
    }

    fn color_diff(a: &[u8; 4], b: &[u8; 4]) -> f32 {
        let (a_lab, b_lab): (Lab, Lab) = (
            Srgba::new(
                a[0] as f32 / 255.,
                a[1] as f32 / 255.,
                a[2] as f32 / 255.,
                a[3] as f32 / 255.,
            )
            .into_color(),
            Srgba::new(
                b[0] as f32 / 255.,
                b[1] as f32 / 255.,
                b[2] as f32 / 255.,
                b[3] as f32 / 255.,
            )
            .into_color(),
        );

        a_lab.get_color_difference(&b_lab)
    }

    // #[cfg(feature = "parallel")]
    pub fn extract_colors(&self, min_dist: f32) -> String {
        let mut colors = vec![];

        match self.pixel_img {
            Some(_) => self
                .pixel_palette
                .iter()
                .for_each(|p| color_extractor!(p, colors, min_dist)),
            None => self
                .img
                .pixels()
                .for_each(|(.., p)| color_extractor!(p, colors, min_dist)),
        };

        let hex_vec: Vec<String> = colors
            .iter()
            .map(|rgb| format!("#{:02x}{:02x}{:02x}", rgb[0], rgb[1], rgb[2]))
            .collect();

        serde_json::to_string(&hex_vec).unwrap()
    }

    pub fn extract_colors_from_region(
        &self,
        min_dist: f32,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
    ) -> String {
        let img = image::load_from_memory(&self.state).unwrap();

        let sub_img = img.view(x, y, width, height);

        let mut colors: Vec<[u8; 4]> = vec![];

        sub_img
            .pixels()
            .for_each(|(.., p)| color_extractor!(p, colors, min_dist));

        let hex_vec: Vec<String> = colors
            .iter()
            .map(|rgb| format!("#{:02x}{:02x}{:02x}", rgb[0], rgb[1], rgb[2]))
            .collect();

        serde_json::to_string(&hex_vec).unwrap()
    }
}
