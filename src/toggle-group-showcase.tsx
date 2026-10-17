import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { List, Grid3x3, Map, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-8">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [viewMode, setViewMode] = React.useState("list")
  const [formatting, setFormatting] = React.useState<string[]>([])
  const [alignment, setAlignment] = React.useState("left")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Toggle group</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI ToggleGroup. Supports single-select and multi-select, all sizes, disabled state, and outline variant.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Single select — view mode</p>
          <div className="flex flex-col gap-5">
            <Row label="text labels">
              <ToggleGroup value={viewMode} onValueChange={v => { if (v) setViewMode(v as string) }}>
                <ToggleGroupItem value="list">List</ToggleGroupItem>
                <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                <ToggleGroupItem value="map">Map</ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="icon only">
              <ToggleGroup value={viewMode} onValueChange={v => { if (v) setViewMode(v as string) }}>
                <ToggleGroupItem value="list" aria-label="List view"><List /></ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view"><Grid3x3 /></ToggleGroupItem>
                <ToggleGroupItem value="map" aria-label="Map view"><Map /></ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="icon + text">
              <ToggleGroup value={viewMode} onValueChange={v => { if (v) setViewMode(v as string) }} variant="outline">
                <ToggleGroupItem value="list"><List data-icon="inline-start" />List</ToggleGroupItem>
                <ToggleGroupItem value="grid"><Grid3x3 data-icon="inline-start" />Grid</ToggleGroupItem>
                <ToggleGroupItem value="map"><Map data-icon="inline-start" />Map</ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Selected: <span className="font-medium text-foreground">{viewMode}</span>
          </p>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Multiple select — text formatting</p>
          <Row label="formatting">
            <ToggleGroup
              value={formatting}
              onValueChange={v => setFormatting(Array.isArray(v) ? v : [v])}
            >
              <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
            </ToggleGroup>
          </Row>
          <Row label="alignment">
            <ToggleGroup value={alignment} onValueChange={v => { if (v) setAlignment(v as string) }}>
              <ToggleGroupItem value="left" aria-label="Left"><AlignLeft /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Center"><AlignCenter /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right"><AlignRight /></ToggleGroupItem>
            </ToggleGroup>
          </Row>
          <p className="text-xs text-muted-foreground mt-4">
            Active formatting: <span className="font-medium text-foreground">{formatting.length ? formatting.join(", ") : "none"}</span>
          </p>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Sizes</p>
          <div className="flex flex-col gap-5">
            {(["sm", "default", "lg"] as const).map(size => (
              <Row key={size} label={size}>
                <ToggleGroup size={size} defaultValue="list">
                  <ToggleGroupItem value="list">List</ToggleGroupItem>
                  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                  <ToggleGroupItem value="map">Map</ToggleGroupItem>
                </ToggleGroup>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled</p>
          <div className="flex flex-col gap-5">
            <Row label="all disabled">
              <ToggleGroup defaultValue="list">
                <ToggleGroupItem value="list" disabled>List</ToggleGroupItem>
                <ToggleGroupItem value="grid" disabled>Grid</ToggleGroupItem>
                <ToggleGroupItem value="map" disabled>Map</ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="partial">
              <ToggleGroup defaultValue="list">
                <ToggleGroupItem value="list">List</ToggleGroupItem>
                <ToggleGroupItem value="grid" disabled>Grid</ToggleGroupItem>
                <ToggleGroupItem value="map">Map</ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Outline variant</p>
          <div className="flex flex-col gap-5">
            <Row label="text">
              <ToggleGroup variant="outline" defaultValue="active">
                <ToggleGroupItem value="active">Active</ToggleGroupItem>
                <ToggleGroupItem value="expiring">Expiring</ToggleGroupItem>
                <ToggleGroupItem value="expired">Expired</ToggleGroupItem>
              </ToggleGroup>
            </Row>
            <Row label="icon">
              <ToggleGroup variant="outline" defaultValue="grid">
                <ToggleGroupItem value="list" aria-label="List"><List /></ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid"><Grid3x3 /></ToggleGroupItem>
                <ToggleGroupItem value="map" aria-label="Map"><Map /></ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
