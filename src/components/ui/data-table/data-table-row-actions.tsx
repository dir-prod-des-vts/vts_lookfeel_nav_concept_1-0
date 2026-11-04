import * as React from "react"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface RowAction<TData> {
  label: string
  onClick: (row: Row<TData>) => void
  variant?: "default" | "destructive"
  separator?: boolean
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: RowAction<TData>[]
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-7 data-[state=open]:bg-muted"
            aria-label="Row actions"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((action, i) => (
          <React.Fragment key={i}>
            {action.separator && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant={action.variant === "destructive" ? "destructive" : "default"}
              onClick={() => action.onClick(row)}
            >
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
