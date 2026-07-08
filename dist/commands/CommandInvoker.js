export class CommandInvoker {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    executeCommand(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; //Clear the Redo stack
    }
    // Pops from undo, reverts it, and pushes to redo
    undo() {
        if (!this.canUndo())
            return;
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }
    //pops from redo, re-applies it, and pushes back to undo
    redo() {
        if (!this.canRedo())
            return;
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
}
//# sourceMappingURL=CommandInvoker.js.map