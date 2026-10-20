import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-5">{children}</div>
    </div>
  )
}

function LabeledCheckbox({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  indeterminate,
}: {
  label: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
}) {
  return (
    <label className={`flex items-start gap-2.5 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <Checkbox
        checked={indeterminate ? undefined : checked} indeterminate={indeterminate}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </label>
  )
}

const NOTIFICATION_OPTIONS = [
  { id: "critical-dates", label: "Critical date alerts", description: "Notify when a date is within 30 days" },
  { id: "lease-expiry", label: "Lease expiry reminders", description: "Notify 90 and 30 days before expiration" },
  { id: "deal-updates", label: "Deal stage changes", description: "Notify when a deal moves to a new stage" },
  { id: "document-upload", label: "Document uploads", description: "Notify when a new document is added to a deal" },
  { id: "team-comments", label: "Team comments", description: "Notify on new activity feed comments" },
] as const

const FILTER_OPTIONS = [
  { id: "class-a-plus", label: "Class A+" },
  { id: "class-a", label: "Class A" },
  { id: "class-b", label: "Class B" },
  { id: "trophy", label: "Trophy" },
] as const

function App() {
  const [isDark, setIsDark] = React.useState(false)

  // Individual state for each notification
  const [notifChecked, setNotifChecked] = React.useState<Record<string, boolean>>({
    "critical-dates": true,
    "lease-expiry": true,
    "deal-updates": false,
    "document-upload": false,
    "team-comments": true,
  })

  // Building class filters
  const [filterChecked, setFilterChecked] = React.useState<Record<string, boolean>>({
    "class-a-plus": true,
    "class-a": true,
    "class-b": false,
    "trophy": false,
  })

  // Select-all pattern
  const allSelected = Object.values(filterChecked).every(Boolean)
  const someSelected = Object.values(filterChecked).some(Boolean)
  const isIndeterminate = someSelected && !allSelected

  function handleSelectAll(checked: boolean) {
    setFilterChecked(Object.fromEntries(FILTER_OPTIONS.map(o => [o.id, checked])))
  }

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Checkbox</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI. Supports checked, unchecked, indeterminate ("mixed"), and disabled states.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* States */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · States</p>
          <Row label="unchecked">
            <Checkbox />
          </Row>
          <div className="mt-5" />
          <Row label="checked">
            <Checkbox defaultChecked />
          </Row>
          <div className="mt-5" />
          <Row label="indeterminate">
            <Checkbox indeterminate />
          </Row>
          <div className="mt-5" />
          <Row label="disabled">
            <Checkbox disabled />
            <Checkbox disabled defaultChecked />
            <Checkbox disabled indeterminate />
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With label */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With label</p>
          <Row label="label only">
            <LabeledCheckbox label="Active leases only" />
            <LabeledCheckbox label="Include expired" checked={false} />
            <LabeledCheckbox label="Show sublease" checked />
          </Row>
          <div className="mt-5" />
          <Row label="with description">
            <LabeledCheckbox
              label="Include critical dates"
              description="Show leases with upcoming renewal or expiry dates"
              checked
            />
          </Row>
          <div className="mt-5" />
          <Row label="disabled">
            <LabeledCheckbox label="Read-only access" checked disabled />
            <LabeledCheckbox label="Admin features" disabled />
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Form group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Form group — notification preferences</p>
          <Row label="vertical list">
            <div className="flex flex-col gap-4 max-w-sm w-full">
              <div className="border rounded-xl p-4 flex flex-col gap-4">
                <p className="text-sm font-medium">Notification preferences</p>
                {NOTIFICATION_OPTIONS.map(opt => (
                  <LabeledCheckbox
                    key={opt.id}
                    label={opt.label}
                    description={opt.description}
                    checked={notifChecked[opt.id]}
                    onCheckedChange={v => setNotifChecked(prev => ({ ...prev, [opt.id]: v }))}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setNotifChecked(Object.fromEntries(NOTIFICATION_OPTIONS.map(o => [o.id, false])))}>
                  Deselect all
                </Button>
                <Button size="sm">Save preferences</Button>
              </div>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Select all pattern */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Select all — indeterminate pattern</p>
          <Row label="select all">
            <div className="flex flex-col gap-3 max-w-xs w-full">
              <div className="border rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-muted-foreground mb-1">Filter by building class</p>
                <LabeledCheckbox
                  label="All classes"
                  checked={allSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                />
                <div className="border-t border-border" />
                {FILTER_OPTIONS.map(opt => (
                  <LabeledCheckbox
                    key={opt.id}
                    label={opt.label}
                    checked={filterChecked[opt.id]}
                    onCheckedChange={v => setFilterChecked(prev => ({ ...prev, [opt.id]: v }))}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.values(filterChecked).filter(Boolean).length} of {FILTER_OPTIONS.length} classes selected
              </p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world: table row selection */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Real-world: table row selection</p>
          <Row label="table">
            <TableWithCheckboxes />
          </Row>
        </section>

      </div>
    </div>
  )
}

const TABLE_LEASES = [
  { id: "1", tenant: "Acme Corp", building: "101 Park Ave", expiry: "Dec 31, 2029", rsf: "24,500" },
  { id: "2", tenant: "Globex LLC", building: "Tower SF", expiry: "Mar 15, 2025", rsf: "12,200" },
  { id: "3", tenant: "Initech Inc", building: "One World", expiry: "Jun 1, 2026", rsf: "8,800" },
  { id: "4", tenant: "Umbrella Co", building: "Park Place", expiry: "Sep 30, 2027", rsf: "15,000" },
]

function TableWithCheckboxes() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const allSelected = selected.size === TABLE_LEASES.length
  const someSelected = selected.size > 0 && !allSelected

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(TABLE_LEASES.map(l => l.id)))
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-2xl w-full border rounded-xl overflow-hidden">
      {selected.size > 0 && (
        <div className="bg-muted/50 border-b px-4 py-2 flex items-center gap-3 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <Button size="sm" variant="outline">Archive</Button>
          <Button size="sm" variant="destructive">Delete</Button>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelected(new Set())}>Clear selection</Button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-2.5 w-10">
              <Checkbox
                checked={allSelected} indeterminate={someSelected && !allSelected}
                onCheckedChange={toggleAll}
              />
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Tenant</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Building</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">RSF</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Expiration</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_LEASES.map(lease => (
            <tr
              key={lease.id}
              className={`border-b last:border-0 transition-colors cursor-pointer ${selected.has(lease.id) ? "bg-primary/5" : "hover:bg-muted/30"}`}
              onClick={() => toggleRow(lease.id)}
            >
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <Checkbox
                  checked={selected.has(lease.id)}
                  onCheckedChange={() => toggleRow(lease.id)}
                />
              </td>
              <td className="px-4 py-3 font-medium">{lease.tenant}</td>
              <td className="px-4 py-3 text-muted-foreground">{lease.building}</td>
              <td className="px-4 py-3 text-muted-foreground">{lease.rsf} SF</td>
              <td className="px-4 py-3 text-muted-foreground">{lease.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
