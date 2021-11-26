<script setup lang='ts'>
// import Cropper from './Cropper.vue';
import Options from './Options.vue'
import Cropper from './Cropper.vue'
import ImageUpload from './ImageUpload.vue'

import { ref } from 'vue'
import ky from 'ky'
import useStore from '../store/useStore'

const store = useStore()

</script>

<template>
    <div class="display-uploaded" v-if="store.loaded">
        <Cropper />
        <!-- <img :src="store.getSrc" /> -->
        <Options id="options" />
    </div>
    <ImageUpload id="upload" v-else />
</template>

<style scoped lang='scss'>
.display-uploaded {
    // background-color: blue;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
}
img {
    justify-self: center;
    height: 80%;
    border: 1px solid black;
    object-fit: contain;
}
#options {
    grid-column: 1;
    grid-row: 2;
}
#upload {
    justify-self: center;
    align-self: center;
}
</style>