export class EditCellCommand {
    constructor(dataModel, row, column, oldValue, newValue) {
        this.dataModel = dataModel;
        this.row = row;
        this.column = column;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    execute() {
        this.dataModel.setCellValue(this.row, this.column, this.newValue);
    }
    undo() {
        this.dataModel.setCellValue(this.row, this.column, this.oldValue);
    }
}
//# sourceMappingURL=EditCellCommand.js.map