import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

const OFFICE_IMAGES = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
  "https://images.unsplash.com/photo-1462206092226-f46025ffe607?w=800",
]

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Aspect ratio</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Constrains content to a fixed aspect ratio using a CSS custom property. Accepts any numeric ratio.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* 16:9 */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · 16:9 widescreen</p>
          <Row label="ratio 1.778">
            <div className="max-w-2xl overflow-hidden rounded-xl border">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={OFFICE_IMAGES[0]}
                  alt="Office building exterior"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* 4:3 */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · 4:3 standard</p>
          <Row label="ratio 1.333">
            <div className="max-w-lg overflow-hidden rounded-xl border">
              <AspectRatio ratio={4 / 3}>
                <img
                  src={OFFICE_IMAGES[1]}
                  alt="Office interior"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* 1:1 */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · 1:1 square</p>
          <Row label="ratio 1">
            <div className="max-w-xs overflow-hidden rounded-xl border">
              <AspectRatio ratio={1}>
                <img
                  src={OFFICE_IMAGES[2]}
                  alt="Building lobby"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* 3:2 */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · 3:2 photo</p>
          <Row label="ratio 1.5">
            <div className="max-w-xl overflow-hidden rounded-xl border">
              <AspectRatio ratio={3 / 2}>
                <img
                  src={OFFICE_IMAGES[3]}
                  alt="Commercial office building"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Side-by-side comparison */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · All ratios side by side</p>
          <Row label="comparison">
            <div className="grid grid-cols-4 gap-4 max-w-3xl">
              {([
                { ratio: 16 / 9, label: "16:9" },
                { ratio: 4 / 3, label: "4:3" },
                { ratio: 1, label: "1:1" },
                { ratio: 3 / 2, label: "3:2" },
              ] as const).map(({ ratio, label }, i) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="overflow-hidden rounded-lg border">
                    <AspectRatio ratio={ratio}>
                      <img
                        src={OFFICE_IMAGES[i]}
                        alt={`Office building ${label}`}
                        className="h-full w-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With overlay content */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · With overlay content</p>
          <Row label="property card">
            <div className="max-w-sm overflow-hidden rounded-xl border bg-card">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={OFFICE_IMAGES[0]}
                  alt="101 Park Avenue"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <p className="font-semibold text-sm">101 Park Avenue</p>
                  <p className="text-xs opacity-80">New York, NY 10178</p>
                </div>
              </AspectRatio>
              <div className="p-3">
                <div className="flex gap-4 text-sm">
                  <div><p className="text-muted-foreground text-xs">Size</p><p className="font-medium">850,000 SF</p></div>
                  <div><p className="text-muted-foreground text-xs">Occupancy</p><p className="font-medium">94.2%</p></div>
                  <div><p className="text-muted-foreground text-xs">Class</p><p className="font-medium">A+</p></div>
                </div>
              </div>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
