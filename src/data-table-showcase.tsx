import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { DataTable, DataTableColumnHeader, type ColumnDef } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

// ── Sample data ───────────────────────────────────────────────────────────────

type Lease = {
  id: string
  tenant: string
  building: string
  market: string
  sf: number
  rent: number
  ti: number
  freeRent: number
  term: number
  start: string
  expiry: string
  status: "Active" | "Expiring" | "Expired" | "Negotiating"
  dealType: "New deal" | "Renewal" | "Expansion" | "Sublease"
}

const LEASES: Lease[] = [
  { id: "L-001", tenant: "Acme Corp",          building: "111 8th Ave",        market: "New York",      sf: 42000, rent: 88,  ti: 165, freeRent: 9,  term: 84,  start: "Apr 2019", expiry: "Mar 2026", status: "Active",      dealType: "New deal"  },
  { id: "L-002", tenant: "Brightline Media",   building: "525 Market St",      market: "San Francisco", sf: 28000, rent: 95,  ti: 130, freeRent: 12, term: 96,  start: "Jan 2021", expiry: "Dec 2027", status: "Active",      dealType: "Renewal"   },
  { id: "L-003", tenant: "Meridian Health",    building: "350 N Orleans",      market: "Chicago",       sf: 18500, rent: 62,  ti: 72,  freeRent: 6,  term: 72,  start: "Oct 2018", expiry: "Sep 2024", status: "Expiring",    dealType: "New deal"  },
  { id: "L-004", tenant: "Techstart Inc",      building: "1 Market Plaza",     market: "San Francisco", sf: 9200,  rent: 102, ti: 145, freeRent: 7,  term: 60,  start: "Jul 2022", expiry: "Jun 2027", status: "Active",      dealType: "Expansion" },
  { id: "L-005", tenant: "Redpoint Capital",   building: "300 Park Ave",       market: "New York",      sf: 33000, rent: 110, ti: 200, freeRent: 14, term: 120, start: "Mar 2020", expiry: "Feb 2030", status: "Active",      dealType: "New deal"  },
  { id: "L-006", tenant: "Axis Logistics",     building: "7000 Intermodal Dr", market: "Chicago",       sf: 55000, rent: 48,  ti: 42,  freeRent: 4,  term: 60,  start: "Jun 2021", expiry: "May 2026", status: "Expiring",    dealType: "Renewal"   },
  { id: "L-007", tenant: "Cardinal Health",    building: "7000 Cardinal Pl",   market: "Boston",        sf: 22000, rent: 80,  ti: 140, freeRent: 8,  term: 84,  start: "Nov 2019", expiry: "Oct 2026", status: "Active",      dealType: "New deal"  },
  { id: "L-008", tenant: "Slate Advisory",     building: "101 Federal St",     market: "Boston",        sf: 11500, rent: 76,  ti: 125, freeRent: 6,  term: 72,  start: "Feb 2023", expiry: "Jan 2029", status: "Active",      dealType: "New deal"  },
  { id: "L-009", tenant: "Summit RE Group",    building: "111 8th Ave",        market: "New York",      sf: 8000,  rent: 90,  ti: 170, freeRent: 10, term: 60,  start: "Sep 2022", expiry: "Aug 2027", status: "Negotiating", dealType: "Renewal"   },
  { id: "L-010", tenant: "Pinnacle Law LLP",   building: "300 Park Ave",       market: "New York",      sf: 26000, rent: 115, ti: 195, freeRent: 12, term: 96,  start: "Jan 2018", expiry: "Dec 2025", status: "Expiring",    dealType: "New deal"  },
  { id: "L-011", tenant: "Luminary Studios",   building: "525 Market St",      market: "San Francisco", sf: 14000, rent: 88,  ti: 115, freeRent: 7,  term: 60,  start: "Apr 2024", expiry: "Mar 2029", status: "Active",      dealType: "New deal"  },
  { id: "L-012", tenant: "Harbor Insurance",   building: "101 Federal St",     market: "Boston",        sf: 19000, rent: 78,  ti: 138, freeRent: 9,  term: 84,  start: "May 2020", expiry: "Apr 2027", status: "Active",      dealType: "Expansion" },
  { id: "L-013", tenant: "Crestline Pharma",   building: "350 N Orleans",      market: "Chicago",       sf: 31000, rent: 65,  ti: 80,  freeRent: 5,  term: 72,  start: "Aug 2017", expiry: "Jul 2024", status: "Expired",     dealType: "Renewal"   },
  { id: "L-014", tenant: "Vertice Capital",    building: "1 Market Plaza",     market: "San Francisco", sf: 7500,  rent: 105, ti: 150, freeRent: 8,  term: 60,  start: "Oct 2023", expiry: "Sep 2028", status: "Active",      dealType: "Sublease"  },
  { id: "L-015", tenant: "Nexus Consulting",   building: "7000 Cardinal Pl",   market: "Boston",        sf: 12500, rent: 82,  ti: 130, freeRent: 7,  term: 72,  start: "Mar 2022", expiry: "Feb 2028", status: "Active",      dealType: "New deal"  },
]

const STATUS_VARIANT: Record<Lease["status"], string> = {
  Active:      "bg-success/15 text-success border-success/20",
  Expiring:    "bg-warning/15 text-warning border-warning/20",
  Expired:     "bg-muted text-muted-foreground border-border",
  Negotiating: "bg-primary/10 text-primary border-primary/20",
}

const DEAL_VARIANT: Record<Lease["dealType"], string> = {
  "New deal":  "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Renewal":   "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Expansion": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  "Sublease":  "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

function fmtNum(n: number) { return n.toLocaleString() }
function fmtRent(n: number) { return `$${n.toFixed(2)}` }

// ── Column definitions ────────────────────────────────────────────────────────

const columns: ColumnDef<Lease>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ getValue }) => <span className="font-mono text-xs text-muted-foreground">{String(getValue())}</span>,
    size: 80,
  },
  {
    accessorKey: "tenant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ getValue }) => <span className="font-medium">{String(getValue())}</span>,
  },
  {
    accessorKey: "building",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Building" />,
  },
  {
    accessorKey: "market",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Market" />,
  },
  {
    accessorKey: "sf",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SF" className="justify-end" />,
    cell: ({ getValue }) => <span className="tabular-nums text-right block">{fmtNum(Number(getValue()))}</span>,
    size: 90,
  },
  {
    accessorKey: "rent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rent" className="justify-end" />,
    cell: ({ getValue }) => <span className="tabular-nums text-right block">{fmtRent(Number(getValue()))}</span>,
    size: 90,
  },
  {
    accessorKey: "ti",
    header: ({ column }) => <DataTableColumnHeader column={column} title="TI" className="justify-end" />,
    cell: ({ getValue }) => <span className="tabular-nums text-right block">{fmtRent(Number(getValue()))}</span>,
    size: 80,
  },
  {
    accessorKey: "freeRent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Free rent" className="justify-end" />,
    cell: ({ getValue }) => <span className="tabular-nums text-right block">{getValue() as number} mo</span>,
    size: 90,
  },
  {
    accessorKey: "term",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Term" className="justify-end" />,
    cell: ({ getValue }) => <span className="tabular-nums text-right block">{getValue() as number} mo</span>,
    size: 80,
  },
  {
    accessorKey: "start",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start" />,
    size: 90,
  },
  {
    accessorKey: "expiry",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry" />,
    size: 90,
  },
  {
    accessorKey: "dealType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deal type" />,
    cell: ({ getValue }) => {
      const v = getValue() as Lease["dealType"]
      return <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${DEAL_VARIANT[v]}`}>{v}</span>
    },
    size: 110,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => {
      const v = getValue() as Lease["status"]
      return <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${STATUS_VARIANT[v]}`}>{v}</span>
    },
    size: 110,
  },
]

// ── Sections ──────────────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Components</p>
            <h1 className="text-[38px] font-semibold tracking-[-0.018em] leading-[1.2]">Data table</h1>
            <p className="text-base text-muted-foreground leading-relaxed mt-2 max-w-xl">
              TanStack Table v9 wired to shadcn table primitives and theme tokens. Sorting, filtering, row selection, column visibility, pinning, pagination, resizing, grouping, expanding — all opt-in via props.
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setDark(d => !d)} className="mt-1">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>

        {/* 1 — Basic */}
        <Section title="Basic" description="Sorting only. No extra chrome.">
          <DataTable columns={columns} data={LEASES.slice(0, 6)} />
        </Section>

        {/* 2 — Search + column visibility */}
        <Section title="Search and column visibility" description="Global filter input and column show/hide dropdown.">
          <DataTable
            columns={columns}
            data={LEASES}
            enableFiltering
            enableColumnVisibility
          />
        </Section>

        {/* 3 — Row selection */}
        <Section title="Row selection" description="Checkbox column prepended automatically. Header checkbox selects all on current page.">
          <DataTable
            columns={columns}
            data={LEASES.slice(0, 8)}
            enableRowSelection
            enableFiltering
          />
        </Section>

        {/* 4 — Pagination */}
        <Section title="Pagination" description="Page size selector, page counter, and navigation controls.">
          <DataTable
            columns={columns}
            data={LEASES}
            enablePagination
            enableRowSelection
            enableFiltering
            enableColumnVisibility
            defaultPageSize={5}
            pageSizeOptions={[5, 10, 15]}
          />
        </Section>

        {/* 5 — Column pinning */}
        <Section title="Column pinning" description="Pin columns left from the column settings dropdown. Pinned columns stay visible when scrolling horizontally.">
          <DataTable
            columns={columns}
            data={LEASES}
            enableColumnVisibility
            enableColumnPinning
          />
        </Section>

        {/* 6 — Row pinning */}
        <Section title="Row pinning" description="Rows can be pinned to the top or bottom of the table programmatically. The first two rows are pinned top here.">
          <DataTableWithRowPinning />
        </Section>

        {/* 7 — Column resizing */}
        <Section title="Column resizing" description="Drag the resize handle at the right edge of any column header.">
          <DataTable
            columns={columns}
            data={LEASES.slice(0, 6)}
            enableColumnResizing
          />
        </Section>

        {/* 8 — Compact + striped */}
        <Section title="Compact and striped" description="Tighter row padding with alternating row fills.">
          <DataTable
            columns={columns}
            data={LEASES.slice(0, 8)}
            compact
            striped
          />
        </Section>

        {/* 9 — Sub-rows / expanding */}
        <Section title="Expanding rows" description="Rows with sub-content expose a chevron toggle. renderSubRow controls what appears below.">
          <DataTable
            columns={columns.filter(c => ["tenant", "building", "market", "rent", "status"].includes(c.accessorKey as string))}
            data={LEASES.slice(0, 5)}
            enableExpanding
            renderSubRow={row => (
              <div className="bg-muted/30 px-6 py-3 text-sm text-muted-foreground border-t">
                <span className="font-medium text-foreground">{row.original.tenant}</span>
                {" — "}{row.original.sf.toLocaleString()} sf · {row.original.term} mo term · {row.original.start} → {row.original.expiry}
                {row.original.dealType !== "New deal" && ` · ${row.original.dealType}`}
              </div>
            )}
          />
        </Section>

        {/* 10 — Custom toolbar */}
        <Section title="Custom toolbar slot" description="Pass a toolbar render prop to add controls above the table.">
          <DataTable
            columns={columns}
            data={LEASES}
            enableFiltering
            enableColumnVisibility
            enablePagination
            defaultPageSize={5}
            pageSizeOptions={[5, 10]}
            toolbar={table => (
              <Badge variant="outline" className="font-normal text-muted-foreground">
                {table.getFilteredRowModel().rows.length} leases
              </Badge>
            )}
          />
        </Section>
      </div>
    </div>
  )
}

// ── Row pinning demo wrapper ──────────────────────────────────────────────────

function DataTableWithRowPinning() {
  const [pinned, setPinned] = React.useState<string[]>(["L-005", "L-001"])
  const cols = columns.filter(c => ["tenant", "building", "sf", "rent", "status"].includes(c.accessorKey as string))
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">Rows L-005 and L-001 are pinned to the top.</p>
      <DataTable
        columns={cols}
        data={LEASES.slice(0, 8)}
        enableRowPinning
        toolbar={() => (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-sm font-normal"
            onClick={() => setPinned(p => p.length ? [] : ["L-005", "L-001"])}
          >
            {pinned.length ? "Unpin rows" : "Pin L-005 + L-001"}
          </Button>
        )}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
