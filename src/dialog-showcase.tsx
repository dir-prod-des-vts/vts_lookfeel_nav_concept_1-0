import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Dialog</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Modal dialogs for confirmations, forms, and scrollable content. Built on Base UI Dialog.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="confirmation">
            <Dialog>
              <DialogTrigger render={<Button variant="outline">Archive lease</Button>} />
              <DialogContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <AlertTriangle className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">Archive this lease?</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Acme Corp — 100 Mission St, Suite 1400. Archiving will remove it from active views but it can be restored later.</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>} />
                    <DialogClose render={<Button variant="destructive" size="sm">Archive lease</Button>} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With form</p>
          <Row label="new tenant">
            <Dialog>
              <DialogTrigger render={<Button><span data-icon="inline-start">+</span>New tenant</Button>} />
              <DialogContent className="sm:max-w-md">
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-sm font-semibold">Add tenant</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">Enter the tenant details to add them to this property.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Company name</label>
                      <Input placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium">Contact email</label>
                      <Input type="email" placeholder="contact@acmecorp.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium">Industry</label>
                        <Input placeholder="e.g. Technology" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium">Headcount</label>
                        <Input type="number" placeholder="250" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>} />
                    <Button size="sm">Add tenant</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Large with scrollable content</p>
          <Row label="lease terms">
            <Dialog>
              <DialogTrigger render={<Button variant="outline">View lease terms</Button>} />
              <DialogContent className="sm:max-w-lg">
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold">Lease terms — Acme Corp</h2>
                  <div className="max-h-72 overflow-y-auto pr-2 flex flex-col gap-3 text-sm text-muted-foreground">
                    {[
                      ["Commencement date", "January 1, 2022"],
                      ["Expiration date", "December 31, 2027"],
                      ["Base rent (Y1–Y2)", "$48.50 / SF / yr"],
                      ["Base rent (Y3–Y4)", "$50.25 / SF / yr"],
                      ["Base rent (Y5–Y6)", "$52.00 / SF / yr"],
                      ["Rentable SF", "12,400 SF"],
                      ["Annual rent (Y1)", "$601,400"],
                      ["Security deposit", "$150,350"],
                      ["Free rent", "3 months"],
                      ["TI allowance", "$75.00 / SF"],
                      ["Renewal option", "Two 5-year options at fair market"],
                      ["Termination right", "Month 36 with 12-month notice and fee"],
                      ["HVAC", "Landlord provides base building HVAC"],
                      ["Parking", "4 reserved spaces at $350/mo each"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                        <span>{k}</span>
                        <span className="text-foreground font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <DialogClose render={<Button size="sm">Close</Button>} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Non-closeable</p>
          <Row label="no X button">
            <Dialog>
              <DialogTrigger render={<Button variant="outline">Open required dialog</Button>} />
              <DialogContent showCloseButton={false}>
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold">Action required</h2>
                  <p className="text-sm text-muted-foreground">Please review and accept the updated data processing terms before continuing.</p>
                  <div className="flex justify-end gap-2">
                    <DialogClose render={<Button size="sm">Accept terms</Button>} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
