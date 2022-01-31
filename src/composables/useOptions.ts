import { SortMode } from '../../wasm-paletting/pkg/wasm_paletting';
import useStore from '../store/useStore';
import { computed, onMounted, onUpdated, reactive, ref, Ref } from "vue";
import { useRouter } from "vue-router";



export function useOptions() {

    const store = useStore();
    const router = useRouter();


    const toleranceOptions = store.getToleranceOptions;
    const sortOptions = store.getSortOptions

    const pixelationFactor = ref(0);
    const sortOption = ref(SortMode.NONE);
    const toleranceFactor = ref(toleranceOptions.Medium);

    const pixelationElement = ref<HTMLInputElement | null>(null);

    const pixelationPercentage = computed(() =>
        Math.floor((100 / Number(pixelationElement.value?.max)) * pixelationFactor.value)
    );

    let pixelationSlider = reactive({
        color: "#f38630",
        sliderStyle: "",
    });

    const sliderStyle = computed(
        () =>
            `linear-gradient(90deg, ${pixelationSlider.color} ${pixelationPercentage.value}%, #fff ${pixelationPercentage.value}%)`
    );

    onMounted(() => {
        pixelationSlider.sliderStyle = sliderStyle.value;
        store.setTolerance(toleranceOptions.Medium);
        toleranceFactor.value = store.tolerance;
    });

    onUpdated(() => {
        pixelationSlider.sliderStyle = sliderStyle.value;
    });

    const pixelate = async () => {
        await store.pixelate(pixelationFactor.value);
        store.render();
    };

    const sortImage = async (e: Event) => {
        const click = parseInt((e.target as HTMLInputElement).value);

        if (click === sortOption.value) {
            sortOption.value = SortMode.NONE;
        } else {
            sortOption.value = click;
        }

        await store.sortBuffer(sortOption.value);
        await store.render();

        pixelationFactor.value = 0;
    };

    const setTolerance = () => {
        const dE = toleranceFactor.value;
        store.setTolerance(dE);
    };

    const reset = async () => {
        await store.reset();
        await store.render();

        pixelationFactor.value = 0;
        sortOption.value = SortMode.NONE;
    };

    const extract = async () => {
        await store.extractColors();
    };

    const extractFromSubImage = async () => {
        await store.extractFromRegion();
    };

    const remove = () => {
        store.remove();
        router.push({ path: "/" });
    };

    const exportPrompt = () => {
        store.togglePrompt();
    };

    return {
        pixelate,
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
    }

}