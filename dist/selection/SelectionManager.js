import { CellRange } from "../models/CellRange.js";
/**
 * SelectionManager owns only one piece of state: the currently
 * selected range of cells. It never draws anything (that's the
 * CanvasRenderer's job) and never touches the mouse or the DOM
 * directly (that's the MouseHandler's job).
 */
export class SelectionManager {
    constructor() {
        this.selectedRange = null;
    }
    /**
     * Selects a single cell. A single cell is just a range whose
     * start and end are the same - this keeps the model simple.
     */
    selectCell(row, column) {
        this.selectedRange = new CellRange(row, column, row, column);
    }
    /**
     * Selects a rectangular range of cells. Coordinates are
     * normalized with Math.min/Math.max so that dragging in any
     * direction (top->bottom, bottom->top, etc.) always produces a
     * valid, well-ordered range.
     */
    selectRange(startRow, startColumn, endRow, endColumn) {
        if (this.selectedRange) {
            this.selectedRange.startRow = Math.min(startRow, endRow);
            this.selectedRange.startColumn = Math.min(startColumn, endColumn);
            this.selectedRange.endRow = Math.max(startRow, endRow);
            this.selectedRange.endColumn = Math.max(startColumn, endColumn);
        }
        else {
            this.selectedRange = new CellRange(Math.min(startRow, endRow), Math.min(startColumn, endColumn), Math.max(startRow, endRow), Math.max(startColumn, endColumn));
        }
    }
    getSelection() {
        return this.selectedRange;
    }
    selectRow(row, visibleColumns) {
        this.selectedRange = new CellRange(row, 0, row, visibleColumns - 1);
    }
    selectColumn(column, visibleRows) {
        this.selectedRange = new CellRange(0, column, visibleRows - 1, column);
    }
}
//# sourceMappingURL=SelectionManager.js.map