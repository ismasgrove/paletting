<script setup lang="ts">
import iro from '@jaames/iro'
import { onMounted, ref } from 'vue'

let colorPicker = ref(null)

onMounted(() => {
    colorPicker = new (iro.ColorPicker as any)('#color-picker', {
        width: 300,
        color: '#fff',
    })
})
</script>

<template>
    <div id="color-picker" ref="colorPicker" />
</template>

<style scoped>
.selector-container {
    display: flex;
    transform: translateX(-14px);
    background-color: #333;
    border: 5px solid #333;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    z-index: 2;
    height: 100%;
    width: 30rem;
}
#color-picker {
    align-self: center;
    justify-self: center;
}
</style>
