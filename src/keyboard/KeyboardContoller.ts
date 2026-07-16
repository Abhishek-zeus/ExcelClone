//CTRL Z and CTRL Y owner

import { CommandInvoker } from "../commands/CommandInvoker";
import { EditorManager } from "../editor/EditorManager";
import { RenderScheduler } from "../renderer/RenderScheduler";

export class KeyboardController{
    constructor(
        private commandInvoker: CommandInvoker,
        private renderScheduler: RenderScheduler,
        private editorManager: EditorManager
    ){}

    //Keys
    public onKeyDown(event: KeyboardEvent): void {
        let needsRender = false;
        if (event.ctrlKey && event.key.toLowerCase() === "z") {
            event.preventDefault(); //stops browsers default action for that key

            //If text editor is opened, Close it
            if (this.editorManager && this.editorManager.isEditing === true) {
                this.editorManager.destroy();
            }

            this.commandInvoker.undo();
            needsRender = true;
        }
        if (event.ctrlKey && event.key.toLowerCase() === "y") {
            event.preventDefault();

            //If text editor is opened, Close it
            if (this.editorManager && this.editorManager.isEditing === true) {
                this.editorManager.destroy();
            }

            this.commandInvoker.redo();
            needsRender = true;
        }

        this.renderScheduler.queueRender(needsRender);
    }
}
