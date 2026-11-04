import type { Table } from "@tanstack/react-table"
import { AlignStartVertical, AlignEndVertical, ArrowLeft, Columns3, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  const anyPinned = enableColumnPinning && hidableColumns.some((col) => col.getIsPinned())

  const orderedColumns = table.getAllColumns().filter((col) => col.getCanHide())

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

      <DropdownMenuContent align="end" className="w-64 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <span className="text-sm font-medium text-foreground">Columns</span>
          <div className="flex items-center gap-0.5">
            <button
              className={cn(
                "px-1.5 py-0.5 rounded text-xs transition-colors",
                allVisible
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => table.toggleAllColumnsVisible(true)}
              disabled={allVisible}
            >
              Show all
            </button>
            <span className="text-muted-foreground/30 text-xs select-none">·</span>
            <button
              className={cn(
                "px-1.5 py-0.5 rounded text-xs transition-colors",
                allHidden
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => table.toggleAllColumnsVisible(false)}
              disabled={allHidden}
            >
              Hide all
            </button>
          </div>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        {/* Column list */}
        <DropdownMenuGroup>
          <div className="max-h-72 overflow-y-auto py-1.5">
            {hidableColumns.map((col) => {
              const label =
                typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
              const isVisible = col.getIsVisible()
              const pinned = col.getIsPinned()
              const colIdx = orderedColumns.indexOf(col)
              const isFirst = colIdx === 0
              const isLast = colIdx === orderedColumns.length - 1

              return (
                <div
                  key={col.id}
                  className={cn(
                    "group flex items-center gap-2 px-2 mx-1 rounded-md py-1 cursor-pointer select-none transition-colors",
                    "hover:bg-accent",
                    pinned && "bg-primary/5"
                  )}
                >
                  {/* Visibility checkbox */}
                  <button
                    onClick={() => col.toggleVisibility(!isVisible)}
                    className={cn(
                      "size-4 shrink-0 rounded border flex items-center justify-center transition-colors",
                      isVisible
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border bg-background"
                    )}
                  >
                    {isVisible && <Check className="size-2.5 stroke-[3]" />}
                  </button>

                  {/* Label */}
                  <span
                    className={cn(
                      "flex-1 min-w-0 truncate text-sm transition-colors",
                      isVisible ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => col.toggleVisibility(!isVisible)}
                  >
                    {label}
                  </span>

                  {/* Ordering controls */}
                  {enableColumnOrdering && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveColumn(col.id, "left") }}
                        disabled={isFirst}
                        className={cn(
                          "size-5 flex items-center justify-center rounded transition-colors",
                          isFirst
                            ? "text-muted-foreground/25 cursor-not-allowed"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        aria-label={`Move ${label} left`}
                      >
                        <ArrowLeft className="size-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveColumn(col.id, "right") }}
                        disabled={isLast}
                        className={cn(
                          "size-5 flex items-center justify-center rounded transition-colors",
                          isLast
                            ? "text-muted-foreground/25 cursor-not-allowed"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        aria-label={`Move ${label} right`}
                      >
                        <ArrowLeft className="size-3 rotate-180" />
                      </button>
                    </div>
                  )}

                  {/* Pin controls */}
                  {enableColumnPinning && (
                    <div className={cn(
                      "flex items-center gap-0.5 transition-opacity",
                      !pinned && "opacity-0 group-hover:opacity-100"
                    )}>
                      <button
                        onClick={(e) => { e.stopPropagation(); col.pin(pinned === "left" ? false : "left") }}
                        title={pinned === "left" ? "Unpin" : "Pin left"}
                        className={cn(
                          "size-5 flex items-center justify-center rounded transition-colors",
                          pinned === "left"
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <AlignStartVertical className="size-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); col.pin(pinned === "right" ? false : "right") }}
                        title={pinned === "right" ? "Unpin" : "Pin right"}
                        className={cn(
                          "size-5 flex items-center justify-center rounded transition-colors",
                          pinned === "right"
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <AlignEndVertical className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DropdownMenuGroup>

        {/* Footer actions */}
        {anyPinned && (
          <>
            <DropdownMenuSeparator className="mx-0 my-0" />
            <div className="px-2 py-1.5">
              <button
                onClick={() => table.resetColumnPinning()}
                className="w-full text-left px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Unpin all columns
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
