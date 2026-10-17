import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

const LEASES = [
  { id: "L-001", tenant: "Acme Corp", building: "111 8th Ave", start: "Apr 2019", exp: "Mar 2026", ner: 72, status: "Active" },
  { id: "L-002", tenant: "Brightline Media", building: "525 Market St", start: "Jan 2021", exp: "Dec 2027", ner: 68, status: "Active" },
  { id: "L-003", tenant: "Meridian Health", building: "350 N Orleans", start: "Oct 2018", exp: "Sep 2024", ner: 65, status: "Expiring" },
  { id: "L-004", tenant: "Techstart Inc", building: "1 Market Plaza", start: "Jul 2022", exp: "Jun 2029", ner: 84, status: "Active" },
  { id: "L-005", tenant: "Redpoint Capital", building: "300 Park Ave", start: "Mar 2020", exp: "Feb 2027", ner: 95, status: "Active" },
]

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Expiring: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Expired: "bg-muted text-muted-foreground",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.Expired}`}>
      {status}
    </span>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="size-3 ml-1 opacity-40" />
    return sortDir === "asc" ? <ArrowUp className="size-3 ml-1" /> : <ArrowDown className="size-3 ml-1" />
  }

  const allSelected = LEASES.length > 0 && selected.size === LEASES.length
  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(LEASES.map(l => l.id)))
  }
  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Table</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Semantic HTML table with hover states, sorting indicators, row selection, and an empty state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Start date</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>NER</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEASES.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.tenant}</TableCell>
                    <TableCell className="text-muted-foreground">{l.building}</TableCell>
                    <TableCell className="text-muted-foreground">{l.start}</TableCell>
                    <TableCell>{l.exp}</TableCell>
                    <TableCell className="font-medium">${l.ner}/SF</TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With sorting indicators</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button className="flex items-center text-left font-medium hover:text-foreground" onClick={() => toggleSort("tenant")}>
                      Tenant<SortIcon field="tenant" />
                    </button>
                  </TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>
                    <button className="flex items-center text-left font-medium hover:text-foreground" onClick={() => toggleSort("exp")}>
                      Expiration<SortIcon field="exp" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center text-left font-medium hover:text-foreground" onClick={() => toggleSort("ner")}>
                      NER<SortIcon field="ner" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEASES.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.tenant}</TableCell>
                    <TableCell className="text-muted-foreground">{l.building}</TableCell>
                    <TableCell>{l.exp}</TableCell>
                    <TableCell className="font-medium">${l.ner}/SF</TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With row selection</p>
          {selected.size > 0 && (
            <div className="flex items-center gap-3 mb-3 text-sm">
              <span className="font-medium">{selected.size} selected</span>
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          )}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  </TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>NER</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEASES.map(l => (
                  <TableRow key={l.id} data-state={selected.has(l.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(l.id)}
                        onCheckedChange={() => toggleRow(l.id)}
                        aria-label={`Select ${l.tenant}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{l.tenant}</TableCell>
                    <TableCell className="text-muted-foreground">{l.building}</TableCell>
                    <TableCell>{l.exp}</TableCell>
                    <TableCell className="font-medium">${l.ner}/SF</TableCell>
                    <TableCell><StatusBadge status={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Striped rows</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>NER</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEASES.map((l, i) => (
                  <TableRow key={l.id} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">{l.tenant}</TableCell>
                    <TableCell className="text-muted-foreground">{l.building}</TableCell>
                    <TableCell>{l.exp}</TableCell>
                    <TableCell className="font-medium">${l.ner}/SF</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Dense/compact</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">Tenant</TableHead>
                  <TableHead className="h-8 text-xs">Building</TableHead>
                  <TableHead className="h-8 text-xs">Exp</TableHead>
                  <TableHead className="h-8 text-xs">NER</TableHead>
                  <TableHead className="h-8 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LEASES.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="py-1 text-xs font-medium">{l.tenant}</TableCell>
                    <TableCell className="py-1 text-xs text-muted-foreground">{l.building}</TableCell>
                    <TableCell className="py-1 text-xs">{l.exp}</TableCell>
                    <TableCell className="py-1 text-xs font-medium">${l.ner}</TableCell>
                    <TableCell className="py-1"><StatusBadge status={l.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Empty state</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>NER</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No leases match your filters
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
