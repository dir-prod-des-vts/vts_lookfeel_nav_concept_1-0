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
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [notifications, setNotifications] = React.useState(true)
  const [archived, setArchived] = React.useState(false)
  const [autoRenew, setAutoRenew] = React.useState(false)
  const [emailDigest, setEmailDigest] = React.useState(true)
  const [alerts, setAlerts] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Switch</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Switch. Two sizes, on/off, disabled states, and flexible label placement.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · On/off states</p>
          <div className="flex flex-col gap-5">
            <Row label="off">
              <Switch checked={false} />
            </Row>
            <Row label="on">
              <Switch checked={true} />
            </Row>
            <Row label="disabled off">
              <Switch checked={false} disabled />
            </Row>
            <Row label="disabled on">
              <Switch checked={true} disabled />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With label (right)</p>
          <div className="flex flex-col gap-4">
            {[
              { id: "notifications", label: "Send notifications", checked: notifications, onChange: setNotifications },
              { id: "archived", label: "Show archived deals", checked: archived, onChange: setArchived },
              { id: "auto-renew", label: "Enable auto-renewal", checked: autoRenew, onChange: setAutoRenew },
            ].map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                />
                <Label htmlFor={item.id} className="cursor-pointer text-sm">{item.label}</Label>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With label (left)</p>
          <div className="flex flex-col gap-4">
            {[
              { id: "digest", label: "Weekly email digest", checked: emailDigest, onChange: setEmailDigest },
              { id: "alerts", label: "Expiry alerts", checked: alerts, onChange: setAlerts },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between max-w-xs">
                <Label htmlFor={item.id} className="cursor-pointer text-sm">{item.label}</Label>
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Sizes</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Switch size="default" checked={true} />
              <Switch size="default" checked={false} />
            </Row>
            <Row label="small">
              <Switch size="sm" checked={true} />
              <Switch size="sm" checked={false} />
            </Row>
            <Row label="sm + label">
              <div className="flex items-center gap-2">
                <Switch size="sm" id="compact-switch" defaultChecked />
                <Label htmlFor="compact-switch" className="cursor-pointer text-xs">Compact mode</Label>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Settings panel pattern</p>
          <div className="w-full max-w-sm rounded-lg border border-border divide-y divide-border">
            {[
              { id: "s1", label: "Send notifications", desc: "Get alerts for lease changes", checked: notifications, onChange: setNotifications },
              { id: "s2", label: "Show archived deals", desc: "Include closed and expired deals", checked: archived, onChange: setArchived },
              { id: "s3", label: "Enable auto-renewal", desc: "Automatically renew expiring leases", checked: autoRenew, onChange: setAutoRenew },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Switch
                  id={item.id}
                  size="sm"
                  checked={item.checked}
                  onCheckedChange={item.onChange}
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
