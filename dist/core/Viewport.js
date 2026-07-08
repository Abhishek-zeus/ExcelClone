import { CELL_WIDTH } from "../utils/Constants.js";
/**
 * Viewport is responsible ONLY for figuring out which rows/columns
 * are currently visible based on the current scroll position.
 *
 * It does NOT know about:
 *  - the DataModel
 *  - the CanvasRenderer
 *  - the Mouse
 *  - Selection
 *
 * It only knows: scrollTop, scrollLeft, canvasWidth, canvasHeight.
 * Everything else can be calculated from those four values.
 */
export class Viewport {
    constructor(canvasWidth, canvasHeight, rowColumnManager) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.rowColumnManager = rowColumnManager;
        this.scrollTop = 0;
        this.scrollLeft = 0;
    }
    setScrollTop(scrollTop) {
        this.scrollTop = scrollTop;
    }
    setScrollLeft(scrollLeft) {
        this.scrollLeft = scrollLeft;
    }
    getScrollTop() {
        return this.scrollTop;
    }
    getScrollLeft() {
        return this.scrollLeft;
    }
    getFirstVisibleRow() {
        let currentY = 0;
        let row = 0;
        while (currentY < this.scrollTop) {
            currentY += this.rowColumnManager.getRowHeight(row);
            row++;
        }
        return Math.max(0, row - 1);
    }
    getLastVisibleRow() {
        let currentY = this.rowColumnManager.getRowY(this.getFirstVisibleRow());
        let row = this.getFirstVisibleRow();
        while (currentY < this.scrollTop + this.canvasHeight) {
            currentY += this.rowColumnManager.getRowHeight(row);
            row++;
        }
        return row;
    }
    getFirstVisibleColumn() {
        return Math.floor(this.scrollLeft / CELL_WIDTH);
    }
    getLastVisibleColumn() {
        return (this.getFirstVisibleColumn() +
            Math.ceil(this.canvasWidth / CELL_WIDTH));
    }
}
//# sourceMappingURL=Viewport.js.map