import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
  const [comboValue, setComboValue] = React.useState("")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Combobox</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Searchable dropdown for selecting from a list of options.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Combobox value={comboValue} onValueChange={(v) => setComboValue(v ?? "")}>
                <ComboboxInput placeholder="Search tenants…" className="w-56" />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxEmpty>No tenants found.</ComboboxEmpty>
                    {["Acme Corp", "Globex", "Initech", "Umbrella Corp", "Wayne Enterprises"].map(t => (
                      <ComboboxItem key={t} value={t}>{t}</ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
