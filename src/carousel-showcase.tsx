import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

const PROPERTIES = [
  {
    name: "101 Park Avenue",
    city: "New York, NY",
    size: "850,000 SF",
    occupancy: "94.2%",
    ner: "$52/SF",
    class: "Class A+",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600",
  },
  {
    name: "Tower SF",
    city: "San Francisco, CA",
    size: "420,000 SF",
    occupancy: "88.5%",
    ner: "$68/SF",
    class: "Class A",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
  },
  {
    name: "One World Plaza",
    city: "Chicago, IL",
    size: "680,000 SF",
    occupancy: "91.0%",
    ner: "$44/SF",
    class: "Class A",
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600",
  },
  {
    name: "Park Place",
    city: "Boston, MA",
    size: "320,000 SF",
    occupancy: "97.1%",
    ner: "$58/SF",
    class: "Class A+",
    img: "https://images.unsplash.com/photo-1462206092226-f46025ffe607?w=600",
  },
  {
    name: "Metro Center",
    city: "Washington, DC",
    size: "510,000 SF",
    occupancy: "86.3%",
    ner: "$47/SF",
    class: "Class B",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600",
  },
]

const DEALS = [
  { tenant: "Acme Corp", building: "101 Park Ave", sf: "24,500 SF", stage: "Executed", stageVariant: "default" as const },
  { tenant: "Globex LLC", building: "Tower SF", sf: "12,200 SF", stage: "Negotiating", stageVariant: "secondary" as const },
  { tenant: "Initech Inc", building: "One World", sf: "8,800 SF", stage: "Touring", stageVariant: "outline" as const },
  { tenant: "Umbrella Co", building: "Park Place", sf: "15,000 SF", stage: "Prospect", stageVariant: "ghost" as const },
]

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
          <h1 className="text-3xl font-semibold text-foreground">Carousel</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Embla Carousel. Horizontal and vertical orientations, navigation arrows, partial-slide peek, and variable basis.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Horizontal property cards */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Horizontal — property cards</p>
          <Row label="with arrows">
            <div className="px-12">
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {PROPERTIES.map(p => (
                    <CarouselItem key={p.name} className="basis-72">
                      <div className="border rounded-xl overflow-hidden bg-card">
                        <img src={p.img} alt={p.name} className="w-full h-32 object-cover" />
                        <div className="p-3 flex flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm">{p.name}</p>
                            <Badge variant="outline" className="shrink-0">{p.class}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{p.city}</p>
                          <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                            <div>
                              <p className="text-muted-foreground">Size</p>
                              <p className="font-medium">{p.size}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Occ.</p>
                              <p className="font-medium">{p.occupancy}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">NER</p>
                              <p className="font-medium">{p.ner}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* One slide at a time */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · One slide at a time</p>
          <Row label="full width">
            <div className="px-12 max-w-xl">
              <Carousel opts={{ align: "center" }}>
                <CarouselContent>
                  {PROPERTIES.map(p => (
                    <CarouselItem key={p.name}>
                      <div className="border rounded-xl overflow-hidden bg-card">
                        <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.city} · {p.size}</p>
                          <div className="flex gap-4 mt-3 text-sm">
                            <div><p className="text-muted-foreground text-xs">Occupancy</p><p className="font-medium">{p.occupancy}</p></div>
                            <div><p className="text-muted-foreground text-xs">NER</p><p className="font-medium">{p.ner}</p></div>
                            <div><p className="text-muted-foreground text-xs">Class</p><p className="font-medium">{p.class}</p></div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Deal cards */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Deal cards</p>
          <Row label="deals">
            <div className="px-12">
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {DEALS.map(d => (
                    <CarouselItem key={d.tenant} className="basis-56">
                      <div className="border rounded-xl p-4 bg-card flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm">{d.tenant}</p>
                          <Badge variant={d.stageVariant}>{d.stage}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{d.building}</p>
                        <p className="text-xs text-muted-foreground">{d.sf}</p>
                        <Button variant="outline" size="sm" className="mt-2 w-full">View deal</Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Vertical */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Vertical</p>
          <Row label="vertical">
            <div className="relative h-80 py-12 w-72">
              <Carousel orientation="vertical" opts={{ align: "start" }} className="h-full">
                <CarouselContent className="h-64">
                  {PROPERTIES.map(p => (
                    <CarouselItem key={p.name} className="basis-1/3">
                      <div className="border rounded-xl p-3 bg-card flex items-center gap-3 h-full">
                        <img src={p.img} alt={p.name} className="size-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.city}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
