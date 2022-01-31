import { expose, proxy, transfer } from "comlink";
import type { ImageView, SortMode } from "../../wasm-paletting/pkg/wasm_paletting.js";
import type { WorkerInterface } from "./types";


const initHandlers = async () => {
  const wasm = await import("../../wasm-paletting/pkg/wasm_paletting.js")
  await wasm.default();
  await wasm.initThreadPool(navigator.hardwareConcurrency);

  return proxy<WorkerInterface>({
    view: {} as ImageView,
    init(buf: Uint8Array) {
      this.view = new wasm.ImageView(buf);
    },
    pixelate(factor: number) {
      if (factor != 0) {
        this.view.pixelate(factor);
      } else {
        this.resetPixelation();
      }
    },
    sortBuffer(mode: SortMode) {
      if (mode !== wasm.SortMode.NONE) {
        this.view.sort_buffer(mode);
      } else {
        this.reset();
      }
    },
    render(): Uint8Array {
      const buf = this.view.get_copy();
      return transfer(buf, [buf.buffer]);
    },
    extractColors(dE: number): string {
      return this.view.extract_colors(dE);
    },
    extractFromRegion(
      dE: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) {
      return this.view.extract_colors_from_region(dE, x1, y1, x2, y2);
    },
    resetPixelation() {
      this.view.reset_pixelation();
    },
    reset() {
      this.view.reset();
    },
  });
}

expose({ handlers: initHandlers() });