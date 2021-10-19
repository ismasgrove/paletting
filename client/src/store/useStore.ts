import { defineStore } from 'pinia'
import init, { ImageView, SortMode } from '../../wasm-colordump/pkg/wasm_colordump'

type SubImage = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

const useStore = defineStore('store', {
    state: () => (
        {
            palette: [] as Array<string>,
            imageView: {} as ImageView,
            initial: {} as Uint8Array,
            loaded: false,
            memory: {} as WebAssembly.Memory,
            src: "",
            tolerance: 23,
            subImage: {} as SubImage
        }
    ),
    actions: {
        async initialize(buf: Uint8Array) {
            await init().then(({memory}) => this.memory = memory).catch(console.error)
            this.imageView = new ImageView(buf)
            this.initial = buf
        },
        setLoaded(cond: boolean) {
            this.loaded = cond
        },
        pixelate(factor: number) {
            if (factor != 0) {
                this.imageView.pixelate(factor)
            } else {
                this.imageView.reset_pixelation()
            }
        },
        sortBuffer(mode: SortMode) {
            if (mode !== SortMode.NONE) {
                this.imageView.sort_buffer(mode)
            } else {
                this.imageView.reset_sort()
            }
        },
        render() {
            const imgPtr = this.imageView.buffer_ptr()
            const size = this.imageView.size()
            const buf = new Uint8Array(this.memory.buffer, imgPtr, size)
            this.src = URL.createObjectURL(new Blob([buf]))
        },
        extractColors(): String {
            return this.imageView.extract_colors(this.tolerance)
        },
        setTolerance(dE: number) {
            this.tolerance = dE
        },
        setSubImage(x1: number, y1: number, x2: number, y2: number) {
            this.subImage = {x1, y1, x2, y2}
        },
        reset() {
            this.imageView.reset(this.initial)
        }
    },
    getters: {
        getPalette: (state) => state.palette,
        getInitial: (state) => state.initial,
        getImageView: (state) => state.imageView,
        getSrc: (state) => state.src,
        getSubImg: (state) => state.subImage
    }
})

export default useStore