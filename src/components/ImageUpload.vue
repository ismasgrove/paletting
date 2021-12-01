<script setup lang="ts">
import { ref, Ref } from 'vue'

import useStore from '../store/useStore'
import { useRouter } from 'vue-router'

const imageFile = ref()
const active = ref(false)
const store = useStore()
const router = useRouter()

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
            await store.render()
            store.setLoaded(true)
            router.push({ path: '/editor' })
        })
}

const handleStuff = () => {
    active.value = !active.value
}

</script>

<template>
    <div
        :class="{ active: active }"
        @dragenter.prevent="handleStuff"
        @dragleave.prevent="handleStuff"
        @drop.prevent="handleStuff"
        @drop="uploadDrop"
        @dragover.prevent
        class="image-box"
    >
        <span>Drag and drop</span>
        <span>or</span>
        <input @change="uploadButton" id="img" type="file" accept="image/*" ref="file" />
        <label for="img">upload an image</label>
    </div>
</template>

<style scoped lang="scss">
$transition: 0.3s ease all;
$accent: #f38630;
.active {
    background-color: antiquewhite;
}
.image-box {
    width: 40%;
    height: 50%;
    transition: $transition;

    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    align-items: center;
    border: 1px solid $accent;
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
        color: black;
        align-items: center;
        justify-content: center;
        height: 2rem;
        padding: 1ch;
        cursor: pointer;
        border: 2px solid $accent;
        border-style: solid;
        border-radius: 5px;
        transition: $transition;
    }
}
</style>