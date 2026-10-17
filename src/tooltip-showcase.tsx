import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Info, Trash2, Building2, UserPlus } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-8">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
            <h1 className="text-3xl font-semibold text-foreground">Tooltip</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-prose">
              Built on Base UI Tooltip. Wrap the app in TooltipProvider. Supports all four sides, keyboard shortcuts, delays, and rich multi-line content.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        </div>

        <div className="flex flex-col gap-10">

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
            <div className="flex flex-col gap-5">
              <Row label="icon button">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon"><Plus /></Button>} />
                  <TooltipContent>Add lease</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon"><Trash2 /></Button>} />
                  <TooltipContent>Delete lease</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon"><Info /></Button>} />
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>
              </Row>
              <Row label="text button">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="sm">Export</Button>} />
                  <TooltipContent>Download as CSV or PDF</TooltipContent>
                </Tooltip>
              </Row>
            </div>
          </section>

          <div className="border-t border-border" />

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Placements</p>
            <Row label="sides">
              {(["top", "right", "bottom", "left"] as const).map(side => (
                <Tooltip key={side}>
                  <TooltipTrigger render={<Button variant="outline" size="sm">{side}</Button>} />
                  <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
                </Tooltip>
              ))}
            </Row>
          </section>

          <div className="border-t border-border" />

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With keyboard shortcut</p>
            <Row label="shortcuts">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon"><UserPlus /></Button>} />
                <TooltipContent>
                  Add tenant <kbd className="ml-1 rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono">⌘T</kbd>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon"><Building2 /></Button>} />
                <TooltipContent>
                  Add building <kbd className="ml-1 rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono">⌘B</kbd>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon"><Plus /></Button>} />
                <TooltipContent>
                  New deal <kbd className="ml-1 rounded bg-background/20 px-1 py-0.5 text-[10px] font-mono">⌘N</kbd>
                </TooltipContent>
              </Tooltip>
            </Row>
          </section>

          <div className="border-t border-border" />

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Delayed</p>
            <Row label="500 ms delay">
              <TooltipProvider delay={500}>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="sm">Hover me</Button>} />
                  <TooltipContent>Appears after 500 ms</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delay={1000}>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="sm">Slower</Button>} />
                  <TooltipContent>Appears after 1 second</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Row>
          </section>

          <div className="border-t border-border" />

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Disabled trigger</p>
            <Row label="disabled button">
              <Tooltip>
                <span className="inline-block">
                  <TooltipTrigger render={<Button variant="outline" disabled style={{ pointerEvents: "none" }}>Publish report</Button>} />
                </span>
                <TooltipContent>You don't have permission to publish</TooltipContent>
              </Tooltip>
            </Row>
          </section>

          <div className="border-t border-border" />

          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Rich content</p>
            <Row label="multi-line">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon"><Info /></Button>} />
                <TooltipContent className="max-w-52 text-left leading-snug">
                  <p className="font-medium">NER (Net effective rent)</p>
                  <p className="mt-0.5 text-xs opacity-80">Blended rent after free rent and TI amortization, expressed per SF annually.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="sm">Deal health</Button>} />
                <TooltipContent className="max-w-56 text-left leading-snug">
                  <p className="font-medium">Deal health score</p>
                  <p className="mt-0.5 text-xs opacity-80">Composite score based on days to expiration, document completeness, and last activity date.</p>
                </TooltipContent>
              </Tooltip>
            </Row>
          </section>

        </div>
      </div>
    </TooltipProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
