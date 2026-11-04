import type { Table } from "@tanstack/react-table"
import { Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnPinningProps<TData> {
  table: Table<TData>
}

export function DataTableColumnPinning<TData>({
  table,
}: DataTableColumnPinningProps<TData>) {
  const pinnableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanPin())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium" />
        }
      >
        <Pin className="size-3.5" />
        Pin columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Pin columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pinnableColumns.map((col) => {
          const pinned = col.getIsPinned()
          const label =
            typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : col.id

          return (
            <DropdownMenuItem
              key={col.id}
              className="flex items-center justify-between gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <span className="truncate max-w-24">{label}</span>
              <div className="flex items-center gap-0.5">
                <Button
                  variant={pinned === "left" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-1.5 text-xs"
                  onClick={() => col.pin(pinned === "left" ? false : "left")}
                  aria-label={`Pin ${label} left`}
                >
                  Left
                </Button>
                <Button
                  variant={pinned === "right" ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-1.5 text-xs"
                  onClick={() => col.pin(pinned === "right" ? false : "right")}
                  aria-label={`Pin ${label} right`}
                >
                  Right
                </Button>
              </div>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => table.resetColumnPinning()}>
          Unpin all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
