<script setup lang="ts">
import useStore from '../store/useStore'
import { SortMode } from '../../wasm-colordump/pkg/wasm_colordump'
import { ref } from 'vue'

const store = useStore()
const pix = ref()

const pixelate = (e: Event) => {
    const mode = parseFloat((e.target as HTMLInputElement).value)
    store.pixelate(mode)
    store.render()
}

const sortBuffer = (e: Event) => {
    pix.value.value = 0
    const mode = ((): SortMode => {
        switch ((e.target as HTMLInputElement).value) {
            case 'hue':
                return SortMode.HUE
            case 'saturation':
                return SortMode.SATURATION
            case 'brightness':
                return SortMode.BRIGHTNESS
            default:
                return SortMode.NONE
        }
    })

    store.sortBuffer(mode())
    store.render()
}

const changeTolerance = (e: Event) => {
    const dE = parseFloat((e.target as HTMLInputElement).value)
    store.setTolerance(dE)
}

const reset = (e: Event) => {
    store.reset()
    store.render()
}

const extract = (e: Event) => {
    const json = store.extractColors()
    console.log(json)
}

const extractFromSubImage = (e: Event) => {

}

const remove = (e: Event) => {
    store.$reset()
}

</script>  

<template>
    <div class="options">
        <label class="pixelate-label" for="pixelate">pixelate</label>
        <input
            ref="pix"
            type="range"
            min="0"
            max="0.25"
            value="0"
            step="0.05"
            name="pixelate"
            @change="pixelate"
        />
        <select @change="sortBuffer">
            <option value="default" selected>default</option>
            <option value="hue">hue</option>
            <option value="saturation">saturation</option>
            <option value="brightness">brightness</option>
        </select>
        <button @click="reset">reset</button>
        <!-- Add distance as options -->
        <select @change="changeTolerance">
            <option value="23" selected>only very different colors</option>
            <option value="10">close enough</option>
            <option value="2.3">distinguisable</option>
            <option value="0">EVERY SINGLE ONE (no duplicates)</option>
        </select>
        <button @click="extract">extract</button>
        <button @click="extractFromSubImage">extract from region</button>
        <button @click="remove">remove</button>
    </div>
</template>

<style scoped lang="scss">
.options {
    // background-color: red;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .pixelate-label {
        font-size: medium;
        // align-self: flex-start;
    }
}
</style>