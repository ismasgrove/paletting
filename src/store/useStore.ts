import { RemoteObject, wrap } from 'comlink'
import { defineStore } from 'pinia'
import { SortMode } from '../../wasm-paletting/pkg/wasm_paletting'
import PWorker from '../worker/paletting.worker?worker'
import { WasmWorker } from '../worker/paletting.worker'

type SubImage = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

const workerApi = wrap<typeof WasmWorker>(new PWorker);
let instance: RemoteObject<WasmWorker>

const useStore = defineStore('store', {
    state: () => (
        {
            palette: ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"],
            initial: {} as Uint8Array,
            state: {} as Uint8Array,
            loaded: false,
            src: "",
            tolerance: 23,
            subImage: {} as SubImage,
        }
    ),
    actions: {
        async initialize(buf: Uint8Array) {
            this.initial = buf
            this.state = buf
            instance = await new workerApi(buf)
        },
        setLoaded(cond: boolean) {
            this.loaded = cond
        },
        async pixelate(factor: number) {
            if (factor != 0) {
                await instance.pixelate(factor)
            } else {
                await instance.resetPixelation()
            }
        },
        async sortBuffer(mode: SortMode) {
            if (mode != SortMode.NONE) {
                await instance.sortBuffer(mode)
            } else {
                await this.reset()
            }
        },
        async render() {
            const blob: Uint8Array = await instance.render()
            this.src = URL.createObjectURL(new Blob([blob]))

        },
        async extractColors() {
            const json = await instance.extractColors(this.tolerance)
            this.palette = Object.values(JSON.parse(json))
            console.log(this.palette)
        },
        setTolerance(dE: number) {
            this.tolerance = dE
        },
        setSubImage(x1: number, y1: number, x2: number, y2: number) {
            this.subImage = { x1, y1, x2, y2 }
        },
        async extractFromRegion() {
            const json = await instance.extractFromRegion(
                this.tolerance,
                this.subImage.x1,
                this.subImage.y1,
                this.subImage.x2 - this.subImage.x1,
                this.subImage.y2 - this.subImage.y1,
            )
            this.palette = Object.values(JSON.parse(json))
        },
        async reset() {
            this.state = this.initial
            await instance.reset()
        },
        remove() {

        }
    },
    getters: {
        getPalette: (state) => state.palette,
        getInitial: (state) => state.initial,
        getSrc: (state) => state.src,
        getSubImg: (state) => state.subImage
    }
})

export default useStore