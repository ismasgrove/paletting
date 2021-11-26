//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]
// #![cfg_attr(not(test), no_std)]

use std::fs;

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate wasm_paletting;
use wasm_paletting::{ImageView, SortMode};

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[cfg(test)]
mod ImageView_tests {
    #[test]
    pub fn extraction() {
        let src = fs::read("img.jpg").unwrap();
        let view = wasm_paletting::ImageView::new(src.as_bytes());
        let json = view.extract_colors(20.);

        println!("{}", json);
    }

    #[test]
    pub fn pixelation() {
        let src = fs::read("img.jpg").unwrap();
        let mut view = wasm_paletting::ImageView::new(src.as_bytes());
        let t = std::time::Instant::now();
        view.pixelate(0.2);
        let duration = t.elapsed().as_secs_f64();

        fs::write("pixel.jpg", view.get()).unwrap();
    }

    #[test]
    pub fn sorting() {
        let src = fs::read("img.jpg").unwrap();
        let mut view = wasm_paletting::ImageView::new(src.as_bytes());
        let t = std::time::Instant::now();
        view.sort_buffer(SortMode::HUE);
        let duration = t.elapsed().as_secs_f64();

        fs::write("sort.jpg", view.get()).unwrap();
    }

    #[test]
    pub fn reset() {
        let src = fs::read("img.jpg").unwrap();
        let mut view = wasm_paletting::ImageView::new(src.as_bytes());
        view.pixelate(0.2);

        view.reset_pixelation();

        fs::write("unpix.jpg", view.get()).unwrap();
    }
}
