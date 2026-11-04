import { Skeleton } from "@/components/ui/skeleton"

const COL_WIDTHS = ["w-16", "w-24", "w-20", "w-32", "w-14", "w-28", "w-18", "w-12"]

interface DataTableLoadingStateProps {
  columns?: number
  rows?: number
}

export function DataTableLoadingState({
  columns = 5,
  rows = 8,
}: DataTableLoadingStateProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-3 py-2.5">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton
              key={j}
              className={`h-4 shrink-0 ${COL_WIDTHS[(i + j) % COL_WIDTHS.length]}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
