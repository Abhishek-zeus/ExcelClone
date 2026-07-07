export class EditorManager{
    private input: HTMLInputElement | null = null;

    //container is a parent html element
    constructor(private container: HTMLElement){}

    private createInput(): HTMLInputElement{
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
    public startEditing(
        row:number, 
        column:number,
        x:number, 
        y:number, 
        width:number, 
        height:number, 
        currentValue:string,
        onSave:(value:string)=>void //fallback function that tells the editor that once finished call this to save to db
    ): void{
        //position input
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
        this.input.addEventListener("keydown", (event)=>{
            if(event.key === "Enter"){
                onSave(this.input!.value);
                this.destroy(); 
            }
            if(event.key === "Escape"){
                isCancelled = true;
                this.destroy();
            }
        }
        );

        //Blur
        this.input.addEventListener("blur", () => {
            if(!isCancelled && this.input){
                onSave(this.input!.value);
                this.destroy();
            }
        }
        );
    }

    private destroy():void{
        if(!this.input)
            return;
        this.input.remove();
        this.input = null;
    }

}