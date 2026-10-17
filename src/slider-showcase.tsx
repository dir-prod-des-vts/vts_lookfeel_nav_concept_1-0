import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 flex flex-wrap items-center gap-6">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [rent, setRent] = React.useState([40, 120])
  const [area, setArea] = React.useState([5000, 50000])
  const [occupancy, setOccupancy] = React.useState([85])
  const [floor, setFloor] = React.useState([3])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Slider</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Slider. Supports single thumb, range (two thumbs), discrete steps, disabled state, and vertical orientation.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default (single thumb)</p>
          <Row label="occupancy">
            <div className="w-72 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min occupancy threshold</span>
                <span className="font-medium text-foreground">{occupancy[0]}%</span>
              </div>
              <Slider
                value={occupancy}
                onValueChange={setOccupancy}
                min={0}
                max={100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span><span>100%</span>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Range (two thumbs)</p>
          <Row label="rent range">
            <div className="w-80 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>NER range</span>
                <span className="font-medium text-foreground">${rent[0]}/SF – ${rent[1]}/SF</span>
              </div>
              <Slider
                value={rent}
                onValueChange={setRent}
                min={0}
                max={200}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0/SF</span><span>$200/SF</span>
              </div>
            </div>
          </Row>
          <Row label="floor area">
            <div className="w-80 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>RSF range</span>
                <span className="font-medium text-foreground">{area[0].toLocaleString()} – {area[1].toLocaleString()} SF</span>
              </div>
              <Slider
                value={area}
                onValueChange={setArea}
                min={0}
                max={100000}
                step={1000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 SF</span><span>100,000 SF</span>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Steps (discrete)</p>
          <Row label="floor">
            <div className="w-72 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Floor number</span>
                <span className="font-medium text-foreground">Floor {floor[0]}</span>
              </div>
              <Slider
                value={floor}
                onValueChange={setFloor}
                min={1}
                max={40}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Floor 1</span><span>Floor 40</span>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled</p>
          <Row label="disabled">
            <div className="w-72 flex flex-col gap-2">
              <Slider defaultValue={[60]} disabled />
              <p className="text-xs text-muted-foreground">Single — locked at 60</p>
            </div>
            <div className="w-72 flex flex-col gap-2">
              <Slider defaultValue={[25, 75]} disabled />
              <p className="text-xs text-muted-foreground">Range — locked at 25–75</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · With value display</p>
          <Row label="lease term">
            <ValueSlider />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Vertical orientation</p>
          <Row label="priority">
            <div className="flex gap-8 h-40 items-end">
              {["Low", "Medium", "High"].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Slider
                    orientation="vertical"
                    defaultValue={[(i + 1) * 30]}
                    min={0}
                    max={100}
                    className="h-32"
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

function ValueSlider() {
  const [value, setValue] = React.useState([5])
  return (
    <div className="w-72 flex flex-col gap-3">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Lease term</span>
        <span className="font-semibold text-foreground text-sm">{value[0]} {value[0] === 1 ? "year" : "years"}</span>
      </div>
      <Slider value={value} onValueChange={setValue} min={1} max={20} step={1} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 year</span><span>20 years</span>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
