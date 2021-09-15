<script setup lang='ts'>
    import { Cropper } from 'vue-advanced-cropper'
    import 'vue-advanced-cropper/dist/style.css'
    import demopurp from '../assets/demopurp.jpg'
    
    const change = (props: any) => {
        console.log(props.coordinates, props.canvas)
    }

</script>

<template>
    <cropper
        class='cropper'
        :src='demopurp'
        :auto-zoom="true"
        :stencil-size="{
            width: 280,
            height: 280
        }"
        image-restriction="stencil"
        @change="change"
    />
</template>

<style scoped lang='scss'>
</style>
