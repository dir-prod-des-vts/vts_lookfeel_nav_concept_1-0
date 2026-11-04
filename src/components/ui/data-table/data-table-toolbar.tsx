import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { DataTableFilters } from "./data-table-filters"
import { DataTableColumnVisibility } from "./data-table-column-visibility"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  enableGlobalFilter?: boolean
  enableColumnVisibility?: boolean
  enableColumnPinning?: boolean
  enableColumnOrdering?: boolean
  searchPlaceholder?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
  enableColumnPinning = false,
  enableColumnOrdering = false,
  searchPlaceholder,
  children,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {enableGlobalFilter && (
          <DataTableFilters table={table} placeholder={searchPlaceholder} />
        )}
        {children}
      </div>
      <div className="flex items-center gap-2">
        {enableColumnVisibility && (
          <DataTableColumnVisibility
            table={table}
            enableColumnPinning={enableColumnPinning}
            enableColumnOrdering={enableColumnOrdering}
          />
        )}
      </div>
    </div>
  )
}
