import { InteractionManager } from "../InteractionManager.js";
import { InteractionType } from "../Resolver/HitTest.js";
import { InteractionState } from "./InteractionState.js";

export class IdleState implements InteractionState {

    constructor(private interactionManager: InteractionManager) { }

    onPointerDown(event: PointerEvent): void {
        // console.log("Idle -> pointer down");
        const interaction = this.interactionManager.getHitTest().resolve(event);

        switch (interaction.type) {

            case InteractionType.CELL:
                this.interactionManager.startCellSelection(event);
                console.log("CELL SELECTED");
                break;

            case InteractionType.ROW_HEADER:
                this.interactionManager.startHeaderSelection(event);
                console.log("ROW HEADER SELECTED");
                break;

            case InteractionType.COLUMN_HEADER:
                this.interactionManager.startHeaderSelection(event);
                console.log("COLUMN HEADER SELECTED");
                break;

            case InteractionType.COLUMN_RESIZE:
                this.interactionManager.startColumnResize(event);
                console.log("COL RESIZE SELECTED");
                break;

            case InteractionType.ROW_RESIZE:
                this.interactionManager.startRowResize(event);
                console.log("ROW RESIZE SELECTED");
                break;
        }

    }
    onPointerMove(event: PointerEvent): void {
        //Nothing
        // console.log("Idle -> pointer move");
    }
    onPointerUp(event: PointerEvent): void {
        //Nothing
        // console.log("Idle -> pointer up");
        this.interactionManager.getCanvas().style.cursor = "cell";
    }
    onDoubleClick(event: MouseEvent): void {
        // console.log("Idle -> DBL click");
        this.interactionManager.startEditing(event);

    }

}