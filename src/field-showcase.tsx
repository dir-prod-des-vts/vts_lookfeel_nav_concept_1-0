import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3 flex-1">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Field</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Composable form fields with label, description, error, and group layouts.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Vertical (default)</p>
          <Row label="label + input">
            <div className="w-72">
              <Field orientation="vertical">
                <FieldLabel>Tenant name</FieldLabel>
                <Input placeholder="e.g. Acme Corp" />
                <FieldDescription>Enter the legal entity name as it appears on the lease.</FieldDescription>
              </Field>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Horizontal</p>
          <Row label="label beside">
            <div className="w-80">
              <Field orientation="horizontal">
                <FieldLabel>Base rent</FieldLabel>
                <Input placeholder="$48.50" type="number" />
              </Field>
            </div>
          </Row>
          <div className="mt-4" />
          <Row label="with description">
            <div className="w-80">
              <Field orientation="horizontal">
                <FieldLabel>
                  <FieldTitle>Floor / suite</FieldTitle>
                  <FieldDescription>Optional</FieldDescription>
                </FieldLabel>
                <Input placeholder="14F, Suite 1400" />
              </Field>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With error</p>
          <Row label="invalid">
            <div className="w-72">
              <Field orientation="vertical" data-invalid="true">
                <FieldLabel>Lease expiration date</FieldLabel>
                <Input aria-invalid placeholder="MM/DD/YYYY" defaultValue="13/99/2024" />
                <FieldError>Invalid date. Use MM/DD/YYYY format.</FieldError>
              </Field>
            </div>
          </Row>
          <div className="mt-4" />
          <Row label="required">
            <div className="w-72">
              <Field orientation="vertical" data-invalid="true">
                <FieldLabel>Tenant name</FieldLabel>
                <Input aria-invalid placeholder="Enter tenant name" />
                <FieldError>Tenant name is required.</FieldError>
              </Field>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled</p>
          <Row label="read-only">
            <div className="w-72">
              <Field orientation="vertical" data-disabled="true">
                <FieldLabel>Property address</FieldLabel>
                <Input disabled value="100 Mission Street, SF" />
                <FieldDescription>Address is synced from the property record.</FieldDescription>
              </Field>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Field group</p>
          <Row label="multi-field">
            <div className="w-full max-w-sm">
              <FieldGroup>
                <Field orientation="vertical">
                  <FieldLabel>First name</FieldLabel>
                  <Input placeholder="Sarah" />
                </Field>
                <Field orientation="vertical">
                  <FieldLabel>Last name</FieldLabel>
                  <Input placeholder="Chen" />
                </Field>
                <Field orientation="vertical">
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" placeholder="sarah.chen@acmecorp.com" />
                  <FieldDescription>Used for lease notifications.</FieldDescription>
                </Field>
              </FieldGroup>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · FieldSet with checkbox</p>
          <Row label="options">
            <div className="w-full max-w-sm">
              <FieldSet>
                <FieldLegend variant="legend">Notification preferences</FieldLegend>
                {[
                  ["Lease expiration", "Notify 90, 60, and 30 days before expiry"],
                  ["Rent escalations", "Notify when scheduled escalation is due"],
                  ["Critical dates", "Notify on option exercise deadlines"],
                ].map(([label, desc]) => (
                  <FieldLabel key={label} className="flex-row items-start gap-3 rounded-lg border border-border p-3">
                    <Field data-slot="field" className="mt-0.5">
                      <Checkbox />
                    </Field>
                    <FieldContent>
                      <FieldTitle>{label}</FieldTitle>
                      <FieldDescription>{desc}</FieldDescription>
                    </FieldContent>
                  </FieldLabel>
                ))}
              </FieldSet>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
