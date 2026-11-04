import type { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

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
      <InputGroup className="w-48">
        <InputGroupAddon align="inline-start">
          <Search className="size-3.5" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={placeholder}
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="text-sm"
        />
      </InputGroup>
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
