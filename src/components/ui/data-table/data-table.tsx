import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ExpandedState,
  type GroupingState,
  type Row,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Pin, PinOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableEmptyState } from "./data-table-empty-state"
import { DataTableLoadingState } from "./data-table-loading-state"
import { FIXED_LEFT_COLUMN_IDS } from "./types"
import type { DataTableProps } from "./types"

function getPinStyles(
  isPinned: false | "left" | "right",
  left: number,
  right: number
): React.CSSProperties | undefined {
  if (!isPinned) return undefined
  return isPinned === "left" ? { left } : { right }
}

type CellKey = string // `${rowId}:${colId}`

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  error,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enablePagination = true,
  enableSorting = true,
  enableColumnFilters = true,
  enableExpanding = false,
  enableColumnResizing = false,
  enableColumnPinning = false,
  enableColumnOrdering = false,
  enableRowPinning = false,
  enableGrouping = false,
  enableFaceting = false,
  enableCellSelection = false,
  initialSorting = [],
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  onRowSelectionChange,
  getRowCanExpand,
  renderSubComponent,
  emptyMessage,
  toolbar,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({ top: [], bottom: [] })
  const [selectedCells, setSelectedCells] = React.useState<Set<CellKey>>(new Set())
  const [lastSelectedCell, setLastSelectedCell] = React.useState<{ rowIdx: number; colIdx: number } | null>(null)

  const selectionColumn: ColumnDef<TData, unknown> = {
    id: "__select__",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 36,
  }

  const expandColumn: ColumnDef<TData, unknown> = {
    id: "__expand__",
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={(e) => {
            e.stopPropagation()
            row.toggleExpanded()
          }}
          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </Button>
      ) : null,
    enableSorting: false,
    enableHiding: false,
    size: 36,
  }

  const allColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    const cols: ColumnDef<TData, unknown>[] = []
    if (enableRowSelection) cols.push(selectionColumn)
    if (enableExpanding) cols.push(expandColumn)
    return [...cols, ...columns]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, enableRowSelection, enableExpanding])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useReactTable<TData>({
    data,
    columns: allColumns as ColumnDef<TData, any>[],
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
      columnOrder,
      grouping,
      rowPinning,
    },
    enableRowSelection,
    enableMultiRowSelection,
    enableSorting,
    enableColumnFilters,
    enableColumnResizing,
    enableColumnPinning,
    enableGrouping,
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    getRowCanExpand: getRowCanExpand as ((row: Row<TData>) => boolean) | undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater)
      if (onRowSelectionChange) {
        const next =
          typeof updater === "function" ? updater(rowSelection) : updater
        const selectedRows = Object.keys(next)
          .filter((k) => next[k])
          .map((k) => table.getRowModel().rowsById[k])
          .filter(Boolean) as Row<TData>[]
        onRowSelectionChange(selectedRows)
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    onColumnOrderChange: (updater) => {
      setColumnOrder((old) => {
        const next = typeof updater === "function" ? updater(old) : updater
        const fixed = next.filter((id) => (FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(id))
        const rest = next.filter((id) => !(FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(id))
        return [...fixed, ...rest]
      })
    },
    onGroupingChange: setGrouping,
    onRowPinningChange: setRowPinning,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(enableGrouping ? { getGroupedRowModel: getGroupedRowModel() } : {}),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    ...(enableFaceting && !enableGrouping
      ? {
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }
      : {}),
    initialState: {
      pagination: { pageSize: initialPageSize },
    },
  })

  const isFiltered =
    table.getState().columnFilters.length > 0 || !!globalFilter

  // Cell selection helpers
  function handleCellClick(
    e: React.MouseEvent,
    rowIdx: number,
    colIdx: number,
    cellKey: CellKey
  ) {
    if (!enableCellSelection) return
    if (e.shiftKey && lastSelectedCell) {
      // Range selection
      const minRow = Math.min(lastSelectedCell.rowIdx, rowIdx)
      const maxRow = Math.max(lastSelectedCell.rowIdx, rowIdx)
      const minCol = Math.min(lastSelectedCell.colIdx, colIdx)
      const maxCol = Math.max(lastSelectedCell.colIdx, colIdx)
      const rows = table.getRowModel().rows
      const newSelected = new Set<CellKey>()
      for (let r = minRow; r <= maxRow; r++) {
        const row = rows[r]
        if (!row) continue
        const cells = row.getVisibleCells()
        for (let c = minCol; c <= maxCol; c++) {
          const cell = cells[c]
          if (cell) newSelected.add(`${row.id}:${cell.column.id}`)
        }
      }
      setSelectedCells(newSelected)
    } else {
      setSelectedCells(new Set([cellKey]))
      setLastSelectedCell({ rowIdx, colIdx })
    }
  }

  // Row render helpers for pinning
  function renderRows(rows: Row<TData>[], extraClass?: string) {
    return rows.map((row, i) => (
      <React.Fragment key={row.id}>
        <TableRow
          data-state={row.getIsSelected() ? "selected" : undefined}
          className={cn(
            "transition-colors",
            i > 0 || extraClass ? "border-t border-border/40" : "border-0",
            row.getIsSelected() && "bg-primary/5",
            extraClass,
          )}
        >
          {row.getVisibleCells().map((cell, cIdx) => {
            const pinned = cell.column.getIsPinned()
            const pinStyle = getPinStyles(
              pinned,
              cell.column.getStart("left"),
              cell.column.getAfter("right")
            )
            const cellKey: CellKey = `${row.id}:${cell.column.id}`
            const isCellSelected = enableCellSelection && selectedCells.has(cellKey)

            // Cell spanning via column meta
            const colSpan = (cell.column.columnDef.meta as { colSpan?: (row: Row<TData>) => number } | undefined)?.colSpan?.(row)

            return (
              <TableCell
                key={cell.id}
                colSpan={colSpan}
                style={{
                  ...(enableColumnResizing ? { width: cell.column.getSize() } : {}),
                  ...pinStyle,
                }}
                onClick={(e) => handleCellClick(e, i, cIdx, cellKey)}
                className={cn(
                  "px-3 py-2.5 text-sm",
                  cell.column.id === "__select__" && "px-2",
                  cell.column.id === "__expand__" && "px-2",
                  pinned && "sticky z-10 bg-card",
                  pinned === "left" && "border-r-2 border-primary/40",
                  pinned === "right" && "border-l-2 border-primary/40",
                  isCellSelected && "bg-primary/10",
                  enableCellSelection && "cursor-pointer select-none",
                  // Grouped rows
                  cell.getIsGrouped() && "font-medium",
                  cell.getIsAggregated() && "text-muted-foreground text-xs",
                  cell.getIsPlaceholder() && "opacity-0",
                )}
              >
                {cell.getIsGrouped() ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto gap-1 px-0 py-0 font-medium hover:bg-transparent"
                    onClick={(e) => { e.stopPropagation(); row.toggleExpanded() }}
                  >
                    {row.getIsExpanded() ? (
                      <ChevronDown className="size-3.5" />
                    ) : (
                      <ChevronRight className="size-3.5" />
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({row.subRows.length})
                    </span>
                  </Button>
                ) : cell.getIsAggregated() ? (
                  flexRender(
                    cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                    cell.getContext()
                  )
                ) : cell.getIsPlaceholder() ? null : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </TableCell>
            )
          })}
          {enableRowPinning && (
            <TableCell className="px-2 py-2.5 w-9">
              {row.getIsPinned() ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground"
                  onClick={() => row.pin(false)}
                  aria-label="Unpin row"
                >
                  <PinOff className="size-3.5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => row.pin("top")}
                  aria-label="Pin row to top"
                >
                  <Pin className="size-3.5" />
                </Button>
              )}
            </TableCell>
          )}
        </TableRow>
        {row.getIsExpanded() && renderSubComponent && !row.getIsGrouped() && (
          <TableRow className="border-t border-border/40 bg-muted/30 hover:bg-muted/30">
            <TableCell
              colSpan={row.getVisibleCells().length + (enableRowPinning ? 1 : 0)}
              className="px-6 py-3"
            >
              {renderSubComponent({ row })}
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ))
  }

  const topRows = enableRowPinning ? (table.getTopRows() as Row<TData>[]) : ([] as Row<TData>[])
  const bottomRows = enableRowPinning ? (table.getBottomRows() as Row<TData>[]) : ([] as Row<TData>[])
  const centerRows = enableRowPinning
    ? (table.getCenterRows() as Row<TData>[])
    : (table.getRowModel().rows as Row<TData>[])

  const totalColSpan = allColumns.length + (enableRowPinning ? 1 : 0)

  return (
    <div className="flex flex-col gap-3">
      {(enableGlobalFilter || enableColumnVisibility || toolbar) && (
        <DataTableToolbar
          table={table}
          enableGlobalFilter={enableGlobalFilter}
          enableColumnVisibility={enableColumnVisibility}
          enableColumnPinning={enableColumnPinning}
          enableColumnOrdering={enableColumnOrdering}
        >
          {toolbar?.(table as import("@tanstack/react-table").Table<TData>)}
        </DataTableToolbar>
      )}

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  <TableRow className="border-b border-border/60 hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      const pinned = header.column.getIsPinned()
                      const pinStyle = getPinStyles(
                        pinned,
                        header.column.getStart("left"),
                        header.column.getAfter("right")
                      )
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...(enableColumnResizing ? { width: header.getSize() } : {}),
                            ...pinStyle,
                          }}
                          className={cn(
                            "relative h-10 px-3 text-xs font-medium text-muted-foreground",
                            header.column.id === "__select__" && "w-9 px-2",
                            header.column.id === "__expand__" && "w-9 px-2",
                            pinned && "sticky z-10 bg-card",
                            pinned === "left" && "border-r-2 border-primary/40",
                            pinned === "right" && "border-l-2 border-primary/40",
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {enableColumnResizing && header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={cn(
                                "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none opacity-0 hover:opacity-100 bg-border",
                                header.column.getIsResizing() && "opacity-100 bg-primary"
                              )}
                            />
                          )}
                        </TableHead>
                      )
                    })}
                    {enableRowPinning && <TableHead className="w-9" />}
                  </TableRow>
                  {/* Per-column filter row */}
                  {enableColumnFilters && (
                    <TableRow className="border-b border-border/40 hover:bg-transparent">
                      {headerGroup.headers.map((header) => {
                        const canFilter = header.column.getCanFilter()
                        const facets = (() => {
                          if (!enableFaceting) return undefined
                          try {
                            const f = header.column.getFacetedUniqueValues?.()
                            return f instanceof Map ? f : undefined
                          } catch {
                            return undefined
                          }
                        })()
                        return (
                          <TableHead
                            key={`filter-${header.id}`}
                            className="px-2 py-1 h-9"
                          >
                            {canFilter && !header.isPlaceholder && (
                              header.column.id === "__select__" || header.column.id === "__expand__" ? null :
                              <ColumnFilter column={header.column} facets={facets} />
                            )}
                          </TableHead>
                        )
                      })}
                      {enableRowPinning && <TableHead className="w-9" />}
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={totalColSpan} className="p-0">
                    <DataTableLoadingState
                      columns={totalColSpan}
                      rows={initialPageSize > 8 ? 8 : initialPageSize}
                    />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell
                    colSpan={totalColSpan}
                    className="py-16 text-center text-sm text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : centerRows.length === 0 && topRows.length === 0 ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={totalColSpan} className="p-0">
                    <DataTableEmptyState
                      message={emptyMessage}
                      isFiltered={isFiltered}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {topRows.length > 0 && (
                    <>
                      {renderRows(topRows, "bg-primary/5 sticky top-0 z-[1]")}
                      <TableRow className="border-t border-border/60 hover:bg-transparent">
                        <TableCell colSpan={totalColSpan} className="py-0 h-0 p-0" />
                      </TableRow>
                    </>
                  )}
                  {renderRows(centerRows)}
                  {bottomRows.length > 0 && (
                    <>
                      <TableRow className="border-t border-border/60 hover:bg-transparent">
                        <TableCell colSpan={totalColSpan} className="py-0 h-0 p-0" />
                      </TableRow>
                      {renderRows(bottomRows, "bg-muted/40 sticky bottom-0 z-[1]")}
                    </>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  )
}

// Per-column filter input with optional facet hints
function ColumnFilter<TData>({
  column,
  facets,
}: {
  column: import("@tanstack/react-table").Column<TData, unknown>
  facets?: Map<unknown, number>
}) {
  const value = (column.getFilterValue() as string) ?? ""
  const sortedFacets = React.useMemo(() => {
    if (!facets || facets.size === 0) return []
    return Array.from(facets.entries())
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 8)
  }, [facets])

  if (facets && facets.size <= 10 && facets.size > 0) {
    // Show a select-style filter for low-cardinality columns
    return (
      <Select
        value={value || "__all__"}
        onValueChange={(val) => column.setFilterValue(val === "__all__" ? undefined : val)}
      >
        <SelectTrigger className="h-7 w-full text-xs" aria-label={`Filter by ${column.id}`}>
          <SelectValue>
            {!value ? "All" : value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">
            All {sortedFacets.length > 0 ? `(${facets.size})` : ""}
          </SelectItem>
          {sortedFacets.map(([v, count]) => (
            <SelectItem key={String(v)} value={String(v)}>
              {String(v)} ({count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      placeholder="Filter..."
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      className="h-7 text-xs"
      aria-label={`Filter by ${column.id}`}
    />
  )
}
