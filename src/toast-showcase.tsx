import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"

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

  const fakePromise = () =>
    new Promise<string>((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.3 ? resolve("Lease saved") : reject()), 2000)
    )

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <Toaster richColors closeButton theme={isDark ? "dark" : "light"} />

      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Toast</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Powered by Sonner. Click the buttons below to trigger each toast type. Supports success, error, warning, info, action buttons, promises, and custom durations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Types</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Button variant="outline" onClick={() => toast("Lease updated")}>
                Default
              </Button>
            </Row>
            <Row label="success">
              <Button variant="outline" onClick={() => toast.success("Lease saved successfully")}>
                Success
              </Button>
            </Row>
            <Row label="error">
              <Button variant="outline" onClick={() => toast.error("Failed to save lease")}>
                Error
              </Button>
            </Row>
            <Row label="warning">
              <Button variant="outline" onClick={() => toast.warning("Lease expires in 90 days")}>
                Warning
              </Button>
            </Row>
            <Row label="info">
              <Button variant="outline" onClick={() => toast.info("3 leases require your review")}>
                Info
              </Button>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With action button</p>
          <Row label="action">
            <Button
              variant="outline"
              onClick={() =>
                toast("Lease moved to archive", {
                  action: {
                    label: "Undo",
                    onClick: () => toast.success("Undo successful — lease restored"),
                  },
                })
              }
            >
              With undo action
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error("Lease export failed", {
                  action: {
                    label: "Retry",
                    onClick: () => toast.info("Retrying export…"),
                  },
                })
              }
            >
              Error with retry
            </Button>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With promise (loading then success/error)</p>
          <Row label="promise">
            <Button
              variant="outline"
              onClick={() =>
                toast.promise(fakePromise(), {
                  loading: "Saving lease…",
                  success: "Lease saved successfully",
                  error: "Failed to save lease — please try again",
                })
              }
            >
              Save with promise
            </Button>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Custom duration</p>
          <div className="flex flex-col gap-5">
            <Row label="1 second">
              <Button variant="outline" size="sm" onClick={() => toast("Quick note", { duration: 1000 })}>
                1 s
              </Button>
            </Row>
            <Row label="5 seconds">
              <Button variant="outline" size="sm" onClick={() => toast.info("Renewal window opens in 30 days", { duration: 5000 })}>
                5 s
              </Button>
            </Row>
            <Row label="persistent">
              <Button variant="outline" size="sm" onClick={() => toast.warning("System maintenance tonight at 11 PM", { duration: Infinity })}>
                No auto-dismiss
              </Button>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Dismissible</p>
          <Row label="dismissible">
            <Button
              variant="outline"
              onClick={() =>
                toast("Tenant contact added", {
                  description: "Alice Johnson was attached to Acme Corp lease",
                  closeButton: true,
                })
              }
            >
              With description
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Deal executed", {
                  description: "111 8th Ave · Acme Corp · $72/SF · 7 years",
                  closeButton: true,
                  duration: 8000,
                })
              }
            >
              With long duration
            </Button>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
