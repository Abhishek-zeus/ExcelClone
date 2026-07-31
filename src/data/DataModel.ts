import { MIN_SALARY, TOTAL_COLUMNS, TOTAL_ROWS } from "../utils/Constants.js";

export interface RowData {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    salary: number;
    // Allows dynamic columns (Col_5, Col_6, ...)
    [key: string]: any;
}

export class DataModel {
    // Stores all row data
    private records: RowData[] = [];

    // Maps column index -> property name
    private columnKeys: string[] = [
        "id",
        "firstName",
        "lastName",
        "age",
        "salary"
    ];

    constructor() {
        this.generateMockData(TOTAL_ROWS);
        this.generateRemainingColumns(TOTAL_COLUMNS);
    }

    /**
     * Generates sample employee records
     */
    private generateMockData(count: number): void {
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
                salary: MIN_SALARY + (i % 10) * 10000
            });
        }
    }

    /**
     * Creates remaining column names up to 500 columns
     */
    private generateRemainingColumns(totalColumns: number): void {
        while (this.columnKeys.length < totalColumns) {
            this.columnKeys.push(`Col_${this.columnKeys.length}`);
        }
    }

    /**
     * Returns value stored inside a cell
     */
    public getCellValue(row: number, column: number): any {
        const rowData = this.records[row];
        if (!rowData) return "";

        const key = this.columnKeys[column];
        return rowData[key] ?? "";
    }

    /**
     * Updates value of a cell
     */
    public setCellValue(
        row: number,
        column: number,
        value: any
    ): void {
        const rowData = this.records[row];
        if (!rowData) return;

        const key = this.columnKeys[column];
        if (!key) return;
        this.records[row][key] = value;
    }

    /**
     * Returns column header
     */
    public getColumnName(column: number): string {
        return this.columnKeys[column];
    }

    /**
     * Returns total rows
     */
    public getRowCount(): number {
        return this.records.length;
    }

    /**
     * Returns total columns
     */
    public getColumnCount(): number {
        return this.columnKeys.length;
    }
}
