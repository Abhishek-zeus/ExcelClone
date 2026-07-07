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

    for (
        let col = this.viewPort.getFirstVisibleColumn();
        col <= this.viewPort.getLastVisibleColumn();
        col++
    ) {

        const worldRightX =
            ROW_HEADER_WIDTH +
            this.rowColumnManager.getColumnX(col) +
            this.rowColumnManager.getColumnWidth(col);

        const screenRightX = worldRightX - scrollLeft;

        if (
            Math.abs(mouseX - screenRightX) <= RESIZE_MARGIN
        ) {
            return {
                type: "COLUMN",
                index: col
            };
        }
    }

    const scrollTop = this.viewPort.getScrollTop();

    for (
        let row = this.viewPort.getFirstVisibleRow();
        row <= this.viewPort.getLastVisibleRow();
        row++
    ) {

        const worldBottomY =
            COLUMN_HEADER_HEIGHT +
            this.rowColumnManager.getRowY(row) +
            this.rowColumnManager.getRowHeight(row);

        const screenBottomY = worldBottomY - scrollTop;

        if (
            Math.abs(mouseY - screenBottomY) <= RESIZE_MARGIN
        ) {
            return {
                type: "ROW",
                index: row
            };
        }
    }

    return {
        type: null,
        index: -1
    };
}

}