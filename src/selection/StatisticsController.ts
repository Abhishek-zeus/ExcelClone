import { DataModel } from "../data/DataModel";
import { StatusBar } from "../ui/StatusBar";
import { SelectionManager } from "./SelectionManager";
import { StatisticsCalculator } from "./StatisticsCalculator";

export class StatisticsController{
    constructor(
        private selectionManager: SelectionManager,
        private statisticsCalculator: StatisticsCalculator,
        private statusBar: StatusBar,
        private dataModel: DataModel
    ){}

    // Helper Method for calculating statistics
    public update(): void {
        const selection = this.selectionManager.getSelection();
        if (selection) {
            const stats = this.statisticsCalculator.calculate(selection, this.dataModel);
            // console.log(stats);
            this.statusBar.show(stats);
        }
        else {
            this.statusBar.clear();
        }
    }
}