<script setup lang="ts">
import useStore from '../store/useStore'
import { SortMode } from '../../wasm-paletting/pkg/wasm_paletting'
import { onMounted, ref, Ref } from 'vue'

const store = useStore()

const pixelationOption: Ref<any> = ref()
const sortOption: Ref<any> = ref()
const toleranceOption: Ref<any> = ref()

onMounted(() => {
    pixelationOption.value = '0'
    sortOption.value = 'default'
    toleranceOption.value = store.tolerance
})

const pixelate = async (e: Event) => {
    const factor = parseFloat((e.target as HTMLInputElement).value)
    await store.pixelate(factor)
    store.render()
}

const sortBuffer = async (e: Event) => {
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

    await store.sortBuffer(mode())
    await store.render()

    pixelationOption.value = 0
}

const changeTolerance = (e: Event) => {
    const dE = parseFloat((e.target as HTMLInputElement).value)
    store.setTolerance(dE)
}

const reset = async (e: Event) => {
    await store.reset()
    await store.render()

    pixelationOption.value = 0
    sortOption.value = "default"
}

const extract = async (e: Event) => {
    await store.extractColors()
    console.log(store.palette)
}

const extractFromSubImage = async (e: Event) => {
    await store.extractFromRegion()
}

const remove = (e: Event) => {
    store.$reset()
}

</script>  

<template>
    <div class="options">
        <label class="pixelate-label" for="pixelate">pixelate</label>
        <input
            v-model="pixelationOption"
            type="range"
            min="0"
            max="0.25"
            step="0.01"
            name="pixelate"
            @input="pixelate"
        />
        <select v-model="sortOption" @change="sortBuffer">
            <option value="default" selected>default</option>
            <option value="hue">hue</option>
            <option value="saturation">saturation</option>
            <option value="brightness">brightness</option>
        </select>
        <button @click="reset">reset</button>
        <!-- Add distance as options -->
        <select v-model="toleranceOption" @change="changeTolerance">
            <option value="23" selected>High difference</option>
            <option value="10">Medium difference</option>
            <option value="2.3">Low difference</option>
            <!-- <option value="0">EVERY SINGLE ONE (no duplicates)</option> -->
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