import { CELL_HEIGHT, CELL_WIDTH } from "../utils/Constants.js";
import { RowColumnManager } from "./RowColumnManager.js";

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
        private canvasHeight: number,
        private rowColumnManager: RowColumnManager
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
        let currentY = 0;
        let row = 0;
        while(currentY < this.scrollTop){
            currentY += this.rowColumnManager.getRowHeight(row);
            row++;
        }
        return Math.max(0, row-1);
    }

    public getLastVisibleRow(): number {
        let currentY = this.rowColumnManager.getRowY(this.getFirstVisibleRow());
        let row = this.getFirstVisibleRow();
        while(currentY < this.scrollTop + this.canvasHeight){
            currentY += this.rowColumnManager.getRowHeight(row);
            row++;
        }
        return row;
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
