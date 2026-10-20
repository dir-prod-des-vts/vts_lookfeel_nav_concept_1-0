import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const LEASES = [
  { id: "L-001", tenant: "Acme Corp", building: "111 8th Ave", exp: "Mar 2026", ner: "$72" },
  { id: "L-002", tenant: "Brightline Media", building: "525 Market St", exp: "Sep 2027", ner: "$68" },
  { id: "L-003", tenant: "Meridian Health", building: "350 N Orleans", exp: "Dec 2024", ner: "$65" },
  { id: "L-004", tenant: "Techstart Inc", building: "1 Market Plaza", exp: "Jun 2028", ner: "$84" },
  { id: "L-005", tenant: "Redpoint Capital", building: "300 Park Ave", exp: "Jan 2027", ner: "$95" },
  { id: "L-006", tenant: "Atlas Logistics", building: "2200 Mission St", exp: "Aug 2025", ner: "$58" },
  { id: "L-007", tenant: "Nova Analytics", building: "875 Howard St", exp: "May 2029", ner: "$78" },
  { id: "L-008", tenant: "Summit Partners", building: "180 Maiden Ln", exp: "Oct 2026", ner: "$88" },
  { id: "L-009", tenant: "Coastal Ventures", building: "44 Montgomery St", exp: "Feb 2028", ner: "$91" },
  { id: "L-010", tenant: "Ironwood Group", building: "55 Water St", exp: "Nov 2025", ner: "$62" },
  { id: "L-011", tenant: "Keystone Capital", building: "101 California St", exp: "Apr 2030", ner: "$102" },
  { id: "L-012", tenant: "Harbinger LLC", building: "222 Broadway", exp: "Jul 2026", ner: "$77" },
  { id: "L-013", tenant: "Pinnacle RE", building: "400 Howard St", exp: "Dec 2027", ner: "$83" },
  { id: "L-014", tenant: "Vanguard Studios", building: "600 3rd St", exp: "Mar 2029", ner: "$75" },
  { id: "L-015", tenant: "Criterion Fund", building: "115 Sansome St", exp: "Sep 2028", ner: "$98" },
  { id: "L-016", tenant: "Delphi Research", building: "650 California St", exp: "Jan 2026", ner: "$70" },
  { id: "L-017", tenant: "Ember Dynamics", building: "333 Market St", exp: "May 2027", ner: "$86" },
  { id: "L-018", tenant: "Fulcrum Capital", building: "425 Market St", exp: "Aug 2030", ner: "$110" },
  { id: "L-019", tenant: "Greenway Systems", building: "101 2nd St", exp: "Feb 2026", ner: "$74" },
  { id: "L-020", tenant: "Helix Biosciences", building: "505 Sansome St", exp: "Jun 2031", ner: "$94" },
]

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
          <h1 className="text-3xl font-semibold text-foreground">Scroll area</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI ScrollArea. Custom scrollbars for vertical, horizontal, and both-axes overflow.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Vertical scroll</p>
          <ScrollArea className="h-72 rounded-lg border border-border">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Active leases (20)</p>
              <div className="flex flex-col gap-px">
                {LEASES.map(l => (
                  <div key={l.id} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{l.tenant}</p>
                      <p className="text-xs text-muted-foreground">{l.building}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{l.ner}/SF</p>
                      <p className="text-xs text-muted-foreground">Exp {l.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Horizontal scroll</p>
          <ScrollArea className="rounded-lg border border-border w-full">
            <div className="p-4" style={{ width: "900px" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Tenant", "Building", "Market", "Floor", "RSF", "Start", "Expiration", "NER", "Status"].map(col => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEASES.slice(0, 6).map(l => (
                    <tr key={l.id} className="border-b border-border/40 hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium whitespace-nowrap">{l.tenant}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{l.building}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">New York, NY</td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">12</td>
                      <td className="px-3 py-2 whitespace-nowrap">42,000</td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">Jan 2022</td>
                      <td className="px-3 py-2 whitespace-nowrap">{l.exp}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{l.ner}</td>
                      <td className="px-3 py-2 whitespace-nowrap"><span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Both axes</p>
          <ScrollArea className="h-48 rounded-lg border border-border w-full">
            <div style={{ width: "800px" }} className="p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Deal pipeline</p>
              <div className="flex flex-col gap-px">
                {LEASES.map(l => (
                  <div key={l.id} className="flex gap-8 py-2 border-b border-border/40 last:border-0 whitespace-nowrap text-sm">
                    <span className="w-40 font-medium">{l.tenant}</span>
                    <span className="w-44 text-muted-foreground">{l.building}</span>
                    <span className="w-24 text-muted-foreground">{l.exp}</span>
                    <span className="w-16 font-medium">{l.ner}/SF</span>
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Fixed height with overflow</p>
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Contacts panel (h-40)</p>
              <ScrollArea className="h-40 rounded-lg border border-border">
                <div className="p-3 flex flex-col gap-px">
                  {["Alice Johnson", "Ben Nakamura", "Clara Ortiz", "David Park", "Elena Rossi", "Frank Müller", "Grace Lee", "Hiro Tanaka"].map(name => (
                    <div key={name} className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-muted/40 text-sm cursor-pointer">
                      <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">{name[0]}</div>
                      {name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Notes panel (h-40)</p>
              <ScrollArea className="h-40 rounded-lg border border-border">
                <div className="p-3 text-sm text-muted-foreground leading-relaxed">
                  <p>Tenant submitted LOI on Oct 14. Requesting 5,000 SF on floor 8 with a 7-year term. TI allowance under negotiation at $85/SF. Commencement expected Q1 2025.</p>
                  <p className="mt-3">Follow-up call scheduled with broker for Thursday. Landlord open to 3-month free rent concession in lieu of increased TI.</p>
                  <p className="mt-3">Space currently being used as temporary storage by prior tenant. Demising work estimated at 6 weeks after lease execution.</p>
                </div>
              </ScrollArea>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
