export class ResizeRowCommand {
    constructor(rowColumnManager, row, oldHeight, newHeight) {
        this.rowColumnManager = rowColumnManager;
        this.row = row;
        this.oldHeight = oldHeight;
        this.newHeight = newHeight;
    }
    execute() {
        this.rowColumnManager.setRowHeight(this.row, this.newHeight);
    }
    undo() {
        this.rowColumnManager.setRowHeight(this.row, this.oldHeight);
    }
}
//# sourceMappingURL=ResizeRowCommand.js.map