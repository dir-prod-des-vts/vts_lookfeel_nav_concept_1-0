import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { AlignStartVertical, AlignEndVertical, Columns3, Check, GripVertical } from "lucide-react"
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

    const FIXED = ["__select__", "__expand__"]
    const pinned = table.getState().columnPinning
    const reorderableIds = table
      .getAllLeafColumns()
      .filter((c) => !c.getIsPinned() && !FIXED.includes(c.id))
      .map((c) => c.id)

    const fromIdx = reorderableIds.indexOf(sourceId)
    const toIdx = reorderableIds.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return

    const newIds = [...reorderableIds]
    newIds.splice(fromIdx, 1)
    newIds.splice(toIdx, 0, sourceId)

    const fixedIds = table.getAllLeafColumns()
      .filter((c) => FIXED.includes(c.id))
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
              const isDragTarget = dragOver === col.id

              return (
                <div
                  key={col.id}
                  draggable={enableColumnOrdering}
                  onDragStart={(e) => handleDragStart(e, col.id)}
                  onDragOver={(e) => handleDragOver(e, col.id)}
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
                      <button
                        onClick={(e) => { e.stopPropagation(); col.pin(pinned === "left" ? false : "left") }}
                        title={pinned === "left" ? "Unpin" : "Pin left"}
                        className={cn(
                          "size-5 flex items-center justify-center rounded transition-colors",
                          pinned === "left"
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
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
                            : "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
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
