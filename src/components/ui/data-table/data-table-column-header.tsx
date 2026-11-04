import type { Column, Table } from "@tanstack/react-table"
import { FIXED_LEFT_COLUMN_IDS } from "./types"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EyeOff,
  AlignStartVertical,
  AlignEndVertical,
  Pin,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  table?: Table<TData>
  title: string
  className?: string
  enableColumnPinning?: boolean
  enableColumnOrdering?: boolean
}

function moveColumn<TData>(table: Table<TData>, columnId: string, direction: "left" | "right" | "first" | "last") {
  const pinned = table.getState().columnPinning
  const cols = table.getAllLeafColumns().filter(
    (c) => !c.getIsPinned() && !(FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(c.id)
  )
  const ids = cols.map((c) => c.id)
  const idx = ids.indexOf(columnId)
  if (idx === -1) return
  const newIds = [...ids]
  newIds.splice(idx, 1)
  if (direction === "first") newIds.unshift(columnId)
  else if (direction === "last") newIds.push(columnId)
  else if (direction === "left" && idx > 0) newIds.splice(idx - 1, 0, columnId)
  else if (direction === "right" && idx < ids.length - 1) newIds.splice(idx + 1, 0, columnId)
  else return
  const fixedIds = table.getAllLeafColumns()
    .filter((c) => (FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(c.id))
    .map((c) => c.id)
  table.setColumnOrder([
    ...fixedIds,
    ...(pinned.left ?? []),
    ...newIds,
    ...(pinned.right ?? []),
  ])
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  table,
  title,
  className,
  enableColumnPinning = false,
  enableColumnOrdering = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-sm font-medium", className)}>{title}</div>
  }

  const pinned = column.getIsPinned()

  const unpinnedCols = table?.getAllLeafColumns().filter(
    (c) => !c.getIsPinned() && !(FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(c.id)
  ) ?? []
  const unpinnedIds = unpinnedCols.map((c) => c.id)
  const colIdx = unpinnedIds.indexOf(column.id)
  const isFirst = colIdx === 0
  const isLast = colIdx === unpinnedIds.length - 1

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-7 gap-1 px-2 text-sm font-medium data-[state=open]:bg-accent"
            />
          }
        >
          {title}
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="size-3.5 text-muted-foreground" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="size-3.5 text-muted-foreground" />
          ) : (
            <ArrowUpDown className="size-3.5 text-muted-foreground" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="size-3.5 text-muted-foreground" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="size-3.5 text-muted-foreground" />
            Desc
          </DropdownMenuItem>

          {enableColumnPinning && (
            <>
              <DropdownMenuSeparator />
              {pinned ? (
                <DropdownMenuItem onClick={() => column.pin(false)}>
                  <Pin className="size-3.5 text-muted-foreground" />
                  Unpin
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => column.pin("left")}>
                    <AlignStartVertical className="size-3.5 text-muted-foreground" />
                    Pin left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => column.pin("right")}>
                    <AlignEndVertical className="size-3.5 text-muted-foreground" />
                    Pin right
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          {enableColumnOrdering && table && !pinned && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isFirst}
                onClick={() => moveColumn(table, column.id, "first")}
              >
                <ChevronsLeft className="size-3.5 text-muted-foreground" />
                Move to start
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isFirst}
                onClick={() => moveColumn(table, column.id, "left")}
              >
                <ChevronLeft className="size-3.5 text-muted-foreground" />
                Move left
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLast}
                onClick={() => moveColumn(table, column.id, "right")}
              >
                <ChevronRight className="size-3.5 text-muted-foreground" />
                Move right
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLast}
                onClick={() => moveColumn(table, column.id, "last")}
              >
                <ChevronsRight className="size-3.5 text-muted-foreground" />
                Move to end
              </DropdownMenuItem>
            </>
          )}

          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="size-3.5 text-muted-foreground" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
