import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Command } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
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
          <h1 className="text-3xl font-semibold text-foreground">Kbd</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Keyboard key indicator. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">Kbd</code> for single keys and <code className="text-xs bg-muted px-1 py-0.5 rounded">KbdGroup</code> for combinations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Single keys */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Single keys</p>
          <div className="flex flex-col gap-5">
            <Row label="letters">
              {["K", "P", "N", "S", "D", "F"].map(k => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </Row>
            <Row label="modifiers">
              <Kbd><Command className="size-3" /></Kbd>
              <Kbd>⌥</Kbd>
              <Kbd>⌃</Kbd>
              <Kbd>⇧</Kbd>
            </Row>
            <Row label="special">
              <Kbd>Enter</Kbd>
              <Kbd>Esc</Kbd>
              <Kbd>Tab</Kbd>
              <Kbd>Space</Kbd>
              <Kbd>⌫</Kbd>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
            </Row>
            <Row label="function">
              <Kbd>F1</Kbd>
              <Kbd>F5</Kbd>
              <Kbd>F12</Kbd>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Key combinations */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Key combinations</p>
          <div className="flex flex-col gap-5">
            <Row label="common">
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>K</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>S</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>Z</Kbd></KbdGroup>
            </Row>
            <Row label="navigation">
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>1</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>2</Kbd></KbdGroup>
              <KbdGroup><Kbd>⌥</Kbd><Kbd>↑</Kbd></KbdGroup>
              <KbdGroup><Kbd>⌥</Kbd><Kbd>↓</Kbd></KbdGroup>
            </Row>
            <Row label="editing">
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>C</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>V</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>X</Kbd></KbdGroup>
              <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>A</Kbd></KbdGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* In context */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · In context</p>
          <div className="flex flex-col gap-5">
            <Row label="inline prose">
              <p className="text-sm text-muted-foreground">
                Press <Kbd><Command className="size-3" /></Kbd><Kbd>K</Kbd> to open the command palette, or <Kbd>Esc</Kbd> to dismiss.
              </p>
            </Row>
            <Row label="menu item">
              <div className="w-52 rounded-lg border border-border bg-popover p-1 text-sm shadow-md">
                <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent cursor-default">
                  <span>New deal</span>
                  <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>N</Kbd></KbdGroup>
                </div>
                <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent cursor-default">
                  <span>Save draft</span>
                  <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>S</Kbd></KbdGroup>
                </div>
                <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent cursor-default">
                  <span>Command palette</span>
                  <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>K</Kbd></KbdGroup>
                </div>
                <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent cursor-default">
                  <span>Close panel</span>
                  <Kbd>Esc</Kbd>
                </div>
              </div>
            </Row>
            <Row label="search hint">
              <div className="flex w-72 items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                <span>Search buildings and deals…</span>
                <KbdGroup><Kbd><Command className="size-3" /></Kbd><Kbd>K</Kbd></KbdGroup>
              </div>
            </Row>
            <Row label="help text">
              <p className="text-sm text-muted-foreground max-w-prose">
                Use <KbdGroup><Kbd>↑</Kbd><Kbd>↓</Kbd></KbdGroup> to navigate results, <Kbd>Enter</Kbd> to select, and <Kbd>Esc</Kbd> to cancel.
              </p>
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
