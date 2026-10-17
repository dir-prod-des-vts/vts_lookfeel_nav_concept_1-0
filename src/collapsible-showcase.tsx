import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

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
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Collapsible</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Toggle visibility of content sections.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="w-72">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Lease details</h4>
                  <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <ChevronDown className="size-4" />
                  </CollapsibleTrigger>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Suite 400, 12,000 sq ft</p>
                <CollapsibleContent className="mt-3 space-y-2">
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Commencement: Jan 1, 2024</div>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Expiration: Dec 31, 2029</div>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">Base rent: $48/sq ft</div>
                </CollapsibleContent>
              </Collapsible>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
