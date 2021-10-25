import { expose } from "comlink";
// import init, {
// ImageView,
// SortMode,
// } from "../../wasm-colordump/pkg/wasm_colordump"

// const wasm = import('../../wasm-colordump/pkg/wasm_colordump')

export type WasmFunctions = {
    pixelate: (buf: Uint8Array, factor: number) => Uint8Array | undefined,
    sortBuffer: (buf: Uint8Array, factor: number) => Uint8Array | undefined,
    extractColors: (buf: Uint8Array, dE: number) => string
}

const workerApi = async () => {
    console.log("??");

    const api = await import('../../wasm-colordump/pkg/wasm_colordump')
    console.log("api import");

    api.default()
    api.initThreadPool(navigator.hardwareConcurrency)

    console.log("inits");

    const pixelate = (buf: Uint8Array, factor: number): Uint8Array | undefined => {
        return api.pixelate(buf, factor)
    }
    const sortBuffer = (buf: Uint8Array, mode: number): Uint8Array | undefined => {
        return api.sort_buffer(buf, mode)
    }
    const extractColors = (buf: Uint8Array, dE: number): string => {
        return api.extract_colors(buf, dE)
    }

    const exportObj = { pixelate, sortBuffer, extractColors }

    console.log("now what");


    return exportObj
}

export type ImageLib = typeof workerApi
expose(workerApi)

// class WasmWorker {
// view!: ImageView;
// mem!: WebAssembly.Memory;
// 
// async initialize(buf: Uint8Array) {
// init()
// .then((w) => {
// this.view = new ImageView(buf);
// this.mem = w.memory;
// })
// .catch(console.error);
// }
// async pixelate(factor: number) {
// if (factor != 0) {
// this.view.pixelate(factor);
// } else {
// this.view.reset_pixelation();
// }
// }
// async sortBuffer(mode: SortMode) {
// if (mode !== SortMode.NONE) {
// this.view.sort_buffer(mode);
// } else {
// this.view.reset_sort();
// }
// }
// async render(): Promise<string> {
// const imgPtr = this.view?.buffer_ptr();
// const size = this.view?.size();
// const buf = new Uint8Array(this.mem.buffer, imgPtr, size);
// console.log(imgPtr)
// return URL.createObjectURL(new Blob([buf]));
// }
// async extractColors(dE: number): Promise<string> {
// return this.view.extract_colors(dE);
// }
// reset(initial: Uint8Array) {
// this.view.reset(initial);
// }
// }

// export { WasmWorker };