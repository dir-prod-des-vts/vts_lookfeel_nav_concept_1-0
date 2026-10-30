import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ExpandedState,
  type GroupingState,
  type PaginationState,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Pin,
  PinOff,
  Settings2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ── Re-export ColumnDef so consumers import from one place ───────────────────
export type { ColumnDef }

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  // Feature flags
  enableRowSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean       // global search input
  enableColumnVisibility?: boolean
  enableColumnPinning?: boolean
  enablePagination?: boolean
  enableRowPinning?: boolean
  enableGrouping?: boolean
  enableExpanding?: boolean
  enableColumnResizing?: boolean
  // Slots
  toolbar?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode
  renderSubRow?: (row: import("@tanstack/react-table").Row<TData>) => React.ReactNode
  // Pagination defaults
  defaultPageSize?: number
  pageSizeOptions?: number[]
  // Styling
  className?: string
  stickyHeader?: boolean
  striped?: boolean
  compact?: boolean
}

// ── Column header with sort controls ─────────────────────────────────────────

export function DataTableColumnHeader<TData>({
  column,
  title,
  className,
}: {
  column: import("@tanstack/react-table").Column<TData>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn("text-sm font-medium", className)}>{title}</div>
  }
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn("-ml-2 h-8 gap-1 font-medium text-foreground", className)}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ArrowUpDown className="size-3.5 text-muted-foreground" />
      )}
    </Button>
  )
}

// ── Column visibility / pin dropdown ─────────────────────────────────────────

function ColumnSettings<TData>({
  table,
  enablePinning,
}: {
  table: ReturnType<typeof useReactTable<TData>>
  enablePinning?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="sm" className="ml-auto h-8 gap-1.5 font-normal" />
      }>
        <Settings2 className="size-3.5" />
        Columns
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {table.getAllLeafColumns()
          .filter(c => c.id !== "__select__" && c.id !== "__expand__")
          .map(col => (
            <React.Fragment key={col.id}>
              <DropdownMenuCheckboxItem
                checked={col.getIsVisible()}
                onCheckedChange={v => col.toggleVisibility(v)}
              >
                <span className="flex items-center gap-2">
                  {col.getIsVisible() ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5 text-muted-foreground" />}
                  {typeof col.columnDef.header === "string"
                    ? col.columnDef.header
                    : col.id}
                </span>
              </DropdownMenuCheckboxItem>
              {enablePinning && (
                <DropdownMenuItem
                  onClick={() =>
                    col.getIsPinned()
                      ? col.pin(false)
                      : col.pin("left")
                  }
                  className="text-xs text-muted-foreground"
                >
                  {col.getIsPinned() ? (
                    <><PinOff className="size-3.5 mr-2" />Unpin</>
                  ) : (
                    <><Pin className="size-3.5 mr-2" />Pin left</>
                  )}
                </DropdownMenuItem>
              )}
              {enablePinning && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Pagination bar ────────────────────────────────────────────────────────────

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: {
  table: ReturnType<typeof useReactTable<TData>>
  pageSizeOptions: number[]
}) {
  const selected = Object.keys(table.getState().rowSelection).length
  const total = table.getFilteredRowModel().rows.length
  return (
    <div className="flex items-center justify-between gap-4 px-2 py-2 border-t">
      <div className="text-sm text-muted-foreground">
        {selected > 0
          ? <>{selected} of {total} row{total !== 1 ? "s" : ""} selected</>
          : <>{total} row{total !== 1 ? "s" : ""}</>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={v => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main DataTable component ──────────────────────────────────────────────────

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  enableRowSelection = false,
  enableSorting = true,
  enableFiltering = false,
  enableColumnVisibility = false,
  enableColumnPinning = false,
  enablePagination = false,
  enableRowPinning = false,
  enableGrouping = false,
  enableExpanding = false,
  enableColumnResizing = false,
  toolbar,
  renderSubRow,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  stickyHeader = false,
  striped = false,
  compact = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({})
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({ top: [], bottom: [] })
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Prepend selection and expand columns when needed
  const allColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const pre: ColumnDef<TData, TValue>[] = []
    if (enableExpanding) {
      pre.push({
        id: "__expand__",
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </Button>
          ) : null,
        size: 36,
        enableSorting: false,
        enableResizing: false,
      } as ColumnDef<TData, TValue>)
    }
    if (enableRowSelection) {
      pre.push({
        id: "__select__",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
            }
            onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
            className="translate-y-[1px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={v => row.toggleSelected(!!v)}
            aria-label="Select row"
            className="translate-y-[1px]"
            onClick={e => e.stopPropagation()}
          />
        ),
        size: 40,
        enableSorting: false,
        enableResizing: false,
      } as ColumnDef<TData, TValue>)
    }
    return [...pre, ...columns]
  }, [columns, enableRowSelection, enableExpanding])

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnOrder,
      columnPinning,
      columnSizing,
      rowSelection,
      rowPinning,
      grouping,
      expanded,
      pagination,
    },
    enableRowSelection,
    enableSorting,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableHiding: true,
    enableColumnPinning,
    enableGrouping,
    enableExpanding,
    enableRowPinning,
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    onRowPinningChange: setRowPinning,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    manualPagination: false,
  })

  const pinnedTop = enableRowPinning ? table.getTopRows() : []
  const pinnedBottom = enableRowPinning ? table.getBottomRows() : []
  const bodyRows = enableRowPinning ? table.getCenterRows() : (enablePagination ? table.getPaginationRowModel().rows : table.getRowModel().rows)

  const cellPx = compact ? "px-2 py-1" : "px-3 py-2"
  const headPx = compact ? "px-2 py-1.5" : "px-3 py-2.5"

  const renderRow = (row: import("@tanstack/react-table").Row<TData>, pinned?: "top" | "bottom") => (
    <React.Fragment key={row.id}>
      <TableRow
        data-state={row.getIsSelected() ? "selected" : undefined}
        className={cn(
          striped && "even:bg-muted/30",
          pinned === "top" && "bg-primary/5 sticky top-[41px] z-10",
          pinned === "bottom" && "bg-primary/5 sticky bottom-0 z-10",
        )}
      >
        {row.getVisibleCells().map(cell => (
          <TableCell
            key={cell.id}
            className={cn(
              cellPx,
              cell.column.getIsPinned() === "left" && "sticky left-0 bg-background z-10 shadow-[1px_0_0_0_hsl(var(--border))]",
              cell.column.getIsPinned() === "right" && "sticky right-0 bg-background z-10 shadow-[-1px_0_0_0_hsl(var(--border))]",
            )}
            style={enableColumnResizing ? { width: cell.column.getSize() } : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      {row.getIsExpanded() && renderSubRow && (
        <TableRow>
          <TableCell colSpan={row.getVisibleCells().length} className="p-0">
            {renderSubRow(row)}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Toolbar row */}
      {(enableFiltering || enableColumnVisibility || toolbar) && (
        <div className="flex items-center gap-2">
          {enableFiltering && (
            <Input
              placeholder="Search…"
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="h-8 max-w-xs text-sm"
            />
          )}
          <div className="ml-auto flex items-center gap-2">
            {toolbar?.(table)}
            {enableColumnVisibility && (
              <ColumnSettings table={table} enablePinning={enableColumnPinning} />
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-20 bg-background")}>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map(header => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      headPx,
                      "text-xs font-medium text-muted-foreground bg-muted/40",
                      header.column.getIsPinned() === "left" && "sticky left-0 bg-muted/60 z-10 shadow-[1px_0_0_0_hsl(var(--border))]",
                      header.column.getIsPinned() === "right" && "sticky right-0 bg-muted/60 z-10 shadow-[-1px_0_0_0_hsl(var(--border))]",
                    )}
                    style={enableColumnResizing ? { width: header.getSize(), position: "relative" } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {enableColumnResizing && header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                          "bg-border opacity-0 hover:opacity-100",
                          header.column.getIsResizing() && "opacity-100 bg-primary",
                        )}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pinnedTop.length > 0 && pinnedTop.map(row => renderRow(row, "top"))}
            {bodyRows.length > 0
              ? bodyRows.map(row => renderRow(row))
              : (
                <TableRow>
                  <TableCell colSpan={allColumns.length} className="h-24 text-center text-muted-foreground text-sm">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            {pinnedBottom.length > 0 && pinnedBottom.map(row => renderRow(row, "bottom"))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  )
}
