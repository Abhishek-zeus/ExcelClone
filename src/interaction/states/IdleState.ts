import { InteractionManager } from "../InteractionManager.js";
import { InteractionType } from "../Resolver/HitTest.js";
import { InteractionState } from "./InteractionState.js";

export class IdleState implements InteractionState {

    constructor(private interactionManager: InteractionManager) { }

    onPointerDown(event: PointerEvent): void {
        console.log("Idle -> pointer down");
        const interaction = this.interactionManager.getHitTest().resolve(event);

        switch (interaction.type) {

            case InteractionType.CELL:
                this.interactionManager.startCellSelection(interaction);
                break;

            case InteractionType.ROW_HEADER:
                this.interactionManager.startHeaderSelection(interaction);
                break;

            case InteractionType.COLUMN_HEADER:
                this.interactionManager.startHeaderSelection(interaction);
                break;

            case InteractionType.COLUMN_RESIZE:
                this.interactionManager.startColumnResize(interaction);
                break;

            case InteractionType.ROW_RESIZE:
                this.interactionManager.startRowResize(interaction);
                break;

        }

    }
    onPointerMove(event: PointerEvent): void {
        //Nothing
        console.log("Idle -> pointer move");
    }
    onPointerUp(event: PointerEvent): void {
        //Nothing
        console.log("Idle -> pointer up");
    }
    onDoubleClick(event: MouseEvent): void {
        console.log("Idle -> DBL click");

    }

}