mod utils;

#[allow(unused_imports)]
use std::{cmp::Ordering, convert::TryInto, fs};

#[allow(unused_imports)]
use image::{DynamicImage, EncodableLayout, GenericImageView, ImageBuffer, ImageOutputFormat, Rgb};
use palette::{ColorDifference, FromColor, GetHue, Hsv, IntoColor, Lab, Srgb};

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

macro_rules! rgb2hsv {
    ($srgb:expr) => {
        Hsv::from_color(Srgb::new(
            $srgb[0] as f32 / 255.,
            $srgb[1] as f32 / 255.,
            $srgb[2] as f32 / 255.,
        ))
    };
}

#[wasm_bindgen]
#[derive(PartialEq, Copy, Clone)]
pub enum SortMode {
    HUE,
    SATURATION,
    BRIGHTNESS,
    NONE,
}

/*
    TODO: Support different formats by adding a new constructor parameter + some macros
*/

#[wasm_bindgen]
pub struct ImageView {
    state: Vec<u8>,
    sort_mode: SortMode,
    img: DynamicImage,
    sorted_img: Option<DynamicImage>,
    pixel_img: Option<DynamicImage>,
    pixel_palette: Vec<[u8; 3]>,
}

#[wasm_bindgen]
impl ImageView {
    #[wasm_bindgen(constructor)]
    pub fn new(buf: &[u8]) -> ImageView {
        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();

        let img = image::load_from_memory(buf).expect("Buffer wasn't loaded correctly");
        ImageView {
            state: buf.to_vec(),
            sort_mode: SortMode::NONE,
            img,
            sorted_img: None,
            pixel_img: None,
            pixel_palette: vec![],
        }
    }

    pub fn size(&self) -> usize {
        self.state.len()
    }

    pub fn buffer_ptr(&self) -> *const u8 {
        self.state.as_ptr()
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

        img.write_to(&mut buf, ImageOutputFormat::Jpeg(200))
            .unwrap();

        self.state = buf;
    }

    pub fn reset_sort(&mut self) {
        self.sorted_img = None;

        let mut buf = Vec::<u8>::new();

        let img = match &self.pixel_img {
            Some(pixel_img) => pixel_img,
            None => &self.img,
        };

        img.write_to(&mut buf, ImageOutputFormat::Jpeg(200))
            .unwrap();

        self.state = buf;
    }

    pub fn reset(&mut self, buf: &[u8]) {
        self.pixel_palette.clear();
        self.pixel_img = None;
        self.sorted_img = None;

        self.state = buf.to_vec();
    }

    pub fn sort_buffer(&mut self, mode: SortMode) {
        if mode == SortMode::NONE {
            return;
        }

        let img = match &self.pixel_img {
            Some(pixel_img) => pixel_img,
            None => &self.img,
        };

        let mut chunks: Vec<_> = img.as_bytes().chunks(3).collect();

        let hsva_sorter = |a: Hsv, b: Hsv| -> Ordering {
            match mode {
                SortMode::HUE => partial_cmp!(hue_deg!(a), hue_deg!(b)),
                SortMode::SATURATION => partial_cmp!(a.saturation, b.saturation),
                SortMode::BRIGHTNESS => partial_cmp!(a.value, b.value),
                SortMode::NONE => Ordering::Equal, // should never happen, handled in TS
            }
        };

        chunks.sort_unstable_by(|a, b| hsva_sorter(rgb2hsv!(a), rgb2hsv!(b)));

        let flat_vec: Vec<u8> = chunks.into_iter().flatten().copied().collect();

        let image_buffer: ImageBuffer<Rgb<u8>, _> =
            image::ImageBuffer::from_vec(img.width(), img.height(), flat_vec)
                .expect("Output buffer was not created successfully");

        let img = DynamicImage::ImageRgb8(image_buffer);

        let mut buf = Vec::<u8>::new();

        img.write_to(&mut buf, ImageOutputFormat::Jpeg(200))
            .unwrap();

        self.sorted_img = Some(img);
        self.state = buf;
        self.sort_mode = mode;
    }

    /*
        TS side should validate that it's not a 0 factor
        and call reset when it is
    */

    pub fn pixelate(&mut self, factor: f32) {
        self.pixel_palette.clear();

        let img = match &self.sorted_img {
            Some(sorted_img) => sorted_img,
            None => &self.img,
        };

        let mut image_buffer: ImageBuffer<Rgb<u8>, _> =
            image::ImageBuffer::new(img.width(), img.height());

        let (x_factor, y_factor): (u32, u32) = (
            (factor * img.width() as f32).floor() as u32,
            (factor * img.height() as f32).floor() as u32,
        );

        for x in (0..img.width()).step_by(x_factor as usize) {
            for y in (0..img.height()).step_by(y_factor as usize) {
                let (mut ar, mut ag, mut ab): (u32, u32, u32) = (0, 0, 0);
                let (max_x, max_y) = (
                    (x + x_factor).min(img.width()),
                    (y + y_factor).min(img.height()),
                );

                for x_inner in x..max_x {
                    for y_inner in y..max_y {
                        let pixel = img.get_pixel(x_inner, y_inner);
                        ar += pixel.0[0] as u32;
                        ag += pixel.0[1] as u32;
                        ab += pixel.0[2] as u32;
                    }
                }

                ar /= x_factor * y_factor;
                ag /= x_factor * y_factor;
                ab /= x_factor * y_factor;

                let (ar, ag, ab): (u8, u8, u8) = (
                    ar.try_into()
                        .expect("Overflow error while calculating averages!"),
                    ag.try_into()
                        .expect("Overflow error while calculating averages!"),
                    ab.try_into()
                        .expect("Overflow error while calculating averages!"),
                );
                self.pixel_palette.push([ar, ag, ab]);

                for x_inner in x..max_x {
                    for y_inner in y..max_y {
                        image_buffer.put_pixel(x_inner, y_inner, Rgb { 0: [ar, ag, ab] });
                    }
                }
            }
        }

        let img = DynamicImage::ImageRgb8(image_buffer);

        let mut buf = Vec::<u8>::new();

        img.write_to(&mut buf, ImageOutputFormat::Jpeg(255))
            .unwrap();

        // buf
        self.pixel_img = Some(img);
        self.state = buf;
    }

    pub fn extract_colors(&self, min_dist: f32) -> String {
        let color_diff = |a: &[u8; 3], b: &[u8; 3]| -> f32 {
            let (a_lab, b_lab): (Lab, Lab) = (
                Srgb::new(a[0] as f32 / 255., a[1] as f32 / 255., a[2] as f32 / 255.).into_color(),
                Srgb::new(b[0] as f32 / 255., b[1] as f32 / 255., b[2] as f32 / 255.).into_color(),
            );

            a_lab.get_color_difference(&b_lab)
        };

        // O(n^2) algorithm.. oopsies

        let mut colors: Vec<[u8; 3]> = Vec::new();

        /*
            add a macro or something
        */

        if self.pixel_img.is_some() {
            self.pixel_palette.iter().for_each(|p| {
                let rgb: [u8; 3] = [p[0], p[1], p[2]];
                if !colors
                    .iter()
                    .any(|other| color_diff(&rgb, other) < min_dist)
                {
                    colors.push(rgb);
                }
            });
        } else {
            self.img.pixels().for_each(|p| {
                let rgb: [u8; 3] = [p.2[0], p.2[1], p.2[2]];
                if !colors
                    .iter()
                    .any(|other| color_diff(&rgb, other) < min_dist)
                {
                    colors.push(rgb);
                }
            });
        }

        /* serializing */

        let hex_vec: Vec<String> = colors
            .iter()
            .map(|rgb| format!("#{:x}{:x}{:x}", rgb[0], rgb[1], rgb[2]))
            .collect();

        serde_json::to_string(&hex_vec).unwrap()
    }
}
// }

#[test]
pub fn extraction() {
    let src = fs::read("5.jpg").unwrap();
    let view = ImageView::new(src.as_bytes());
    let json = view.extract_colors(20.);

    println!("{}", json);
}

#[test]
pub fn pixelation() {
    let src = fs::read("5.jpg").unwrap();
    let mut view = ImageView::new(src.as_bytes());
    view.pixelate(0.2);

    fs::write("pixel.jpg", view.get()).unwrap();
}

#[test]
pub fn sorting() {
    let src = fs::read("5df.jpg").unwrap();
    let mut view = ImageView::new(src.as_bytes());
    view.sort_buffer(SortMode::HUE);

    fs::write("sort.jpg", view.get()).unwrap();
}

#[test]
pub fn reset() {
    let src = fs::read("5df.jpg").unwrap();
    let mut view = ImageView::new(src.as_bytes());
    view.pixelate(0.2);

    view.reset_pixelation();

    fs::write("unpix.jpg", view.get()).unwrap();
}
