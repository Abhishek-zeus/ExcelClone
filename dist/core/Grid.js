import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { DataModel } from "../data/DataModel.js";
import { EditorManager } from "../editor/EditorManager.js";
import { Viewport } from "./Viewport.js";
import { MouseHandler } from "../events/MouseHandler.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { CELL_HEIGHT, CELL_WIDTH, COLUMN_HEADER_HEIGHT, MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT, ROW_HEADER_WIDTH } from "../utils/Constants.js";
import { ResizeDetector } from "../events/ResizeDetector.js";
import { RowColumnManager } from "./RowColumnManager.js";
import { CommandInvoker } from "../commands/CommandInvoker.js";
import { EditCellCommand } from "../commands/EditCellCommand.js";
import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";
import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";
/**
 * Grid is the "manager"/orchestrator of the whole application.
 * It creates every other class and wires them together, but it
 * never draws anything itself, never stores data itself, and never
 * calculates selection/viewport logic itself. It just coordinates.
 */
export class Grid {
    constructor() {
        this.resizeState = null;
        this.isSelecting = false;
        this.selectionStart = null;
        this.canvas = document.getElementById("excelCanvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.dataModel = new DataModel();
        this.selectionManager = new SelectionManager(500, 100000);
        this.rowColumnManager = new RowColumnManager();
        this.viewport = new Viewport(this.canvas.width, this.canvas.height, this.rowColumnManager);
        this.resizeDetector = new ResizeDetector(this.viewport, this.rowColumnManager);
        this.commandInvoker = new CommandInvoker();
        this.mouseHandler = new MouseHandler(this.viewport, this.rowColumnManager);
        const container = this.canvas.parentElement || document.body;
        this.editorManager = new EditorManager(container);
        this.scrollContainer = document.getElementById("grid-container");
        this.scrollContent = document.createElement("div");
        this.scrollContent.style.position = 'absolute';
        this.scrollContent.style.top = '0';
        this.scrollContent.style.left = '0';
        this.scrollContent.style.width = `${500 * CELL_WIDTH}px`;
        this.scrollContent.style.height = `${100000 * CELL_HEIGHT}px`;
        this.scrollContent.style.pointerEvents = 'none'; // Passes clicks directly to canvas
        this.scrollContainer.appendChild(this.scrollContent);
        this.renderer = new CanvasRenderer(this.canvas, this.dataModel, this.selectionManager, this.viewport, this.rowColumnManager);
        this.registerEvents();
        this.render();
    }
    registerEvents() {
        //Select
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        //double-click event
        this.canvas.addEventListener("dblclick", this.onDoubleClick.bind(this));
        //Resize Icon
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        //Mouse-Up
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
        //Scroll Bar
        this.scrollContainer.addEventListener("scroll", this.onScroll.bind(this));
        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }
    onMouseDown(event) {
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
                originalHeight: this.rowColumnManager.getRowHeight(resizeInfo.index), // Tracks row height
            };
            return; // Stop execution so we don't trigger cell selection
        }
        // If row header is selected
        if (event.offsetX < ROW_HEADER_WIDTH) {
            const row = this.mouseHandler.getRowFromMouse(event.offsetY);
            if (row !== -1) {
                this.selectionManager.selectRow(row);
                this.render();
            }
            return;
        }
        // If column header is selected
        if (event.offsetY < COLUMN_HEADER_HEIGHT) {
            const column = this.mouseHandler.getColumnFromMouse(event.offsetX);
            if (column !== -1) {
                this.selectionManager.selectColumn(column);
                this.render();
            }
            return;
        }
        // Else
        const cell = this.mouseHandler.getCellFromMouse(event.offsetX, event.offsetY);
        if (cell) {
            //Select 1 cell on Mouse Down 
            this.selectionStart = cell;
            this.isSelecting = true;
            this.selectionManager.selectCell(cell.row, cell.column);
            this.render();
        }
    }
    onDoubleClick(event) {
        //Ask mousehandler what cell was clicked
        const cell = this.mouseHandler.getCellFromMouse(event.offsetX, event.offsetY);
        if (!cell)
            return;
        // Apply renderer's exact formulas to determine input tracking coordinates of the cell to fit into cell not on mouse's cursor
        const screenX = ROW_HEADER_WIDTH +
            this.rowColumnManager.getColumnX(cell.column);
        const screenY = COLUMN_HEADER_HEIGHT +
            this.rowColumnManager.getRowY(cell.row);
        const value = this.dataModel.getCellValue(cell.row, cell.column);
        this.editorManager.startEditing(cell.row, cell.column, screenX, screenY, this.rowColumnManager.getColumnWidth(cell.column), this.rowColumnManager.getRowHeight(cell.row), value, (newValue) => {
            // this.dataModel.setCellValue(cell.row, cell.column, newValue);
            // this.render();
            const oldValue = this.dataModel.getCellValue(cell.row, cell.column);
            const command = new EditCellCommand(this.dataModel, cell.row, cell.column, oldValue, newValue);
            this.commandInvoker.executeCommand(command);
            this.render();
        });
    }
    onMouseMove(event) {
        const resize = this.resizeDetector.detectResize(event.offsetX, event.offsetY);
        if (resize.type === "ROW") {
            this.canvas.style.cursor = "row-resize";
        }
        else if (resize.type === "COLUMN") {
            this.canvas.style.cursor = "col-resize";
        }
        else {
            this.canvas.style.cursor = "default";
        }
        if (this.resizeState?.type === "COLUMN") {
            const deltaX = event.offsetX - this.resizeState.startMouseX; //Difference in start and end
            const newWidth = this.resizeState.originalWidth + deltaX;
            //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
            this.rowColumnManager.setColumnWidth(this.resizeState.index, Math.max(newWidth, MIN_COLUMN_WIDTH));
            //Render
            this.render();
        }
        else if (this.resizeState?.type === "ROW") {
            const deltaY = event.offsetY - this.resizeState.startMouseY; //Difference in start and end
            const newHeight = this.resizeState.originalHeight + deltaY;
            //update rowColumnManager - as per mincolumnwidth --Mutates real time dragging
            this.rowColumnManager.setRowHeight(this.resizeState.index, Math.max(newHeight, MIN_ROW_HEIGHT));
            //Render
            this.render();
        }
        //MULTIPLE SELECTION LOGIC IF Resize is not Triggered
        if (this.isSelecting) {
            const cell = this.mouseHandler.getCellFromMouse(event.offsetX, event.offsetY);
            if (!cell || !this.selectionStart) {
                return;
            }
            //Selects a range of cells
            this.selectionManager.selectRange(this.selectionStart.row, this.selectionStart.column, cell.row, cell.column);
            this.render();
        }
    }
    //When a user releases his finger
    onMouseUp() {
        if (!this.resizeState)
            return;
        if (this.resizeState.type === "COLUMN") {
            const finalWidth = this.rowColumnManager.getColumnWidth(this.resizeState.index);
            // only push to history if the user actually changed the dimension
            if (finalWidth != this.resizeState.originalWidth) {
                //Command is created
                const command = new ResizeColumnCommand(this.rowColumnManager, this.resizeState.index, this.resizeState.originalWidth, finalWidth);
                //And sent
                this.commandInvoker.executeCommand(command);
            }
        }
        else if (this.resizeState.type === "ROW") {
            const finalHeight = this.rowColumnManager.getRowHeight(this.resizeState.index);
            // only push to history if the user actually changed the dimension
            if (finalHeight != this.resizeState.originalHeight) {
                const command = new ResizeRowCommand(this.rowColumnManager, this.resizeState.index, this.resizeState.originalHeight, finalHeight);
                this.commandInvoker.executeCommand(command);
            }
        }
        //clear the active operation token
        this.resizeState = null;
        this.isSelecting = false;
        this.render();
    }
    //Scroll bar
    onScroll() {
        this.viewport.setScrollTop(this.scrollContainer.scrollTop);
        this.viewport.setScrollLeft(this.scrollContainer.scrollLeft);
        this.render();
    }
    //Keys
    onKeyDown(event) {
        if (event.ctrlKey && event.key.toLowerCase() === "z") {
            event.preventDefault(); //stops browsers default action for that key
            //If text editor is opened, Close it
            if (this.editorManager && this.editorManager.isEditing === true) {
                this.editorManager.destroy();
            }
            this.commandInvoker.undo();
            this.render();
        }
        if (event.ctrlKey && event.key.toLowerCase() === "y") {
            event.preventDefault();
            //If text editor is opened, Close it
            if (this.editorManager && this.editorManager.isEditing === true) {
                this.editorManager.destroy();
            }
            this.commandInvoker.redo();
            this.render();
        }
    }
    /**
     * Re-renders the visible portion of the sheet. Any future
     * feature (scrolling, editing, resizing, undo/redo, ...) will
     * simply mutate some state and call this.render() again.
     */
    render() {
        const startRow = this.viewport.getFirstVisibleRow();
        const endRow = this.viewport.getLastVisibleRow();
        const startColumn = this.viewport.getFirstVisibleColumn();
        const endColumn = this.viewport.getLastVisibleColumn();
        this.renderer.render(startRow, endRow, startColumn, endColumn, this.viewport.getScrollTop(), this.viewport.getScrollLeft());
    }
}
//# sourceMappingURL=Grid.js.map