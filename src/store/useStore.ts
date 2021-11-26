import { defineStore } from 'pinia'

import { RemoteObject, wrap } from 'comlink'
import { SortMode } from '../../wasm-paletting/pkg/wasm_paletting'
import { WasmWorker } from '../worker/paletting.worker'
import PWorker from '../worker/paletting.worker?worker'

type SubImage = {
    x: number,
    y: number,
    width: number,
    height: number
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
        setSubImage(x: number, y: number, width: number, height: number) {
            this.subImage = { x, y, width, height }
        },
        async extractFromRegion() {
            const json = await instance.extractFromRegion(
                this.tolerance,
                this.subImage.x,
                this.subImage.y,
                this.subImage.width,
                this.subImage.height,
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