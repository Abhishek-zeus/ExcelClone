/**
 * Represents a rectangular range of selected cells, e.g. B2 -> D5.
 *
 * We never store every individual selected cell (that could mean
 * millions of objects for a large selection). Instead we store only
 * the two corners of the rectangle - everything else can be derived.
 */
export class CellRange {
    constructor(
        public startRow: number,
        public startColumn: number,
        public endRow: number,
        public endColumn: number
    ) {}
}
