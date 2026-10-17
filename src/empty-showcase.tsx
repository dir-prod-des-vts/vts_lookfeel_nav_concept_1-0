import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty"
import { FileText, Building2, CalendarX, Search, Plus, Upload, Filter } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3 flex-1">{children}</div>
    </div>
  )
}

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
          <h1 className="text-3xl font-semibold text-foreground">Empty</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Empty state containers with icon, title, description, and optional actions.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Icon variant</p>
          <Row label="no leases">
            <Empty className="h-48 max-w-sm border">
              <EmptyHeader>
                <EmptyMedia variant="icon"><FileText /></EmptyMedia>
                <EmptyTitle>No leases found</EmptyTitle>
                <EmptyDescription>This property has no active leases. Add a lease to get started.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm"><Plus data-icon="inline-start" />Add lease</Button>
              </EmptyContent>
            </Empty>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Default (no icon background)</p>
          <Row label="pipeline">
            <Empty className="h-48 max-w-sm border">
              <EmptyHeader>
                <EmptyMedia variant="default"><Building2 className="size-8 text-muted-foreground" /></EmptyMedia>
                <EmptyTitle>No deals in this stage</EmptyTitle>
                <EmptyDescription>Move deals into Proposal to track them here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With action buttons</p>
          <Row label="critical dates">
            <Empty className="h-56 max-w-sm border">
              <EmptyHeader>
                <EmptyMedia variant="icon"><CalendarX /></EmptyMedia>
                <EmptyTitle>No critical dates this quarter</EmptyTitle>
                <EmptyDescription>No lease expirations, renewals, or options are due in Q4 2024.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Filter data-icon="inline-start" />Change range</Button>
                  <Button size="sm"><Plus data-icon="inline-start" />Add date</Button>
                </div>
              </EmptyContent>
            </Empty>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Search empty state</p>
          <Row label="no results">
            <Empty className="h-48 max-w-sm border">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Search /></EmptyMedia>
                <EmptyTitle>No results for "clearwater holdings"</EmptyTitle>
                <EmptyDescription>Try different keywords or clear your filters.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm" variant="outline">Clear filters</Button>
              </EmptyContent>
            </Empty>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Without action</p>
          <Row label="minimal">
            <Empty className="h-40 max-w-sm border">
              <EmptyHeader>
                <EmptyMedia variant="icon"><Upload /></EmptyMedia>
                <EmptyTitle>No documents uploaded</EmptyTitle>
                <EmptyDescription>Documents attached to this lease will appear here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · No border (in-page)</p>
          <Row label="inline">
            <div className="w-full max-w-sm h-40 rounded-xl bg-muted/30">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon"><FileText /></EmptyMedia>
                  <EmptyTitle>No notes yet</EmptyTitle>
                  <EmptyDescription>Add a note to keep track of deal progress.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
