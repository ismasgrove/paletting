import { expose, transfer } from 'comlink'
// import { threads } from 'wasm-feature-detect'
import init, { ImageView, InitOutput, SortMode } from '../../wasm-paletting/pkg/wasm_paletting'
export { WasmWorker }

const wasm = init().then(
    async (w) => {
        w.initThreadPool(navigator.hardwareConcurrency)
        return w
    }
)

class WasmWorker {
    view!: ImageView
    mem!: WebAssembly.Memory

    constructor(buf: Uint8Array) {
        wasm.then(
            async (w: InitOutput) => {
                this.mem = w.memory
                this.view = new ImageView(buf)
            }
        )
    }
    pixelate(factor: number) {
        if (factor != 0) {
            this.view.pixelate(factor);
        } else {
            this.resetPixelation()
        }
    }
    sortBuffer(mode: SortMode) {
        if (mode !== SortMode.NONE) {
            this.view.sort_buffer(mode);
        } else {
            this.reset()
        }
    }
    render(): Uint8Array {
        // const imgPtr = this.view.buffer_ptr();
        // const size = this.view.size();
        // const memcpy = new Uint32Array(this.mem)
        // const buf = new Uint8Array(this.mem.buffer, imgPtr, size);

        const buf = this.view.get_copy()

        return transfer(buf, [buf.buffer])
    }
    extractColors(dE: number): string {
        return this.view.extract_colors(dE);
    }
    extractFromRegion(dE: number, x1: number, y1: number, x2: number, y2: number) {
        return this.view.extract_colors_from_region(dE, x1, y1, x2, y2)
    }
    resetPixelation() {
        this.view.reset_pixelation()
    }
    reset() {
        this.view.reset()
    }
}

expose(WasmWorker)