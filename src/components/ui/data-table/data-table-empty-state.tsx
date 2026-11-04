import { SearchX } from "lucide-react"

interface DataTableEmptyStateProps {
  message?: string
  isFiltered?: boolean
}

export function DataTableEmptyState({
  message,
  isFiltered,
}: DataTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <SearchX className="size-8 text-muted-foreground/50" />
      <p className="text-sm font-medium text-foreground">
        {message ?? (isFiltered ? "No results match your filters" : "No data")}
      </p>
      {isFiltered && (
        <p className="text-xs text-muted-foreground">
          Try adjusting your search or clearing filters
        </p>
      )}
    </div>
  )
}
