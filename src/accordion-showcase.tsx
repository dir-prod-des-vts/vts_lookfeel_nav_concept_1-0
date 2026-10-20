import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [controlledValue, setControlledValue] = React.useState<string[]>(["renewal-options"])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Accordion</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI. Supports single and multiple expand modes, disabled items, and controlled state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Single expand */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Single expand</p>
          <Row label="default">
            <div className="max-w-xl">
              <Accordion>
                <AccordionItem value="lease-terms">
                  <AccordionTrigger>Lease terms</AccordionTrigger>
                  <AccordionContent>
                    The lease commences on January 1, 2025 and expires December 31, 2029. The initial term is five years with two five-year renewal options at the tenant's election.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rent-schedule">
                  <AccordionTrigger>Rent schedule</AccordionTrigger>
                  <AccordionContent>
                    Base rent starts at $52.00 per RSF in year one, escalating 3% annually. Free rent is provided for the first three months of occupancy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="landlord-obligations">
                  <AccordionTrigger>Landlord obligations</AccordionTrigger>
                  <AccordionContent>
                    Landlord will deliver the premises in warm shell condition and provide a tenant improvement allowance of $120 per RSF. HVAC, elevators, and common areas are maintained by landlord.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="permitted-use">
                  <AccordionTrigger>Permitted use</AccordionTrigger>
                  <AccordionContent>
                    Tenant may use the premises for general office purposes, including software development, data operations, and ancillary administrative functions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Multiple expand */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Multiple expand</p>
          <Row label="openMultiple">
            <div className="max-w-xl">
              <Accordion multiple>
                <AccordionItem value="critical-dates">
                  <AccordionTrigger>Critical dates</AccordionTrigger>
                  <AccordionContent>
                    Lease commencement: January 1, 2025. Rent commencement: April 1, 2025. Expiration: December 31, 2029. Renewal notice deadline: June 30, 2029.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="security-deposit">
                  <AccordionTrigger>Security deposit</AccordionTrigger>
                  <AccordionContent>
                    A security deposit of $312,000 (equal to three months base rent) is due upon lease execution. The deposit may be reduced by 50% after year three if tenant is not in default.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="parking">
                  <AccordionTrigger>Parking</AccordionTrigger>
                  <AccordionContent>
                    Tenant is entitled to 4 unreserved parking spaces per 1,000 RSF leased at the prevailing monthly rate. Two reserved spaces in the executive garage are included at no charge.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Disabled item */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled item</p>
          <Row label="mixed">
            <div className="max-w-xl">
              <Accordion>
                <AccordionItem value="overview">
                  <AccordionTrigger>Overview</AccordionTrigger>
                  <AccordionContent>
                    This lease covers 24,500 RSF on the 18th floor at 101 Park Avenue, New York, NY. Building class: A+. Direct deal with landlord; no sublease.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="confidential" disabled>
                  <AccordionTrigger>Confidential terms (restricted)</AccordionTrigger>
                  <AccordionContent>
                    This section is not available to your role.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contacts">
                  <AccordionTrigger>Contacts</AccordionTrigger>
                  <AccordionContent>
                    Landlord contact: Brookfield Properties, attn. Leasing Dept. Tenant rep broker: CBRE, Sarah Chen. Legal counsel: Skadden Arps LLP.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Controlled */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Controlled</p>
          <Row label="controlled">
            <div className="flex flex-col gap-4 max-w-xl">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => setControlledValue(["renewal-options"])}>Renewal options</Button>
                <Button size="sm" variant="outline" onClick={() => setControlledValue(["break-options"])}>Break options</Button>
                <Button size="sm" variant="ghost" onClick={() => setControlledValue([])}>Close all</Button>
              </div>
              <div className="max-w-xl">
                <Accordion
                  value={controlledValue}
                  onValueChange={(v) => setControlledValue(v)}
                >
                  <AccordionItem value="renewal-options">
                    <AccordionTrigger>Renewal options</AccordionTrigger>
                    <AccordionContent>
                      Two five-year renewal options. First option at 95% of fair market rent. Second option at 100% of fair market rent. Written notice required 12 months prior to expiration.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="break-options">
                    <AccordionTrigger>Break options</AccordionTrigger>
                    <AccordionContent>
                      One-time break right at end of year three. Penalty equal to six months unamortized TI allowance plus leasing commissions. 180-day written notice required.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="subletting">
                    <AccordionTrigger>Subletting and assignment</AccordionTrigger>
                    <AccordionContent>
                      Tenant may sublet up to 50% of premises without landlord consent, subject to recapture rights. Full assignment requires landlord approval, not to be unreasonably withheld.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world lease detail panel */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Real-world: lease detail panel</p>
          <Row label="lease panel">
            <div className="max-w-xl">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground">Lease</p>
                <p className="font-semibold text-sm mt-0.5">101 Park Ave, Floor 18 — Acme Corp</p>
              </div>
              <Accordion multiple>
                <AccordionItem value="address">
                  <AccordionTrigger>Property address</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground">Building</span><span>101 Park Avenue</span>
                      <span className="text-muted-foreground">City</span><span>New York, NY 10178</span>
                      <span className="text-muted-foreground">Floor</span><span>18th floor</span>
                      <span className="text-muted-foreground">RSF</span><span>24,500 SF</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dates">
                  <AccordionTrigger>Key dates</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground">Commencement</span><span>Jan 1, 2025</span>
                      <span className="text-muted-foreground">Rent start</span><span>Apr 1, 2025</span>
                      <span className="text-muted-foreground">Expiration</span><span>Dec 31, 2029</span>
                      <span className="text-muted-foreground">Renewal notice</span><span>Jun 30, 2029</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rent">
                  <AccordionTrigger>Rent schedule</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground font-medium">Year</span>
                      <span className="text-muted-foreground font-medium">Rate ($/RSF)</span>
                      <span className="text-muted-foreground font-medium">Annual</span>
                      <span>1</span><span>$52.00</span><span>$1,274,000</span>
                      <span>2</span><span>$53.56</span><span>$1,312,220</span>
                      <span>3</span><span>$55.17</span><span>$1,351,587</span>
                      <span>4</span><span>$56.82</span><span>$1,392,134</span>
                      <span>5</span><span>$58.53</span><span>$1,434,898</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="options">
                  <AccordionTrigger>Renewal and break options</AccordionTrigger>
                  <AccordionContent>
                    Two five-year renewal options at market rate. Break right at end of year three with 180-day notice and penalty equal to unamortized TI.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
