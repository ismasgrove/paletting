<script setup lang='ts'>
import { ref, Ref, onMounted, onUpdated, reactive } from 'vue'
import useStore from '../store/useStore'

const store = useStore()
let canvas = ref()
let context = ref()
let image = reactive(new Image())
let drawing = false
let startX: number, startY: number
let endX: number, endY: number
let mouseX: number, mouseY: number
let offsetX: number, offsetY: number
let scaleX: number, scaleY: number

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
    offsetX = canvasBoundingRect.left
    offsetY = canvasBoundingRect.top
    scaleX = canvas.value.width / canvasBoundingRect.width
    scaleY = canvas.value.height / canvasBoundingRect.height
    return [
        Math.round((x - offsetX) * scaleX),
        Math.round((y - offsetY) * scaleY)
    ]
}

const endDrawing = (e: MouseEvent) => {
    drawing = false
    const [x, y] = transform(e.clientX, e.clientY)
    endX = x
    endY = y

    store.setSubImage(startX, startY, endX, endY)
    console.log(startX, startY, endX - startX, endY - startY)
}

const handleMouseDown = (e: MouseEvent) => {
    const [x, y] = transform(e.clientX, e.clientY)
    startX = x
    startY = y
    drawing = true
}

const handleMouseUp = (e: MouseEvent) => {
    endDrawing(e)
}

const handleMouseMove = (e: MouseEvent) => {
    if (!drawing) return;

    const [x, y] = transform(e.clientX, e.clientY)
    mouseX = x
    mouseY = y

    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    context.value.drawImage(image, 0, 0)

    const width = Math.round(mouseX - startX)
    const height = Math.round(mouseY - startY)

    context.value.strokeRect(startX, startY, width, height)
}
const handleMouseOut = (e: MouseEvent) => {
    if (!drawing) return
    endDrawing(e)
}

const change = (props: any) => {
    /*
        TODO: send coordinates to WASM
    */
    // console.log(props.coordinates, props.canvas)
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
    <!-- <img :src="store.getSrc" /> -->
</template>

<style scoped lang='scss'>
.canvas {
    justify-self: center;
    // background-color: white;
    height: 80%;
    max-width: 80%;
    // border: 1px solid black;
    object-fit: contain;
}
</style>
