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
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [radio, setRadio] = React.useState("option-1")

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
            A set of checkable buttons where only one can be checked at a time.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Options</p>
          <div className="flex flex-col gap-5">
            <Row label="options">
              <RadioGroup value={radio} onValueChange={setRadio} className="flex flex-col gap-2">
                {[["option-1", "Gross lease"], ["option-2", "Net lease"], ["option-3", "Modified gross"]].map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={v} />
                    <Label htmlFor={v}>{l}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Row>
            <Row label="disabled">
              <RadioGroup defaultValue="opt-1" className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="opt-1" id="d-opt-1" disabled />
                  <Label htmlFor="d-opt-1">Disabled option 1</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="opt-2" id="d-opt-2" disabled />
                  <Label htmlFor="d-opt-2">Disabled option 2</Label>
                </div>
              </RadioGroup>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
