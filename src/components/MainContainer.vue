<script setup lang="ts">
</script>

<template>
    <div class="main-container">
        <h1 class="heading">paletting</h1>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
$editor-width: 100%;
$editor-height: 100%;
.heading {
    margin-top: 6px;
    margin-left: 6px;
    align-self: center;
    justify-self: start;
    color: white;
    strong {
        color: white;
    }
}
.main-container {
    background-color: rgb(44, 44, 44);
    width: $editor-width;
    height: $editor-height;
    grid-column: 1;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 25% 75%;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
}
</style>