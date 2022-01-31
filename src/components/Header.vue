<script setup lang="ts">
import { useRouter } from "vue-router";
import useStore from '../store/useStore'
import { onUpdated } from "vue";

const store = useStore();
const router = useRouter();

const home = () => {
  router.push({ path: "/" });
};

const explore = () => {
  router.push({ path: "/explore" })
}

const editor = () => {
  router.push({ path: '/editor' })
}

</script>

<template>
  <header class="header">
    <h2 class="title">paletting</h2>
    <nav class="nav">
      <span @click="home">home</span>
      <span :class="{ unavailable: !store.getLoaded }" @click="editor">editor</span>
      <span @click="explore">explore</span>
    </nav>
  </header>
</template>

<style scoped lang="scss">
$accent: #f38630;
.unavailable {
  color: rgb(179, 179, 179);
  cursor: default;
}
.header {
  width: 100%;
  background-color: hsl(0, 0%, 15%);
  display: flex;
  place-content: center;
}
.nav {
  width: 100%;
  display: flex;
  align-items: center;
  font-family: "PT Sans";
  font-size: 2.1ch;
  justify-content: flex-end;
  gap: 2.15rem;
  margin-right: 2rem;
}
span {
  color: white;
  cursor: pointer;
}
.title {
  place-self: center;
  font-family: "Comfortaa";
  font-size: 3.3ch;
  cursor: default;
  margin-left: 2rem;
  color: #f38630;
}
</style>
