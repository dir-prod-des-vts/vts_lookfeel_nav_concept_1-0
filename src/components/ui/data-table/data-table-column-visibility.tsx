import type { Table } from "@tanstack/react-table"
import { ArrowLeft, Columns3, PinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DataTableColumnVisibilityProps<TData> {
  table: Table<TData>
  enableColumnPinning?: boolean
  enableColumnOrdering?: boolean
}

export function DataTableColumnVisibility<TData>({
  table,
  enableColumnPinning = false,
  enableColumnOrdering = false,
}: DataTableColumnVisibilityProps<TData>) {
  const hidableColumns = table.getAllColumns().filter((col) => col.getCanHide())
  const allVisible = hidableColumns.every((col) => col.getIsVisible())
  const allHidden = hidableColumns.every((col) => !col.getIsVisible())

  // For ordering: get current column order (excluding internal columns)
  const orderedColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide())

  function moveColumn(colId: string, direction: "left" | "right") {
    const currentOrder = table.getState().columnOrder
    const allIds = table.getAllLeafColumns().map((c) => c.id)
    const workingOrder = currentOrder.length > 0 ? currentOrder : allIds
    const idx = workingOrder.indexOf(colId)
    if (idx === -1) return
    const newOrder = [...workingOrder]
    const swapIdx = direction === "left" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= newOrder.length) return
    ;[newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]]
    table.setColumnOrder(newOrder)
  }

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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Columns</span>
          <div className="flex items-center gap-1">
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => table.toggleAllColumnsVisible(true)}
              disabled={allVisible}
            >
              Show all
            </button>
            <span className="text-muted-foreground/40">·</span>
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => table.toggleAllColumnsVisible(false)}
              disabled={allHidden}
            >
              Hide all
            </button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hidableColumns.map((col) => {
          const label =
            typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : col.id
          const pinned = col.getIsPinned()
          const colIdx = orderedColumns.indexOf(col)
          const isFirst = colIdx === 0
          const isLast = colIdx === orderedColumns.length - 1

          return (
            <div
              key={col.id}
              className="flex items-center justify-between px-1 py-0.5"
            >
              <DropdownMenuCheckboxItem
                checked={col.getIsVisible()}
                onCheckedChange={(value) => col.toggleVisibility(!!value)}
                className="flex-1 min-w-0"
              >
                <span className="truncate">{label}</span>
              </DropdownMenuCheckboxItem>

              {(enableColumnPinning || enableColumnOrdering) && (
                <div className="flex items-center gap-0.5 ml-1 shrink-0">
                  {enableColumnOrdering && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("size-5 text-muted-foreground", isFirst && "opacity-30 pointer-events-none")}
                        onClick={(e) => { e.preventDefault(); moveColumn(col.id, "left") }}
                        aria-label={`Move ${label} left`}
                      >
                        <ArrowLeft className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("size-5 text-muted-foreground", isLast && "opacity-30 pointer-events-none")}
                        onClick={(e) => { e.preventDefault(); moveColumn(col.id, "right") }}
                        aria-label={`Move ${label} right`}
                      >
                        <ArrowLeft className="size-3 rotate-180" />
                      </Button>
                    </>
                  )}
                  {enableColumnPinning && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("size-5", pinned === "left" ? "text-primary" : "text-muted-foreground")}
                        onClick={(e) => { e.preventDefault(); col.pin(pinned === "left" ? false : "left") }}
                        aria-label={`Pin ${label} left`}
                      >
                        <ArrowLeft className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("size-5", pinned === "right" ? "text-primary" : "text-muted-foreground")}
                        onClick={(e) => { e.preventDefault(); col.pin(pinned === "right" ? false : "right") }}
                        aria-label={`Pin ${label} right`}
                      >
                        <ArrowLeft className="size-3 rotate-180" />
                      </Button>
                      {pinned && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-5 text-muted-foreground"
                          onClick={(e) => { e.preventDefault(); col.pin(false) }}
                          aria-label={`Unpin ${label}`}
                        >
                          <PinOff className="size-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {enableColumnPinning && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => table.resetColumnPinning()}>
              <PinOff className="size-3.5" />
              Unpin all
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
