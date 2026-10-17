import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-col gap-3 flex-1 max-w-sm">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Progress</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Accessible progress bar built on Base UI. Supports label, value display, indeterminate state, and custom track/indicator styling.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Values */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Values</p>
          <Row label="0–100%">
            {[0, 25, 50, 75, 100].map(v => (
              <Progress key={v} value={v}>
                <ProgressLabel>{v}%</ProgressLabel>
                <ProgressValue>{v}%</ProgressValue>
              </Progress>
            ))}
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Track sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Track sizes</p>
          <Row label="sm / md / lg">
            <Progress value={60}>
              <ProgressLabel>Small</ProgressLabel>
              <ProgressTrack className="h-1">
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <Progress value={60}>
              <ProgressLabel>Default (h-1)</ProgressLabel>
            </Progress>
            <Progress value={60}>
              <ProgressLabel>Medium</ProgressLabel>
              <ProgressTrack className="h-2">
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <Progress value={60}>
              <ProgressLabel>Large</ProgressLabel>
              <ProgressTrack className="h-3">
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Indicator colors */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Indicator colors</p>
          <Row label="semantic">
            <Progress value={85}>
              <ProgressLabel>Healthy occupancy</ProgressLabel>
              <ProgressValue>85%</ProgressValue>
              <ProgressTrack className="h-2">
                <ProgressIndicator className="bg-green-500" />
              </ProgressTrack>
            </Progress>
            <Progress value={55}>
              <ProgressLabel>Moderate occupancy</ProgressLabel>
              <ProgressValue>55%</ProgressValue>
              <ProgressTrack className="h-2">
                <ProgressIndicator className="bg-yellow-500" />
              </ProgressTrack>
            </Progress>
            <Progress value={22}>
              <ProgressLabel>Low occupancy</ProgressLabel>
              <ProgressValue>22%</ProgressValue>
              <ProgressTrack className="h-2">
                <ProgressIndicator className="bg-red-500" />
              </ProgressTrack>
            </Progress>
            <Progress value={100}>
              <ProgressLabel>Fully leased</ProgressLabel>
              <ProgressValue>100%</ProgressValue>
              <ProgressTrack className="h-2">
                <ProgressIndicator className="bg-primary" />
              </ProgressTrack>
            </Progress>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Indeterminate */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Indeterminate / loading</p>
          <Row label="loading state">
            <Progress value={null}>
              <ProgressLabel>Loading portfolio data…</ProgressLabel>
              <ProgressTrack className="h-1.5 overflow-hidden">
                <ProgressIndicator className="animate-[indeterminate_1.5s_ease-in-out_infinite] w-1/2" />
              </ProgressTrack>
            </Progress>
            <style>{`
              @keyframes indeterminate {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Real-world — portfolio summary</p>
          <Row label="buildings">
            <div className="flex flex-col gap-4 w-full">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">One Embarcadero Center</span>
                  <span className="text-sm text-muted-foreground">94%</span>
                </div>
                <Progress value={94}>
                  <ProgressTrack className="h-2">
                    <ProgressIndicator className="bg-green-500" />
                  </ProgressTrack>
                </Progress>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">555 California Street</span>
                  <span className="text-sm text-muted-foreground">71%</span>
                </div>
                <Progress value={71}>
                  <ProgressTrack className="h-2">
                    <ProgressIndicator className="bg-yellow-500" />
                  </ProgressTrack>
                </Progress>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">345 California Center</span>
                  <span className="text-sm text-muted-foreground">38%</span>
                </div>
                <Progress value={38}>
                  <ProgressTrack className="h-2">
                    <ProgressIndicator className="bg-red-500" />
                  </ProgressTrack>
                </Progress>
              </div>
            </div>
          </Row>

          <div className="mt-8">
            <Row label="deal stage">
              <div className="flex flex-col gap-3 w-full">
                <Progress value={20}>
                  <ProgressLabel>Touring</ProgressLabel>
                  <ProgressValue>2 deals</ProgressValue>
                </Progress>
                <Progress value={45}>
                  <ProgressLabel>LOI issued</ProgressLabel>
                  <ProgressValue>4 deals</ProgressValue>
                </Progress>
                <Progress value={70}>
                  <ProgressLabel>In negotiation</ProgressLabel>
                  <ProgressValue>7 deals</ProgressValue>
                </Progress>
                <Progress value={90}>
                  <ProgressLabel>Lease out for signature</ProgressLabel>
                  <ProgressValue>9 deals</ProgressValue>
                </Progress>
                <Progress value={100}>
                  <ProgressLabel>Executed</ProgressLabel>
                  <ProgressValue>10 deals</ProgressValue>
                </Progress>
              </div>
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
