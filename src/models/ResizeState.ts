export interface ResizeState{
    type: "ROW" | "COLUMN";
    index: number;
    startMouseX: number;
    startMouseY: number;
    originalWidth?: number;
    originalHeight?: number;
}