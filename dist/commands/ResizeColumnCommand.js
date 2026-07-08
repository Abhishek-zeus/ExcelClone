export class ResizeColumnCommand {
    constructor(rowColumnManager, column, oldWidth, newWidth) {
        this.rowColumnManager = rowColumnManager;
        this.column = column;
        this.oldWidth = oldWidth;
        this.newWidth = newWidth;
    }
    execute() {
        this.rowColumnManager.setColumnWidth(this.column, this.newWidth);
    }
    undo() {
        this.rowColumnManager.setColumnWidth(this.column, this.oldWidth);
    }
}
//# sourceMappingURL=ResizeColumnCommand.js.map