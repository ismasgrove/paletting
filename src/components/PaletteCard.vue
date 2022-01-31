<script setup lang="ts">
import { Palette } from "../models/palette";
import { useGradient } from "../composables/useGradient"
import { useDownload } from "../composables/useDownload";
import useStore from "../store/useStore"

const store = useStore();

const { download } = useDownload();

const props = defineProps<{
    item: Palette
}>();

const { palette, count } = props.item;

const { generateCSSGradient } = useGradient();

const cssPreviewGradient = generateCSSGradient(palette, count);

const preview = () => {
    store.setPalette(palette);
}

</script>

<template>
    <div class="card">
        <div class="card-preview"></div>
        <div class="card-body">
            <span>Size: {{ count }}</span>
            <button @click="preview">Preview</button>
            <button @click="download">Download</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
button {
    display: inline-block;
    border: none;
    border-radius: 3px;
    height: 3ch;
    background-color: rgb(255, 255, 255);
    color: black;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
}
.card {
    display: flex;
    flex-direction: column;
    font-family: "PT Sans";
    font-size: small;
    // border: 1px solid black;
    background-color: hsl(0, 0%, 91%);
    border-radius: 5px;
    // padding: 1rem;
    row-gap: 1rem;
}
.card-preview {
    background: v-bind("cssPreviewGradient");
    min-height: 15rem;
    width: 15rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.card-body {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    // text-align: left;
    padding: 1rem;
    column-gap: 1rem;
}
</style>