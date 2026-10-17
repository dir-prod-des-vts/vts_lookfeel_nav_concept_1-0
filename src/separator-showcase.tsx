import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
          <h1 className="text-3xl font-semibold text-foreground">Separator</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Separator. A thin 1px divider for horizontal or vertical separation between content.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Horizontal (default)</p>
          <div className="w-full max-w-md flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium">Lease summary</p>
              <p className="text-sm text-muted-foreground">111 8th Ave, New York, NY</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Tenant</p>
              <p className="text-sm text-muted-foreground">Acme Corp</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Expiration</p>
              <p className="text-sm text-muted-foreground">March 31, 2026</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Vertical</p>
          <div className="flex h-10 items-center gap-4 text-sm">
            <span className="font-medium">Overview</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Leases</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Deals</span>
            <Separator orientation="vertical" />
            <span className="text-muted-foreground">Contacts</span>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With label text</p>
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">or</span>
              <Separator className="flex-1" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground shrink-0">Deal details</span>
              <Separator className="flex-1" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground shrink-0">Q1 2025</span>
              <Separator className="flex-1" />
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · In context: between sections</p>
          <div className="w-full max-w-md rounded-lg border border-border p-5 flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Building</p>
              <p className="text-sm font-semibold">111 8th Ave</p>
              <p className="text-sm text-muted-foreground">New York, NY 10011</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Lease terms</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">RSF</span><span className="font-medium">42,000</span>
                <span className="text-muted-foreground">NER</span><span className="font-medium">$72/SF</span>
                <span className="text-muted-foreground">Term</span><span className="font-medium">7 years</span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">Contacts</p>
              <p className="text-sm">Alice Johnson — Tenant Rep</p>
              <p className="text-sm text-muted-foreground">alice@acmecorp.com</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · In context: between menu items</p>
          <div className="w-48 rounded-lg border border-border shadow-sm bg-popover text-popover-foreground text-sm overflow-hidden">
            {["Edit lease", "Duplicate"].map(item => (
              <div key={item} className="px-3 py-2 hover:bg-accent cursor-pointer">{item}</div>
            ))}
            <Separator />
            {["Export as PDF", "Share link"].map(item => (
              <div key={item} className="px-3 py-2 hover:bg-accent cursor-pointer">{item}</div>
            ))}
            <Separator />
            <div className="px-3 py-2 hover:bg-accent cursor-pointer text-destructive">Delete lease</div>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
