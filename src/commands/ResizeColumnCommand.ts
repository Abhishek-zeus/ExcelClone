import { RowColumnManager } from "../core/RowColumnManager.js";
import { Command } from "./Command.js";

export class ResizeColumnCommand implements Command{
    constructor(private rowColumnManager: RowColumnManager,
        private column: number, private oldWidth: number,
        private newWidth: number
    ){}

    execute(): void{
        this.rowColumnManager.setColumnWidth(this.column,this.newWidth);
    }

    undo(): void{
        this.rowColumnManager.setColumnWidth(this.column, this.oldWidth);
    }
}