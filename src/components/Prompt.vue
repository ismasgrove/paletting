<script setup lang="ts">
import ky from "ky"
import { ref } from "vue";
import useStore from "../store/useStore"
import { useDownload } from "../composables/useDownload";

const store = useStore();
const showTagInput = ref(false);
const tag = ref("");

const { download } = useDownload();

const save = async () => {
    const response = await ky.post("/api/palette", {
        json: {
            tag: tag.value,
            palette: store.getPalette,
            count: store.getPalette.length
        }
    }).json()
    console.log(response)
}

</script>

<template>
    <div class="prompt-container">
        <div class="prompt-field">
            <span>Format</span>
            <select>
                <option value="json">json</option>
            </select>
        </div>
        <div class="prompt-field">
            <label for="save">Save?</label>
            <input v-model="showTagInput" type="checkbox" name="save" />
            <div class="popup" :class="{ invisible: !showTagInput }">
                <label for="tag">Tag</label>
                <input v-model="tag" type="text" name="tag" />
                <button @click="save">Save</button>
            </div>
        </div>
        <button @click="download">Download</button>
    </div>
</template>

<style scoped lang="scss">
.invisible {
    visibility: hidden;
}
.prompt-container {
    display: flex;
    background-color: hsl(0, 0%, 24%);
    max-height: fit-content;
    font-size: small;
    min-width: 20%;
    color: whitesmoke;
    display: flex;
    justify-content: center;
    align-items: center;

    border-top-left-radius: 4px;
}
.prompt-field {
    margin-left: 1rem;
    display: flex;
    column-gap: 0.25rem;
    justify-content: space-around;
    align-items: center;
}

button {
    display: inline-block;
    border: none;
    width: 9.5ch;
    height: 3ch;
    font-size: small;
    background-color: hsl(194, 64%, 49%);
    color: black;
    cursor: pointer;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
}
.popup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4ch;
    column-gap: 1rem;
    margin-right: 0.25rem;
    .invisible {
        visibility: hidden;
    }
}
</style>