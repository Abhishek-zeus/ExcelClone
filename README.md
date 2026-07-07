# Excel Grid (Canvas + TypeScript)

A virtualized, Excel-style spreadsheet grid rendered on an HTML5
Canvas, built incrementally following a mentor-style guide, Phase 0
through Phase 16.

## What's implemented (Phase 0 - Phase 16)

- **Phase 0-3**: Architecture & design (no code yet — SRP, MVC, folder layout).
- **Phase 4-7**: Project scaffold, `Grid`, `CanvasRenderer`, drawing headers
  and grid lines with `Constants.ts`.
- **Phase 8-9**: `DataModel` — 50,000 mock records, 500 columns, sparse
  storage, `getCellValue()` / `setCellValue()`.
- **Phase 10-11**: Dependency Injection — `Grid` creates `DataModel` and
  injects it into `CanvasRenderer`; `drawCellContents()` with clipping.
- **Phase 12-14**: `Viewport` — virtualization/windowing math
  (`getFirstVisibleRow()`, etc.), renderer updated to draw only the
  visible rows/columns, scroll-aware coordinates.
- **Phase 15**: `MouseHandler` — converts mouse pixels into
  row/column cell coordinates.
- **Phase 16**: `CellRange` + `SelectionManager` — single-cell
  selection with a translucent blue highlight, wired into `Grid`'s
  mousedown handler.

## What's intentionally NOT implemented yet

The guide is a partial excerpt (project goes to Phase 20). These
remain stubs (`export {}`) since the guide hadn't reached them by
Phase 16:

- Mouse-wheel scrolling (Phase 18)
- Drag-to-select ranges, row/column header selection (later in selection work)
- Cell editing via `<input>` overlay
- Row/column resize
- Undo/redo (Command Pattern) — `Command.ts`, `CommandInvoker.ts`
- Statistics bar (count/sum/avg/min/max) — `StatisticsCalculator.ts`
- Multi-letter column headers (AA, AB, ...) — `ExcelColumnHelper.ts`
- `Cell.ts` / `Row.ts` / `Column.ts` / `CellRenderer.ts` / `HeaderRenderer.ts`
  / `KeyboardHandler.ts` — scaffolded per the Phase 1 folder plan but
  never filled in within this excerpt.

## Running it

```bash
npm install
npm run build      # compiles src/ -> dist/ with tsc
npm run serve       # or just open index.html via any static server
```

Then open the served `index.html` in a browser. Click any cell to
see it highlighted — currently only the first ~20 rows / 10 columns
are visible since there's no scroll wheel handler yet (that's Phase 18).
