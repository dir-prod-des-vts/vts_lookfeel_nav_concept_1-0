import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Building2, X } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
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
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Slide-in panels from any edge. Supports right, bottom, and form layouts. Built on Base UI Drawer.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Right drawer</p>
          <Row label="lease details">
            <Drawer direction="right">
              <DrawerTrigger render={<Button variant="outline">Open lease details</Button>} />
              <DrawerContent className="w-96">
                <DrawerHeader>
                  <DrawerTitle>Lease details</DrawerTitle>
                  <DrawerDescription>Acme Corp — 100 Mission Street</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                    <div className="size-9 rounded-lg bg-background flex items-center justify-center shrink-0">
                      <Building2 className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">100 Mission Street</p>
                      <p className="text-xs text-muted-foreground">14th floor, Suite 1400 — 12,400 SF</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ["Status", "Active"],
                      ["Commencement", "Jan 1, 2022"],
                      ["Expiration", "Dec 31, 2027"],
                      ["Base rent", "$48.50 / SF / yr"],
                      ["Annual rent", "$601,400"],
                      ["Security deposit", "$150,350"],
                      ["TI allowance", "$75.00 / SF"],
                      ["Renewal option", "Two 5-year options"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Edit lease</Button>
                  <DrawerClose render={<Button variant="outline">Close</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Bottom drawer</p>
          <Row label="mobile-style">
            <Drawer direction="bottom" showSwipeHandle>
              <DrawerTrigger render={<Button variant="outline">Open bottom sheet</Button>} />
              <DrawerContent className="max-h-[60vh]">
                <DrawerHeader>
                  <DrawerTitle>Select property</DrawerTitle>
                  <DrawerDescription>Choose a property to view details</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                  {[
                    ["100 Mission Street", "San Francisco, CA", "248,000 SF"],
                    ["350 Bush Street", "San Francisco, CA", "182,000 SF"],
                    ["One World Trade", "New York, NY", "3,100,000 SF"],
                    ["Rockefeller Plaza", "New York, NY", "620,000 SF"],
                    ["Wilshire Grand", "Los Angeles, CA", "900,000 SF"],
                  ].map(([name, city, sf]) => (
                    <div key={name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{city}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{sf}</span>
                    </div>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="outline" className="w-full">Cancel</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With form</p>
          <Row label="add contact">
            <Drawer direction="right">
              <DrawerTrigger render={<Button>Add contact</Button>} />
              <DrawerContent className="w-96">
                <DrawerHeader>
                  <DrawerTitle>Add contact</DrawerTitle>
                  <DrawerDescription>Add a new contact for Acme Corp.</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">First name</label>
                      <Input placeholder="Sarah" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Last name</label>
                      <Input placeholder="Chen" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Email</label>
                    <Input type="email" placeholder="sarah.chen@acmecorp.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Phone</label>
                    <Input type="tel" placeholder="+1 (415) 555-0100" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Title</label>
                    <Input placeholder="VP Real Estate" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Save contact</Button>
                  <DrawerClose render={<Button variant="outline">Cancel</Button>} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
