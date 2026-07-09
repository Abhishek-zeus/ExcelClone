export class StatusBar {
    constructor() {
        this.element = document.getElementById("status-bar");
    }
    show(stats) {
        // &nbsp;&nbsp;&nbsp; - space
        this.element.innerHTML = `<div class="status-item"><span class="status-label">Count:</span><span class="status-value">${stats.count}</span></div>
            <div class="status-item"><span class="status-label">Sum:</span><span class="status-value">${stats.sum}</span></div>
            <div class="status-item"><span class="status-label">Average:</span><span class="status-value">${stats.average.toFixed(2)}</span></div>
            <div class="status-item"><span class="status-label">Min:</span><span class="status-value">${stats.min}</span></div>
            <div class="status-item"><span class="status-label">Max:</span><span class="status-value">${stats.max}</span></div>`;
    }
    clear() {
        this.element.innerHTML = `<div class="status-ready">Ready</div>`;
    }
}
//# sourceMappingURL=StatusBar.js.map