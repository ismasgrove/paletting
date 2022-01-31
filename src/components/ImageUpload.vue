<script setup lang="ts">
import { useImageUpload } from '../composables/useImageUpload';

const { active,
  dropBoxActive,
  uploadButton,
  uploadDrop } = useImageUpload();

</script>

<template>
  <div
    :class="{ active: active }"
    @dragenter.prevent="dropBoxActive"
    @dragleave.prevent="dropBoxActive"
    @drop.prevent="dropBoxActive"
    @drop="uploadDrop"
    @dragover.prevent
    class="image-box"
  >
    <span>Drag and drop</span>
    <span>or</span>
    <input @change="uploadButton" id="img" type="file" accept="image/*" />
    <label for="img">upload an image</label>
  </div>
</template>

<style scoped lang="scss">
$transition: 0.3s ease all;
$accent: #f38630;
.active {
  background-color: antiquewhite;
}
.image-box {
  width: 40%;
  height: 50%;
  transition: $transition;

  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
  border: 1px solid $accent;
  border-radius: 10px;

  span {
    font-size: large;
  }
  input[type="file"] {
    display: none;
  }
  label {
    // @extend button;
    display: flex;
    background-color: whitesmoke;
    color: black;
    align-items: center;
    justify-content: center;
    height: 2rem;
    padding: 1ch;
    cursor: pointer;
    border: 2px solid $accent;
    border-style: solid;
    border-radius: 5px;
    transition: $transition;
  }
}
</style>
