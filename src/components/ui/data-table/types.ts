import type { ColumnDef, Row, Table } from "@tanstack/react-table"

export type { ColumnDef, Row, Table }

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  loading?: boolean
  error?: string
  // Row features
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableExpanding?: boolean
  enableRowPinning?: boolean
  enableGrouping?: boolean
  // Column features
  enableColumnVisibility?: boolean
  enableColumnPinning?: boolean
  enableColumnOrdering?: boolean
  enableColumnResizing?: boolean
  enableColumnFilters?: boolean
  // Table features
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  enableFaceting?: boolean
  enableCellSelection?: boolean
  // Pagination
  pageSize?: number
  pageSizeOptions?: number[]
  // Callbacks
  onRowSelectionChange?: (rows: Row<TData>[]) => void
  // Expansion
  getRowCanExpand?: (row: Row<TData>) => boolean
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
  // Misc
  emptyMessage?: string
  toolbar?: (table: Table<TData>) => React.ReactNode
}
