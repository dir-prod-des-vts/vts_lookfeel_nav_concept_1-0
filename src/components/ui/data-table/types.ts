import type { ColumnDef, Row, SortingState, Table } from "@tanstack/react-table"

export type { ColumnDef, Row, SortingState, Table }

/** Column IDs that must always remain at the leftmost positions, regardless of reordering. */
export const FIXED_LEFT_COLUMN_IDS = ["__select__", "__expand__"] as const

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
  // Sorting
  initialSorting?: SortingState
  // Pagination
  pageSize?: number
  pageSizeOptions?: number[]
  // Callbacks
  onRowSelectionChange?: (rows: Row<TData>[]) => void
  /** Makes rows open something on click or Enter. Clicks on buttons and links inside the row are ignored. */
  onRowClick?: (row: TData) => void
  /** Limits which rows are clickable when onRowClick is set. Defaults to all rows. */
  isRowClickable?: (row: TData) => boolean
  /** Accessible name for a clickable row, e.g. "Open Amazon deal at Willis Tower". */
  getRowLabel?: (row: TData) => string
  // Expansion
  getRowCanExpand?: (row: Row<TData>) => boolean
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
  // Misc
  emptyMessage?: string
  toolbar?: (table: Table<TData>) => React.ReactNode
}
