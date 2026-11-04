import type { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableFiltersProps<TData> {
  table: Table<TData>
  placeholder?: string
}

export function DataTableFilters<TData>({
  table,
  placeholder = "Search...",
}: DataTableFiltersProps<TData>) {
  const globalFilter = table.getState().globalFilter as string | undefined
  const isFiltered =
    table.getState().columnFilters.length > 0 || !!globalFilter

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-8 w-48 pl-8 text-sm"
        />
      </div>
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-sm font-medium text-muted-foreground"
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter("")
          }}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
