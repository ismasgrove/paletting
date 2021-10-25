import { wrap } from 'comlink'
import { defineStore } from 'pinia'
import init, { ImageView, SortMode, initThreadPool } from '../../wasm-colordump/pkg/wasm_colordump'
// import { ImageLib } from '../worker/colordump.worker'
// import { WasmWorker } from '/colordump.worker.ts'
// import { Remote, RemoteObject, wrap } from 'comlink'

type SubImage = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

// const Wasm = wrap<typeof WasmWorker>(new Worker('/colordump.worker.ts?worker', { type: 'module' }))

const useStore = defineStore('store', {
    state: () => (
        {
            palette: [] as Array<string>,
            // imageView: {} as ImageView,
            lib: {} as import('../worker/colordump.worker').WasmFunctions,
            initial: {} as Uint8Array,
            state: {} as Uint8Array,
            loaded: false,
            // memory: {} as WebAssembly.Memory,
            src: "",
            tolerance: 23,
            subImage: {} as SubImage,
            // instance: {} as Remote<WasmWorker>
        }
    ),
    actions: {
        async initialize(buf: Uint8Array) {
            // await init().then(({ memory }) => this.memory = memory).catch(console.error)
            // await initThreadPool(navigator.hardwareConcurrency)
            // this.imageView = new ImageView(buf)


            const workerApi = wrap<import('../worker/colordump.worker').ImageLib>(new Worker(new URL('../worker/colordump.worker.ts?worker', import.meta.url), {
                type: 'module'
            }))

            console.log("hmm?");
            workerApi().then((lib) => {
                this.lib = lib
                URL.createObjectURL(new Blob([buf]))
                this.initial = buf
                this.state = buf
                console.log(lib);

                console.log(this.lib);
            })
            console.log("hmm..");

            console.log(this.lib);



        },
        setLoaded(cond: boolean) {
            this.loaded = cond
        },
        pixelate(factor: number) {
            if (factor != 0) {
                this.lib.pixelate(this.state, factor)
            } else {
                // this.imageView.reset_pixelation()
            }
        },
        sortBuffer(mode: SortMode) {
            if (mode !== SortMode.NONE) {
                this.lib.sortBuffer(this.state, mode)
            } else {
                // this.imageView.reset_sort()
            }
        },
        async render() {
            // console.log("hm")
            // const imgPtr = this.imageView.buffer_ptr()
            // const size = this.imageView.size()
            // const buf = new Uint8Array(this.memory.buffer, imgPtr, size)
            // const buf = new Uint8Array()
            // this.src = URL.createObjectURL(new Blob([buf]))
            // this.src = this.instance.render().then((e: any) => {
            // console.log(e)
            // console.log(this.instance)
            // }).catch(console.error)
            // console.log(this.src);
            this.src = URL.createObjectURL(new Blob([this.state]))
            console.log(this.src);

        },
        extractColors(): String {
            return this.lib.extractColors(this.state, this.tolerance)
            // return this.imageView.extract_colors(this.tolerance)
        },
        setTolerance(dE: number) {
            this.tolerance = dE
        },
        setSubImage(x1: number, y1: number, x2: number, y2: number) {
            this.subImage = { x1, y1, x2, y2 }
        },
        reset() {
            // this.imageView.reset(this.initial)
        }
    },
    getters: {
        getPalette: (state) => state.palette,
        getInitial: (state) => state.initial,
        // getImageView: (state) => state.imageView,
        getSrc: (state) => state.src,
        getSubImg: (state) => state.subImage
    }
})

export default useStore