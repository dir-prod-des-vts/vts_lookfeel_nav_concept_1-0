import { Skeleton } from "@/components/ui/skeleton"

interface DataTableLoadingStateProps {
  columns?: number
  rows?: number
}

// Stagger widths so skeletons don't look like a uniform grid
const FILL_WIDTHS = ["75%", "60%", "85%", "50%", "70%", "80%", "55%", "65%"]

export function DataTableLoadingState({
  columns = 5,
  rows = 8,
}: DataTableLoadingStateProps) {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex border-b border-border bg-muted/40 px-3 py-2.5">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="flex-1 px-2">
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
      {/* Body row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center border-b border-border px-3 py-3 last:border-0"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 px-2">
              <Skeleton
                className="h-3.5"
                style={{ width: FILL_WIDTHS[(i * columns + j) % FILL_WIDTHS.length] }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
