import useStore from "../store/useStore";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";


export function useImageUpload() {

    const store = useStore();
    const router = useRouter();
    const imageFile = ref<File | null | undefined>(null);
    const active = ref(false);

    async function uploadButton(e: Event) {
        if ((e.target as HTMLInputElement).files?.length === 0) {
            return;
        }

        imageFile.value = (e.target as HTMLInputElement).files?.item(0);

        await initializeStore(imageFile);
    }

    async function uploadDrop(e: DragEvent) {
        if ((e.target as HTMLInputElement).files?.length === 0) {
            return;
        }

        imageFile.value = e.dataTransfer?.files?.item(0);

        await initializeStore(imageFile);
    }

    async function initializeStore(imageFile: Ref<File | null | undefined>) {
        if (!imageFile.value) return;
        const buf = await imageFile.value.arrayBuffer();
        await store.initialize(new Uint8Array(buf));
        await store.render();
        store.setLoaded(true);

        router.push({
            path: "/editor"
        });
    };

    const dropBoxActive = () => {
        active.value = !active.value;
    };

    return {
        active,
        dropBoxActive,
        uploadButton,
        uploadDrop
    }
}