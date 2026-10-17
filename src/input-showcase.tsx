import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Input</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Text input built on Base UI Input. All native types, states, and VTS-domain placeholder copy.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Types</p>
          <div className="flex flex-col gap-4 max-w-sm">
            <Row label="text">
              <Input type="text" placeholder="Tenant name" className="w-72" />
            </Row>
            <Row label="email">
              <Input type="email" placeholder="contact@acmecorp.com" className="w-72" />
            </Row>
            <Row label="number">
              <Input type="number" placeholder="12400" className="w-72" />
            </Row>
            <Row label="password">
              <Input type="password" placeholder="••••••••" className="w-72" />
            </Row>
            <Row label="search">
              <Input type="search" placeholder="Search leases..." className="w-72" />
            </Row>
            <Row label="tel">
              <Input type="tel" placeholder="+1 (415) 555-0100" className="w-72" />
            </Row>
            <Row label="url">
              <Input type="url" placeholder="https://acmecorp.com" className="w-72" />
            </Row>
            <Row label="date">
              <Input type="date" className="w-72" />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · States</p>
          <div className="flex flex-col gap-4">
            <Row label="default">
              <Input placeholder="Enter value" className="w-72" />
            </Row>
            <Row label="filled">
              <Input defaultValue="Acme Corp" className="w-72" />
            </Row>
            <Row label="disabled">
              <Input disabled value="100 Mission Street" className="w-72" />
            </Row>
            <Row label="readonly">
              <Input readOnly value="$48.50 / SF / yr" className="w-72" />
            </Row>
            <Row label="invalid">
              <Input aria-invalid defaultValue="13/99/2024" className="w-72" />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · VTS placeholders</p>
          <div className="flex flex-col gap-4">
            <Row label="search">
              <Input placeholder="Search leases..." className="w-72" />
              <Input placeholder="Search tenants..." className="w-72" />
            </Row>
            <Row label="tenant">
              <Input placeholder="Enter tenant name" className="w-72" />
              <Input placeholder="e.g. Acme Corp" className="w-72" />
            </Row>
            <Row label="financial">
              <Input type="number" placeholder="0.00" className="w-36" />
              <Input placeholder="e.g. $48.50 / SF" className="w-48" />
            </Row>
            <Row label="property">
              <Input placeholder="100 Mission Street" className="w-72" />
              <Input placeholder="San Francisco, CA" className="w-72" />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Real-world</p>
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="space-y-4 rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick search</p>
              <Input type="search" placeholder="Search leases, tenants, buildings..." />
            </div>
            <div className="space-y-3 rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rent entry</p>
              <div className="flex gap-2">
                <Input type="number" placeholder="48.50" className="flex-1" />
                <Input placeholder="SF/yr" className="w-20" readOnly />
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lease term</p>
              <div className="flex gap-2">
                <Input type="date" className="flex-1" />
                <span className="self-center text-sm text-muted-foreground">to</span>
                <Input type="date" className="flex-1" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
