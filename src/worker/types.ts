/* eslint-disable prettier/prettier */
import { ProxyMarked, Remote } from "comlink";
import { ImageView, SortMode } from "wasm-paletting/pkg/wasm_paletting";

export interface WorkerInterface {
    view: ImageView;
    init(buf: Uint8Array): void;
    pixelate(factor: number): void;
    sortBuffer(mode: SortMode): void;
    render(): Uint8Array;
    extractColors(dE: number): string;
    extractFromRegion(
        dE: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): string;
    resetPixelation(): void;
    reset(): void;
}

export interface ExposedObject {
    handlers: Promise<Remote<WorkerInterface> & ProxyMarked>
}