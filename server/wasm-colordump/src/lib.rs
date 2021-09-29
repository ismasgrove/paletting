mod utils;

use std::cmp::Ordering;

use image::{EncodableLayout, GenericImageView, ImageBuffer, Rgb};
use palette::{FromColor, GetHue, Hsva, Srgba};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-colordump!");
}

macro_rules! hsva_partial_cmp {
    ($a:expr, $b:expr) => {
        $a.partial_cmp(&$b).unwrap()
    };
}

macro_rules! hue_deg {
    ($hsv:expr) => {
        $hsv.get_hue().expect("greyscale?").to_positive_degrees()
    };
}

macro_rules! hsva_from_chunk {
    ($srgba:expr) => {
        Hsva::from_color(Srgba::new(
            $srgba[0] as f32 / 255.,
            $srgba[1] as f32 / 255.,
            $srgba[2] as f32 / 255.,
            $srgba[3] as f32 / 255.,
        ))
    };
}

#[wasm_bindgen]
pub enum SortMode {
    HUE,
    SATURATION,
    BRIGHTNESS,
}

#[wasm_bindgen]
pub fn sort_buffer(buffer: &[u8], mode: SortMode) {
    let img = image::load_from_memory(buffer).expect("Buffer wasn't loaded correctly");
    let rgba_bytes = img.as_rgba8().unwrap().as_bytes();
    let mut chunks: Vec<_> = rgba_bytes.chunks(4).collect();

    let hsva_sorter = |a: Hsva, b: Hsva| -> Ordering {
        match mode {
            SortMode::HUE => hsva_partial_cmp!(hue_deg!(a), hue_deg!(b)),
            SortMode::SATURATION => hsva_partial_cmp!(a.saturation, b.saturation),
            SortMode::BRIGHTNESS => hsva_partial_cmp!(a.value, b.value),
        }
    };

    chunks.sort_by(|a, b| hsva_sorter(hsva_from_chunk!(a), hsva_from_chunk!(b)));

    let chunks_flatmap: Vec<u8> = chunks
        .into_iter()
        .flat_map(|chunk| chunk.into_iter().cloned())
        .collect();

    let output: ImageBuffer<Rgb<u8>, _> =
        image::ImageBuffer::from_vec(img.width(), img.height(), chunks_flatmap.to_vec())
            .expect("Output buffer was not created successfully");

    output
        .save("./p_h.png")
        .expect("File could not be saved successfully");
}
