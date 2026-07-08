import { DataModel } from "../data/DataModel.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { Viewport } from "../core/Viewport.js";
import {
    CELL_WIDTH,
    CELL_HEIGHT,
    ROW_HEADER_WIDTH,
    COLUMN_HEADER_HEIGHT,
    GRID_LINE_COLOR,
    HEADER_BACKGROUND,
    FONT,
    TEXT_COLOR
} from "../utils/Constants.js";
import { RowColumnManager } from "../core/RowColumnManager.js";

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
        this.drawColumnHeaders(startColumn, endColumn, scrollLeft);
        this.drawRowHeaders(startRow, endRow, scrollTop);
    }

    private clearCanvas(): void {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    private drawColumnHeaders(
        startColumn: number,
        endColumn: number,
        scrollLeft: number
    ): void {
        const selection = this.selectionManager.getSelection();
        this.ctx.fillStyle = HEADER_BACKGROUND;
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            COLUMN_HEADER_HEIGHT
        );

        this.ctx.strokeStyle = GRID_LINE_COLOR;
        this.ctx.font = FONT;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        for (let col = startColumn; col <= endColumn; col++) {
            const x = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(col) - scrollLeft;
            const currentWidth = this.rowColumnManager.getColumnWidth(col);
            const isSelected = selection && col >= selection.startColumn && col <= selection.endColumn;
            this.ctx.fillStyle = isSelected? "#D9EAFE" : HEADER_BACKGROUND;

            this.ctx.fillRect(x, 0, currentWidth, COLUMN_HEADER_HEIGHT);


            this.ctx.strokeRect(
                x,
                0,
                currentWidth,
                COLUMN_HEADER_HEIGHT
            );
            

            // Only supports single-letter columns (A-Z) for now.
            // ExcelColumnHelper (AA, AB, ...) will replace this later.
            const header = String.fromCharCode(65 + (col % 26));

            this.ctx.fillStyle = TEXT_COLOR; //Otherwise the letters become blue too

            this.ctx.fillText(
                header,
                x + currentWidth / 2,
                COLUMN_HEADER_HEIGHT / 2
            );

            
        }
    }

    private drawRowHeaders(
        startRow: number,
        endRow: number,
        scrollTop: number
    ): void {
        const selection = this.selectionManager.getSelection();
        this.ctx.fillStyle = HEADER_BACKGROUND;
        this.ctx.fillRect(
            0,
            0,
            ROW_HEADER_WIDTH,
            this.canvas.height
        );

        this.ctx.strokeStyle = GRID_LINE_COLOR;
        this.ctx.font = FONT;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        for (let row = startRow; row <= endRow; row++) {
            const y = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(row) - scrollTop;
            const currentHeight = this.rowColumnManager.getRowHeight(row);

            if(selection && row >= selection.startRow && row <= selection.endRow){
                this.ctx.fillStyle = "#D9EAFE"
            }
            else{
                this.ctx.fillStyle = HEADER_BACKGROUND;
            }

            this.ctx.fillRect(0, y, ROW_HEADER_WIDTH, currentHeight);

            this.ctx.strokeRect(
                0,
                y,
                ROW_HEADER_WIDTH,
                currentHeight
            );

            this.ctx.fillStyle = TEXT_COLOR; //Otherwise the letters become blue too

            this.ctx.fillText(
                String(row + 1),
                ROW_HEADER_WIDTH / 2,
                y + currentHeight / 2
            );
        }
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

        for (let row = startRow; row <= endRow; row++) {
            const y = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(row) - scrollTop;
            const currentHeight = this.rowColumnManager.getRowHeight(row);
            for (let col = startColumn; col <= endColumn; col++) {
                const x = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(col) - scrollLeft;
                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                this.ctx.strokeRect(
                    x,
                    y,
                    currentWidth,
                    currentHeight
                );
            }
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

        for (let row = startRow; row <= endRow; row++) {
            const y = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(row) - scrollTop;
            const currentHeight = this.rowColumnManager.getRowHeight(row);

            for (let col = startColumn; col <= endColumn; col++) {
                const value = this.dataModel.getCellValue(row, col);

                if (value === "") continue;

                const x = ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(col) - scrollLeft;
                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                // Clip so long text never spills into neighboring cells.
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(
                    x,
                    y,
                    currentWidth,
                    currentHeight
                );
                this.ctx.clip();

                this.ctx.fillText(
                    String(value),
                    x + 5,
                    y + currentHeight / 2
                );

                this.ctx.restore();
            }
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

        for (let row = selection.startRow; row <= selection.endRow; row++) {
            const y = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(row) - this.viewport.getScrollTop();
            const currentHeight = this.rowColumnManager.getRowHeight(row);

            for (let col = selection.startColumn; col <= selection.endColumn; col++) {
                const x =
                    ROW_HEADER_WIDTH + this.rowColumnManager.getColumnX(col) -
                    this.viewport.getScrollLeft();
                const currentWidth = this.rowColumnManager.getColumnWidth(col);

                this.ctx.fillRect(
                    x,
                    y,
                    currentWidth,
                    currentHeight
                );
            }
        }
    }
}
