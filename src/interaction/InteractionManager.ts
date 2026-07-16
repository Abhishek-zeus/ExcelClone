import { CommandInvoker } from "../commands/CommandInvoker.js";
import { RowColumnManager } from "../core/RowColumnManager.js";
import { Viewport } from "../core/Viewport.js";
import { MouseCell, MouseHandler } from "../events/MouseHandler.js";
import { ResizeDetector } from "../events/ResizeDetector.js";
import { ResizeState } from "../models/ResizeState.js";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { RenderScheduler } from "../renderer/RenderScheduler.js";
import { COLUMN_HEADER_HEIGHT, MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT, ROW_HEADER_WIDTH } from "../utils/Constants.js";
import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";
import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";


//Owner of all Pointer down, up and move
export class InteractionManager{
    private resizeState: ResizeState | null = null;
    private isSelecting = false;
    private selectionStart : MouseCell | null = null;


    constructor(
        private canvas: HTMLCanvasElement, 
        private viewport: Viewport,
        private mouseHandler: MouseHandler,
        private selectionManager: SelectionManager,
        private resizeDetector: ResizeDetector,
        private rowColumnManager: RowColumnManager,
        private commandInvoker: CommandInvoker,
        private renderer: CanvasRenderer,
        private renderScheduler: RenderScheduler,
    ){}

    

    public onPointerDown(event: MouseEvent): void {
            const resizeInfo = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
    
            //Flag to track if data changed and requires a screen update
            let needsRender = false;
    
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
                    originalHeight: this.rowColumnManager.getRowHeight(resizeInfo.index), // Tracks row height
                };
                return; // Stop execution so we don't trigger cell selection
            }
    
            // If row header is selected
            if (event.offsetX < ROW_HEADER_WIDTH) {
                const row = this.mouseHandler.getRowFromMouse(event.offsetY);
                if (row !== -1) {
                    this.selectionManager.selectRow(row, Infinity);
                    needsRender = true;
                }
                this.renderScheduler;
                return;
            }
    
            // If column header is selected
            if (event.offsetY < COLUMN_HEADER_HEIGHT) {
                const column = this.mouseHandler.getColumnFromMouse(event.offsetX);
                if (column !== -1) {
                    this.selectionManager.selectColumn(column, Infinity); //passed Infinity for selecting even after scrolling
                    needsRender = true;
                }
                this.renderScheduler.queueRender(needsRender);
                return;
            }
    
            // Else
            const cell = this.mouseHandler.getCellFromMouse(
                event.offsetX,
                event.offsetY
            );
    
            if (cell) {
                //Select 1 cell on Mouse Down 
                this.selectionStart = cell;
                this.isSelecting = true;
    
                this.selectionManager.selectCell(cell.row, cell.column);
                needsRender = true;
            }
            this.renderScheduler.queueRender(needsRender);
        }

        public onPointerMove(event: MouseEvent): void {
                //If resizing and not selecting
                if (!this.isSelecting && this.resizeState === null) {
                    const resize = this.resizeDetector.detectResize(
                        event.offsetX,
                        event.offsetY
                    );
        
                    if (resize.type === "ROW") {
                        this.canvas.style.cursor = "row-resize";
                    }
                    else if (resize.type === "COLUMN") {
                        this.canvas.style.cursor = "col-resize";
                    }
                    else {
                        this.canvas.style.cursor = "cell";
                    }
                }
        
                //Flag to track if data changed and requires a screen update
                let needsRender = false;
        
                if (this.resizeState?.type === "COLUMN") {
                    const deltaX = event.offsetX - this.resizeState.startMouseX;    //Difference in start and end
                    const newWidth = this.resizeState.originalWidth! + deltaX;
        
                    //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
                    this.rowColumnManager.setColumnWidth(this.resizeState.index, Math.max(newWidth, MIN_COLUMN_WIDTH));
        
                    //Render
                    needsRender = true;
                }
                else if (this.resizeState?.type === "ROW") {
                    const deltaY = event.offsetY - this.resizeState.startMouseY;    //Difference in start and end
                    const newHeight = this.resizeState.originalHeight! + deltaY;
        
                    //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
                    this.rowColumnManager.setRowHeight(this.resizeState.index, Math.max(newHeight, MIN_ROW_HEIGHT));
        
                    //Render
                    needsRender = true;
                }
        
                //MULTIPLE SELECTION LOGIC IF Resize is not Triggered
                if (this.isSelecting && event.buttons === 1) {
                    const cell = this.mouseHandler.getCellFromMouse(event.offsetX, event.offsetY);
                    if (cell && this.selectionStart) {
                        this.selectionManager.selectRange(this.selectionStart.row, this.selectionStart.column, cell.row, cell.column);
                        needsRender = true;
                    }
                }
                else if (this.isSelecting) {
                    //Reset selection state if they click anything else mid-drag
                    this.isSelecting = false;
                }
        
        
                //Throttled Render Phase, 60 / 120FPS 
                this.renderScheduler.queueRender(needsRender);
            }
        
            //When a user releases his finger
            public onPointerUp(): void {
        
                if (this.resizeState) {
                    if (this.resizeState.type === "COLUMN") {
                        const finalWidth = this.rowColumnManager.getColumnWidth(this.resizeState.index);
        
                        // only push to history if the user actually changed the dimension
                        if (finalWidth != this.resizeState.originalWidth) {
                            //Command is created
                            const command = new ResizeColumnCommand(
                                this.rowColumnManager,
                                this.resizeState.index,
                                this.resizeState.originalWidth!,
                                finalWidth
                            );
                            //And sent
                            this.commandInvoker.executeCommand(command);
                        }
                    }
                    else if (this.resizeState.type === "ROW") {
                        const finalHeight = this.rowColumnManager.getRowHeight(this.resizeState.index);
        
                        // only push to history if the user actually changed the dimension
                        if (finalHeight != this.resizeState.originalHeight) {
                            const command = new ResizeRowCommand(
                                this.rowColumnManager,
                                this.resizeState.index,
                                this.resizeState.originalHeight!,
                                finalHeight
                            );
                            this.commandInvoker.executeCommand(command);
                        }
                    }
                }
        
                //clear the active operation token
                this.selectionStart = null;
                this.resizeState = null;
                this.isSelecting = false;
        
                this.renderScheduler.queueRender(true);
            }


            

        
}