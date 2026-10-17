import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Info, SlidersHorizontal, Filter } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function ColumnFilterPopover() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({
    "office": true,
    "retail": false,
    "industrial": true,
    "mixed-use": false,
    "data-center": false,
  })

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm"><Filter className="size-3.5" data-icon="inline-start" />Filter type</Button>} />
      <PopoverContent className="w-56">
        <PopoverHeader>
          <PopoverTitle>Building type</PopoverTitle>
          <PopoverDescription>Show only selected types</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-1.5 mt-1">
          {Object.entries(checked).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer rounded-md px-1.5 py-1 hover:bg-muted">
              <input
                type="checkbox"
                checked={val}
                onChange={() => setChecked(prev => ({ ...prev, [key]: !prev[key] }))}
                className="accent-primary"
              />
              <span className="capitalize">{key.replace("-", " ")}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between gap-2 pt-1 border-t border-border mt-1">
          <Button size="sm" variant="ghost" onClick={() => setChecked(Object.fromEntries(Object.keys(checked).map(k => [k, false])))}>
            Clear
          </Button>
          <Button size="sm">Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
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
          <h1 className="text-3xl font-semibold text-foreground">Popover</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Non-modal overlay anchored to a trigger. Built on Base UI Popover with portal, positioner, and animated popup.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Default */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default — info popover</p>
          <Row label="simple">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm"><Info className="size-3.5" data-icon="inline-start" />About this metric</Button>} />
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Weighted average lease term</PopoverTitle>
                  <PopoverDescription>
                    The average remaining lease term weighted by square footage across all occupied suites in the portfolio.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="icon-sm"><Info /></Button>} />
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Effective rent</PopoverTitle>
                  <PopoverDescription>
                    Net rent after accounting for free rent periods and amortized tenant improvement allowances.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With form */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With form</p>
          <Row label="date filter">
            <Popover>
              <PopoverTrigger render={<Button variant="outline"><SlidersHorizontal className="size-3.5" data-icon="inline-start" />Filter by date</Button>} />
              <PopoverContent className="w-72">
                <PopoverHeader>
                  <PopoverTitle>Lease date range</PopoverTitle>
                  <PopoverDescription>Filter deals by commencement date</PopoverDescription>
                </PopoverHeader>
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pop-from">From</Label>
                    <Input id="pop-from" type="date" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pop-to">To</Label>
                    <Input id="pop-to" type="date" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">Clear</Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Placement variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Placement variants</p>
          <Row label="sides">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm">Top</Button>} />
              <PopoverContent side="top">
                <PopoverTitle>Popover on top</PopoverTitle>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm">Right</Button>} />
              <PopoverContent side="right">
                <PopoverTitle>Popover on right</PopoverTitle>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm">Bottom</Button>} />
              <PopoverContent side="bottom">
                <PopoverTitle>Popover on bottom</PopoverTitle>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="sm">Left</Button>} />
              <PopoverContent side="left">
                <PopoverTitle>Popover on left</PopoverTitle>
              </PopoverContent>
            </Popover>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world column filter */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Real-world — column filter</p>
          <Row label="table filter">
            <ColumnFilterPopover />
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
