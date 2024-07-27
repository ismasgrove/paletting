<script setup lang="ts">
import PaletteCard from './PaletteCard.vue'
import ky from 'ky'
import { Palette } from '../models/palette';
import { onMounted, ref, watch } from 'vue';

let paletteCollection = ref<Palette[]>([]);

onMounted(async () => {
    const response: Array<Palette> = await ky.get('/api/palette').json();
    paletteCollection.value = response;
})

let found = ref<Palette | undefined>()
let searchInput = ref<string>("");
let searching = ref(false);

watch(searchInput, (searchInput) => {
    if (searchInput === "")
        searching.value = false;
    found.value = undefined;
})

const handleSearch = () => {
    if (searching.value) {
        searchInput.value = "";
        found.value = undefined;
        searching.value = false;
    }
    else {
        searching.value = true;
        found.value = paletteCollection.value.find(palette => {
            if (palette.tag === searchInput.value) return palette;
        })
    }
}

</script>

<template>
    <div class="explore-container">
        <div class="search-container">
            <input
                type="search"
                v-model="searchInput"
                placeholder="find your old palette with its tag"
            />
            <button @click="handleSearch">{{ searching ? "back" : "search" }}</button>
        </div>
        <div class="explore-preview">
            <PaletteCard v-if="found" :item="found" />
            <PaletteCard v-if="!searching" v-for="item in paletteCollection" :item="item"></PaletteCard>
            <div v-if="searching && !found" class="not-found">
                <p>Palette with tag '{{ searchInput }}' was not found!</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.not-found {
    width: 100%;
    justify-self: center;
    align-self: center;
}
button {
    display: inline-block;
    border: none;
    border-radius: 3px;
    background-color: rgb(255, 255, 255);
    color: black;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
}
.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 2;
    margin-top: 5rem;
    gap: 0.25rem;
    margin-bottom: 2rem;
    input[type="search"] {
        width: 20rem;
        border: none;
    }
}
.explore-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 1rem;
}
.explore-preview {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    margin-left: 1rem;
    margin-right: 1rem;
    // align-self: center;
    // justify-self: center;
    // justify-content: center;
    // align-items: center;
    gap: 0.5rem;
}
</style>