import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { DataTableFilters } from "./data-table-filters"
import { DataTableColumnVisibility } from "./data-table-column-visibility"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  enableGlobalFilter?: boolean
  enableColumnVisibility?: boolean
  searchPlaceholder?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
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
      {enableColumnVisibility && <DataTableColumnVisibility table={table} />}
    </div>
  )
}
