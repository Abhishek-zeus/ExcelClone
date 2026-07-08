import { Command } from "./Command.js";

export class CommandInvoker{
    private undoStack: Command[] = [];

    private redoStack: Command[] = [];

    public executeCommand(command: Command):void{
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];    //Clear the Redo stack
    }

    // Pops from undo, reverts it, and pushes to redo
    public undo(): void{
        if(!this.canUndo()) return;
        const command = this.undoStack.pop();
        if(command){
            command.undo();
            this.redoStack.push(command);
        }
    }

    //pops from redo, re-applies it, and pushes back to undo
    public redo(): void{
        if(!this.canRedo()) return;
        const command = this.redoStack.pop();
        if(command){
            command.execute();
            this.undoStack.push(command);
        }
    }

    public canUndo(): boolean{
        return this.undoStack.length > 0;
    }

    public canRedo(): boolean{
        return this.redoStack.length > 0;
    }
}