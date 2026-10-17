import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Label</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Accessible form label with peer-disabled and group-disabled support. Pairs with any input component.
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
            <Row label="basic">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tenant-name">Tenant name</Label>
                <Input id="tenant-name" placeholder="e.g. Acme Corp" className="w-60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lease-start">Lease start date</Label>
                <Input id="lease-start" type="date" className="w-48" />
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Required */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Required indicator</p>
          <div className="flex flex-col gap-5">
            <Row label="with asterisk">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="building-name">
                  Building name
                  <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input id="building-name" placeholder="e.g. One Embarcadero Center" className="w-72" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sq-ft">
                  Square footage
                  <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input id="sq-ft" type="number" placeholder="0" className="w-36" required />
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Disabled */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled state</p>
          <div className="flex flex-col gap-5">
            <Row label="peer-disabled">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lease-type-disabled">Lease type</Label>
                <Input id="lease-type-disabled" value="Full-service gross" disabled className="w-52" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expiry-disabled">Expiration date</Label>
                <Input id="expiry-disabled" value="2027-06-30" disabled className="w-40" />
              </div>
            </Row>
            <Row label="group-disabled">
              <div data-disabled="true" className="group flex flex-col gap-1.5">
                <Label>Floor number</Label>
                <Input value="12" disabled className="w-32" />
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Error state */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Error state</p>
          <div className="flex flex-col gap-5">
            <Row label="with error">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rent-psf" className="text-destructive">
                  Rent per sf
                  <span aria-hidden="true">*</span>
                </Label>
                <Input id="rent-psf" aria-invalid="true" value="-5" className="w-36" />
                <p className="text-xs text-destructive">Rent must be a positive number.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deal-name-err" className="text-destructive">
                  Deal name
                </Label>
                <Input id="deal-name-err" aria-invalid="true" placeholder="Required" className="w-60" />
                <p className="text-xs text-destructive">Deal name is required.</p>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Real-world form */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Real-world — new lease form</p>
          <Row label="form">
            <div className="flex flex-col gap-4 w-full max-w-sm">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-tenant">
                  Tenant <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input id="form-tenant" placeholder="Search tenants…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="form-start">Start date</Label>
                  <Input id="form-start" type="date" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="form-end">End date</Label>
                  <Input id="form-end" type="date" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-rent">
                  Annual rent per sf <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input id="form-rent" type="number" placeholder="0.00" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-notes">Notes</Label>
                <Input id="form-notes" placeholder="Optional notes…" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save lease</Button>
              </div>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
