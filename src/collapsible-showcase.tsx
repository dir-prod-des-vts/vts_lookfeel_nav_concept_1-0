import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3 flex-1">{children}</div>
    </div>
  )
}

function LeasePanel({ defaultOpen = false, disabled = false }: { defaultOpen?: boolean; disabled?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen} disabled={disabled} className="w-full max-w-sm rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:pointer-events-none">
        <span>Lease details</span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden transition-all data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0">
        <div className="border-t border-border px-4 py-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Tenant</span><span className="text-foreground">Acme Corp</span></div>
          <div className="flex justify-between"><span>Floor</span><span className="text-foreground">14th floor, Suite 1400</span></div>
          <div className="flex justify-between"><span>Term</span><span className="text-foreground">Jan 2022 — Dec 2027</span></div>
          <div className="flex justify-between"><span>Base rent</span><span className="text-foreground">$48.50 / SF / yr</span></div>
          <div className="flex justify-between"><span>RSF</span><span className="text-foreground">12,400 SF</span></div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ControlledPanel() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>Expand</Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Collapse</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(o => !o)}>Toggle</Button>
      </div>
      <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors">
          <span>Rent escalation schedule</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 [[data-open]_&]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border px-4 py-3 space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>Year 1–2</span><span className="text-foreground">$48.50 / SF</span></div>
            <div className="flex justify-between"><span>Year 3–4</span><span className="text-foreground">$50.25 / SF</span></div>
            <div className="flex justify-between"><span>Year 5–6</span><span className="text-foreground">$52.00 / SF</span></div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function AdditionalClausesForm() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl border border-border p-4">
      <p className="text-sm font-medium">Lease form</p>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Base rent</label>
        <input className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" placeholder="$0.00 / SF / yr" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Lease term</label>
        <input className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" placeholder="e.g. 60 months" />
      </div>
      <Collapsible className="rounded-lg border border-border">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors">
          <span>Additional clauses</span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 [[data-open]_&]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border p-3 space-y-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Renewal option</label>
              <input className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" placeholder="e.g. two 5-year options" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Termination right</label>
              <input className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" placeholder="e.g. month 36 with 12-month notice" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
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
          <h1 className="text-3xl font-semibold text-foreground">Collapsible</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Expandable content panels with animated open/close transitions. Built on Base UI Collapsible.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="closed">
            <LeasePanel />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Open by default</p>
          <Row label="expanded">
            <LeasePanel defaultOpen />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled</p>
          <Row label="non-interactive">
            <LeasePanel disabled />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Controlled</p>
          <Row label="external state">
            <ControlledPanel />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Real-world</p>
          <Row label="lease form">
            <AdditionalClausesForm />
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
