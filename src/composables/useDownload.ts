import useStore from "../store/useStore";

export function useDownload() {
    const store = useStore();
    const download = () => {
        const palette = JSON.stringify(store.getPalette);
        const link = document.createElement("a");
        link.setAttribute(
            "href",
            "data:application/json;charset=utf-8," + encodeURIComponent(palette)
        );
        link.download = "palette.json";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        download
    }
}