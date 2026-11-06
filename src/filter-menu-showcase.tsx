import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { FilterMenu } from "@/components/filter-menu"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mb-14">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Frame({ label, children, wide }: { label?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "w-full" : ""}>
      {label && <p className="text-xs text-muted-foreground mb-2">{label}</p>}
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-md px-6 py-5">
        {children}
      </div>
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
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Components</p>
          <h1 className="text-4xl font-semibold text-foreground mb-2">Filter menu</h1>
          <p className="text-base text-muted-foreground max-w-xl">
            A responsive filter row that collapses gracefully on narrow viewports. Desktop shows inline dropdown pills;
            mobile uses a full-screen takeover. Supports default always-visible fields, applied-value pills, an overflow
            trigger, and saved views.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDark(d => !d)}
          className="shrink-0 mt-1"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Default / empty state */}
      <Section
        title="Default"
        description="No filters applied. The three default fields (Lease Status, Size Range, Occupancy) always render as dropdown pills. Saved views and Filters sit at the right."
      >
        <Frame wide>
          <FilterMenu />
        </Frame>
      </Section>

      {/* Narrower container — overflow */}
      <Section
        title="Overflow"
        description="When the row is too narrow to show all default pills, unselected defaults collapse first. Applied pills that still don't fit hide behind a '+N more' overflow trigger."
      >
        <Frame wide label="Constrained to 480px">
          <div className="max-w-[480px]">
            <FilterMenu />
          </div>
        </Frame>
        <Frame wide label="Constrained to 320px" >
          <div className="max-w-[320px] mt-4">
            <FilterMenu />
          </div>
        </Frame>
      </Section>

      {/* Mobile viewport */}
      <Section
        title="Mobile"
        description="Below md breakpoint, Saved views collapses to a bottom sheet and Filters opens a full-screen takeover. Resize the browser window to see this state."
      >
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Resize the browser to under 768 px to see the mobile filter layout (bottom sheet + full-screen).
        </div>
      </Section>

      {/* Props table */}
      <Section title="Props">
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {[
            { prop: "className", type: "string", default: "—", description: "Extra classes applied to the root element." },
          ].map(({ prop, type, default: def, description }) => (
            <div key={prop} className="grid grid-cols-[180px_140px_100px_1fr] gap-4 px-4 py-3 bg-card text-sm">
              <code className="font-mono text-primary text-xs">{prop}</code>
              <code className="font-mono text-muted-foreground text-xs">{type}</code>
              <code className="font-mono text-muted-foreground text-xs">{def}</code>
              <span className="text-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="Key parts of the filter row and their roles.">
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {[
            { part: "DefaultPill", desc: "An always-visible field with no value. Opens a dropdown of options." },
            { part: "ActivePill", desc: "A field with one or more values set. Shows the value (or field label + count). Has an inline clear button." },
            { part: "OverflowTrigger", desc: "'+N more' button that opens the mega-menu when applied pills can't fit in the row." },
            { part: "FilterMegaMenu", desc: "Two-column popover: left column lists all filter fields; right column shows options for the selected field." },
            { part: "Saved views", desc: "Dropdown listing named filter sets. 'Create view' appends a new one." },
            { part: "Mobile sheet", desc: "Bottom sheet for Saved views on narrow viewports." },
            { part: "MobileFullPage", desc: "Full-screen takeover for Filters on narrow viewports, with drill-down per field." },
          ].map(({ part, desc }) => (
            <div key={part} className="flex gap-6 px-4 py-3 bg-card">
              <code className="font-mono text-xs text-primary w-44 shrink-0 pt-0.5">{part}</code>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Behavior notes */}
      <Section title="Behavior">
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {[
            "Applied default-field pills move to the left of the unselected default pills.",
            "Extra (non-default) fields with values follow the applied default pills.",
            "Width fitting runs off-screen via a mirror div — measuring the live row is never needed.",
            "A ResizeObserver watches the row, mirror, and tail so fitting re-runs on any width change including font swaps.",
            "Clearing a field removes it from active state; default fields reappear as unselected pills.",
            "The mega-menu's field column uses cmdk for keyboard navigation; data-selected background is suppressed and replaced by explicit active state.",
          ].map((note, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 bg-card">
              <span className="text-xs font-mono text-muted-foreground w-6 shrink-0 pt-0.5">{i + 1}.</span>
              <span className="text-sm text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>)
