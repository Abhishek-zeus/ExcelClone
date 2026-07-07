export class RowColumnManager {
    constructor() {
        this.defaultColumnWidth = 100;
        this.defaultRowHeight = 25;
        this.columnWidths = new Map();
        this.rowHeights = new Map();
    }
    getColumnWidth(column) {
        return this.columnWidths.get(column) ?? this.defaultColumnWidth;
    }
    getRowHeight(row) {
        return this.rowHeights.get(row) ?? this.defaultRowHeight;
    }
    setColumnWidth(column, width) {
        this.columnWidths.set(column, width);
    }
    setRowHeight(row, height) {
        this.rowHeights.set(row, height);
    }
    getColumnX(column) {
        let x = 0;
        for (let i = 0; i < column; i++) {
            x += this.getColumnWidth(i);
        }
        return x;
    }
    getRowY(row) {
        let y = 0;
        for (let i = 0; i < row; i++) {
            y += this.getRowHeight(i);
        }
        return y;
    }
}
//# sourceMappingURL=RowColumnManager.js.map