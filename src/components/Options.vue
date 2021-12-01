<script setup lang="ts">
import useStore from '../store/useStore'
import { SortMode } from "../../wasm-paletting/pkg/wasm_paletting"
import { computed, onMounted, onUpdated, reactive, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const toleranceOptions = {
    'High': 15,
    'Medium': 8,
    'Low': 2.3
}

const sortOptions = {
    'Hue': SortMode.HUE,
    'Saturation': SortMode.SATURATION,
    'Brightness': SortMode.BRIGHTNESS
}

const pixelationFactor: Ref<number> = ref(0)
const sortOption: Ref<SortMode> = ref(SortMode.NONE)
const toleranceFactor: Ref<number> = ref(toleranceOptions['Medium'])

const pixelationElement: Ref<any> = ref()

const pixelationPercentage = computed(() => Math.floor((100 / pixelationElement.value.max) * pixelationFactor.value))

let pixelationSlider = reactive({
    color: '#f38630',
    sliderStyle: ''
}
)

const sliderStyle = computed(() => `linear-gradient(90deg, ${pixelationSlider.color} ${pixelationPercentage.value}%, #fff ${pixelationPercentage.value}%)`)

onMounted(() => {
    // pixelationPercentage.value = sliderMap.value
    pixelationSlider.sliderStyle = sliderStyle.value
    store.setTolerance(toleranceOptions.Medium)
    toleranceFactor.value = store.tolerance
})

onUpdated(() => {
    pixelationSlider.sliderStyle = sliderStyle.value
})

const pixelate = async (e: Event) => {
    await store.pixelate(pixelationFactor.value)
    store.render()
}

const sortImage = async (e: Event) => {
    const click = parseInt((e.target as HTMLInputElement).value)

    if (click === sortOption.value) {
        sortOption.value = SortMode.NONE
    } else {
        sortOption.value = click
    }

    await store.sortBuffer(sortOption.value)
    await store.render()

    pixelationFactor.value = 0
}

const setTolerance = (e: Event) => {
    const dE = toleranceFactor.value
    store.setTolerance(dE)
}

const reset = async (e: Event) => {
    await store.reset()
    await store.render()

    pixelationFactor.value = 0
    sortOption.value = SortMode.NONE
}

const extract = async (e: Event) => {
    await store.extractColors()
}

const extractFromSubImage = async (e: Event) => {
    await store.extractFromRegion()
}

const remove = (e: Event) => {
    store.$reset()
    router.push({ path: '/' })
}

</script>  

<template>
    <div class="options">
        <!---->
        <div class="options-set" id="sort-div">
            <label class="option-label" for="sort-div">Sort by</label>
            <div class="radio-options" v-for="(value, name) in sortOptions">
                <input
                    :id="name"
                    type="radio"
                    v-model="sortOption"
                    :value="value"
                    @click="sortImage"
                />
                <label class="mode-selector" :for="name">{{ name }}</label>
            </div>
        </div>
        <!---->
        <div class="options-set">
            <label class="option-label" for="pixelate">Pixelate</label>
            <input
                v-model="pixelationFactor"
                type="range"
                min="0"
                max="0.25"
                step="0.01"
                id="pixelate"
                ref="pixelationElement"
                @input="pixelate"
            />
        </div>
        <!---->
        <div class="options-set">
            <label class="option-label">Tolerance</label>
            <div class="radio-options" v-for="(value, name) in toleranceOptions">
                <input
                    :id="name"
                    type="radio"
                    v-model="toleranceFactor"
                    :value="value"
                    @change="setTolerance"
                />
                <label class="mode-selector" :for="name">{{ name }}</label>
            </div>
        </div>

        <div class="buttons-div">
            <span @click="extract">extract</span>
            <span @click="extractFromSubImage">extract from region</span>
            <span @click="reset">reset</span>
            <span @click="remove">remove</span>
        </div>

        <button class="export-btn">export</button>
    </div>
</template>

<style scoped lang="scss">
$selected: hsl(39, 86%, 43%);
$options-highlights: #f38630;
$buttons-color: #69d2e7;
$radio-radius: 5px;
$options-bar-color: hsl(0, 0%, 15%);
$range-slider-thumb: hsl(305, 100%, 91%);
.options-set {
    display: inline-flex;
    place-content: center;
    gap: 1rem;
    input[type="range"] {
        -webkit-appearance: none;
        width: 9rem;
        opacity: 0.8;
        background-color: $options-bar-color;
        cursor: pointer;
    }
    input[type="range"]:focus {
        outline: none;
    }
    input[type="range"]:hover {
        opacity: 1;
    }
    input[type="range"]::-webkit-slider-runnable-track {
        background: v-bind("pixelationSlider.sliderStyle");
        height: 5px;
    }
    input[type="range"]::-moz-range-track {
        background: v-bind("pixelationSlider.sliderStyle");
        height: 5px;
    }
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 15px;
        width: 15px;
        background: $range-slider-thumb;
        margin-top: -5px;
        border-radius: 50%;
    }
    input[type="range"]::-moz-range-thumb {
        height: 15px;
        width: 15px;
        background: $range-slider-thumb;
        margin-top: -5px;
        border-radius: 50%;
    }
    .radio-options {
        color: black;
        width: 9.5ch;
        height: 3ch;
        background-color: hsl(0, 0%, 89%);
        // border: 1px solid red;
        border-radius: $radio-radius;

        input[type="radio"] {
            display: none;
        }
        .mode-selector {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
            font-size: small;
            border-radius: $radio-radius;
        }
        input[type="radio"]:checked + .mode-selector {
            background-color: $options-highlights;
        }
    }
}
button {
    cursor: pointer;
}
.buttons-div {
    display: inline-flex;
    place-content: center;
    place-items: center;
    gap: 1rem;
    span {
        height: 3ch;
        width: 9.5ch;
        // border: 0.1em solid #f38630;
        border-radius: 5px;
        font-family: "Trebuchet MS";
        // border-radius: 5px;
        background-color: $buttons-color;
        width: auto;
        // height: 3ch;
    }
}
.options {
    display: flex;
    place-items: center;
    justify-content: space-evenly;
    // gap: 0.25rem;
    background-color: $options-bar-color;
    .option-label {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: small;
        place-self: center;
    }
}
</style>