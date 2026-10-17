import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Drawer</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Slide-in panel from the bottom edge for supplementary content.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Bottom</p>
          <div className="flex flex-col gap-5">
            <Row label="bottom">
              <Drawer>
                <DrawerTrigger render={<Button variant="outline" />}>
                  Open drawer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Lease summary</DrawerTitle>
                    <DrawerDescription>Key metrics for your current portfolio.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    {[["Active leases", "142"], ["Sq ft managed", "4.2M"], ["Occupancy", "94%"], ["Avg rent", "$52/sf"]].map(([k, v]) => (
                      <div key={k} className="rounded-lg border bg-card p-3">
                        <p className="text-xs text-muted-foreground">{k}</p>
                        <p className="text-xl font-semibold">{v}</p>
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
