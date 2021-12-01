<script setup lang='ts'>
import { ref, Ref, onMounted, onUpdated, reactive } from 'vue'
import useStore from '../store/useStore'

const store = useStore()
const resolution = window.devicePixelRatio *
    Math.min(window.screen.width, window.screen.height)
let canvas = ref()
let context = ref()
let image = reactive(new Image())
let drawing = false
let startX: number, startY: number


onMounted(() => {
    image.onload = () => {
        canvas.value.width = image.naturalWidth
        canvas.value.height = image.naturalHeight
        context.value = canvas.value.getContext("2d")
        context.value.drawImage(image, 0, 0)
    }
    image.src = store.getSrc
})

onUpdated(() => {
    image.onload = () => {
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        context.value.drawImage(image, 0, 0)
    }
    image.src = store.getSrc
})

const transform = (x: number, y: number): [number, number] => {
    const canvasBoundingRect = canvas.value.getBoundingClientRect()
    const offsetX = canvasBoundingRect.left
    const offsetY = canvasBoundingRect.top
    const scaleX = canvas.value.width / canvasBoundingRect.width
    const scaleY = canvas.value.height / canvasBoundingRect.height
    return [
        Math.round((x - offsetX) * scaleX),
        Math.round((y - offsetY) * scaleY)
    ]
}

const endDrawing = (e: MouseEvent) => {
    drawing = false
    const [endX, endY] = transform(e.clientX, e.clientY)

    const deltaX = Math.max(startX, endX) - Math.min(startX, endX)
    const deltaY = Math.max(startY, endY) - Math.min(startY, endY)

    store.setSubImage(Math.min(startX, endX), Math.min(startY, endY), deltaX, deltaY)
}

const handleMouseDown = (e: MouseEvent) => {
    [startX, startY] = transform(e.clientX, e.clientY)
    drawing = true
}

const handleMouseUp = (e: MouseEvent) => {
    endDrawing(e)
}

const handleMouseMove = (e: MouseEvent) => {
    if (!drawing) return;

    const [mouseX, mouseY] = transform(e.clientX, e.clientY)

    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    context.value.drawImage(image, 0, 0)

    const width = Math.round(mouseX - startX)
    const height = Math.round(mouseY - startY)

    const line = 3 * Math.sqrt(canvas.value.width * canvas.value.width
        + canvas.value.height * canvas.value.height) / resolution

    context.value.lineWidth = line
    context.value.strokeRect(startX, startY, width, height)
}
const handleMouseOut = (e: MouseEvent) => {
    if (!drawing) return
    endDrawing(e)
}

</script>

<template>
    <canvas
        @mousedown.prevent="handleMouseDown"
        @mouseup.prevent="handleMouseUp"
        @mousemove.prevent="handleMouseMove"
        @mouseout.prevent="handleMouseOut"
        ref="canvas"
        class="canvas"
        :src="store.getSrc"
    />
</template>

<style scoped lang='scss'>
.canvas {
    object-fit: contain;
}
</style>
