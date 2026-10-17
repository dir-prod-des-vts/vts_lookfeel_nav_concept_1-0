import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Checkbox</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Binary selection control for forms and settings.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · States</p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <Row label="states">
                <div className="flex items-center gap-2">
                  <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                  <Label htmlFor="cb1">Send reminder emails</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb2" defaultChecked />
                  <Label htmlFor="cb2">Notify on critical dates</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="cb3" disabled />
                  <Label htmlFor="cb3">Disabled option</Label>
                </div>
              </Row>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
