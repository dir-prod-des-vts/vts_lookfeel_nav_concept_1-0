import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Building2, Mail, Phone, MapPin, BarChart2 } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Hover card</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Preview cards that appear on hover. Built on Base UI PreviewCard.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · User card</p>
          <Row label="contact">
            <p className="text-sm text-muted-foreground">
              Lease managed by{" "}
              <HoverCard>
                <HoverCardTrigger className="underline underline-offset-4 cursor-pointer text-foreground font-medium">
                  Sarah Chen
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                        SC
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Sarah Chen</p>
                        <p className="text-xs text-muted-foreground">VP Real Estate, Acme Corp</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2"><Mail className="size-3.5" />sarah.chen@acmecorp.com</div>
                      <div className="flex items-center gap-2"><Phone className="size-3.5" />+1 (415) 555-0182</div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>{" "}
              at Acme Corp.
            </p>
          </Row>
          <div className="mt-6" />
          <Row label="in a table">
            <div className="w-80 rounded-lg border border-border">
              {[
                { name: "Sarah Chen", role: "VP Real Estate" },
                { name: "Marcus Leung", role: "Director, Facilities" },
                { name: "Priya Patel", role: "Real Estate Counsel" },
              ].map(({ name, role }) => (
                <div key={name} className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 border-border text-sm">
                  <HoverCard>
                    <HoverCardTrigger className="font-medium underline underline-offset-4 cursor-pointer">
                      {name}
                    </HoverCardTrigger>
                    <HoverCardContent side="right">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                          {name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{name}</p>
                          <p className="text-xs text-muted-foreground">{role}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <span className="text-muted-foreground">{role}</span>
                </div>
              ))}
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Property card</p>
          <Row label="building info">
            <p className="text-sm text-muted-foreground">
              Located at{" "}
              <HoverCard>
                <HoverCardTrigger className="underline underline-offset-4 cursor-pointer text-foreground font-medium">
                  100 Mission Street
                </HoverCardTrigger>
                <HoverCardContent className="w-72">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">100 Mission Street</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="size-3" />San Francisco, CA 94105
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><p className="text-muted-foreground">Total SF</p><p className="font-medium">248,000</p></div>
                      <div><p className="text-muted-foreground">Occupancy</p><p className="font-medium">91%</p></div>
                      <div><p className="text-muted-foreground">Active leases</p><p className="font-medium">12</p></div>
                      <div><p className="text-muted-foreground">Avg rent</p><p className="font-medium">$52 / SF</p></div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              , San Francisco.
            </p>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Side variants</p>
          <Row label="positions">
            {(["top", "bottom", "left", "right"] as const).map(side => (
              <HoverCard key={side}>
                <HoverCardTrigger>
                  <Button variant="outline" size="sm">{side}</Button>
                </HoverCardTrigger>
                <HoverCardContent side={side}>
                  <div className="text-sm">
                    <p className="font-medium">Hover card</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Positioned on the {side}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
