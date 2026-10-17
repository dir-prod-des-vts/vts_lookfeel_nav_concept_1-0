import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

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
          <h1 className="text-3xl font-semibold text-foreground">Resizable</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on react-resizable-panels. Drag handles to redistribute space between panels horizontally, vertically, or in complex layouts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Horizontal</p>
          <div className="h-48 rounded-lg border border-border overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={40}>
                <div className="flex h-full flex-col p-4 bg-muted/30">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Portfolio</p>
                  <div className="flex flex-col gap-1 text-sm">
                    {["111 8th Ave, NYC", "525 Market St, SF", "350 N Orleans, CHI"].map(b => (
                      <div key={b} className="px-2 py-1.5 rounded hover:bg-accent cursor-pointer text-foreground">{b}</div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60}>
                <div className="flex h-full flex-col p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Building details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Market</span><p className="font-medium">New York, NY</p></div>
                    <div><span className="text-muted-foreground">Type</span><p className="font-medium">Class A Office</p></div>
                    <div><span className="text-muted-foreground">RSF</span><p className="font-medium">2,900,000</p></div>
                    <div><span className="text-muted-foreground">Occupancy</span><p className="font-medium">94.2%</p></div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Vertical</p>
          <div className="h-56 rounded-lg border border-border overflow-hidden">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full flex-col p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Active leases</p>
                  <div className="flex flex-col gap-1 text-sm">
                    {[
                      { tenant: "Acme Corp", exp: "Mar 2026", ner: "$72" },
                      { tenant: "Brightline", exp: "Sep 2027", ner: "$68" },
                    ].map(l => (
                      <div key={l.tenant} className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="font-medium">{l.tenant}</span>
                        <span className="text-muted-foreground">{l.exp} · {l.ner}/SF</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full flex-col p-4 bg-muted/20">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Expiring leases</p>
                  <div className="flex flex-col gap-1 text-sm">
                    {[
                      { tenant: "Meridian Health", exp: "Dec 2024", ner: "$65" },
                    ].map(l => (
                      <div key={l.tenant} className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="font-medium text-destructive">{l.tenant}</span>
                        <span className="text-muted-foreground">{l.exp} · {l.ner}/SF</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Three panels</p>
          <div className="h-64 rounded-lg border border-border overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} minSize={15}>
                <div className="flex h-full flex-col p-3 bg-muted/30">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">Nav</p>
                  {["Overview", "Leases", "Deals", "Contacts"].map(item => (
                    <div key={item} className="py-1.5 px-2 rounded text-sm cursor-pointer hover:bg-accent">{item}</div>
                  ))}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={55}>
                <div className="flex h-full flex-col p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Lease list</p>
                  <div className="flex flex-col gap-1 text-sm">
                    {["Acme Corp", "Brightline", "Meridian Health", "Techstart Inc"].map(t => (
                      <div key={t} className="px-2 py-1.5 rounded hover:bg-accent cursor-pointer">{t}</div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15}>
                <div className="flex h-full flex-col p-4 bg-muted/10">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Details</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div><span className="text-muted-foreground text-xs">Tenant</span><p className="font-medium">Acme Corp</p></div>
                    <div><span className="text-muted-foreground text-xs">Floors</span><p className="font-medium">12–14</p></div>
                    <div><span className="text-muted-foreground text-xs">RSF</span><p className="font-medium">42,000</p></div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With min/max constraints</p>
          <p className="text-sm text-muted-foreground mb-4">Left panel: min 20%, max 40%. Try dragging beyond the limit.</p>
          <div className="h-40 rounded-lg border border-border overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                <div className="flex h-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
                  20–40% wide
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Remaining space
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
