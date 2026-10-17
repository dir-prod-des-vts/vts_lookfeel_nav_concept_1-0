import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { toast, Toaster } from "sonner"
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
      <Toaster />
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Toast (Sonner)</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            An opinionated toast component built on Sonner. Click each button to trigger the variant.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <div className="flex flex-col gap-5">
            <Row label="variants">
              <Button variant="outline" size="sm" onClick={() => toast("Lease saved successfully")}>Default</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Lease executed")}>Success</Button>
              <Button variant="outline" size="sm" onClick={() => toast.error("Failed to save")}>Error</Button>
              <Button variant="outline" size="sm" onClick={() => toast.warning("Critical date approaching")}>Warning</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("New proposal received")}>Info</Button>
              <Button variant="outline" size="sm" onClick={() => toast.loading("Saving…")}>Loading</Button>
            </Row>
            <Row label="with action">
              <Button variant="outline" size="sm" onClick={() => toast("Lease archived", { action: { label: "Undo", onClick: () => toast.success("Restored") } })}>With action</Button>
              <Button variant="outline" size="sm" onClick={() => toast("Lease deleted", { description: "This action cannot be undone." })}>With description</Button>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
