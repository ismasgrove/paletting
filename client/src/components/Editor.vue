<script setup lang='ts'>
import Cropper from './Cropper.vue';
import ColorPicker from './ColorPicker.vue'



</script>

<template>
    <div class='editor-container' >
    <!-- <ColorPicker id='color-picker' /> -->
    <!-- <Cropper id='cropper' /> -->
    <div class='select-prompt' id='color-select'>
        <button>pick a color</button>

    </div>
    <div class='select-prompt' id='image-select'>
        <button>upload an image</button>

    </div>
    </div>
</template>

<style scoped lang='scss'>
.editor-container {
    background-color: hsl(323, 100%, 85%);
    flex-grow: 0;
    border-radius: 15px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    display: grid;
    grid-template-columns: 1.25% 98.75%;
    grid-template-rows: 50% 50%;
}
#cropper {
    margin-top: 1px;
    grid-column: 2;
    grid-row: 1;
    width: max-content;
    max-width: auto;
}
.select-prompt {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    align-items: center;
    button {
        margin-left: 3rem;
        height: 3rem;
        background-color: greenyellow;
    }
}
#color-select {
    grid-column: 2;
    grid-row: 1;
}
#image-select {
    grid-column: 2;
    grid-row: 2;
}

</style>