<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import p5 from 'p5'
import useStore from '../store/useStore'

const store = useStore()

let preview = ref()

onMounted(() => {
    const sketch = (p: p5) => {

        let cells = 10

        const rect = (x: number, y: number, width: number, height: number, colors: p5.Color[]) => {
            const cellSize = width / cells

            for (let r = 0; r < (height / cells + cellSize); r++) {
                for (let c = 0; c < cells; c++) {
                    // const alpha = p.noise(c, r) * 255
                    const color = colors[(r + c) % (colors.length)]
                    // const color = colors[Math.floor(Math.random() * colors.length)]
                    color.setAlpha(255)
                    p.fill(color)
                    p.rect(x + cellSize * c, y + cellSize * r, cellSize, cellSize)
                }
            }
        }

        p.setup = function () {
            let width = preview.value.offsetWidth
            let height = preview.value.offsetHeight
            let canvas = p.createCanvas(width + 20, height)
            canvas.parent("sketch")
            // p.noLoop()
            p.noStroke()
        }

        p.draw = function () {
            let width = preview.value.offsetWidth
            let height = preview.value.offsetHeight
            p.background(0)
            const colors = store.getPalette.map((col) => p.color(col))
            rect(0, 0, width, height, colors)
        }

        p.windowResized = function () {
            let width = preview.value.offsetWidth
            let height = preview.value.offsetHeight

            this.resizeCanvas(width, height)
            this.redraw()
        }
    }

    new p5(sketch)
})

</script>

<template>
    <div id="sketch" ref="preview"></div>
</template>

<style lang="scss">
#sketch {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
}
</style>
