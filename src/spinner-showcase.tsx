import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-8">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const handleLoad = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2500)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Spinner</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            An animated loading indicator. Compose with size utilities and color tokens for any context.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Sizes</p>
          <div className="flex flex-col gap-5">
            <Row label="xs (size-3)">
              <Spinner className="size-3" />
            </Row>
            <Row label="sm (size-4)">
              <Spinner className="size-4" />
            </Row>
            <Row label="default (size-5)">
              <Spinner className="size-5" />
            </Row>
            <Row label="lg (size-6)">
              <Spinner className="size-6" />
            </Row>
            <Row label="xl (size-8)">
              <Spinner className="size-8" />
            </Row>
            <Row label="2xl (size-10)">
              <Spinner className="size-10" />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Colors</p>
          <div className="flex flex-col gap-5">
            <Row label="foreground">
              <Spinner className="size-5 text-foreground" />
            </Row>
            <Row label="primary">
              <Spinner className="size-5 text-primary" />
            </Row>
            <Row label="muted">
              <Spinner className="size-5 text-muted-foreground" />
            </Row>
            <Row label="destructive">
              <Spinner className="size-5 text-destructive" />
            </Row>
            <Row label="on dark bg">
              <div className="flex items-center justify-center size-10 rounded-md bg-primary">
                <Spinner className="size-5 text-primary-foreground" />
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Inside a button</p>
          <div className="flex flex-wrap gap-3">
            <Button disabled={saving} onClick={handleSave}>
              {saving ? (
                <><Spinner className="size-4 mr-1.5" />Saving lease…</>
              ) : (
                "Save lease"
              )}
            </Button>
            <Button variant="outline" disabled={loading} onClick={handleLoad}>
              {loading ? (
                <><Spinner className="size-4 mr-1.5" />Loading…</>
              ) : (
                "Load portfolio"
              )}
            </Button>
            <Button variant="secondary" disabled>
              <Spinner className="size-4 mr-1.5" />Processing…
            </Button>
            <Button variant="ghost" disabled>
              <Spinner className="size-4 mr-1.5" />Syncing
            </Button>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Replacing content during loading</p>
          <div className="flex gap-4">
            <div className="w-56 rounded-lg border border-border p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Leases expiring</p>
              </div>
              <div className="flex items-center justify-center h-12">
                <Spinner className="size-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Loading metrics…</p>
            </div>
            <div className="w-56 rounded-lg border border-border p-4 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total NER</p>
              <p className="text-2xl font-semibold">$78.40/SF</p>
              <p className="text-xs text-muted-foreground">Avg across 47 leases</p>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Full-page overlay</p>
          <div className="relative h-40 rounded-lg border border-border overflow-hidden bg-background">
            <div className="p-4 text-sm text-muted-foreground">
              <p>Portfolio data would render here.</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Spinner className="size-7 text-primary" />
                <p className="text-sm text-muted-foreground">Loading portfolio…</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
