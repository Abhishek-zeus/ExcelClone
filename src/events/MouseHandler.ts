import { RowColumnManager } from "../core/RowColumnManager.js";
import { Viewport } from "../core/Viewport.js";
import {
    CELL_HEIGHT,
    CELL_WIDTH,
    ROW_HEADER_WIDTH,
    COLUMN_HEADER_HEIGHT
} from "../utils/Constants.js";

export interface MouseCell {
    row: number;
    column: number;
}

/**
 * Converts raw mouse pixel coordinates (event.offsetX/offsetY) into
 * grid coordinates (row/column). Needs the Viewport because the
 * current scroll position affects which row/column a given pixel
 * actually corresponds to.
 */
export class MouseHandler {
    constructor(private viewport: Viewport, private rowColumnManager: RowColumnManager) {}

    public getCellFromMouse(
        mouseX: number,
        mouseY: number
    ): MouseCell | null {
        // Clicks inside the header area don't correspond to a data cell.
        if (
            mouseX < ROW_HEADER_WIDTH ||
            mouseY < COLUMN_HEADER_HEIGHT
        ) {
            return null;
        }

        const actualX =
            mouseX +
            this.viewport.getScrollLeft() -
            ROW_HEADER_WIDTH;

        const actualY =
            mouseY +
            this.viewport.getScrollTop() -
            COLUMN_HEADER_HEIGHT;

        // VARIABLE WIDTH COLUMN LOOKUP LOOP
        let column = -1;
        let currentX = 0;
        const totalColumns = 500;

        for (let col = 0; col < totalColumns; col++) {
            currentX += this.rowColumnManager.getColumnWidth(col);
            if (actualX < currentX) {
                column = col;
                break; // Found the column index! Exit loop early.
            }
        }

        // Variable Height row lookup loop
        let row = -1;
        let currentY = 0;
        const totalRows = 50000;

        for (let r = 0; r < totalRows; r++) {
            currentY += this.rowColumnManager.getRowHeight(r);
            if (actualY < currentY) {
                row = r;
                break; // Found the row index! Exit loop early.
            }
        }

        // Safety fallback: if mouse is clicked beyond computed layout dimensions
        if (row === -1 || column === -1) {
            return null;
        }
        

        return {
            row,
            column
        };
    }

    public getColumnFromMouse(mouseX: number): number{
        if(mouseX < ROW_HEADER_WIDTH){
            return -1;
        }

        const actualX = mouseX + this.viewport.getScrollLeft() - ROW_HEADER_WIDTH;

        let currentX = 0;

        const totalColumns = 500;

        for(let col = 0; col < totalColumns; col++){
            currentX += this.rowColumnManager.getColumnWidth(col);
            if(actualX < currentX){
                return col;
            }
        }
        return -1;
    }


    public getRowFromMouse(mouseY: number): number{
        if(mouseY < COLUMN_HEADER_HEIGHT){
            return -1;
        }

        const actualY = mouseY + this.viewport.getScrollTop() - COLUMN_HEADER_HEIGHT;

        let currentY = 0;

        const totalRows = 100000;

        for(let row = 0; row < totalRows; row++){
            currentY += this.rowColumnManager.getRowHeight(row);
            if(actualY < currentY){
                return row;
            }
        }
        return -1;
    }
}
