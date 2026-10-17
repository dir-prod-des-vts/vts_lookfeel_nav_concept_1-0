import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

const occupancy = [87, 92, 95, 83]

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
          <h1 className="text-3xl font-semibold text-foreground">Carousel</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Horizontally scrollable content slider with navigation controls.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Horizontal</p>
          <div className="flex flex-col gap-5">
            <Row label="horizontal">
              <Carousel className="w-72">
                <CarouselContent>
                  {["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"].map((q, i) => (
                    <CarouselItem key={q}>
                      <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-sm font-medium">{q}</p>
                        <p className="text-2xl font-bold mt-1">{occupancy[i]}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Occupancy</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
