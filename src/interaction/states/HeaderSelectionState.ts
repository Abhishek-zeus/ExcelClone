import { MouseCell, MouseHandler } from "../../events/MouseHandler.js";
import { ResizeDetector } from "../../events/ResizeDetector.js";
import { COLUMN_HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../utils/Constants.js";
import { InteractionManager } from "../InteractionManager.js";
import { InteractionState } from "./InteractionState.js";

export class HeaderSelectionState implements InteractionState{

    private selectionStart : MouseCell | null = null;
    private needsRender: boolean = false;

    constructor(
        private interactionManager: InteractionManager,
        private resizeDetector: ResizeDetector,
        private mouseHandler: MouseHandler
    ){}

    HitTest(event: PointerEvent): boolean {
        if (event.offsetX < ROW_HEADER_WIDTH || event.offsetY < COLUMN_HEADER_HEIGHT) {
            return true;
        }
        return false;
    }

    onPointerDown(event: PointerEvent): void {
        
        // If row header is selected
        if (event.offsetX < ROW_HEADER_WIDTH) {
            const row = this.interactionManager.getMouseHandler().getRowFromMouse(event.offsetY);
            if (row !== -1) {
                this.interactionManager.getSelectionManager().selectRow(row, Infinity);
                this.needsRender = true;
            }
            this.interactionManager.getRenderScheduler().queueRender(this.needsRender);
            return;
        }

        // If column header is selected
        if (event.offsetY < COLUMN_HEADER_HEIGHT) {
            const column = this.interactionManager.getMouseHandler().getColumnFromMouse(event.offsetX);
            if (column !== -1) {
                this.interactionManager.getSelectionManager().selectColumn(column, Infinity); //passed Infinity for selecting even after scrolling
                this.needsRender = true;
            }
            this.interactionManager.getRenderScheduler().queueRender(this.needsRender);
            return;
        }
    }


    onPointerMove(event: PointerEvent): void {
        //nothing
    }
    onPointerUp(event: PointerEvent): void {
        this.interactionManager.goIdle();
    }
    onDoubleClick(event: MouseEvent): void {
        //nothing
    }
}