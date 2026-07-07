import { CELL_HEIGHT, CELL_WIDTH } from "../utils/Constants.js";
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
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
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
        return Math.floor(this.scrollTop / CELL_HEIGHT);
    }
    getLastVisibleRow() {
        return (this.getFirstVisibleRow() +
            Math.ceil(this.canvasHeight / CELL_HEIGHT));
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