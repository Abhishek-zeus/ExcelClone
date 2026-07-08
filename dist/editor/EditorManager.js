export class EditorManager {
    //container is a parent html element
    constructor(container) {
        this.container = container;
        this.input = null;
        this.isEditing = false;
        this.onSaveCallBack = null;
    }
    createInput() {
        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "absolute";
        input.style.zIndex = "1000";
        input.style.padding = "2px";
        input.style.margin = "0";
        input.style.boxSizing = "border-box";
        return input;
    }
    //This method will be called after double click
    startEditing(row, column, x, y, width, height, currentValue, onSave //fallback function that tells the editor that once finished call this to save to db
    ) {
        //position input
        this.isEditing = true;
        this.onSaveCallBack = onSave;
        this.input = this.createInput();
        this.input.style.left = `${x}px`;
        this.input.style.top = `${y}px`;
        this.input.style.width = `${width}px`;
        this.input.style.height = `${height}px`;
        this.input.value = currentValue;
        //add input
        this.container.appendChild(this.input);
        this.input.focus();
        this.input.select();
        // TRACKING FLAG: Track if the user aborted editing
        let isCancelled = false;
        //saving or escape
        this.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); //prevents browsers default behaviour
                if (this.input) {
                    onSave(this.input.value);
                }
                this.destroy();
            }
            if (event.key === "Escape") {
                event.preventDefault();
                isCancelled = true;
                this.destroy();
            }
        });
        //Blur
        this.input.addEventListener("blur", () => {
            if (!isCancelled && this.input) {
                onSave(this.input.value);
                this.destroy();
            }
        });
    }
    destroy() {
        if (!this.input)
            return;
        this.input.remove();
        this.isEditing = false;
        this.input = null;
        this.onSaveCallBack = null; // to close the save function in progress and avoid data leaks
    }
}
//# sourceMappingURL=EditorManager.js.map