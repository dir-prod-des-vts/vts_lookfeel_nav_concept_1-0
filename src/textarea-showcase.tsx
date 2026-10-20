import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 flex flex-wrap items-start gap-4">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [notes, setNotes] = React.useState("")
  const [description, setDescription] = React.useState("")
  const MAX = 500

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Textarea</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            A multi-line text input with auto-resize via field-sizing-content. Supports placeholder, disabled, readonly, error, and character count.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="default">
            <Textarea className="w-80" placeholder="Add lease notes..." />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With placeholder</p>
          <div className="flex flex-col gap-5">
            <Row label="notes">
              <Textarea className="w-80" placeholder="Add lease notes..." />
            </Row>
            <Row label="description">
              <Textarea className="w-80" placeholder="Describe the space — layout, condition, amenities..." />
            </Row>
            <Row label="special terms">
              <Textarea className="w-80" placeholder="Note any special conditions, exclusions, or riders..." />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled</p>
          <Row label="disabled">
            <Textarea className="w-80" placeholder="Notes locked" disabled />
            <Textarea className="w-80" defaultValue="Tenant submitted LOI on Oct 14. Renewal discussions pending." disabled />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Readonly</p>
          <Row label="readonly">
            <Textarea
              className="w-80"
              defaultValue="Lease commenced April 1, 2019. NNN structure with annual 2.5% escalations. TI allowance of $85/SF delivered as tenant improvements."
              readOnly
            />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Error/invalid state</p>
          <Row label="invalid">
            <div className="flex flex-col gap-1.5 w-80">
              <Textarea
                aria-invalid="true"
                placeholder="Add lease notes..."
              />
              <p className="text-xs text-destructive">Lease notes are required before submitting</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · With character count</p>
          <Row label="notes">
            <div className="flex flex-col gap-1.5 w-96">
              <Label htmlFor="notes-count">Lease notes</Label>
              <Textarea
                id="notes-count"
                value={notes}
                onChange={e => setNotes(e.target.value.slice(0, MAX))}
                placeholder="Add lease notes..."
                aria-invalid={notes.length >= MAX}
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Visible to all deal participants</span>
                <span className={notes.length >= MAX ? "text-destructive font-medium" : "text-muted-foreground"}>
                  {notes.length}/{MAX}
                </span>
              </div>
            </div>
          </Row>
          <Row label="space description">
            <div className="flex flex-col gap-1.5 w-96">
              <Label htmlFor="desc-count">Space description</Label>
              <Textarea
                id="desc-count"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, 200))}
                placeholder="Describe the space..."
                aria-invalid={description.length >= 200}
              />
              <div className="flex justify-end text-xs">
                <span className={description.length >= 200 ? "text-destructive font-medium" : "text-muted-foreground"}>
                  {description.length}/200
                </span>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">07 · Auto-resize</p>
          <Row label="auto-resize">
            <div className="flex flex-col gap-1.5 w-80">
              <p className="text-xs text-muted-foreground mb-1">Type multiple lines to see the textarea grow.</p>
              <Textarea placeholder="Start typing..." />
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
