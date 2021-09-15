<script setup lang='ts'>
import Sidebar from './components/Sidebar.vue'
import Editor from './components/Editor.vue'
import ColorPicker from './components/ColorPicker.vue'

</script>

<template>
    <Sidebar id="sidebar" />
    <Editor id="editor" />
</template>

<style lang='scss'>

$container-height: 60%;
$container-width: 60%;

body, html {
  margin: 0;
  padding: 0;
}
#editor {
    grid-column-start: 3;
    grid-column-end: span 2;
    grid-row: 2;
    height: 100%;
    width: 100%;
    transform: translateX(-0.75%);
  }
#sidebar {
  grid-column: 2;
  grid-row: 2;
  flex-shrink: 0;
  transform: translateX(0.75%);
}
#app {
/* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #faf884;
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr 3fr;
  grid-template-rows: 2fr 7fr 2fr;
  height: 100vh;
}
</style>