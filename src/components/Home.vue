<script setup lang="ts">
import ImageUpload from './ImageUpload.vue';

</script>

<template>
    <div class="home">
        <ImageUpload />
        <div class="introduction">
            <p>
                <i>
                    <strong>paletting</strong>
                </i> is a simple website built with Vue 3 together with wasm-bindgen. where you upload an image and manipulate it so you can extract a color palette you like (displayed on the right). Then you can both download it and save it with a unique tag to find it again via the explore page.
            </p>
        </div>
    </div>
</template>

<style lang="scss">
.home {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: 100%;
    strong {
        font-weight: 600;
    }
    .introduction {
        width: 50%;
        text-align: left;
    }
}
</style>