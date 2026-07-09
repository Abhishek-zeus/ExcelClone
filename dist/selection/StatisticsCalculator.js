export class StatisticsCalculator {
    calculate(range, dataModel) {
        let count = 0;
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;
        //If Row / Column Header is selected this will help {
        const totalRows = dataModel.getRowCount();
        const totalCols = dataModel.getColumnCount();
        const endRow = range.endRow === Infinity ? totalRows - 1 : range.endRow;
        const endColumn = range.endColumn === Infinity ? totalCols - 1 : range.endColumn;
        // }
        for (let row = range.startRow; row <= endRow; row++) {
            for (let column = range.startColumn; column <= endColumn; column++) {
                const value = Number(dataModel.getCellValue(row, column));
                if (isNaN(value)) { //Not A Number
                    continue;
                }
                count++;
                sum += value;
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
        let average = (count === 0) ? 0 : sum / count;
        min = (count === 0) ? 0 : min;
        max = (count === 0) ? 0 : max;
        return { count, sum, average, min, max };
    }
}
//# sourceMappingURL=StatisticsCalculator.js.map