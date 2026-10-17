import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Clock, Building2, TrendingUp, Star, Bell } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const VARIANTS = ["default", "secondary", "outline", "destructive", "ghost"] as const

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Badge</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Small status labels with five variants, optional icons, and composable render prop.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <div className="flex flex-col gap-5">
            {VARIANTS.map(v => (
              <Row key={v} label={v}>
                <Badge variant={v}>Active</Badge>
                <Badge variant={v}>Expiring soon</Badge>
                <Badge variant={v}>Critical</Badge>
                <Badge variant={v}>New deal</Badge>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* With icons */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With icons</p>
          <Row label="leading icon">
            <Badge variant="default"><CheckCircle2 data-icon="inline-start" />Executed</Badge>
            <Badge variant="secondary"><Clock data-icon="inline-start" />Pending review</Badge>
            <Badge variant="destructive"><AlertTriangle data-icon="inline-start" />Critical date</Badge>
            <Badge variant="outline"><Building2 data-icon="inline-start" />Class A</Badge>
          </Row>
          <div className="mt-5" />
          <Row label="trailing icon">
            <Badge variant="default">Trending<TrendingUp data-icon="inline-end" /></Badge>
            <Badge variant="secondary">Featured<Star data-icon="inline-end" /></Badge>
            <Badge variant="outline">Alerts<Bell data-icon="inline-end" /></Badge>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Deal status badges */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Deal and lease status</p>
          <Row label="deal stage">
            <Badge variant="secondary">Prospect</Badge>
            <Badge variant="outline">Touring</Badge>
            <Badge variant="secondary">Proposing</Badge>
            <Badge variant="secondary">Negotiating</Badge>
            <Badge variant="default">Executed</Badge>
            <Badge variant="ghost">Lost</Badge>
          </Row>
          <div className="mt-5" />
          <Row label="lease health">
            <Badge variant="default"><CheckCircle2 data-icon="inline-start" />Healthy</Badge>
            <Badge variant="secondary"><Clock data-icon="inline-start" />Expiring 90d</Badge>
            <Badge variant="destructive"><AlertTriangle data-icon="inline-start" />Critical</Badge>
          </Row>
          <div className="mt-5" />
          <Row label="building class">
            <Badge variant="outline">Class A+</Badge>
            <Badge variant="outline">Class A</Badge>
            <Badge variant="outline">Class B</Badge>
            <Badge variant="ghost">Trophy</Badge>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* In context: table row */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Real-world: lease table</p>
          <Row label="table rows">
            <div className="w-full max-w-2xl border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Building</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Expiration</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tenant: "Acme Corp", building: "101 Park Ave", expiry: "Dec 31, 2029", badge: <Badge variant="default">Active</Badge> },
                    { tenant: "Globex LLC", building: "Tower SF", expiry: "Mar 15, 2025", badge: <Badge variant="secondary"><Clock data-icon="inline-start" />Expiring</Badge> },
                    { tenant: "Initech Inc", building: "One World", expiry: "Jan 1, 2025", badge: <Badge variant="destructive"><AlertTriangle data-icon="inline-start" />Critical</Badge> },
                    { tenant: "Umbrella Co", building: "Park Place", expiry: "Jun 30, 2027", badge: <Badge variant="outline">Renewal sent</Badge> },
                  ].map(row => (
                    <tr key={row.tenant} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{row.tenant}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.building}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.expiry}</td>
                      <td className="px-4 py-3">{row.badge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Notification count */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Notification count</p>
          <Row label="count badges">
            <div className="relative inline-flex">
              <Button variant="outline" size="icon"><Bell /></Button>
              <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full px-1 text-[10px]">3</Badge>
            </div>
            <div className="relative inline-flex">
              <Button variant="outline">Critical dates</Button>
              <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full px-1 text-[10px]">12</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Deals needing attention</span>
              <Badge variant="destructive">5</Badge>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
