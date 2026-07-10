import { DataModel } from "../data/DataModel.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { Viewport } from "../core/Viewport.js";
import {
    HANDLE_SIZE,
    ROW_HEADER_WIDTH,
    COLUMN_HEADER_HEIGHT,
    GRID_LINE_COLOR,
    FONT,
    TEXT_COLOR
} from "../utils/Constants.js";
import { RowColumnManager } from "../core/RowColumnManager.js";
import { ExcelColumnHelper } from "../utils/ExcelColumnHelper.js";
import { HeaderRenderer } from "./HeaderRenderer.js";

/**
 * CanvasRenderer is responsible ONLY for drawing.
 *
 * It never decides which rows/columns are visible (that's the
 * Viewport's job), never stores the actual cell values (that's the
 * DataModel's job) and never knows about the mouse or commands.
 *
 * Grid tells it what to draw (via the startRow/endRow/... parameters
 * that come from the Viewport); the Renderer just draws it.
 */
export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private dataModel: DataModel;
    private selectionManager: SelectionManager;
    private viewport: Viewport;
    private headerRenderer: HeaderRenderer;
    private rowColumnManager: RowColumnManager;

    constructor(
        canvas: HTMLCanvasElement,
        dataModel: DataModel,
        selectionManager: SelectionManager,
        viewport: Viewport,
        rowColumnManager: RowColumnManager
    ) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.dataModel = dataModel;
        this.rowColumnManager = rowColumnManager;
        this.selectionManager = selectionManager;
        this.viewport = viewport;
        this.headerRenderer = new HeaderRenderer(this.selectionManager,this.ctx,this.canvas, this.rowColumnManager);
    }

    public render(
        startRow: number,
        endRow: number,
        startColumn: number,
        endColumn: number,
        scrollTop: number,
        scrollLeft: number
    ): void {
        this.clearCanvas();
        this.drawGrid(startRow, endRow, startColumn, endColumn, scrollTop, scrollLeft);
        this.drawCellContents(startRow, endRow, startColumn, endColumn, scrollTop, scrollLeft);
        this.drawSelection();
        this.headerRenderer.drawColumnHeaders(startColumn, endColumn, scrollLeft);
        this.headerRenderer.drawRowHeaders(startRow, endRow, scrollTop);
    }

    private clearCanvas(): void {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    

    private drawGrid(
        startRow: number,
        endRow: number,
        startColumn: number,
        endColumn: number,
        scrollTop: number,
        scrollLeft: number
    ): void {
        this.ctx.strokeStyle = GRID_LINE_COLOR;

        let currentY = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(startRow) - scrollTop;
    

        for (let row = startRow; row <= endRow; row++) {
            const currentHeight = this.rowColumnManager.getRowHeight(row);
            let currentX = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(startColumn) - scrollLeft;

            for (let col = startColumn; col <= endColumn; col++) {
                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                this.ctx.strokeRect(
                    currentX,
                    currentY,
                    currentWidth,
                    currentHeight
                );
                currentX += currentWidth;
            }
            currentY += currentHeight;
        }
    }

    private drawCellContents(
        startRow: number,
        endRow: number,
        startColumn: number,
        endColumn: number,
        scrollTop: number,
        scrollLeft: number
    ): void {
        this.ctx.font = FONT;
        this.ctx.fillStyle = TEXT_COLOR;
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";

        let currentY = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(startRow) - scrollTop;


        for (let row = startRow; row <= endRow; row++) {
            const currentHeight = this.rowColumnManager.getRowHeight(row);

            let currentX = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(startColumn) - scrollLeft;


            for (let col = startColumn; col <= endColumn; col++) {
                const value = this.dataModel.getCellValue(row, col);

                if (value === "") continue;

                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                // Clip so long text never spills into neighboring cells.
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(
                    currentX,
                    currentY,
                    currentWidth,
                    currentHeight
                );
                this.ctx.clip();

                this.ctx.fillText(
                    String(value),
                    currentX + 5,
                    currentY + currentHeight / 2
                );

                this.ctx.restore();

                currentX += currentWidth;
            }
            currentY += currentHeight;
        }
    }

    /**
     * Draws the current selection (if any) as a translucent blue
     * overlay, exactly like Excel. The Renderer only ever reads the
     * selection - it never modifies it.
     */
    private drawSelection(): void {
        const selection = this.selectionManager.getSelection();
        if (!selection) return;

        this.ctx.fillStyle = "rgba(0,120,215,0.25)";

        //To make the selection appear even after scroll
        const endRow = selection.endRow === Infinity ?
            this.viewport.getLastVisibleRow() : selection.endRow;
        const endCol = selection.endColumn === Infinity?
            this.viewport.getLastVisibleColumn() : selection.endColumn;


        let currentY = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(selection.startRow) - this.viewport.getScrollTop();


        for (let row = selection.startRow; row <= endRow; row++) {
            const currentHeight = this.rowColumnManager.getRowHeight(row);

            let currentX =
                    ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(selection.startColumn) -
                    this.viewport.getScrollLeft();
            for (let col = selection.startColumn; col <= endCol; col++) {
                
                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                this.ctx.fillRect(
                    currentX,
                    currentY,
                    currentWidth,
                    currentHeight
                );
                currentX += currentWidth;
            }
            currentY += currentHeight;
        }

        // Borders
        const left = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(selection.startColumn) - this.viewport.getScrollLeft();
        const top = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(selection.startRow) - this.viewport.getScrollTop();
        const right = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(endCol) + this.rowColumnManager.getColumnWidth(selection.endColumn) - this.viewport.getScrollLeft();
        const bottom = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(endRow) + this.rowColumnManager.getRowHeight(selection.endRow) - this.viewport.getScrollTop();
    
        this.ctx.strokeStyle = "#107C41";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(left, top, right-left, bottom-top);

        // Additional little square for drag-copy (Show not working)
        const handleX = right - HANDLE_SIZE;
        const handleY = bottom - HANDLE_SIZE;

        this.ctx.fillStyle = "#107C41";
        this.ctx.fillRect(handleX, handleY, HANDLE_SIZE, HANDLE_SIZE);
    }
}
