import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { FIXED_LEFT_COLUMN_IDS } from "./types"
import { AlignStartVertical, AlignEndVertical, Columns3, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  const dragOverId = React.useRef<string | null>(null)
  const [dragOver, setDragOver] = React.useState<string | null>(null)

  // Get columns in current table order (getAllLeafColumns respects columnOrder state)
  const hidableColumns = table.getAllLeafColumns().filter((col) => col.getCanHide())
  const allVisible = hidableColumns.every((col) => col.getIsVisible())
  const allHidden = hidableColumns.every((col) => !col.getIsVisible())
  const anyPinned = enableColumnPinning && hidableColumns.some((col) => col.getIsPinned())

  function handleDragStart(e: React.DragEvent, colId: string) {
    e.dataTransfer.setData("text/plain", colId)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleDragOver(e: React.DragEvent, colId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverId.current !== colId) {
      dragOverId.current = colId
      setDragOver(colId)
    }
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData("text/plain")
    if (!sourceId || sourceId === targetId) return

    const pinned = table.getState().columnPinning
    const reorderableIds = table
      .getAllLeafColumns()
      .filter((c) => !c.getIsPinned() && !(FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(c.id))
      .map((c) => c.id)

    const fromIdx = reorderableIds.indexOf(sourceId)
    const toIdx = reorderableIds.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return

    const newIds = [...reorderableIds]
    newIds.splice(fromIdx, 1)
    // After removing fromIdx, indices after it shift left by 1
    const insertAt = toIdx > fromIdx ? toIdx - 1 : toIdx
    newIds.splice(insertAt, 0, sourceId)

    const fixedIds = table.getAllLeafColumns()
      .filter((c) => (FIXED_LEFT_COLUMN_IDS as readonly string[]).includes(c.id))
      .map((c) => c.id)

    table.setColumnOrder([
      ...fixedIds,
      ...(pinned.left ?? []),
      ...newIds,
      ...(pinned.right ?? []),
    ])
    setDragOver(null)
    dragOverId.current = null
  }

  function handleDragEnd() {
    setDragOver(null)
    dragOverId.current = null
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
        <div className="flex items-center justify-between px-1 pt-1 pb-0">
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <div className="flex items-center gap-0.5 pr-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto px-1.5 py-0.5 text-xs",
                allVisible ? "text-muted-foreground/40" : "text-muted-foreground"
              )}
              onClick={() => table.toggleAllColumnsVisible(true)}
              disabled={allVisible}
            >
              Show all
            </Button>
            <span className="text-muted-foreground/30 text-xs select-none">·</span>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto px-1.5 py-0.5 text-xs",
                allHidden ? "text-muted-foreground/40" : "text-muted-foreground"
              )}
              onClick={() => table.toggleAllColumnsVisible(false)}
              disabled={allHidden}
            >
              Hide all
            </Button>
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
              const isDragTarget = dragOver === col.id

              return (
                <div
                  key={col.id}
                  draggable={enableColumnOrdering}
                  onDragStart={(e) => handleDragStart(e, col.id)}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={() => { dragOverId.current = null; setDragOver(null) }}
                  onDrop={(e) => handleDrop(e, col.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-2 px-2 mx-1 rounded-md py-1 select-none transition-colors",
                    "hover:bg-accent",
                    pinned && "bg-primary/5",
                    isDragTarget && "border-t-2 border-primary"
                  )}
                >
                  {/* Drag handle */}
                  {enableColumnOrdering && (
                    <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30 cursor-grab active:cursor-grabbing" />
                  )}

                  {/* Visibility checkbox */}
                  <Checkbox
                    checked={isVisible}
                    onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
                    className="size-4 shrink-0"
                  />

                  {/* Label */}
                  <span
                    className={cn(
                      "flex-1 min-w-0 truncate text-sm transition-colors cursor-pointer",
                      isVisible ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => col.toggleVisibility(!isVisible)}
                  >
                    {label}
                  </span>

                  {/* Pin controls — always visible */}
                  {enableColumnPinning && (
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "size-5",
                          pinned === "left"
                            ? "text-primary bg-primary/10 hover:bg-primary/20"
                            : "text-muted-foreground/40 hover:text-foreground"
                        )}
                        onClick={(e) => { e.stopPropagation(); col.pin(pinned === "left" ? false : "left") }}
                        title={pinned === "left" ? "Unpin" : "Pin left"}
                      >
                        <AlignStartVertical className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "size-5",
                          pinned === "right"
                            ? "text-primary bg-primary/10 hover:bg-primary/20"
                            : "text-muted-foreground/40 hover:text-foreground"
                        )}
                        onClick={(e) => { e.stopPropagation(); col.pin(pinned === "right" ? false : "right") }}
                        title={pinned === "right" ? "Unpin" : "Pin right"}
                      >
                        <AlignEndVertical className="size-3" />
                      </Button>
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
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => table.resetColumnPinning()}
              >
                Unpin all columns
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
