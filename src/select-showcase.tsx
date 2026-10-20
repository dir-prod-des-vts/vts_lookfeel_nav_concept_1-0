import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [market, setMarket] = React.useState("")
  const [propertyType, setPropertyType] = React.useState("")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Select</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Select. Supports grouped options, placeholder, disabled state, sizes, and error/invalid state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="building type">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="mixed-use">Mixed use</SelectItem>
                <SelectItem value="life-sciences">Life sciences</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With groups</p>
          <Row label="market">
            <Select value={market} onValueChange={v => setMarket(v ?? "")}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>East Coast</SelectLabel>
                  <SelectItem value="nyc">New York, NY</SelectItem>
                  <SelectItem value="bos">Boston, MA</SelectItem>
                  <SelectItem value="dc">Washington, DC</SelectItem>
                  <SelectItem value="mia">Miami, FL</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>West Coast</SelectLabel>
                  <SelectItem value="sf">San Francisco, CA</SelectItem>
                  <SelectItem value="la">Los Angeles, CA</SelectItem>
                  <SelectItem value="sea">Seattle, WA</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Midwest</SelectLabel>
                  <SelectItem value="chi">Chicago, IL</SelectItem>
                  <SelectItem value="det">Detroit, MI</SelectItem>
                  <SelectItem value="min">Minneapolis, MN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Row>
          <Row label="property type">
            <Select value={propertyType} onValueChange={v => setPropertyType(v ?? "")}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Commercial</SelectLabel>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Industrial</SelectLabel>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="data-center">Data center</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled state</p>
          <Row label="disabled">
            <Select disabled>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Not available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="sf" disabled>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sf">San Francisco, CA</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Sizes</p>
          <Row label="default (h-8)">
            <Select>
              <SelectTrigger size="default" className="w-44">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nyc">New York, NY</SelectItem>
                <SelectItem value="sf">San Francisco, CA</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="small (h-7)">
            <Select>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nyc">New York, NY</SelectItem>
                <SelectItem value="sf">San Francisco, CA</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Error/invalid state</p>
          <Row label="invalid">
            <Select>
              <SelectTrigger className="w-48" aria-invalid="true">
                <SelectValue placeholder="Select a market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nyc">New York, NY</SelectItem>
                <SelectItem value="sf">San Francisco, CA</SelectItem>
                <SelectItem value="chi">Chicago, IL</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-destructive pt-1.5">Market is required</p>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · With placeholder</p>
          <Row label="deal stage">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose a stage..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="touring">Touring</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="executed">Executed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
