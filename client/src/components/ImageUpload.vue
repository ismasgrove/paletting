<script setup lang="ts">
import { ref, Ref } from 'vue'

import useStore from '../store/useStore'

const imageFile = ref()
const active = ref(false)
const store = useStore()

function uploadButton(e: Event) {
    if ((e.target as HTMLInputElement).files?.length === 0) {
        return
    }

    imageFile.value = (e.target as HTMLInputElement).files?.item(0)

    initializeStore(imageFile)
}

function uploadDrop(e: DragEvent) {
    if ((e.target as HTMLInputElement).files?.length === 0) {
        return
    }

    imageFile.value = e.dataTransfer?.files?.item(0)

    initializeStore(imageFile)
}

const initializeStore = (imageFile: Ref<any>) => {
    imageFile.value.arrayBuffer().then(
        async (buf: any) => {
            await store.initialize(new Uint8Array(buf))
            store.setLoaded(true)
            store.render()
        })
}

const handleStuff = () => {
    active.value = !active.value
}

</script>

<template>
    <div
        :class="{ 'active': active }"
        @dragenter.prevent="handleStuff"
        @dragleave.prevent="handleStuff"
        @drop.prevent="handleStuff"
        @drop="uploadDrop"
        @dragover.prevent
        class="image-box"
    >
        <span>Drag and drop</span>
        <span>or</span>
        <!-- <form class="image-form" @submit.prevent> -->
        <input @change="uploadButton" id="img" type="file" accept="image/*" ref="file" />
        <label for="img">upload an image</label>
        <!-- <input type="submit" value="use" /> -->
        <!-- </form> -->
    </div>
</template>

<style scoped lang="scss">
$transition: 0.3s ease all;
.active {
    background-color: antiquewhite;
}
.image-box {
    width: 40%;
    height: 50%;
    transition: $transition;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    align-items: center;
    border: 1px solid crimson;
    border-radius: 10px;
    span {
        font-size: large;
    }
    input[type="file"] {
        display: none;
    }
    label {
        // @extend button;
        display: flex;
        background-color: whitesmoke;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 2rem;
        padding: 1ch;
        cursor: pointer;
        border: 2px solid black;
        transition: $transition;
    }
}
</style>