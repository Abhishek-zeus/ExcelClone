import { ResizeRowCommand } from "../../commands/ResizeRowCommand.js";
import { MouseCell, MouseHandler } from "../../events/MouseHandler.js";
import { ResizeDetector } from "../../events/ResizeDetector.js";
import { ResizeState } from "../../models/ResizeState.js";
import { MIN_ROW_HEIGHT } from "../../utils/Constants.js";
import { InteractionManager } from "../InteractionManager.js";
import { InteractionState } from "./InteractionState.js";

export class RowResizeState implements InteractionState{

    private resizeState: ResizeState | null = null;
    

    constructor(
        private interactionManager: InteractionManager,
        private resizeDetector: ResizeDetector,
        private mouseHandler: MouseHandler
    ){}

    HitTest(event: PointerEvent): boolean {
        const resizeInfo = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
        if (resizeInfo.type === "ROW") {
            return true;
        }
        return false;
    }

    onPointerDown(event: PointerEvent): void {
        const resizeInfo = this.interactionManager.getResizeDetector().detectResize(event.offsetX, event.offsetY);
        this.resizeState = {
                type: "ROW",
                index: resizeInfo.index,
                startMouseX: event.offsetX,
                startMouseY: event.offsetY,
                originalHeight: this.interactionManager.getRowColumnManager().getRowHeight(resizeInfo.index), // Tracks row height
        };
    }
    onPointerMove(event: PointerEvent): void {
        this.interactionManager.getCanvas().style.cursor = "row-resize";
        const deltaY = event.offsetY - this.resizeState?.startMouseY!;    //Difference in start and end
        const newHeight = this.resizeState?.originalHeight! + deltaY;

        //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
        this.interactionManager.getRowColumnManager().setRowHeight(this.resizeState?.index!, Math.max(newHeight, MIN_ROW_HEIGHT));

        //Render
        this.interactionManager.getRenderScheduler().queueRender(true);
    }
    onPointerUp(event: PointerEvent): void {
        if (this.resizeState){
            const finalHeight = this.interactionManager.getRowColumnManager().getRowHeight(this.resizeState.index);

            // only push to history if the user actually changed the dimension
            if (finalHeight != this.resizeState.originalHeight) {
                const command = new ResizeRowCommand(
                    this.interactionManager.getRowColumnManager(),
                    this.resizeState.index,
                    this.resizeState.originalHeight!,
                    finalHeight
                );
            this.interactionManager.getCommandInvoker().executeCommand(command);
            }
        }
        this.interactionManager.goIdle();
    }
    onDoubleClick(event: MouseEvent): void {
        //nothing
    }
    
}