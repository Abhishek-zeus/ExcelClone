import { RowColumnManager } from "../core/RowColumnManager.js";
import { Command } from "./Command.js";

export class ResizeRowCommand implements Command{
    constructor(private rowColumnManager: RowColumnManager,
        private row: number, private oldHeight: number,
        private newHeight: number
    ){}

    execute(): void{
        this.rowColumnManager.setRowHeight(this.row,this.newHeight);
    }

    undo(): void{
        this.rowColumnManager.setRowHeight(this.row, this.oldHeight);
    }
}