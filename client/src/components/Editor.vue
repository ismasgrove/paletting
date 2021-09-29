<script setup lang='ts'>
// import Cropper from './Cropper.vue';
// import ColorPicker from './ColorPicker.vue'
import { ref } from 'vue'
import ky from 'ky'
import useStore from '../store/useStore'

const imageFile = ref()
const store = useStore()
const uploadedImage = ref(false)
const submitted = ref(false)

const handleUpload = async (e: Event) => {
    if ((e.target as HTMLInputElement).files?.length === 0) {
        return
    }

    imageFile.value = (e.target as HTMLInputElement).files?.item(0)

    store.setImage(imageFile.value)
}

const handleSubmit = async (e: Event) => {
    let formData = new FormData()

    formData.append('target', store.getTarget)

    const response = await ky.post('/api/image/upload', {
        body: formData
    })

    console.log(response)
}

</script>

<template>
    <div class="editor-container">
        <form @submit.prevent @submit="handleSubmit">
            <div class="select-prompt" id="image-select">
                <input @change="handleUpload" id="img" type="file" accept="image/*" ref="file" />
                <label for="img">upload an image</label>
                <input type="submit" value="use" />
            </div>
        </form>
    </div>
</template>

<style scoped lang='scss'>
// form {
// }
input[type="file"] {
    display: none;
}
label {
    @extend button;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    cursor: pointer;
    border: 2px;
    border-style: outset;
}

.editor-container {
    background-color: hsl(323, 100%, 85%);
    flex-grow: 0;
    // border-radius: 10px;
    // border-top-left-radius: 0;
    // border-bottom-left-radius: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
#cropper {
    margin-top: 1px;
    width: max-content;
    max-width: auto;
}
.select-prompt {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    button {
        // margin-left: 3rem;
        height: 3rem;
        width: 10rem;
        background-color: greenyellow;
    }
}
</style>