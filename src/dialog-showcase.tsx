import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Dialog</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Modal overlay for focused user interactions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Trigger</p>
          <div className="flex flex-col gap-5">
            <Row label="trigger">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  <Plus className="mr-2 size-4" />New lease
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new lease</DialogTitle>
                    <DialogDescription>Add a lease to your portfolio. Fill in the key details below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <Input placeholder="Tenant name" />
                    <Input placeholder="Space (sq ft)" type="number" />
                    <Input placeholder="Base rent ($/sq ft)" type="number" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create lease</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
