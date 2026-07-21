import { Viewport } from "../core/Viewport.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { TOTAL_COLUMNS, TOTAL_ROWS } from "../utils/Constants.js";

export class NavigationController{

    constructor(
        private selectionManager: SelectionManager,
        private viewPort: Viewport
    ){} 

    moveRight():void{
        console.log("ArrowRight");
        const row: number = this.selectionManager.selectedRow();
        const col: number = this.selectionManager.selectedColumn();
        const newCol: number = Math.max(0, Math.min(TOTAL_COLUMNS-1,col + 1));
        this.selectionManager.selectCell(row, newCol);
        this.viewPort.ensureCellVisible(row, newCol+1);
    }
    moveLeft():void{
        console.log("ArrowLeft");
        const row: number = this.selectionManager.selectedRow();
        const col: number = this.selectionManager.selectedColumn();
        const newCol: number = Math.max(0, Math.min(TOTAL_COLUMNS-1,col - 1));
        this.selectionManager.selectCell(row, newCol);
        this.viewPort.ensureCellVisible(row, newCol-1);
    }
    moveUp():void{
        const row: number = this.selectionManager.selectedRow();
        const col: number = this.selectionManager.selectedColumn();
        const newRow: number = Math.max(0, Math.min(TOTAL_ROWS-1,row - 1));
        this.selectionManager.selectCell(newRow, col);
        this.viewPort.ensureCellVisible(newRow-1, col);

    }
    moveDown():void{
        const row: number = this.selectionManager.selectedRow();
        const col: number = this.selectionManager.selectedColumn();
        const newRow: number = Math.max(0, Math.min(TOTAL_ROWS-1,row + 1));
        this.selectionManager.selectCell(newRow, col);
        this.viewPort.ensureCellVisible(newRow+1, col);
    }
}