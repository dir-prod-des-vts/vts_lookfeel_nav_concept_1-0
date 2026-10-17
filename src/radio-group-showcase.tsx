import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [leaseType, setLeaseType] = React.useState("nnn")
  const [dealStage, setDealStage] = React.useState("")
  const [viewMode, setViewMode] = React.useState("list")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Radio group</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI RadioGroup. Supports vertical and horizontal layouts, disabled states, and descriptive sub-labels.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Vertical group</p>
          <Row label="lease type">
            <RadioGroup value={leaseType} onValueChange={setLeaseType} className="gap-3">
              {[
                { value: "gross", label: "Gross" },
                { value: "nnn", label: "NNN" },
                { value: "modified", label: "Modified gross" },
              ].map(opt => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`lease-${opt.value}`} />
                  <Label htmlFor={`lease-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Horizontal group</p>
          <Row label="view mode">
            <RadioGroup value={viewMode} onValueChange={setViewMode} className="flex flex-row gap-6">
              {[
                { value: "list", label: "List" },
                { value: "grid", label: "Grid" },
                { value: "map", label: "Map" },
              ].map(opt => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`view-${opt.value}`} />
                  <Label htmlFor={`view-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With descriptions</p>
          <Row label="deal stage">
            <RadioGroup value={dealStage} onValueChange={setDealStage} className="gap-4">
              {[
                { value: "prospect", label: "Prospect", desc: "Initial contact made, no signed docs" },
                { value: "active", label: "Active", desc: "Touring or negotiating a lease" },
                { value: "executed", label: "Executed", desc: "Lease signed and in effect" },
                { value: "expired", label: "Expired", desc: "Term ended, no renewal" },
              ].map(opt => (
                <div key={opt.value} className="flex items-start gap-2">
                  <RadioGroupItem value={opt.value} id={`stage-${opt.value}`} className="mt-0.5" />
                  <div>
                    <Label htmlFor={`stage-${opt.value}`} className="cursor-pointer font-medium">{opt.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled options</p>
          <Row label="access level">
            <RadioGroup defaultValue="viewer" className="gap-3">
              {[
                { value: "owner", label: "Owner", disabled: true },
                { value: "editor", label: "Editor", disabled: false },
                { value: "viewer", label: "Viewer", disabled: false },
                { value: "none", label: "No access", disabled: true },
              ].map(opt => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`access-${opt.value}`} disabled={opt.disabled} />
                  <Label
                    htmlFor={`access-${opt.value}`}
                    className={opt.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Pre-selected</p>
          <Row label="property class">
            <RadioGroup defaultValue="a" className="flex flex-row gap-6">
              {["A", "B", "C"].map(cls => (
                <div key={cls} className="flex items-center gap-2">
                  <RadioGroupItem value={cls.toLowerCase()} id={`class-${cls}`} />
                  <Label htmlFor={`class-${cls}`} className="cursor-pointer">Class {cls}</Label>
                </div>
              ))}
            </RadioGroup>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
