import { SearchX } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface DataTableEmptyStateProps {
  message?: string
  isFiltered?: boolean
}

export function DataTableEmptyState({
  message,
  isFiltered,
}: DataTableEmptyStateProps) {
  return (
    <Empty className="border-none py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>
          {message ?? (isFiltered ? "No results match your filters" : "No data")}
        </EmptyTitle>
        {isFiltered && (
          <EmptyDescription>
            Try adjusting your search or clearing filters
          </EmptyDescription>
        )}
      </EmptyHeader>
    </Empty>
  )
}
