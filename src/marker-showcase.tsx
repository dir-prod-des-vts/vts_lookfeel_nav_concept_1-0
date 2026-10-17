import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Marker, MarkerIcon, MarkerContent } from "@/components/ui/marker"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HardHat,
  Wrench,
  TrendingUp,
  MapPin,
  Users,
  Building2,
} from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-col gap-2 flex-1 max-w-sm">{children}</div>
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
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Marker</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Section label or status row. Three variants: default, separator (with flanking lines), and border (bottom rule).
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
            <Row label="default">
              <Marker>
                <MarkerContent>Available space</MarkerContent>
              </Marker>
            </Row>
            <Row label="separator">
              <Marker variant="separator">
                <MarkerContent>4 properties</MarkerContent>
              </Marker>
            </Row>
            <Row label="border">
              <Marker variant="border">
                <MarkerContent>Lease details</MarkerContent>
              </Marker>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* With icons */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With icons</p>
          <div className="flex flex-col gap-5">
            <Row label="status icons">
              <Marker>
                <MarkerIcon><CheckCircle2 className="text-green-600" /></MarkerIcon>
                <MarkerContent>Available</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon><Users className="text-blue-600" /></MarkerIcon>
                <MarkerContent>Occupied</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon><HardHat className="text-yellow-600" /></MarkerIcon>
                <MarkerContent>Under construction</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon><Wrench className="text-orange-600" /></MarkerIcon>
                <MarkerContent>Under renovation</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon><XCircle className="text-red-600" /></MarkerIcon>
                <MarkerContent>Off market</MarkerContent>
              </Marker>
              <Marker>
                <MarkerIcon><Clock className="text-muted-foreground" /></MarkerIcon>
                <MarkerContent>Expiring within 12 months</MarkerContent>
              </Marker>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Separator variant with icons */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Separator with icons</p>
          <div className="flex flex-col gap-5">
            <Row label="section dividers">
              <Marker variant="separator">
                <MarkerIcon><Building2 /></MarkerIcon>
                <MarkerContent>3 buildings</MarkerContent>
              </Marker>
              <Marker variant="separator">
                <MarkerIcon><TrendingUp /></MarkerIcon>
                <MarkerContent>Active deals</MarkerContent>
              </Marker>
              <Marker variant="separator">
                <MarkerIcon><MapPin /></MarkerIcon>
                <MarkerContent>San Francisco</MarkerContent>
              </Marker>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Real-world: property list */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Real-world — property availability list</p>
          <Row label="status list">
            <div className="flex flex-col gap-1.5 w-full">
              <Marker variant="border">
                <MarkerIcon><MapPin /></MarkerIcon>
                <MarkerContent className="font-medium text-foreground">San Francisco portfolio</MarkerContent>
              </Marker>
              <div className="pl-6 flex flex-col gap-1">
                <Marker>
                  <MarkerIcon><CheckCircle2 className="text-green-600" /></MarkerIcon>
                  <MarkerContent>One Embarcadero Center — floors 12, 14 (available)</MarkerContent>
                </Marker>
                <Marker>
                  <MarkerIcon><Users className="text-blue-600" /></MarkerIcon>
                  <MarkerContent>555 California St — fully occupied</MarkerContent>
                </Marker>
                <Marker>
                  <MarkerIcon><AlertCircle className="text-yellow-600" /></MarkerIcon>
                  <MarkerContent>101 Mission St — lease expiring Jun 2026</MarkerContent>
                </Marker>
                <Marker>
                  <MarkerIcon><HardHat className="text-orange-600" /></MarkerIcon>
                  <MarkerContent>345 California Center — floors 8–10 under renovation</MarkerContent>
                </Marker>
              </div>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
