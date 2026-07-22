import { CommandInvoker } from "../commands/CommandInvoker.js";
import { RowColumnManager } from "../core/RowColumnManager.js";
import { Viewport } from "../core/Viewport.js";
import { MouseHandler } from "../events/MouseHandler.js";
import { ResizeDetector } from "../events/ResizeDetector.js";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { RenderScheduler } from "../renderer/RenderScheduler.js";
import { InteractionState } from "./states/InteractionState.js";

import { DataModel } from "../data/DataModel.js";
import { EditorManager } from "../editor/EditorManager.js";
import { IdleState } from "./states/IdleState.js";




//Owner of all Pointer down, up and move
export class InteractionManager {

    private currentState: InteractionState;

    constructor(
        private canvas: HTMLCanvasElement,
        private viewport: Viewport,
        private mouseHandler: MouseHandler,
        private dataModel: DataModel,
        private selectionManager: SelectionManager,
        private resizeDetector: ResizeDetector,
        private rowColumnManager: RowColumnManager,
        private commandInvoker: CommandInvoker,
        private editorManager: EditorManager,
        private renderer: CanvasRenderer,
        private renderScheduler: RenderScheduler,
    ) {
        this.currentState = new IdleState(this);
    }


    public setState(state: InteractionState) {
        this.currentState = state;
    }

    //......................................................................................................................


    public onPointerDown(event: PointerEvent): void {
        this.currentState.onPointerDown(event);
    }

    public onPointerMove(event: PointerEvent): void {
        this.currentState.onPointerMove(event);
    }

    //When a user releases his finger
    public onPointerUp(event: PointerEvent): void {
        this.currentState.onPointerUp(event);
    }


    public onDoubleClick(event: MouseEvent): void {

        this.currentState.onDoubleClick(event);

    }


    //.....................................................................................................................
    // Share Holder methods

    public getSelectionManager(): SelectionManager {
        return this.selectionManager;
    }

    public getViewport(): Viewport {
        return this.viewport;
    }

    public getRenderScheduler(): RenderScheduler {
        return this.renderScheduler;
    }

    public getRowColumnManager(): RowColumnManager {
        return this.rowColumnManager;
    }

    public getCommandInvoker(): CommandInvoker {
        return this.commandInvoker;
    }

    public getResizeDetector(): ResizeDetector {
        return this.resizeDetector;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getRenderer(): CanvasRenderer {
        return this.renderer;
    }

    public getMouseHandler(): MouseHandler {
        return this.mouseHandler;
    }

    public getDataModel(): DataModel {
        return this.dataModel;
    }

    public getEditorManager(): EditorManager {
        return this.editorManager;
    }

//.................................................................................................................................

    public goIdle(): void {
        this.getCanvas().style.cursor = "cell";
        this.currentState = new IdleState(this);
    }


}