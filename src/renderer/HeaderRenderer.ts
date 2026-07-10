import { RowColumnManager } from "../core/RowColumnManager.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { COLUMN_HEADER_HEIGHT, FONT, GRID_LINE_COLOR, HEADER_BACKGROUND, ROW_HEADER_WIDTH, TEXT_COLOR } from "../utils/Constants.js";
import { ExcelColumnHelper } from "../utils/ExcelColumnHelper.js";

export class HeaderRenderer{

    constructor(private selectionManager: SelectionManager,
         private ctx: CanvasRenderingContext2D, 
         private canvas: HTMLCanvasElement,
         private rowColumnManager: RowColumnManager){}

    public drawColumnHeaders(
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
                
    
                // ExcelColumnHelper (AA, AB, ...)
                const header = ExcelColumnHelper.getColumnName(col);
    
                this.ctx.fillStyle = TEXT_COLOR; //Otherwise the letters become blue too
    
                this.ctx.fillText(
                    header,
                    x + currentWidth / 2,
                    COLUMN_HEADER_HEIGHT / 2
                );
    
                
            }
        }
    
        public drawRowHeaders(
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
            let currentY = COLUMN_HEADER_HEIGHT + this.rowColumnManager.getRowY(startRow) - scrollTop;
    
            for (let row = startRow; row <= endRow; row++) {
                const currentHeight = this.rowColumnManager.getRowHeight(row);
    
                if(selection && row >= selection.startRow && row <= selection.endRow){
                    this.ctx.fillStyle = "#D9EAFE"
                }
                else{
                    this.ctx.fillStyle = HEADER_BACKGROUND;
                }
    
                this.ctx.fillRect(0, currentY, ROW_HEADER_WIDTH, currentHeight);
    
                this.ctx.strokeRect(
                    0,
                    currentY,
                    ROW_HEADER_WIDTH,
                    currentHeight
                );
    
                this.ctx.fillStyle = TEXT_COLOR; //Otherwise the letters become blue too
    
                this.ctx.fillText(
                    String(row + 1),
                    ROW_HEADER_WIDTH / 2,
                    currentY + currentHeight / 2
                );
                currentY += currentHeight;
            }
        }
}