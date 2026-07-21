import { CellRange } from "../models/CellRange.js";


//   SelectionManager owns only one piece of state: the currently
//   selected range of cells. It never draws anything (that's the
//   CanvasRenderer's job) and never touches the mouse or the DOM
//   directly (that's the MouseHandler's job).
 
export class SelectionManager {
    private selectedRange: CellRange | null = null;

    
    //   Selects a single cell. A single cell is just a range whose start and end are the same - this keeps the model simple.
     
    public selectCell(row: number, column: number): void {
        this.selectedRange = new CellRange(
            row,
            column,
            row,
            column
        );
    }

    //   Sends the single selected cell
    public selectedRow(): number{
        return this.selectedRange?.startRow ?? -1;
    }

    public selectedColumn(): number{
        return this.selectedRange?.startColumn ?? -1;
    }


    
    //   Selects a rectangular range of cells. Coordinates are
    //   normalized with Math.min/Math.max so that dragging in any
    //   direction (top->bottom, bottom->top, etc.) always produces a
    //   valid, well-ordered range.
    
    public selectRange(
        startRow: number,
        startColumn: number,
        endRow: number,
        endColumn: number
    ): void {
        if(this.selectedRange){
            this.selectedRange.startRow = Math.min(startRow, endRow);
            this.selectedRange.startColumn = Math.min(startColumn, endColumn);
            this.selectedRange.endRow = Math.max(startRow, endRow);
            this.selectedRange.endColumn = Math.max(startColumn, endColumn);
        }
        else {
            this.selectedRange = new CellRange(
            Math.min(startRow, endRow),
            Math.min(startColumn, endColumn),
            Math.max(startRow, endRow),
            Math.max(startColumn, endColumn)
        );
        }

    }

    public getSelection(): CellRange | null {
        return this.selectedRange;
    }

    public selectRow(row: number, visibleColumns: number): void{
        this.selectedRange = new CellRange(row, 0, row, visibleColumns - 1);
    }

    public selectColumn(column: number, visibleRows: number): void{
        this.selectedRange = new CellRange(0, column, visibleRows - 1, column);
    }
}
