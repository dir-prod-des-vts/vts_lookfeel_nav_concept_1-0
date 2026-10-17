import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Mail, ChevronRight, Plus, Loader2, Trash2, ArrowUpRight, Search, Copy, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

const VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const SIZES = ["xs", "sm", "default", "lg"] as const

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-28 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Section({ title }: { title: string }) {
  return (
    <div className="col-span-full mt-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4">{title}</p>
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
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Button</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI with CVA. Six variants, four sizes, icon support, and loading/disabled states.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <div className="flex flex-col gap-5">
            {VARIANTS.map(v => (
              <Row key={v} label={v}>
                <Button variant={v}>Button</Button>
                <Button variant={v} disabled>Disabled</Button>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Sizes</p>
          <div className="flex flex-col gap-5">
            {SIZES.map(s => (
              <Row key={s} label={s}>
                <Button size={s}>Button</Button>
                <Button size={s} variant="outline">Button</Button>
                <Button size={s} variant="secondary">Button</Button>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Icon sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Icon buttons</p>
          <div className="flex flex-col gap-5">
            {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map(s => (
              <Row key={s} label={s}>
                <Button size={s}><Plus /></Button>
                <Button size={s} variant="outline"><Plus /></Button>
                <Button size={s} variant="secondary"><Plus /></Button>
                <Button size={s} variant="ghost"><Plus /></Button>
                <Button size={s} variant="destructive"><Trash2 /></Button>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* With icons */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With icons</p>
          <div className="flex flex-col gap-5">
            <Row label="leading">
              <Button><Mail data-icon="inline-start" />Send email</Button>
              <Button variant="outline"><Plus data-icon="inline-start" />New deal</Button>
              <Button variant="secondary"><Mail data-icon="inline-start" />Send email</Button>
              <Button variant="ghost"><Plus data-icon="inline-start" />Add</Button>
            </Row>
            <Row label="trailing">
              <Button>Continue<ChevronRight data-icon="inline-end" /></Button>
              <Button variant="outline">View all<ArrowUpRight data-icon="inline-end" /></Button>
              <Button variant="secondary">View all<ChevronRight data-icon="inline-end" /></Button>
              <Button variant="link">Learn more<ChevronRight data-icon="inline-end" /></Button>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* States */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · States</p>
          <div className="flex flex-col gap-5">
            <Row label="loading">
              <Button disabled><Loader2 className="animate-spin" data-icon="inline-start" />Saving…</Button>
              <Button variant="outline" disabled><Loader2 className="animate-spin" data-icon="inline-start" />Loading…</Button>
              <Button variant="secondary" disabled><Loader2 className="animate-spin" data-icon="inline-start" />Processing…</Button>
            </Row>
            <Row label="disabled">
              {VARIANTS.map(v => <Button key={v} variant={v} disabled>Disabled</Button>)}
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Small size showcase */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Common patterns</p>
          <div className="flex flex-col gap-5">
            <Row label="toolbar">
              <Button size="sm" variant="outline"><Plus data-icon="inline-start" />Add filter</Button>
              <Button size="sm" variant="ghost">Clear all</Button>
              <Button size="sm">Apply</Button>
            </Row>
            <Row label="action bar">
              <Button variant="ghost" size="icon-sm"><Trash2 /></Button>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm"><Mail data-icon="inline-start" />Send</Button>
            </Row>
            <Row label="destructive">
              <Button variant="destructive"><Trash2 data-icon="inline-start" />Delete lease</Button>
              <Button variant="destructive" size="sm">Remove</Button>
              <Button variant="outline" size="icon-sm"><Trash2 /></Button>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Button group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">07 · Button group</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <ButtonGroup>
                <Button variant="outline">Archive</Button>
                <Button variant="outline">Report</Button>
                <Button variant="outline">Snooze</Button>
              </ButtonGroup>
            </Row>
            <Row label="with icons">
              <ButtonGroup>
                <Button variant="outline" size="icon"><AlignLeft /></Button>
                <Button variant="outline" size="icon"><AlignCenter /></Button>
                <Button variant="outline" size="icon"><AlignRight /></Button>
              </ButtonGroup>
            </Row>
            <Row label="separator">
              <ButtonGroup>
                <Button>Copy</Button>
                <ButtonGroupSeparator />
                <Button size="icon"><Copy /></Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="secondary"><Search data-icon="inline-start" />Search</Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" size="icon"><Plus /></Button>
              </ButtonGroup>
            </Row>
            <Row label="vertical">
              <ButtonGroup orientation="vertical">
                <Button variant="outline">Top</Button>
                <Button variant="outline">Middle</Button>
                <Button variant="outline">Bottom</Button>
              </ButtonGroup>
            </Row>
            <Row label="sizes">
              <ButtonGroup>
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="sm">Group</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline">Default</Button>
                <Button variant="outline">Group</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="outline" size="lg">Large</Button>
                <Button variant="outline" size="lg">Group</Button>
              </ButtonGroup>
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
