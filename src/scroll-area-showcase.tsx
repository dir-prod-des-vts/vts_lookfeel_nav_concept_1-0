import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Scroll area</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Augments native scroll functionality for custom, cross-browser styling.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Vertical</p>
          <div className="flex flex-col gap-5">
            <Row label="vertical">
              <ScrollArea className="h-40 w-72 rounded-lg border p-3">
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="rounded-lg border bg-card px-3 py-2 text-sm">
                      Lease #{1000 + i} · Suite {(i + 1) * 100}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Row>
            <Row label="horizontal">
              <ScrollArea className="w-72 rounded-lg border p-3">
                <div className="flex gap-2 pb-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="shrink-0 rounded-lg border bg-card px-4 py-2 text-sm w-32">
                      Building {i + 1}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
