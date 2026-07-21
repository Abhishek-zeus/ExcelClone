import { EditCellCommand } from "../../commands/EditCellCommand.js";
import { MouseCell, MouseHandler } from "../../events/MouseHandler.js";
import { ResizeDetector } from "../../events/ResizeDetector.js";
import { COLUMN_HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../utils/Constants.js";
import { InteractionManager } from "../InteractionManager.js";
import { InteractionState } from "./InteractionState.js";

export class EditingState implements InteractionState{

    private cell : MouseCell | null = null;

    constructor(
        private interactionManager: InteractionManager,
        private resizeDetector: ResizeDetector,
        private mouseHandler: MouseHandler
    ){}

    HitTest(event: PointerEvent): boolean {
        return false;
    }

    onPointerDown(event: PointerEvent): void {
        //nothing
    }
    onPointerMove(event: PointerEvent): void {
        //nothing
    }
    onPointerUp(event: PointerEvent): void {
        this.interactionManager.goIdle();
    }

    onDoubleClick(event: MouseEvent): void {
        //Ask mousehandler what cell was clicked
        this.cell = this.interactionManager.getMouseHandler().getCellFromMouse(
            event.offsetX,
            event.offsetY
        );

        if (!this.cell) return;

        // Apply renderer's exact formulas to determine input tracking coordinates of the cell to fit into cell not on Pointer's cursor
        const screenX =
            ROW_HEADER_WIDTH +
            this.interactionManager.getRowColumnManager().getColumnX(this.cell.column);

        const screenY =
            COLUMN_HEADER_HEIGHT +
            this.interactionManager.getRowColumnManager().getRowY(this.cell.row);

        const value = this.interactionManager.getDataModel().getCellValue(this.cell.row, this.cell.column);

        this.interactionManager.getEditorManager().startEditing(this.cell.row, this.cell.column, screenX, screenY, this.interactionManager.getRowColumnManager().getColumnWidth(this.cell.column), this.interactionManager.getRowColumnManager().getRowHeight(this.cell.row), value,
            (newValue: string) => {
                // this.dataModel.setCellValue(cell.row, cell.column, newValue);
                // this.render();

                const oldValue = this.interactionManager.getDataModel().getCellValue(this.cell?.row!, this.cell?.column!);
                const command = new EditCellCommand(this.interactionManager.getDataModel(), this.cell?.row!, this.cell?.column!, oldValue, newValue);

                this.interactionManager.getCommandInvoker().executeCommand(command);
                this.interactionManager.getRenderScheduler().queueRender(true);
            }
        );

    }
}