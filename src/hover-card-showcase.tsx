import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Hover card</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Rich preview card displayed on hover.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Hover</p>
          <div className="flex flex-col gap-5">
            <Row label="hover">
              <HoverCard>
                <HoverCardTrigger render={<Button variant="link" />}>
                  One Market Plaza
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                        <Home className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">One Market Plaza</p>
                        <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">1.6M sq ft · 4 active leases · 98% occupancy</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
