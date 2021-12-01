<script setup lang='ts'>
import Header from './components/Header.vue'

import Preview from './components/Preview.vue'

import Options from './components/Options.vue'
import Canvas from './components/Canvas.vue'
import ImageUpload from './components/ImageUpload.vue'

// import useStore from './store/useStore'

</script>

<template>
  <Header class="header" />
  <div class="ridge" />
  <router-view class="image-upload"></router-view>
  <!-- <ImageUpload class="image-upload" v-if="!store.loaded" /> -->
  <router-view name="Canvas" class="canvas"></router-view>
  <router-view name="Options" class="options"></router-view>
  <!-- <Canvas v-if="store.loaded" class="canvas" /> -->
  <!-- <Options v-if="store.loaded" class="options" /> -->
  <Preview class="preview" />
</template>

<style lang='scss'>
$ridge-color: hsl(0, 0%, 15%);
body,
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
.ridge {
  height: 100%;
  width: 100%;
  grid-row: 1 / -1;
  grid-column: 2;
  background-color: $ridge-color;
}
.canvas {
  grid-column: 1;
  grid-row: 2;
  max-height: 100%;
  max-width: 100%;
  place-self: center;
}
.options {
  grid-column: 1;
  grid-row: 3;
  justify-self: stretch;
  place-content: center;
}
.image-upload {
  grid-column: 1;
  grid-row: 2;
  place-self: center;
}
.header {
  display: flex;
  justify-items: start;
  width: 100%;
  grid-row: 1;
  grid-column: 1;
}
.preview {
  height: 100%;
  width: 100%;
  grid-column: 3;
  grid-row: 1 / span 3;
}
#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: whitesmoke;
  display: grid;
  grid-template-rows: 6% 88% 6%;
  grid-template-columns: 79.8% 0.2% 20%;
  height: 100vh;
  overflow: hidden;
}
</style>