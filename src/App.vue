<script setup lang="ts">
import Header from "./components/Header.vue";
import Preview from "./components/Preview.vue";
import Prompt from "./components/Prompt.vue";

import useStore from './store/useStore'

const store = useStore()

</script>

<template>
  <Header class="header" />
  <div class="ridge" />
  <Prompt class="prompt" v-if="store.prompt" />
  <router-view class="image-upload"></router-view>
  <router-view name="Canvas" class="canvas"></router-view>
  <router-view name="Options" class="options"></router-view>
  <router-view name="Explore" class="explore"></router-view>
  <Preview class="preview" />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=PT+Sans&display=swap");

$ridge-color: hsl(0, 0%, 15%);
body,
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
.prompt {
  justify-self: right;
  align-self: flex-end;
  grid-row: 2 / 3;
  grid-column: 1;
  z-index: 10;
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
  min-height: fit-content;
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
