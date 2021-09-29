import { defineStore } from 'pinia'

const useStore = defineStore('store', {
    state: () => (
        {
            palette: [] as Array<string>,
            target: {} as File,
            submitted: false,
        }
    ),
    actions: {
        setImage(image: File) {
            this.target = image
        },
        setPalette(palette: Array<string>) {
            this.palette = palette
        }
    },
    getters: {
        getPalette: (state) => state.palette,
        getTarget: (state) => state.target
    }
})

export default useStore