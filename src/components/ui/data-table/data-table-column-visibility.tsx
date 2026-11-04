import type { Table } from "@tanstack/react-table"
import { Columns3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>
}

export function DataTableColumnVisibility<TData>({
  table,
}: DataTableColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium" />
        }
      >
        <Columns3 className="size-3.5" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {typeof col.columnDef.header === "string"
                ? col.columnDef.header
                : col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
