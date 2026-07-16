import { StatisticsController } from "../selection/StatisticsController";

export class RenderScheduler{

    private animationFrameId: number | null = null;
    
    constructor(
        private render:() => void,
        private statisticsController: StatisticsController
    ){}

    // Helper method to keep requestAnimationFrame DRY and centralized
    public queueRender(needsRender: boolean): void {
        if (needsRender && !this.animationFrameId) {
            this.animationFrameId = requestAnimationFrame(() => {
                this.render();
                this.statisticsController.update();
                this.animationFrameId = null;
            });
        }
    }


}