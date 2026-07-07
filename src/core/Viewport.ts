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
    private scrollTop: number = 0;
    private scrollLeft: number = 0;

    constructor(
        private canvasWidth: number,
        private canvasHeight: number
    ) {}

    public setScrollTop(scrollTop: number): void {
        this.scrollTop = scrollTop;
    }

    public setScrollLeft(scrollLeft: number): void {
        this.scrollLeft = scrollLeft;
    }

    public getScrollTop(): number {
        return this.scrollTop;
    }

    public getScrollLeft(): number {
        return this.scrollLeft;
    }

    public getFirstVisibleRow(): number {
        return Math.floor(this.scrollTop / CELL_HEIGHT);
    }

    public getLastVisibleRow(): number {
        return (
            this.getFirstVisibleRow() +
            Math.ceil(this.canvasHeight / CELL_HEIGHT)
        );
    }

    public getFirstVisibleColumn(): number {
        return Math.floor(this.scrollLeft / CELL_WIDTH);
    }

    public getLastVisibleColumn(): number {
        return (
            this.getFirstVisibleColumn() +
            Math.ceil(this.canvasWidth / CELL_WIDTH)
        );
    }
}
