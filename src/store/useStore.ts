import { defineStore } from "pinia";
import { wrap, transfer, releaseProxy, Remote } from "comlink";
import { SortMode } from "../../wasm-paletting/pkg/wasm_paletting";
import type { WorkerInterface, ExposedObject } from "../worker/types";

type SubImage = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const useStore = defineStore("store", {
  state: () => ({
    initial: {} as Uint8Array,
    state: {} as Uint8Array,
    src: "",
    tolerance: 0,
    subImage: {} as SubImage,
    handlers: {} as Remote<WorkerInterface>,
    palette: ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"],
    // app options, might potentially separate them two stores
    toleranceOptions: {
      High: 15,
      Medium: 8,
      Low: 2.3,
    },
    sortOptions: {
      Hue: SortMode.HUE,
      Saturation: SortMode.SATURATION,
      Brightness: SortMode.BRIGHTNESS,
    },
    prompt: false,
    loaded: false,
  }),
  actions: {
    async initialize(buf: Uint8Array) {
      this.initial = buf;
      this.state = buf;

      const handlers = await wrap<ExposedObject>(
        new Worker(
          new URL("../worker/paletting.worker.ts", import.meta.url),
          {
            type: "module"
          }
        )
      ).handlers

      await handlers.init(transfer(buf, [buf.buffer]));

      this.handlers = handlers;
    },
    async pixelate(factor: number) {
      if (factor != 0) {
        await this.handlers.pixelate(factor);
      } else {
        await this.handlers.resetPixelation();
      }
    },
    async sortBuffer(mode: SortMode) {
      if (mode != SortMode.NONE) {
        await this.handlers.sortBuffer(mode);
      } else {
        await this.reset();
      }
    },
    async render() {
      const blob: Uint8Array = await this.handlers.render();
      this.src = URL.createObjectURL(new Blob([blob]));
    },
    async extractColors() {
      const json = await this.handlers.extractColors(this.tolerance);
      this.palette = Object.values(JSON.parse(json));
    },
    setTolerance(dE: number) {
      this.tolerance = dE;
    },
    setSubImage(x: number, y: number, width: number, height: number) {
      this.subImage = { x, y, width, height };
    },
    async extractFromRegion() {
      const json = await this.handlers.extractFromRegion(
        this.tolerance,
        this.subImage.x,
        this.subImage.y,
        this.subImage.width,
        this.subImage.height
      );
      const palette: string[] = Object.values(JSON.parse(json));
      if (palette.length < 1) {
        // TODO: Notify the user that their selection was invalid
      } else {
        this.palette = palette;
      }
    },
    async reset() {
      this.state = this.initial;
      await this.handlers.reset();
    },
    remove() {
      this.handlers[releaseProxy]();
      URL.revokeObjectURL(this.src);
      this.loaded = false;
      this.$reset;
    },
    setPalette(palette: Array<string>) {
      this.palette = palette;
    },
    setLoaded(cond: boolean) {
      this.loaded = cond;
    },
    setPrompt(cond: boolean) {
      this.prompt = cond;
    },
    togglePrompt() {
      this.prompt = !this.prompt;
    }
  },
  getters: {
    getPalette: (state) => state.palette,
    getInitial: (state) => state.initial,
    getSrc: (state) => state.src,
    getSubImg: (state) => state.subImage,
    getToleranceOptions: (state) => state.toleranceOptions,
    getSortOptions: (state) => state.sortOptions,
    getLoaded: (state) => state.loaded
  },
});

export default useStore;
