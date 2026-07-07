export class DataModel {
    constructor() {
        // Stores all row data
        this.records = [];
        // Maps column index -> property name
        this.columnKeys = [
            "id",
            "firstName",
            "lastName",
            "age",
            "salary"
        ];
        this.generateMockData(50000);
        this.generateRemainingColumns(500);
    }
    /**
     * Generates sample employee records
     */
    generateMockData(count) {
        const firstNames = [
            "Suraj",
            "Abhishek",
            "Piyush",
            "Michael",
            "Kshitiz",
            "Dhrumil",
            "Aditya",
            "Divyan",
            "Joshua"
        ];
        const lastNames = [
            "Prajapati",
            "Patel",
            "Revankar",
            "Pawar",
            "Hosamani",
            "Poojary",
            "Jain"
        ];
        for (let i = 1; i <= count; i++) {
            this.records.push({
                id: i,
                firstName: firstNames[i % firstNames.length],
                lastName: lastNames[i % lastNames.length],
                age: 20 + (i % 25),
                salary: 50000 + (i % 10) * 10000
            });
        }
    }
    /**
     * Creates remaining column names up to 500 columns
     */
    generateRemainingColumns(totalColumns) {
        while (this.columnKeys.length < totalColumns) {
            this.columnKeys.push(`Col_${this.columnKeys.length}`);
        }
        console.log("Columns are", this.columnKeys[6], this.columnKeys[7], this.columnKeys[8], this.columnKeys[9]);
    }
    /**
     * Returns value stored inside a cell
     */
    getCellValue(row, column) {
        const rowData = this.records[row];
        if (!rowData)
            return "";
        const key = this.columnKeys[column];
        return rowData[key] ?? "";
    }
    /**
     * Updates value of a cell
     */
    setCellValue(row, column, value) {
        const key = this.columnKeys[column];
        this.records[row][key] = value;
    }
    /**
     * Returns column header
     */
    getColumnName(column) {
        return this.columnKeys[column];
    }
    /**
     * Returns total rows
     */
    getRowCount() {
        return this.records.length;
    }
    /**
     * Returns total columns
     */
    getColumnCount() {
        return this.columnKeys.length;
    }
}
//# sourceMappingURL=DataModel.js.map