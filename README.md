# paletting

paletting is a simple website built with Vue 3 together with wasm-bindgen. where you upload an image and manipulate it so you can extract a color palette you like (displayed on the right). Then you can both download it and save it with a unique tag to find it again via the explore page.

## Background

I started this project primarily because I wanted to learn acquire experience in certain technologies, primarily Vue and WebAssembly.

And, as is the case with most independent programming endeavours, I ended up learning a lot more than what I set out to do. This site takes advantage of [wasm-bindgen-rayon](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon) and Web Workers. It's hosted on Vercel, and uses its Serverless Functions to hook itself to an Atlas DB.

It was originally setup to use Vite but eventually I switched to Webpack to avoid some compatibility issues with both Firefox and wasm-bindgen-rayon, both of which Webpack works flawlessly with.
