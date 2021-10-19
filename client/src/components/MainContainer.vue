<script setup lang="ts">
</script>

<template>
    <div class="main-container">
        <h1>
            color
            <strong>dump</strong>
        </h1>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
$editor-width: 100%;
$editor-height: 100%;
.main-container {
    background-color: aquamarine;
    width: $editor-width;
    height: $editor-height;
    max-height: 80%;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>