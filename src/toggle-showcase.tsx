import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline, List, Grid3x3, Map, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-8">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const VARIANTS = ["default", "outline"] as const
const SIZES = ["sm", "default", "lg"] as const

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [bold, setBold] = React.useState(false)
  const [italic, setItalic] = React.useState(false)
  const [underline, setUnderline] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Toggle</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Toggle. Two variants (default, outline), three sizes, pressed/unpressed states, disabled, and icon or text+icon combos.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <div className="flex flex-col gap-5">
            {VARIANTS.map(v => (
              <Row key={v} label={v}>
                <Toggle variant={v}>Unpressed</Toggle>
                <Toggle variant={v} defaultPressed>Pressed</Toggle>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Sizes</p>
          <div className="flex flex-col gap-5">
            {SIZES.map(s => (
              <Row key={s} label={s}>
                <Toggle size={s}>Toggle</Toggle>
                <Toggle size={s} variant="outline">Toggle</Toggle>
                <Toggle size={s} defaultPressed>Pressed</Toggle>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With icon only</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Toggle aria-label="Bold"><Bold /></Toggle>
              <Toggle aria-label="Italic" defaultPressed><Italic /></Toggle>
              <Toggle aria-label="Underline"><Underline /></Toggle>
            </Row>
            <Row label="outline">
              <Toggle variant="outline" aria-label="List view"><List /></Toggle>
              <Toggle variant="outline" aria-label="Grid view" defaultPressed><Grid3x3 /></Toggle>
              <Toggle variant="outline" aria-label="Map view"><Map /></Toggle>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Text with icon</p>
          <div className="flex flex-col gap-5">
            <Row label="leading icon">
              <Toggle variant="outline"><List data-icon="inline-start" />List</Toggle>
              <Toggle variant="outline" defaultPressed><Grid3x3 data-icon="inline-start" />Grid</Toggle>
              <Toggle variant="outline"><Map data-icon="inline-start" />Map</Toggle>
            </Row>
            <Row label="text format">
              <Toggle pressed={bold} onPressedChange={setBold}><Bold data-icon="inline-start" />Bold</Toggle>
              <Toggle pressed={italic} onPressedChange={setItalic}><Italic data-icon="inline-start" />Italic</Toggle>
              <Toggle pressed={underline} onPressedChange={setUnderline}><Underline data-icon="inline-start" />Underline</Toggle>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Disabled</p>
          <div className="flex flex-col gap-5">
            <Row label="disabled off">
              <Toggle disabled>Toggle</Toggle>
              <Toggle variant="outline" disabled><Bold /></Toggle>
            </Row>
            <Row label="disabled on">
              <Toggle disabled defaultPressed>Toggle</Toggle>
              <Toggle variant="outline" disabled defaultPressed><Italic /></Toggle>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Alignment toolbar pattern</p>
          <Row label="align">
            <div className="flex gap-1 rounded-lg border border-border p-0.5">
              <Toggle size="sm" aria-label="Align left" defaultPressed><AlignLeft /></Toggle>
              <Toggle size="sm" aria-label="Align center"><AlignCenter /></Toggle>
              <Toggle size="sm" aria-label="Align right"><AlignRight /></Toggle>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
