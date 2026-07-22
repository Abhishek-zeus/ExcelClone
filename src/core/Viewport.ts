import { CELL_HEIGHT, CELL_WIDTH, COLUMN_HEADER_HEIGHT, STATUS_BAR_HEIGHT } from "../utils/Constants.js";
import { RowColumnManager } from "./RowColumnManager.js";


//  Viewport is responsible ONLY for figuring out which rows/columns are currently visible based on the current scroll position.
//  It does NOT know about:
//   - the DataModel
//   - the CanvasRenderer
//   - the Mouse
//   - Selection

//  It only knows: scrollTop, scrollLeft, canvasWidth, canvasHeight.
//  Everything else can be calculated from those four values.
 
export class Viewport {
    private scrollTop: number = 0;
    private scrollLeft: number = 0;

    constructor(
        private canvasWidth: number,
        private canvasHeight: number,
        private rowColumnManager: RowColumnManager
    ) {}

    public getVisibleHeight(): number{
        return this.canvasHeight - STATUS_BAR_HEIGHT - COLUMN_HEADER_HEIGHT;
    }

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
        const visibleBottom = this.scrollTop + this.getVisibleHeight();
        let currentY = this.rowColumnManager.getRowY(this.getFirstVisibleRow());
        let row = this.getFirstVisibleRow();
        while(currentY < visibleBottom ){
            currentY += this.rowColumnManager.getRowHeight(row);
            row++;
        }
        return row;
    }

    public getFirstVisibleColumn(): number {
        let currentX = 0;
        let column = 0;

        while(currentX < this.scrollLeft){
            currentX += this.rowColumnManager.getColumnWidth(column);
            column++;
        }

        return Math.max(0, column - 1);
    }

    public getLastVisibleColumn(): number {
        const visibleRight = this.scrollLeft + this.canvasWidth;
        let currentX = this.rowColumnManager.getColumnX(this.getFirstVisibleColumn());
        let column = this.getFirstVisibleColumn();

        while(currentX < visibleRight){
            currentX += this.rowColumnManager.getColumnWidth(column);
            column++;
        }

        return column ;

    }

    public ensureCellVisible(row: number, column: number){

        const visibleHeight = this.getVisibleHeight();

        if(row <= this.getFirstVisibleRow()){
            this.scrollTop = this.rowColumnManager.getRowY(row);
        }
        else if(row >= this.getLastVisibleRow()){
            this.scrollTop = this.rowColumnManager.getRowY(row) - visibleHeight + this.rowColumnManager.getRowHeight(row) ;
        }
        if(column <= this.getFirstVisibleColumn()){
            this.scrollLeft = this.rowColumnManager.getColumnX(column);
        }
        else if(column >= this.getLastVisibleColumn()){
            this.scrollLeft = this.rowColumnManager.getColumnX(column) - this.canvasWidth + this.rowColumnManager.getColumnWidth(column);
        }
    }
}
