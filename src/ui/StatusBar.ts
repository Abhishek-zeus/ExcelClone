import { Statistics } from "../selection/StatisticsCalculator.js";

export class StatusBar{
    private element: HTMLDivElement;

    constructor(){
        this.element = document.getElementById("status-bar") as HTMLDivElement;
    }

    public show(stats: Statistics): void{
        // &nbsp;&nbsp;&nbsp; - space
        this.element.innerHTML = `<div class="status-item"><span class="status-label">Count:</span><span class="status-value">${stats.count}</span></div>
            <div class="status-item"><span class="status-label">Sum:</span><span class="status-value">${stats.sum}</span></div>
            <div class="status-item"><span class="status-label">Average:</span><span class="status-value">${stats.average.toFixed(2)}</span></div>
            <div class="status-item"><span class="status-label">Min:</span><span class="status-value">${stats.min}</span></div>
            <div class="status-item"><span class="status-label">Max:</span><span class="status-value">${stats.max}</span></div>`;
    }

    public clear(): void{
        this.element.innerHTML = `<div class="status-ready">Ready</div>`;
    }
}