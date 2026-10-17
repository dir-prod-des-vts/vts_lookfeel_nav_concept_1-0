import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Skeleton</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Animated placeholder for loading states. Compose Skeleton elements to match the layout of your content.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Text skeletons</p>
          <div className="flex flex-col gap-6 max-w-md">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Card skeleton</p>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-56 rounded-lg border border-border p-4 flex flex-col gap-3">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center mt-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Table skeleton</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex gap-0 border-b border-border bg-muted/30 px-3 py-2.5">
              {[120, 160, 100, 80, 80, 80].map((w, i) => (
                <Skeleton key={i} className="h-3.5 mr-6 last:mr-0" style={{ width: w }} />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map(row => (
              <div key={row} className="flex gap-0 border-b border-border/40 last:border-0 px-3 py-3 items-center">
                <Skeleton className="h-3.5 w-28 mr-6" />
                <Skeleton className="h-3.5 w-36 mr-6" />
                <Skeleton className="h-3.5 w-20 mr-6" />
                <Skeleton className="h-3.5 w-16 mr-6" />
                <Skeleton className="h-3.5 w-16 mr-6" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Avatar and text skeleton</p>
          <div className="flex flex-col gap-3 max-w-xs">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · KPI card skeleton</p>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg border border-border p-4 flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-20" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
