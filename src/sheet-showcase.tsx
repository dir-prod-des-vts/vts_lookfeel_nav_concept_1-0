import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
          <h1 className="text-3xl font-semibold text-foreground">Sheet</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Extends the dialog component to display content that complements the main content of the screen.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Sides</p>
          <div className="flex flex-col gap-5">
            <Row label="sides">
              {(["right", "bottom", "left", "top"] as const).map(side => (
                <Sheet key={side}>
                  <SheetTrigger render={<Button variant="outline" />}>
                    Open {side}
                  </SheetTrigger>
                  <SheetContent side={side}>
                    <SheetHeader>
                      <SheetTitle>Lease details</SheetTitle>
                      <SheetDescription>Review and edit the lease information below.</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 mt-4">
                      <Input placeholder="Tenant name" defaultValue="Acme Corp" />
                      <Input placeholder="Space" defaultValue="Suite 400" />
                    </div>
                    <SheetFooter className="mt-4">
                      <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
                      <Button>Save changes</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              ))}
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
