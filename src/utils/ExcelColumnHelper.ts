export class ExcelColumnHelper{
    //Excel is 26 base, so (in 0 base) 25 is 26 is Z, 26 becomes 27 is AA
    public static getColumnName(column: number): string{
        let name = "";
        column++; //27 sent becomes 28
        while(column > 0){
            const remainder = (column - 1) % 26;
            name = String.fromCharCode(65 + remainder) + name;
            column = Math.floor((column - 1)/26); //Update the column for next round
        }
        return name;
    }
}