<script setup lang="ts">
import useStore from '../store/useStore';
import { useOptions } from '../composables/useOptions';

const store = useStore();

const { pixelate,
  sortImage,
  setTolerance,
  reset,
  extract,
  extractFromSubImage,
  remove,
  exportPrompt,
  pixelationElement,
  pixelationSlider,
  pixelationFactor,
  toleranceFactor,
  toleranceOptions,
  sortOption,
  sortOptions
} = useOptions();

</script>

<template>
  <div class="options">
    <!---->
    <div class="options-set" id="sort-div">
      <label class="option-label" for="sort-div">Sort by</label>
      <div class="radio-options" :key="name" v-for="(value, name) in sortOptions">
        <input
          :id="name"
          :key="name"
          type="radio"
          v-model="sortOption"
          :value="value"
          @click="sortImage"
        />
        <label class="mode-selector" :for="name" :key="name">{{ name }}</label>
      </div>
    </div>
    <!---->
    <div class="options-set">
      <label class="option-label" for="pixelate">Pixelate</label>
      <input
        v-model="pixelationFactor"
        type="range"
        min="0"
        max="0.25"
        step="0.01"
        id="pixelate"
        ref="pixelationElement"
        @input="pixelate"
      />
    </div>
    <!---->
    <div class="options-set">
      <label class="option-label">Tolerance</label>
      <div class="radio-options" :key="name" v-for="(value, name) in toleranceOptions">
        <input
          :id="name"
          type="radio"
          v-model="toleranceFactor"
          :value="value"
          @change="setTolerance"
        />
        <label class="mode-selector" :for="name">{{ name }}</label>
      </div>
    </div>
    <!--  -->
    <div class="buttons-div">
      <label class="option-label">Extract</label>
      <button @click="extract">Full</button>
      <button @click="extractFromSubImage">Region</button>
    </div>
    <!--  -->
    <div class="buttons-div crucial-buttons-div">
      <button @click="reset">Reset</button>
      <button @click="remove">Remove</button>
      <button @click="exportPrompt">{{ store.prompt ? "Cancel" : "Export" }}</button>
    </div>
    <!--  -->
  </div>
</template>

<style scoped lang="scss">
$crucial-buttons-color: hsl(35, 89%, 57%);
$crucial-buttons-hover-color: hsl(54, 82%, 65%);
$options-highlights: hsl(26, 89%, 57%);
$options-highlights-hover: hsl(26, 89%, 65%);
$buttons-color: hsl(0, 0%, 89%);
$buttons-hover-color: hsl(0, 0%, 95%);
$radio-radius: 5px;
$options-bar-color: hsl(0, 0%, 15%);
$range-slider-thumb: hsl(190, 72%, 72%);
.options-set {
  display: inline-flex;
  place-content: center;
  gap: 0.75rem;
  input[type="range"] {
    -webkit-appearance: none;
    width: 9rem;
    opacity: 0.8;
    background-color: $options-bar-color;
    cursor: pointer;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]:hover {
    opacity: 1;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: v-bind("pixelationSlider.sliderStyle");
    height: 5px;
  }
  input[type="range"]::-moz-range-track {
    background: v-bind("pixelationSlider.sliderStyle");
    height: 5px;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    background: $range-slider-thumb;
    margin-top: -5px;
    border-radius: 50%;
  }
  input[type="range"]::-moz-range-thumb {
    height: 15px;
    width: 15px;
    background: $range-slider-thumb;
    margin-top: -5px;
    border-radius: 50%;
  }
  .radio-options {
    color: black;
    width: 9.5ch;
    height: 3ch;
    background-color: $buttons-color;
    border-radius: $radio-radius;

    input[type="radio"] {
      display: none;
    }
    .mode-selector {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      font-size: small;
      border-radius: $radio-radius;
    }
    input[type="radio"]:checked + .mode-selector {
      background-color: $options-highlights;
    }
    input[type="radio"]:checked:hover + .mode-selector {
      background-color: $options-highlights-hover;
    }
  }
  .radio-options:hover {
    background-color: $buttons-hover-color;
  }
}
button {
  display: inline-block;
  border: none;
  border-radius: 5px;
  width: 9.5ch;
  height: 3.5ch;
  background-color: $buttons-color;
  color: black;
  font-size: small;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
}

button:hover {
  background-color: hsl(190, 72%, 72%);
}
button:focus {
  outline: none;
}
.buttons-div {
  display: inline-flex;
  place-content: center;
  place-items: center;
  gap: 1rem;
}
.crucial-buttons-div > button {
  background-color: $crucial-buttons-color;
}
.crucial-buttons-div > button:hover {
  background-color: $crucial-buttons-hover-color;
}
.options {
  display: flex;
  place-items: center;
  font-family: "PT Sans";
  justify-content: space-evenly;
  background-color: $options-bar-color;
  .option-label {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: small;
    place-self: center;
  }
}
</style>
