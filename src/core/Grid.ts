import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { DataModel } from "../data/DataModel.js";
import { EditorManager } from "../editor/EditorManager.js";
import { Viewport } from "./Viewport.js";
import { MouseCell, MouseHandler } from "../events/MouseHandler.js";
import { SelectionManager } from "../selection/SelectionManager.js";
import { CELL_HEIGHT, CELL_WIDTH, COLUMN_HEADER_HEIGHT, MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT, ROW_HEADER_WIDTH, TOTAL_COLUMNS, TOTAL_ROWS } from "../utils/Constants.js";
import { ResizeDetector } from "../events/ResizeDetector.js";
import { RowColumnManager } from "./RowColumnManager.js";
import { ResizeState } from "../models/ResizeState.js";
import { CommandInvoker } from "../commands/CommandInvoker.js";
import { EditCellCommand } from "../commands/EditCellCommand.js";
import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";
import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";
import { StatisticsCalculator } from "../selection/StatisticsCalculator.js";
import { StatusBar } from "../ui/StatusBar.js";
import { InteractionManager } from "../interaction/InteractionManager.js"
import { RenderScheduler } from "../renderer/RenderScheduler.js";
import { KeyboardController } from "../keyboard/KeyboardContoller.js";
import { StatisticsController } from "../selection/StatisticsController.js";
import { HitTest } from "../interaction/Resolver/HitTest.js";
import { NavigationController } from "../keyboard/NavigationController.js";

//  Grid is the "manager"/orchestrator of the whole application.
//  It creates every other class and wires them together, but it
//  never draws anything itself, never stores data itself, and never
//  calculates selection/viewport logic itself. It just coordinates.
 
export class Grid {
    private canvas: HTMLCanvasElement;

    private dataModel: DataModel;
    private resizeState: ResizeState | null = null;
    private resizeDetector: ResizeDetector;
    private viewport: Viewport;
    private selectionManager: SelectionManager;
    private mouseHandler: MouseHandler;
    private renderer: CanvasRenderer;
    private editorManager: EditorManager;
    private rowColumnManager: RowColumnManager;
    private scrollContainer!: HTMLDivElement;
    private scrollContent!: HTMLDivElement;
    private commandInvoker: CommandInvoker;
    private statisticsCalculator: StatisticsCalculator;
    private statusBar: StatusBar;

    private isSelecting: boolean = false;
    private selectionStart: MouseCell | null = null;
    private hitTest: HitTest;
    private interactionManager: InteractionManager;
    private renderScheduler: RenderScheduler;
    private statisticsController: StatisticsController;
    private keyBoardController: KeyboardController;
    private navigationController: NavigationController

    constructor() {
        this.canvas = document.getElementById(
            "excelCanvas"
        ) as HTMLCanvasElement;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.dataModel = new DataModel();

        this.selectionManager = new SelectionManager();

        this.rowColumnManager = new RowColumnManager();

        this.viewport = new Viewport(
            this.canvas.width,
            this.canvas.height,
            this.rowColumnManager
        );

        this.statisticsCalculator = new StatisticsCalculator();

        this.resizeDetector = new ResizeDetector(this.viewport, this.rowColumnManager);
        this.commandInvoker = new CommandInvoker();
        this.mouseHandler = new MouseHandler(this.viewport, this.rowColumnManager);

        const container = this.canvas.parentElement || document.body;
        this.editorManager = new EditorManager(container);

        this.scrollContainer = document.getElementById("grid-container") as HTMLDivElement;
        this.scrollContent = document.createElement("div");

        this.scrollContent.style.position = 'absolute';
        this.scrollContent.style.top = '0';
        this.scrollContent.style.left = '0';
        this.scrollContent.style.width = `${TOTAL_COLUMNS * CELL_WIDTH}px`;
        this.scrollContent.style.height = `${TOTAL_ROWS * CELL_HEIGHT}px`;
        this.scrollContent.style.pointerEvents = 'none'; // Passes clicks directly to canvas

        this.scrollContainer.appendChild(this.scrollContent);

        this.statusBar = new StatusBar();
        this.navigationController = new NavigationController(this.selectionManager, this.viewport);

        this.statisticsController = new StatisticsController(this.selectionManager, this.statisticsCalculator, this.statusBar, this.dataModel);

        this.renderScheduler = new RenderScheduler(
            this.render.bind(this), 
            this.statisticsController
        );


        this.renderer = new CanvasRenderer(
            this.canvas,
            this.dataModel,
            this.selectionManager,
            this.viewport,
            this.rowColumnManager
        );

        this.keyBoardController = new KeyboardController(
            this.commandInvoker, 
            this.renderScheduler, 
            this.editorManager,
            this.navigationController
        );

        this.hitTest = new HitTest(this.mouseHandler,this.resizeDetector);

        this.interactionManager = new InteractionManager(
            this.canvas, 
            this.viewport, 
            this.mouseHandler, 
            this.dataModel,
            this.selectionManager, 
            this.resizeDetector, 
            this.rowColumnManager, 
            this.commandInvoker,
            this.editorManager, 
            this.renderer, 
            this.renderScheduler,
            this.hitTest
        );


        this.registerEvents();

        this.render();
    }


    private registerEvents(): void {
        //Select
        this.canvas.addEventListener(
            "pointerdown",
            this.interactionManager.onPointerDown.bind(this.interactionManager)
            // this.onPointerDown.bind(this)
        );

        //double-click event
        this.canvas.addEventListener(
            "dblclick",
            this.interactionManager.onDoubleClick.bind(this.interactionManager)
        );

        //Resize Icon
        this.canvas.addEventListener(
            "pointermove",
            this.interactionManager.onPointerMove.bind(this.interactionManager)
            // this.onPointerMove.bind(this)
        );

        //pointer-Up
        window.addEventListener(
            "pointerup",
            this.interactionManager.onPointerUp.bind(this.interactionManager)
            // this.onPointerUp.bind(this)
        );

        //Scroll Bar
        this.scrollContainer.addEventListener(
            "scroll",
            this.onScroll.bind(this)
        );

        window.addEventListener(
            "keydown",
            this.keyBoardController.onKeyDown.bind(this.keyBoardController)
        );

    }

    

    


    //Scroll bar
    private onScroll(): void {
        this.viewport.setScrollTop(this.scrollContainer.scrollTop);
        this.viewport.setScrollLeft(this.scrollContainer.scrollLeft);
        this.render();
    }

    /**
     * Re-renders the visible portion of the sheet. Any future
     * feature (scrolling, editing, resizing, undo/redo, ...) will
     * simply mutate some state and call this.render() again.
     */
    private render(): void {
        const startRow = this.viewport.getFirstVisibleRow();
        const endRow = this.viewport.getLastVisibleRow();
        const startColumn = this.viewport.getFirstVisibleColumn();
        const endColumn = this.viewport.getLastVisibleColumn();

        this.renderer.render(
            startRow,
            endRow,
            startColumn,
            endColumn,
            this.viewport.getScrollTop(),
            this.viewport.getScrollLeft()
        );
    }
}
