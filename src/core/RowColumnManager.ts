export class RowColumnManager{
    private defaultColumnWidth: number = 100;
    private defaultRowHeight: number = 25;

    // NEW CACHE STATE VARIABLES HERE
    private columnXCache: number[] =[0]; // Index 0 starts at X coordinate 0
    private rowYCache: number[] =[0];    // Index 0 starts at Y coordinate 0
    private validColumnCacheUpTo: number = 0;
    private validRowCacheUpTo: number = 0;


    private columnWidths = new Map<number, number>();
    private rowHeights = new Map<number, number>();

    public getColumnWidth(column: number): number{
        return this.columnWidths.get(column) ?? this.defaultColumnWidth;
    }

    public getRowHeight(row: number): number{
        return this.rowHeights.get(row) ?? this.defaultRowHeight;
    }

    public setColumnWidth(column: number, width: number): void{
        this.columnWidths.set(column, width);
        // If someone resizes a column, all coordinates after it are now invalid
        if (column < this.validColumnCacheUpTo) {
            this.validColumnCacheUpTo = column;
        }

    }

    public setRowHeight(row: number, height: number): void{
        this.rowHeights.set(row, height);
        // If someone resizes a row, all coordinates after it are now invalid!
        if (row < this.validRowCacheUpTo) {
            this.validRowCacheUpTo = row;
        }

    }

    public getColumnX(column: number): number{
        // let x = 0;
        // for(let i=0; i< column; i++){
        //     x += this.getColumnWidth(i);
        // }
        // return x;

        // Only calculate forward from the last known valid index
        for (let i = this.validColumnCacheUpTo; i < column; i++) {
            this.columnXCache[i + 1] = this.columnXCache[i] + this.getColumnWidth(i);
        }
        
        // Push our valid boundary forward if we searched deeper
        if (column > this.validColumnCacheUpTo) {
            this.validColumnCacheUpTo = column;
        }
        
        return this.columnXCache[column];


    }

    public getRowY(row: number): number {
        // let y = 0;
        // for (let i = 0; i < row; i++) {
        //     y += this.getRowHeight(i);
        // }
        // return y;

        // Only calculate forward from the last known valid index
        for (let i = this.validRowCacheUpTo; i < row; i++) {
            this.rowYCache[i + 1] = this.rowYCache[i] + this.getRowHeight(i);
        }
        
        // Push our valid boundary forward if we searched deeper
        if (row > this.validRowCacheUpTo) {
            this.validRowCacheUpTo = row;
        }
        
        return this.rowYCache[row];
    
    }

}