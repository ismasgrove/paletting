<script setup lang='ts'>
import Sidebar from './components/Sidebar.vue'
import Editor from './components/Editor.vue'
import MainContainer from './components/MainContainer.vue'

</script>

<template>
  <MainContainer>
    <Editor />
  </MainContainer>
</template>

<style lang='scss'>
body,
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}
</style>