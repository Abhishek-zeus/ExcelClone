export class RowColumnManager{
    private defaultColumnWidth: number = 100;
    private defaultRowHeight: number = 25;

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
    }

    public setRowHeight(row: number, height: number): void{
        this.rowHeights.set(row, height);
    }

    public getColumnX(column: number): number{
        let x = 0;
        for(let i=0; i< column; i++){
            x += this.getColumnWidth(i);
        }
        return x;
    }

    public getRowY(row: number): number {
        let y = 0;
        for (let i = 0; i < row; i++) {
            y += this.getRowHeight(i);
        }
        return y;
    }

}