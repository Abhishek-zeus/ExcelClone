import { MouseCell, MouseHandler } from "../../events/MouseHandler";
import { ResizeDetector } from "../../events/ResizeDetector";
import { COLUMN_HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../utils/Constants";

export enum InteractionType {
    CELL,
    ROW_HEADER,
    COLUMN_HEADER,
    COLUMN_RESIZE,
    ROW_RESIZE,
    NONE
}
export interface InteractionResult {
    type: InteractionType;
    mouseCell: MouseCell | null;
}

export class HitTest {

    constructor(
        private mouseHandler: MouseHandler,
        private resizeDetector: ResizeDetector
    ) { }

    public resolve(event: PointerEvent): InteractionResult {

        const mouseCell =
            this.mouseHandler.getCellFromMouse(event.offsetX, event.offsetY);

        if (!mouseCell) {
            return {
                type: InteractionType.NONE,
                mouseCell: null
            };
        }

        // Resize ?
        const resizeInfo = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
        if (resizeInfo.type === "COLUMN") {
            return {
                type: InteractionType.COLUMN_RESIZE,
                mouseCell: mouseCell
            };
        }
        if (resizeInfo.type === "ROW") {
            return {
                type: InteractionType.ROW_RESIZE,
                mouseCell: mouseCell
            }
        }

        // Header ?
        if (event.offsetX < ROW_HEADER_WIDTH) {
            return {
                type: InteractionType.ROW_HEADER,
                mouseCell: mouseCell
            }
        }
        if (event.offsetY < COLUMN_HEADER_HEIGHT) {
            return {
                type: InteractionType.COLUMN_HEADER,
                mouseCell: mouseCell
            }
        }

        // Cell ?
        return {
            type: InteractionType.CELL,
            mouseCell: mouseCell
        }

    }

}