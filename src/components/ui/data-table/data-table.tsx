import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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
import type { DataTableProps } from "./types"

function getPinStyles(
  isPinned: false | "left" | "right",
  left: number,
  right: number
): React.CSSProperties | undefined {
  if (!isPinned) return undefined
  return isPinned === "left" ? { left } : { right }
}

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
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  onRowSelectionChange,
  getRowCanExpand,
  renderSubComponent,
  emptyMessage,
  toolbar,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

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

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
    },
    enableRowSelection,
    enableMultiRowSelection,
    enableSorting,
    enableColumnFilters,
    enableColumnResizing,
    enableColumnPinning,
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    getRowCanExpand,
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
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(enablePagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    initialState: {
      pagination: { pageSize: initialPageSize },
    },
  })

  const isFiltered =
    table.getState().columnFilters.length > 0 || !!globalFilter

  return (
    <div className="flex flex-col gap-3">
      {(enableGlobalFilter || enableColumnVisibility || enableColumnPinning || toolbar) && (
        <DataTableToolbar
          table={table}
          enableGlobalFilter={enableGlobalFilter}
          enableColumnVisibility={enableColumnVisibility}
          enableColumnPinning={enableColumnPinning}
        >
          {toolbar?.(table)}
        </DataTableToolbar>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/60 hover:bg-transparent"
                >
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
                        pinned === "left" && "shadow-[1px_0_0_0_hsl(var(--border))]",
                        pinned === "right" && "shadow-[-1px_0_0_0_hsl(var(--border))]",
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
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={allColumns.length} className="p-0">
                    <DataTableLoadingState
                      columns={allColumns.length}
                      rows={initialPageSize > 8 ? 8 : initialPageSize}
                    />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell
                    colSpan={allColumns.length}
                    className="py-16 text-center text-sm text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={allColumns.length} className="p-0">
                    <DataTableEmptyState
                      message={emptyMessage}
                      isFiltered={isFiltered}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      className={cn(
                        "transition-colors",
                        i > 0 ? "border-t border-border/40" : "border-0",
                        row.getIsSelected() && "bg-primary/5"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const pinned = cell.column.getIsPinned()
                        const pinStyle = getPinStyles(
                          pinned,
                          cell.column.getStart("left"),
                          cell.column.getAfter("right")
                        )
                        return (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...(enableColumnResizing ? { width: cell.column.getSize() } : {}),
                            ...pinStyle,
                          }}
                          className={cn(
                            "px-3 py-2.5 text-sm",
                            cell.column.id === "__select__" && "px-2",
                            cell.column.id === "__expand__" && "px-2",
                            pinned && "sticky z-10 bg-card",
                            pinned === "left" && "shadow-[1px_0_0_0_hsl(var(--border))]",
                            pinned === "right" && "shadow-[-1px_0_0_0_hsl(var(--border))]",
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                        )
                      })}
                    </TableRow>
                    {row.getIsExpanded() && renderSubComponent && (
                      <TableRow className="border-t border-border/40 bg-muted/30 hover:bg-muted/30">
                        <TableCell
                          colSpan={row.getVisibleCells().length}
                          className="px-6 py-3"
                        >
                          {renderSubComponent({ row })}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
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
