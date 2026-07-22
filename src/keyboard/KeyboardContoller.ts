//CTRL Z and CTRL Y owner

import { CommandInvoker } from "../commands/CommandInvoker.js";
import { EditorManager } from "../editor/EditorManager.js";
import { RenderScheduler } from "../renderer/RenderScheduler.js";
import { NavigationController } from "./NavigationController.js";

export class KeyboardController {
    constructor(
        private commandInvoker: CommandInvoker,
        private renderScheduler: RenderScheduler,
        private editorManager: EditorManager,
        private navigationController: NavigationController
    ) { }

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

        if (!this.editorManager.isEditing) {
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    this.navigationController.moveUp();
                    needsRender = true;
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.navigationController.moveDown();
                    needsRender = true;
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.navigationController.moveLeft();
                    needsRender = true;
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.navigationController.moveRight();
                    needsRender = true;
                    break;
            }
        }


        this.renderScheduler.queueRender(needsRender);
    }
}
