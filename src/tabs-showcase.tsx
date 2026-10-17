import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
          <h1 className="text-3xl font-semibold text-foreground">Tabs</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Tabs. Supports default and line variants, disabled tabs, badge counts, and vertical orientation.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leases">Leases</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="mt-4 text-sm text-muted-foreground">Building overview — KPIs, occupancy, and upcoming events.</div>
            </TabsContent>
            <TabsContent value="leases">
              <div className="mt-4 text-sm text-muted-foreground">Active leases for this building.</div>
            </TabsContent>
            <TabsContent value="deals">
              <div className="mt-4 text-sm text-muted-foreground">Open deals and pipeline activity.</div>
            </TabsContent>
            <TabsContent value="contacts">
              <div className="mt-4 text-sm text-muted-foreground">Tenant contacts and broker relationships.</div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Disabled tab</p>
          <Tabs defaultValue="leases">
            <TabsList>
              <TabsTrigger value="leases">Leases</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
              <TabsTrigger value="settings" aria-disabled>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="leases">
              <div className="mt-4 text-sm text-muted-foreground">Lease content.</div>
            </TabsContent>
            <TabsContent value="deals">
              <div className="mt-4 text-sm text-muted-foreground">Deal content.</div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With badge/count</p>
          <Tabs defaultValue="leases">
            <TabsList>
              <TabsTrigger value="leases">
                Leases
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary tabular-nums min-w-[1.25rem]">12</span>
              </TabsTrigger>
              <TabsTrigger value="deals">
                Deals
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary tabular-nums min-w-[1.25rem]">4</span>
              </TabsTrigger>
              <TabsTrigger value="contacts">
                Contacts
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary tabular-nums min-w-[1.25rem]">28</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="leases">
              <div className="mt-4 text-sm text-muted-foreground">12 active leases found.</div>
            </TabsContent>
            <TabsContent value="deals">
              <div className="mt-4 text-sm text-muted-foreground">4 open deals in pipeline.</div>
            </TabsContent>
            <TabsContent value="contacts">
              <div className="mt-4 text-sm text-muted-foreground">28 contacts across all tenants.</div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Vertical tabs</p>
          <Tabs defaultValue="overview" orientation="vertical">
            <TabsList className="w-36 h-auto">
              <TabsTrigger value="overview" className="w-full justify-start">Overview</TabsTrigger>
              <TabsTrigger value="leases" className="w-full justify-start">Leases</TabsTrigger>
              <TabsTrigger value="deals" className="w-full justify-start">Deals</TabsTrigger>
              <TabsTrigger value="contacts" className="w-full justify-start">Contacts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="text-sm text-muted-foreground pl-2">Building overview panel.</div>
            </TabsContent>
            <TabsContent value="leases">
              <div className="text-sm text-muted-foreground pl-2">Lease list panel.</div>
            </TabsContent>
            <TabsContent value="deals">
              <div className="text-sm text-muted-foreground pl-2">Deal pipeline panel.</div>
            </TabsContent>
            <TabsContent value="contacts">
              <div className="text-sm text-muted-foreground pl-2">Contacts panel.</div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Line variant</p>
          <Tabs defaultValue="active">
            <TabsList variant="line">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="mt-4 text-sm text-muted-foreground">Active leases.</div>
            </TabsContent>
            <TabsContent value="expiring">
              <div className="mt-4 text-sm text-muted-foreground">Leases expiring within 12 months.</div>
            </TabsContent>
            <TabsContent value="expired">
              <div className="mt-4 text-sm text-muted-foreground">Expired leases.</div>
            </TabsContent>
            <TabsContent value="all">
              <div className="mt-4 text-sm text-muted-foreground">All leases.</div>
            </TabsContent>
          </Tabs>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world content panels</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Tabs defaultValue="summary">
              <div className="border-b border-border px-4 pt-3">
                <TabsList variant="line">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="terms">Lease terms</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="summary">
                <div className="p-4 grid grid-cols-3 gap-4 text-sm">
                  <div><p className="text-muted-foreground text-xs mb-1">Tenant</p><p className="font-medium">Acme Corp</p></div>
                  <div><p className="text-muted-foreground text-xs mb-1">Building</p><p className="font-medium">111 8th Ave</p></div>
                  <div><p className="text-muted-foreground text-xs mb-1">Floor</p><p className="font-medium">12</p></div>
                  <div><p className="text-muted-foreground text-xs mb-1">RSF</p><p className="font-medium">42,000</p></div>
                  <div><p className="text-muted-foreground text-xs mb-1">NER</p><p className="font-medium">$72/SF</p></div>
                  <div><p className="text-muted-foreground text-xs mb-1">Expiration</p><p className="font-medium">Mar 2026</p></div>
                </div>
              </TabsContent>
              <TabsContent value="terms">
                <div className="p-4 text-sm text-muted-foreground">Lease terms including TI allowance, free rent, and escalations.</div>
              </TabsContent>
              <TabsContent value="contacts">
                <div className="p-4 text-sm text-muted-foreground">Alice Johnson (Tenant Rep), Ben Nakamura (Broker).</div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="p-4 text-sm text-muted-foreground">Renewal discussions expected Q3 2025.</div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
