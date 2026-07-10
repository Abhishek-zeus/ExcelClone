import { RowColumnManager } from "../core/RowColumnManager.js";
import { Viewport } from "../core/Viewport.js";
import { COLUMN_HEADER_HEIGHT, RESIZE_MARGIN, ROW_HEADER_WIDTH } from "../utils/Constants.js";

export interface ResizeInfo{
    type: "ROW" | "COLUMN" | null;
    index: number;
}

export class ResizeDetector{
    constructor(private viewPort: Viewport,
        private rowColumnManager: RowColumnManager
    ){};

public detectResize(mouseX: number, mouseY: number): ResizeInfo {

    if (
        mouseX < ROW_HEADER_WIDTH &&
        mouseY < COLUMN_HEADER_HEIGHT
    ) {
        return { type: null, index: -1 };
    }

    const scrollLeft = this.viewPort.getScrollLeft();
    const firstCol = this.viewPort.getFirstVisibleColumn();
    const lastCol = this.viewPort.getLastVisibleColumn();

    let currentX = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(firstCol);

    for (let col = firstCol; col <= lastCol; col++) {

        const colWidth =  this.rowColumnManager.getColumnWidth(col);
        const worldRightX = currentX + colWidth;

        const screenRightX = worldRightX - scrollLeft;

        if (Math.abs(mouseX - screenRightX) <= RESIZE_MARGIN) {
            return {
                type: "COLUMN",
                index: col
            };
        }
        currentX += colWidth;
    }

    const scrollTop = this.viewPort.getScrollTop();
    const firstRow = this.viewPort.getFirstVisibleRow();
    const lastRow = this.viewPort.getLastVisibleRow();

    let currentY = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(firstRow);

    for (let row = firstRow; row <= lastRow; row++) {
        const rowHeight = this.rowColumnManager.getRowHeight(row);
        const worldBottomY = currentY + rowHeight;

        const screenBottomY = worldBottomY - scrollTop;

        if (Math.abs(mouseY - screenBottomY) <= RESIZE_MARGIN) {
            return {
                type: "ROW",
                index: row
            };
        }

        currentY += rowHeight;
    }

    return {
        type: null,
        index: -1
    };
}

}