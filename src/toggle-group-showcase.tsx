import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Layers, Menu } from "lucide-react"

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

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Toggle group</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            A set of two-state buttons that can be toggled on or off.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Selection modes</p>
          <div className="flex flex-col gap-5">
            <Row label="single">
              <ToggleGroup type="single" defaultValue={["list"]}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Layers className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <Menu className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="multiple">
              <ToggleGroup type="multiple">
                <ToggleGroupItem value="bold" aria-label="Bold"><span className="font-bold text-sm">B</span></ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic"><span className="italic text-sm">I</span></ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline"><span className="underline text-sm">U</span></ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
