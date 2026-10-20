import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
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
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Native select</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Styled native <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;select&gt;</code> with a custom chevron. Two sizes, disabled state, option groups, and error state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Default */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <div className="flex flex-col gap-5">
            <Row label="with value">
              <NativeSelect defaultValue="nnn">
                <NativeSelectOption value="fsg">Full-service gross</NativeSelectOption>
                <NativeSelectOption value="nnn">Triple net (NNN)</NativeSelectOption>
                <NativeSelectOption value="mod-gross">Modified gross</NativeSelectOption>
                <NativeSelectOption value="industrial">Industrial gross</NativeSelectOption>
              </NativeSelect>
            </Row>
            <Row label="placeholder">
              <NativeSelect defaultValue="">
                <NativeSelectOption value="" disabled>Select lease type…</NativeSelectOption>
                <NativeSelectOption value="fsg">Full-service gross</NativeSelectOption>
                <NativeSelectOption value="nnn">Triple net (NNN)</NativeSelectOption>
                <NativeSelectOption value="mod-gross">Modified gross</NativeSelectOption>
              </NativeSelect>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Sizes</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <NativeSelect size="default" defaultValue="active">
                <NativeSelectOption value="active">Active</NativeSelectOption>
                <NativeSelectOption value="prospect">Prospect</NativeSelectOption>
                <NativeSelectOption value="closed">Closed</NativeSelectOption>
                <NativeSelectOption value="dead">Dead</NativeSelectOption>
              </NativeSelect>
            </Row>
            <Row label="sm">
              <NativeSelect size="sm" defaultValue="active">
                <NativeSelectOption value="active">Active</NativeSelectOption>
                <NativeSelectOption value="prospect">Prospect</NativeSelectOption>
                <NativeSelectOption value="closed">Closed</NativeSelectOption>
                <NativeSelectOption value="dead">Dead</NativeSelectOption>
              </NativeSelect>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Disabled */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled</p>
          <div className="flex flex-col gap-5">
            <Row label="disabled">
              <NativeSelect disabled defaultValue="office">
                <NativeSelectOption value="office">Office</NativeSelectOption>
                <NativeSelectOption value="retail">Retail</NativeSelectOption>
                <NativeSelectOption value="industrial">Industrial</NativeSelectOption>
              </NativeSelect>
              <NativeSelect size="sm" disabled defaultValue="office">
                <NativeSelectOption value="office">Office</NativeSelectOption>
                <NativeSelectOption value="retail">Retail</NativeSelectOption>
              </NativeSelect>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Option groups */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Option groups</p>
          <div className="flex flex-col gap-5">
            <Row label="building type">
              <NativeSelect defaultValue="">
                <NativeSelectOption value="" disabled>Select building type…</NativeSelectOption>
                <NativeSelectOptGroup label="Commercial">
                  <NativeSelectOption value="office-class-a">Office — class A</NativeSelectOption>
                  <NativeSelectOption value="office-class-b">Office — class B</NativeSelectOption>
                  <NativeSelectOption value="retail-street">Retail — street level</NativeSelectOption>
                  <NativeSelectOption value="retail-mall">Retail — mall</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Industrial">
                  <NativeSelectOption value="warehouse">Warehouse</NativeSelectOption>
                  <NativeSelectOption value="flex">Flex space</NativeSelectOption>
                  <NativeSelectOption value="cold-storage">Cold storage</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Mixed use">
                  <NativeSelectOption value="mixed-office-retail">Office + retail</NativeSelectOption>
                  <NativeSelectOption value="mixed-residential">Office + residential</NativeSelectOption>
                </NativeSelectOptGroup>
              </NativeSelect>
            </Row>
            <Row label="deal stage">
              <NativeSelect defaultValue="">
                <NativeSelectOption value="" disabled>Select stage…</NativeSelectOption>
                <NativeSelectOptGroup label="Early">
                  <NativeSelectOption value="touring">Touring</NativeSelectOption>
                  <NativeSelectOption value="proposal">Proposal sent</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Mid">
                  <NativeSelectOption value="loi">LOI issued</NativeSelectOption>
                  <NativeSelectOption value="negotiation">In negotiation</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Late">
                  <NativeSelectOption value="lease-out">Lease out for signature</NativeSelectOption>
                  <NativeSelectOption value="executed">Executed</NativeSelectOption>
                </NativeSelectOptGroup>
              </NativeSelect>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Error state */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Error state</p>
          <div className="flex flex-col gap-5">
            <Row label="invalid">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="err-select" className="text-destructive">
                  Lease type <span aria-hidden="true">*</span>
                </Label>
                <NativeSelect id="err-select" aria-invalid="true" defaultValue="">
                  <NativeSelectOption value="" disabled>Select lease type…</NativeSelectOption>
                  <NativeSelectOption value="fsg">Full-service gross</NativeSelectOption>
                  <NativeSelectOption value="nnn">Triple net (NNN)</NativeSelectOption>
                </NativeSelect>
                <p className="text-xs text-destructive">Lease type is required.</p>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Real-world form */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world — deal filter bar</p>
          <Row label="filters">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Building type</Label>
                <NativeSelect size="sm" defaultValue="">
                  <NativeSelectOption value="">All types</NativeSelectOption>
                  <NativeSelectOption value="office">Office</NativeSelectOption>
                  <NativeSelectOption value="retail">Retail</NativeSelectOption>
                  <NativeSelectOption value="industrial">Industrial</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Deal stage</Label>
                <NativeSelect size="sm" defaultValue="">
                  <NativeSelectOption value="">All stages</NativeSelectOption>
                  <NativeSelectOption value="touring">Touring</NativeSelectOption>
                  <NativeSelectOption value="loi">LOI issued</NativeSelectOption>
                  <NativeSelectOption value="executed">Executed</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Market</Label>
                <NativeSelect size="sm" defaultValue="sf">
                  <NativeSelectOption value="sf">San Francisco</NativeSelectOption>
                  <NativeSelectOption value="nyc">New York</NativeSelectOption>
                  <NativeSelectOption value="chi">Chicago</NativeSelectOption>
                  <NativeSelectOption value="la">Los Angeles</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline">Apply filters</Button>
              </div>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
