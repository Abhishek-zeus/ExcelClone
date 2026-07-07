import { ROW_HEADER_WIDTH, COLUMN_HEADER_HEIGHT } from "../utils/Constants.js";
/**
 * Converts raw mouse pixel coordinates (event.offsetX/offsetY) into
 * grid coordinates (row/column). Needs the Viewport because the
 * current scroll position affects which row/column a given pixel
 * actually corresponds to.
 */
export class MouseHandler {
    constructor(viewport, rowColumnManager) {
        this.viewport = viewport;
        this.rowColumnManager = rowColumnManager;
    }
    getCellFromMouse(mouseX, mouseY) {
        // Clicks inside the header area don't correspond to a data cell.
        if (mouseX < ROW_HEADER_WIDTH ||
            mouseY < COLUMN_HEADER_HEIGHT) {
            return null;
        }
        const actualX = mouseX +
            this.viewport.getScrollLeft() -
            ROW_HEADER_WIDTH;
        const actualY = mouseY +
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
}
//# sourceMappingURL=MouseHandler.js.map