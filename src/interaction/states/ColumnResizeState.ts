import { ResizeColumnCommand } from "../../commands/ResizeColumnCommand.js";
import { MouseCell } from "../../events/MouseHandler.js";
import { ResizeState } from "../../models/ResizeState.js";
import { MIN_COLUMN_WIDTH } from "../../utils/Constants.js";
import { InteractionManager } from "../InteractionManager.js";
import { InteractionState } from "./InteractionState.js";

export class ColumnResizeState implements InteractionState {

    private resizeState: ResizeState | null = null;


    constructor(
        private interactionManager: InteractionManager
    ) { }

    onPointerDown(event: PointerEvent): void {
        const resizeInfo = this.interactionManager.getResizeDetector().detectResize(event.offsetX, event.offsetY);
        this.resizeState = {
            type: "COLUMN",
            index: resizeInfo.index,
            startMouseX: event.offsetX,
            startMouseY: event.offsetY,
            originalWidth: this.interactionManager.getRowColumnManager().getColumnWidth(resizeInfo.index),
        };
    }

    
    onPointerMove(event: PointerEvent): void {
        this.interactionManager.getCanvas().style.cursor = "col-resize";
        const deltaX = event.offsetX - this.resizeState?.startMouseX!;    //Difference in start and end
        const newWidth = this.resizeState?.originalWidth! + deltaX;

        //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
        this.interactionManager.getRowColumnManager().setColumnWidth(this.resizeState?.index!, Math.max(newWidth, MIN_COLUMN_WIDTH));
        //Render
        this.interactionManager.getRenderScheduler().queueRender(true);
    }


    onPointerUp(event: PointerEvent): void {
        if (this.resizeState) {
            const finalWidth = this.interactionManager.getRowColumnManager().getColumnWidth(this.resizeState.index);

            // only push to history if the user actually changed the dimension
            if (finalWidth != this.resizeState.originalWidth) {
                //Command is created
                const command = new ResizeColumnCommand(
                    this.interactionManager.getRowColumnManager(),
                    this.resizeState.index,
                    this.resizeState.originalWidth!,
                    finalWidth
                );
                //And sent
                this.interactionManager.getCommandInvoker().executeCommand(command);
            }
        }
        this.interactionManager.goIdle();
    }
    onDoubleClick(event: MouseEvent): void {
        // nothing
    }
}