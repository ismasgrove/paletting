<script setup lang="ts">

import { useRouter } from 'vue-router'

const router = useRouter()

const explore = () => {

}

const home = () => {
    router.push({ path: '/' })
}

</script>

<template>
    <header class="header">
        <h2 class="title">paletting</h2>
        <nav class="nav">
            <span>home</span>
            <span>explore</span>
        </nav>
    </header>
</template>

<style scoped lang='scss'>
$accent: #f38630;
.header {
    width: 100%;
    background-color: hsl(0, 0%, 15%);
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
    display: flex;
    place-content: center;
}
.nav {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    margin-right: 2rem;
    span {
        color: white;
        font-size: medium;
        margin-right: 2ch;
        cursor: pointer;
    }
}
.title {
    place-self: center;
    margin-left: 2rem;
    color: #f38630;
    strong {
        color: #f38630;
    }
}
</style>