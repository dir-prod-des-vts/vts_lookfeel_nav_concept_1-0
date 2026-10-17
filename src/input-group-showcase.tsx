import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, MapPin, DollarSign } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Input group</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Inputs composed with leading and trailing addons, icons, text, and buttons.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Leading addon</p>
          <div className="flex flex-col gap-4">
            <Row label="$ prefix">
              <InputGroup className="w-48">
                <InputGroupAddon align="inline-start">$</InputGroupAddon>
                <InputGroupInput placeholder="0.00" type="number" />
              </InputGroup>
            </Row>
            <Row label="search icon">
              <InputGroup className="w-64">
                <InputGroupAddon align="inline-start"><Search /></InputGroupAddon>
                <InputGroupInput placeholder="Search leases..." />
              </InputGroup>
            </Row>
            <Row label="location icon">
              <InputGroup className="w-64">
                <InputGroupAddon align="inline-start"><MapPin /></InputGroupAddon>
                <InputGroupInput placeholder="San Francisco, CA" />
              </InputGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Trailing addon</p>
          <div className="flex flex-col gap-4">
            <Row label="/mo suffix">
              <InputGroup className="w-48">
                <InputGroupInput placeholder="0.00" type="number" />
                <InputGroupAddon align="inline-end">/mo</InputGroupAddon>
              </InputGroup>
            </Row>
            <Row label="SF/yr unit">
              <InputGroup className="w-48">
                <InputGroupInput placeholder="48.50" type="number" />
                <InputGroupAddon align="inline-end">SF/yr</InputGroupAddon>
              </InputGroup>
            </Row>
            <Row label="%">
              <InputGroup className="w-40">
                <InputGroupInput placeholder="0" type="number" />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Both addons</p>
          <div className="flex flex-col gap-4">
            <Row label="$ + /yr">
              <InputGroup className="w-56">
                <InputGroupAddon align="inline-start">$</InputGroupAddon>
                <InputGroupInput placeholder="0.00" type="number" />
                <InputGroupAddon align="inline-end">/yr</InputGroupAddon>
              </InputGroup>
            </Row>
            <Row label="$ + /SF/yr">
              <InputGroup className="w-56">
                <InputGroupAddon align="inline-start"><DollarSign /></InputGroupAddon>
                <InputGroupInput placeholder="48.50" type="number" />
                <InputGroupAddon align="inline-end">/ SF / yr</InputGroupAddon>
              </InputGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With button</p>
          <div className="flex flex-col gap-4">
            <Row label="search">
              <InputGroup className="w-72">
                <InputGroupAddon align="inline-start"><Search /></InputGroupAddon>
                <InputGroupInput placeholder="Search tenants..." />
                <InputGroupButton>Search</InputGroupButton>
              </InputGroup>
            </Row>
            <Row label="copy">
              <InputGroup className="w-80">
                <InputGroupInput readOnly value="https://vts.com/leases/acme-corp-100-mission" />
                <InputGroupButton variant="ghost">Copy</InputGroupButton>
              </InputGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Error state</p>
          <div className="flex flex-col gap-4">
            <Row label="invalid">
              <div className="flex flex-col gap-1.5">
                <InputGroup className="w-56">
                  <InputGroupAddon align="inline-start">$</InputGroupAddon>
                  <InputGroupInput aria-invalid defaultValue="-50" type="number" />
                  <InputGroupAddon align="inline-end">/ SF / yr</InputGroupAddon>
                </InputGroup>
                <p className="text-xs text-destructive">Rent must be a positive number.</p>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Disabled</p>
          <Row label="non-interactive">
            <InputGroup className="w-56" data-disabled="true">
              <InputGroupAddon align="inline-start">$</InputGroupAddon>
              <InputGroupInput disabled value="48.50" type="number" />
              <InputGroupAddon align="inline-end">/ SF / yr</InputGroupAddon>
            </InputGroup>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
