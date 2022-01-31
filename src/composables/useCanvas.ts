import { onMounted, onUpdated, reactive, Ref } from "vue";
import useStore from '../store/useStore'

export function useCanvas(canvas: Ref<HTMLCanvasElement | null>) {
    let image = reactive(new Image());
    let context: CanvasRenderingContext2D | null = null;
    const store = useStore();

    onMounted(() => {
        image.onload = () => {
            canvas.value!.width = image.naturalWidth;
            canvas.value!.height = image.naturalHeight;
            context = canvas.value!.getContext("2d");
            context?.drawImage(image, 0, 0);
        };
        image.src = store.getSrc;
    });

    onUpdated(() => {
        image.onload = () => {
            if (!canvas.value) return;
            context?.clearRect(0, 0, canvas.value.width, canvas.value.height);
            context?.drawImage(image, 0, 0);
        };
        image.src = store.getSrc;
    });

    const resolution =
        window.devicePixelRatio * Math.min(window.screen.width, window.screen.height);
    let drawing = false;
    let startX = 0, startY = 0;

    const transform = (x: number, y: number): [number, number] => {
        if (!canvas.value) return [x, y]

        const canvasBoundingRect = canvas.value.getBoundingClientRect();
        const offsetX = canvasBoundingRect.left;
        const offsetY = canvasBoundingRect.top;
        const scaleX = canvas.value.width / canvasBoundingRect.width;
        const scaleY = canvas.value.height / canvasBoundingRect.height;

        return [
            Math.round((x - offsetX) * scaleX),
            Math.round((y - offsetY) * scaleY),
        ];
    };

    const endDrawing = (e: MouseEvent) => {
        drawing = false;
        const [endX, endY] = transform(e.clientX, e.clientY);

        const deltaX = Math.max(startX, endX) - Math.min(startX, endX);
        const deltaY = Math.max(startY, endY) - Math.min(startY, endY);

        store.setSubImage(
            Math.min(startX, endX),
            Math.min(startY, endY),
            deltaX,
            deltaY
        );
    };

    const handleMouseDown = (e: MouseEvent) => {
        [startX, startY] = transform(e.clientX, e.clientY);
        drawing = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
        endDrawing(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!drawing) return;
        if (!canvas.value) return;

        const [mouseX, mouseY] = transform(e.clientX, e.clientY);

        context?.clearRect(0, 0, canvas.value.width, canvas.value.height);
        context?.drawImage(image, 0, 0);

        const width = Math.round(mouseX - startX);
        const height = Math.round(mouseY - startY);

        const line =
            (3 *
                Math.sqrt(
                    canvas.value.width * canvas.value.width +
                    canvas.value.height * canvas.value.height
                )) /
            resolution;

        context!.lineWidth = line;
        context?.strokeRect(startX, startY, width, height);
    };
    const handleMouseOut = (e: MouseEvent) => {
        if (!drawing) return;
        endDrawing(e);
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleMouseUp,
        store
    }
}