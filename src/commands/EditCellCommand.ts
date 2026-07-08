import { DataModel } from "../data/DataModel.js";
import { Command } from "./Command.js";

export class EditCellCommand implements Command{
    constructor(private dataModel: DataModel,
        private row: number,
        private column: number, private oldValue: any,
        private newValue: any
    ){}

    execute(): void{
        this.dataModel.setCellValue(this.row,this.column,this.newValue);
    }

    undo(): void{
        this.dataModel.setCellValue(this.row,this.column,this.oldValue);
    }
}