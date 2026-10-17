import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
  const [switchOn, setSwitchOn] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Switch</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            A control that allows the user to toggle between checked and not checked.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · States</p>
          <div className="flex flex-col gap-5">
            <Row label="states">
              <div className="flex items-center gap-2">
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="sw1" />
                <Label htmlFor="sw1">Email notifications</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked id="sw2" />
                <Label htmlFor="sw2">Push notifications</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch disabled id="sw3" />
                <Label htmlFor="sw3">Disabled</Label>
              </div>
            </Row>
            <Row label="small">
              <Switch size="sm" />
              <Switch size="sm" defaultChecked />
              <Switch size="sm" disabled />
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
