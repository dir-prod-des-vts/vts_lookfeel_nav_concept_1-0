import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Sheet</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI Dialog. A panel that slides in from any edge. Use for detail views, navigation, and forms.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Right sheet (default)</p>
          <Row label="lease details">
            <Sheet>
              <SheetTrigger render={<Button variant="outline">Open lease details</Button>} />
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Lease details</SheetTitle>
                  <SheetDescription>111 8th Ave, Floor 12 — Acme Corp</SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="px-4 flex flex-col gap-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-3">
                    <span className="text-muted-foreground">Tenant</span><span className="font-medium">Acme Corp</span>
                    <span className="text-muted-foreground">Building</span><span className="font-medium">111 8th Ave</span>
                    <span className="text-muted-foreground">Floor</span><span className="font-medium">12</span>
                    <span className="text-muted-foreground">RSF</span><span className="font-medium">42,000</span>
                    <span className="text-muted-foreground">Commencement</span><span className="font-medium">Apr 1, 2019</span>
                    <span className="text-muted-foreground">Expiration</span><span className="font-medium">Mar 31, 2026</span>
                    <span className="text-muted-foreground">NER</span><span className="font-medium">$72/SF</span>
                    <span className="text-muted-foreground">Lease type</span><span className="font-medium">NNN</span>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose render={<Button variant="outline">Close</Button>} />
                  <Button>Edit lease</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Left sheet</p>
          <Row label="navigation">
            <Sheet>
              <SheetTrigger render={<Button variant="outline">Open nav</Button>} />
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="px-4 flex flex-col gap-1 text-sm">
                  {["Portfolio", "Leases", "Deals", "Contacts", "Reports", "Settings"].map(item => (
                    <div key={item} className="px-2 py-2.5 rounded hover:bg-accent cursor-pointer font-medium">{item}</div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Top sheet</p>
          <Row label="search">
            <Sheet>
              <SheetTrigger render={<Button variant="outline">Open top sheet</Button>} />
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Search leases</SheetTitle>
                  <SheetDescription>Find leases by tenant, building, or market</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-2">
                  <Input placeholder="Search by tenant name or building..." />
                </div>
              </SheetContent>
            </Sheet>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Bottom sheet</p>
          <Row label="filters">
            <Sheet>
              <SheetTrigger render={<Button variant="outline">Open filters</Button>} />
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Filter leases</SheetTitle>
                  <SheetDescription>Narrow results by expiration, market, or lease type</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-2 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col gap-1.5">
                    <Label>Market</Label>
                    <Input placeholder="e.g. New York" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Lease type</Label>
                    <Input placeholder="e.g. NNN" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Expiring within</Label>
                    <Input placeholder="e.g. 12 months" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose render={<Button variant="outline">Cancel</Button>} />
                  <Button>Apply filters</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · With form</p>
          <Row label="add contact">
            <Sheet>
              <SheetTrigger render={<Button><span>Add contact</span></Button>} />
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Add contact</SheetTitle>
                  <SheetDescription>Attach a contact to this lease or deal</SheetDescription>
                </SheetHeader>
                <div className="px-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input id="contact-name" placeholder="Alice Johnson" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-email">Email address</Label>
                    <Input id="contact-email" type="email" placeholder="alice@acmecorp.com" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-title">Title</Label>
                    <Input id="contact-title" placeholder="VP of Real Estate" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="contact-company">Company</Label>
                    <Input id="contact-company" placeholder="Acme Corp" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose render={<Button variant="outline">Cancel</Button>} />
                  <Button>Save contact</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
