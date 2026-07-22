import { InteractionManager } from "../InteractionManager.js";
import { CellSelectionState } from "./CellSelectionState.js";
import { ColumnResizeState } from "./ColumnResizeState.js";
import { EditingState } from "./EditingState.js";
import { HeaderSelectionState } from "./HeaderSelectionState.js";
import { InteractionState } from "./InteractionState.js";
import { RowResizeState } from "./RowResizeState.js";

export class IdleState implements InteractionState {

    constructor(private interactionManager: InteractionManager) { }

    HitTest(event: PointerEvent): boolean {
        return true;
    }

    onPointerDown(event: PointerEvent): void {
        // console.log("Idle -> pointer down");
        const states = [
            ColumnResizeState,
            RowResizeState,
            HeaderSelectionState,
            CellSelectionState
        ]
        

        for(const HandlerClass of states){
            const state = new HandlerClass(this.interactionManager, this.interactionManager.getResizeDetector(), this.interactionManager.getMouseHandler());
            if(state.HitTest(event)){
                this.interactionManager.setState(state);
                this.interactionManager.onPointerDown(event);
                break;
            }
        }

    }
    onPointerMove(event: PointerEvent): void {
        //Nothing
        // console.log("Idle -> pointer move");
    }
    onPointerUp(event: PointerEvent): void {
        //Nothing
        // console.log("Idle -> pointer up");
    }
    onDoubleClick(event: MouseEvent): void {
        // console.log("Idle -> DBL click");
        this.interactionManager.setState(new EditingState(this.interactionManager, this.interactionManager.getResizeDetector(), this.interactionManager.getMouseHandler()));
        this.interactionManager.onDoubleClick(event);
    }

}