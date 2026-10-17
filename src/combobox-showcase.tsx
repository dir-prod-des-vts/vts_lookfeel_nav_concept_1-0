import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

const TENANTS = [
  "Acme Corp",
  "Bridgepoint Capital",
  "Clearwater Holdings",
  "Delta Advisors",
  "Eastgate Partners",
  "Franklin Real Estate",
  "Greystone Ventures",
]

const MARKETS = ["San Francisco", "New York", "Los Angeles", "Chicago", "Boston"]
const SECTORS = ["Office", "Retail", "Industrial", "Multifamily", "Mixed-use"]

function TenantCombobox({ disabled = false }: { disabled?: boolean }) {
  return (
    <Combobox>
      <ComboboxInput placeholder="Search tenants..." disabled={disabled} className="w-56" showClear />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {TENANTS.map(t => (
              <ComboboxItem key={t} value={t}>{t}</ComboboxItem>
            ))}
          </ComboboxCollection>
          <ComboboxEmpty>No tenants found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function GroupedCombobox() {
  return (
    <Combobox>
      <ComboboxInput placeholder="Select market or sector..." className="w-64" showClear />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            <ComboboxGroup>
              <ComboboxLabel>Markets</ComboboxLabel>
              {MARKETS.map(m => (
                <ComboboxItem key={m} value={m}>{m}</ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              <ComboboxLabel>Sectors</ComboboxLabel>
              {SECTORS.map(s => (
                <ComboboxItem key={s} value={s}>{s}</ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxCollection>
          <ComboboxEmpty>No results</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function MultiSelectCombobox() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox multiple>
      <ComboboxChips ref={anchor} className="w-72">
        <ComboboxChipsInput placeholder="Add tenants..." />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          <ComboboxCollection>
            {TENANTS.map(t => (
              <ComboboxItem key={t} value={t}>{t}</ComboboxItem>
            ))}
          </ComboboxCollection>
          <ComboboxEmpty>No tenants found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
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
          <h1 className="text-3xl font-semibold text-foreground">Combobox</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Searchable select with grouped options, multi-select chips, and clearable state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="tenant search">
            <TenantCombobox />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With groups</p>
          <Row label="markets + sectors">
            <GroupedCombobox />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Multi-select</p>
          <Row label="chips">
            <MultiSelectCombobox />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled</p>
          <Row label="non-interactive">
            <TenantCombobox disabled />
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
