import type { ColumnDef, Row, Table } from "@tanstack/react-table"

export type { ColumnDef, Row, Table }

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  loading?: boolean
  error?: string
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  enableColumnFilters?: boolean
  enableExpanding?: boolean
  enableColumnResizing?: boolean
  enableColumnPinning?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  onRowSelectionChange?: (rows: Row<TData>[]) => void
  getRowCanExpand?: (row: Row<TData>) => boolean
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
  emptyMessage?: string
  toolbar?: (table: Table<TData>) => React.ReactNode
}
