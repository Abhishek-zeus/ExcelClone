import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { DataModel } from "../data/DataModel.js";
import { EditorManager } from "../editor/EditorManager.js"; 
import { Viewport } from "./Viewport.js";
import { MouseHandler } from "../events/MouseHandler.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { CELL_HEIGHT, CELL_WIDTH, COLUMN_HEADER_HEIGHT, MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT, ROW_HEADER_WIDTH } from "../utils/Constants.js";
import { ResizeDetector } from "../events/ResizeDetector.js";
import { RowColumnManager } from "./RowColumnManager.js";
import { ResizeState } from "../models/ResizeState.js";

/**
 * Grid is the "manager"/orchestrator of the whole application.
 * It creates every other class and wires them together, but it
 * never draws anything itself, never stores data itself, and never
 * calculates selection/viewport logic itself. It just coordinates.
 */
export class Grid {
    private canvas: HTMLCanvasElement;

    private dataModel: DataModel;
    private resizeState: ResizeState | null = null;
    private resizeDetector: ResizeDetector;
    private viewport: Viewport;
    private selectionManager: SelectionManager;
    private mouseHandler: MouseHandler;
    private renderer: CanvasRenderer;
    private editorManager: EditorManager;
    private rowColumnManager: RowColumnManager;

    constructor() {
        this.canvas = document.getElementById(
            "excelCanvas"
        ) as HTMLCanvasElement;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.dataModel = new DataModel();


        this.viewport = new Viewport(
            this.canvas.width,
            this.canvas.height
        );

        this.selectionManager = new SelectionManager();


        this.rowColumnManager = new RowColumnManager();

        this.resizeDetector = new ResizeDetector(this.viewport,this.rowColumnManager);

        this.mouseHandler = new MouseHandler(this.viewport, this.rowColumnManager);

        const container = this.canvas.parentElement || document.body;
        this.editorManager = new EditorManager(container);

        this.renderer = new CanvasRenderer(
            this.canvas,
            this.dataModel,
            this.selectionManager,
            this.viewport,
            this.rowColumnManager
        );

        this.registerEvents();

        this.render();
    }

    private registerEvents(): void {
        //Select
        this.canvas.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );

        //double-click event
        this.canvas.addEventListener(
            "dblclick",
            this.onDoubleClick.bind(this)
        );

        //Resize Icon
        this.canvas.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this)
        );

        //Mouse-Up
        window.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this)
        );

    }

    private onMouseDown(event: MouseEvent): void {
        const resizeInfo = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
        //if resizeinfo exists then do not select, instead start resizing
         if (resizeInfo.type === "COLUMN") {
            this.resizeState = {
                type: "COLUMN",
                index: resizeInfo.index,
                startMouseX: event.offsetX,
                startMouseY: event.offsetY,
                originalWidth: this.rowColumnManager.getColumnWidth(resizeInfo.index),
            };
            return; // Stop execution so we don't trigger cell selection
        } 
        
        if (resizeInfo.type === "ROW") {
            this.resizeState = {
                type: "ROW",
                index: resizeInfo.index,
                startMouseX: event.offsetX,
                startMouseY: event.offsetY,
                originalWidth: this.rowColumnManager.getRowHeight(resizeInfo.index), // Tracks row height
            };
            return; // Stop execution so we don't trigger cell selection
        }

        const cell = this.mouseHandler.getCellFromMouse(
            event.offsetX,
            event.offsetY
        );

        if (cell) {
            this.selectionManager.selectCell(cell.row, cell.column);
            this.render();
        }
    }

    private onDoubleClick(event: MouseEvent):void{
        //Ask mousehandler what cell was clicked
        const cell = this.mouseHandler.getCellFromMouse(
            event.offsetX,
            event.offsetY
        );

        if(!cell) return;

        // Apply renderer's exact formulas to determine input tracking coordinates of the cell to fit into cell not on mouse's cursor
        const screenX =
            ROW_HEADER_WIDTH +
            cell.column * CELL_WIDTH -
            this.viewport.getScrollLeft();

        const screenY =
            COLUMN_HEADER_HEIGHT +
            cell.row * CELL_HEIGHT -
            this.viewport.getScrollTop();

        const value = this.dataModel.getCellValue(cell.row, cell.column);

        this.editorManager.startEditing(cell.row, cell.column, screenX, screenY, CELL_WIDTH, CELL_HEIGHT, value,
            (newValue : string) => {
                this.dataModel.setCellValue(cell.row, cell.column, newValue);
                this.render();
            }
        );

    }

    private onMouseMove(event: MouseEvent):void{
        const resize = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
        if(resize.type === "ROW"){
            this.canvas.style.cursor = "row-resize";
        }else if(resize.type === "COLUMN"){
            this.canvas.style.cursor = "col-resize";
        }else{
            this.canvas.style.cursor = "default";
        }

        if(this.resizeState?.type === "COLUMN"){
            const deltaX = event.offsetX - this.resizeState.startMouseX;    //Difference in start and end
            const newWidth = this.resizeState.originalWidth! + deltaX; 

            //update rowColumnManager - as per mincolumnwidth
            this.rowColumnManager.setColumnWidth(this.resizeState.index, Math.max(newWidth, MIN_COLUMN_WIDTH));

            //Render
            this.render();
        }
        else if(this.resizeState?.type === "ROW"){
            const deltaY = event.offsetY - this.resizeState.startMouseY;    //Difference in start and end
            const newHeight = this.resizeState.originalHeight! + deltaY; 

            //update rowColumnManager - as per mincolumnwidth
            this.rowColumnManager.setRowHeight(this.resizeState.index, Math.max(newHeight, MIN_ROW_HEIGHT));

            //Render
            this.render();
        }
    }

    //When a user releases his finger
    private onMouseUp():void{
        this.resizeState = null;
    }

    /**
     * Re-renders the visible portion of the sheet. Any future
     * feature (scrolling, editing, resizing, undo/redo, ...) will
     * simply mutate some state and call this.render() again.
     */
    private render(): void {
        const startRow = this.viewport.getFirstVisibleRow();
        const endRow = this.viewport.getLastVisibleRow();
        const startColumn = this.viewport.getFirstVisibleColumn();
        const endColumn = this.viewport.getLastVisibleColumn();

        this.renderer.render(
            startRow,
            endRow,
            startColumn,
            endColumn,
            this.viewport.getScrollTop(),
            this.viewport.getScrollLeft()
        );
    }
}
