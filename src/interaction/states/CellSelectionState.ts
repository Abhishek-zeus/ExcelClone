import { MouseCell } from "../../events/MouseHandler";
import { ResizeState } from "../../models/ResizeState";
import { InteractionManager } from "../InteractionManager";
import { IdleState } from "./IdleState";
import { InteractionState } from "./InteractionState";

export class CellSelectionState implements InteractionState{

    private selectionStart : MouseCell | null = null;

    constructor(
        private interactionManager: InteractionManager
    ){}

    onPointerDown(event: PointerEvent): void {
        const cell = this.interactionManager.getMouseHandler().getCellFromMouse(event.offsetX, event.offsetY);
        if(cell){
            this.selectionStart = cell;
            this.interactionManager.getSelectionManager().selectCell(cell.row, cell.column);    //Select Cell
            this.interactionManager.getRenderScheduler().queueRender(true); //Render
        }

    }

    onPointerMove(event: PointerEvent): void {
        //MULTIPLE SELECTION LOGIC 
        if (event.buttons === 1) {
            const cell = this.interactionManager.getMouseHandler().getCellFromMouse(event.offsetX, event.offsetY);
            if (cell && this.selectionStart) {
                this.interactionManager.getSelectionManager().selectRange(this.selectionStart.row, this.selectionStart.column, cell.row, cell.column);
                this.interactionManager.getRenderScheduler().queueRender(true);
            }
        }
    }

    onPointerUp(event: PointerEvent): void {
        this.interactionManager.goIdle();
    }

    onDoubleClick(event: MouseEvent): void {
        throw new Error("Method not implemented.");
    }

}