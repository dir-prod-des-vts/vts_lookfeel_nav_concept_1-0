import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  type RowAction,
} from "@/components/ui/data-table"

// ─── Sample data ─────────────────────────────────────────────────────────────

type LeaseRow = {
  id: string
  tenant: string
  building: string
  market: string
  sf: number
  ner: number
  start: string
  expiry: string
  status: "Active" | "Expiring" | "Expired" | "Negotiating"
  floors: string
  type: "Gross" | "Net" | "Modified gross"
  subtenants: { name: string; sf: number }[]
}

const DATA: LeaseRow[] = [
  { id: "L-001", tenant: "Acme Corp", building: "111 8th Ave", market: "New York", sf: 42000, ner: 72, start: "Apr 2019", expiry: "Mar 2026", status: "Active", floors: "12-14", type: "Gross", subtenants: [{ name: "Acme Labs", sf: 8000 }] },
  { id: "L-002", tenant: "Brightline Media", building: "525 Market St", market: "San Francisco", sf: 18500, ner: 68, start: "Jan 2021", expiry: "Dec 2027", status: "Active", floors: "7", type: "Net", subtenants: [] },
  { id: "L-003", tenant: "Meridian Health", building: "350 N Orleans", market: "Chicago", sf: 31200, ner: 65, start: "Oct 2018", expiry: "Sep 2024", status: "Expired", floors: "3-4", type: "Gross", subtenants: [] },
  { id: "L-004", tenant: "Techstart Inc", building: "1 Market Plaza", market: "San Francisco", sf: 9800, ner: 84, start: "Jul 2022", expiry: "Jun 2029", status: "Active", floors: "22", type: "Modified gross", subtenants: [] },
  { id: "L-005", tenant: "Redpoint Capital", building: "300 Park Ave", market: "New York", sf: 55000, ner: 95, start: "Mar 2020", expiry: "Feb 2027", status: "Active", floors: "18-20", type: "Gross", subtenants: [{ name: "Redpoint Ventures", sf: 12000 }, { name: "Redpoint Advisory", sf: 8500 }] },
  { id: "L-006", tenant: "Vega Logistics", building: "2 Embarcadero Ctr", market: "San Francisco", sf: 24600, ner: 61, start: "Aug 2017", expiry: "Jul 2024", status: "Expired", floors: "5-6", type: "Net", subtenants: [] },
  { id: "L-007", tenant: "Cobalt Analytics", building: "Willis Tower", market: "Chicago", sf: 38400, ner: 78, start: "May 2023", expiry: "Apr 2030", status: "Active", floors: "44-46", type: "Gross", subtenants: [] },
  { id: "L-008", tenant: "Harbor West", building: "Hudson Yards T1", market: "New York", sf: 72000, ner: 110, start: "Jan 2022", expiry: "Dec 2031", status: "Active", floors: "30-33", type: "Gross", subtenants: [{ name: "Harbor West Advisory", sf: 15000 }] },
  { id: "L-009", tenant: "Nexus Bio", building: "Transamerica Pyramid", market: "San Francisco", sf: 11200, ner: 59, start: "Feb 2021", expiry: "Jan 2025", status: "Expiring", floors: "8", type: "Modified gross", subtenants: [] },
  { id: "L-010", tenant: "Summit Partners", building: "One Financial Ctr", market: "Boston", sf: 29300, ner: 82, start: "Jun 2020", expiry: "May 2027", status: "Active", floors: "15-16", type: "Gross", subtenants: [] },
  { id: "L-011", tenant: "Pacific Realty", building: "Salesforce Tower", market: "San Francisco", sf: 46800, ner: 102, start: "Mar 2022", expiry: "Feb 2032", status: "Active", floors: "35-38", type: "Gross", subtenants: [] },
  { id: "L-012", tenant: "Clearwater Law", building: "Empire State Bldg", market: "New York", sf: 17500, ner: 76, start: "Nov 2019", expiry: "Oct 2026", status: "Expiring", floors: "28", type: "Net", subtenants: [] },
  { id: "L-013", tenant: "Ironclad Finance", building: "Willis Tower", market: "Chicago", sf: 22000, ner: 71, start: "Sep 2021", expiry: "Aug 2028", status: "Active", floors: "55", type: "Gross", subtenants: [] },
  { id: "L-014", tenant: "Azure Cloud Co", building: "1 World Trade Ctr", market: "New York", sf: 88000, ner: 115, start: "Jan 2023", expiry: "Dec 2032", status: "Active", floors: "60-64", type: "Gross", subtenants: [{ name: "Azure AI Division", sf: 22000 }] },
  { id: "L-015", tenant: "Coral Consulting", building: "Union Square 200", market: "San Francisco", sf: 7400, ner: 55, start: "Apr 2022", expiry: "Mar 2025", status: "Expiring", floors: "4", type: "Modified gross", subtenants: [] },
  { id: "L-016", tenant: "Greenfield Dev", building: "Peachtree Ctr", market: "Atlanta", sf: 33600, ner: 48, start: "Jul 2018", expiry: "Jun 2024", status: "Expired", floors: "10-11", type: "Net", subtenants: [] },
  { id: "L-017", tenant: "Momentum VC", building: "Hudson Yards T2", market: "New York", sf: 19200, ner: 108, start: "Nov 2022", expiry: "Oct 2029", status: "Active", floors: "25", type: "Gross", subtenants: [] },
  { id: "L-018", tenant: "Theta Systems", building: "200 Berkeley St", market: "Boston", sf: 41000, ner: 67, start: "Feb 2020", expiry: "Jan 2026", status: "Negotiating", floors: "14-16", type: "Gross", subtenants: [] },
  { id: "L-019", tenant: "Marble Group", building: "One Financial Ctr", market: "Boston", sf: 12800, ner: 74, start: "Aug 2023", expiry: "Jul 2030", status: "Active", floors: "9", type: "Net", subtenants: [] },
  { id: "L-020", tenant: "Dusk Creative", building: "Transamerica Pyramid", market: "San Francisco", sf: 5600, ner: 52, start: "May 2022", expiry: "Apr 2027", status: "Active", floors: "6", type: "Modified gross", subtenants: [] },
  { id: "L-021", tenant: "Vortex Capital", building: "Empire State Bldg", market: "New York", sf: 26500, ner: 88, start: "Oct 2021", expiry: "Sep 2028", status: "Active", floors: "32-33", type: "Gross", subtenants: [] },
  { id: "L-022", tenant: "Strata RE", building: "Salesforce Tower", market: "San Francisco", sf: 15000, ner: 98, start: "Jan 2024", expiry: "Dec 2033", status: "Active", floors: "42", type: "Gross", subtenants: [] },
]

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CLASS: Record<LeaseRow["status"], string> = {
  Active: "bg-success/15 text-success border-transparent",
  Expiring: "bg-warning/15 text-warning border-transparent",
  Expired: "bg-muted text-muted-foreground border-transparent",
  Negotiating: "bg-declined/15 text-declined border-transparent",
}

function StatusBadge({ status }: { status: LeaseRow["status"] }) {
  return <Badge className={STATUS_CLASS[status]}>{status}</Badge>
}

// ─── Column defs ──────────────────────────────────────────────────────────────

const ROW_ACTIONS: RowAction<LeaseRow>[] = [
  { label: "View details", onClick: (row) => alert(`Viewing: ${row.original.tenant}`) },
  { label: "Edit lease", onClick: (row) => alert(`Editing: ${row.original.id}`) },
  { label: "Terminate", onClick: (row) => alert(`Terminating: ${row.original.id}`), variant: "destructive", separator: true },
]

const COLUMNS: ColumnDef<LeaseRow>[] = [
  {
    accessorKey: "id",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="ID" enableColumnPinning enableColumnOrdering />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</span>,
    size: 80,
  },
  {
    accessorKey: "tenant",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Tenant" enableColumnPinning enableColumnOrdering />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("tenant")}</span>,
  },
  {
    accessorKey: "building",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Building" enableColumnPinning enableColumnOrdering />,
  },
  {
    accessorKey: "market",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Market" enableColumnPinning enableColumnOrdering />,
    filterFn: "includesString",
  },
  {
    accessorKey: "sf",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="SF" className="justify-end" enableColumnPinning enableColumnOrdering />,
    cell: ({ row }) => (
      <span className="tabular-nums text-right block">
        {(row.getValue("sf") as number).toLocaleString()}
      </span>
    ),
    aggregationFn: "sum",
    aggregatedCell: ({ getValue }) => (
      <span className="tabular-nums text-right block font-medium">
        {(getValue() as number).toLocaleString()} total
      </span>
    ),
  },
  {
    accessorKey: "ner",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="NER/sf/yr" className="justify-end" enableColumnPinning enableColumnOrdering />,
    cell: ({ row }) => (
      <span className="tabular-nums text-right block">${row.getValue("ner")}</span>
    ),
    aggregationFn: "mean",
    aggregatedCell: ({ getValue }) => (
      <span className="tabular-nums text-right block font-medium">
        ${Math.round(getValue() as number)} avg
      </span>
    ),
  },
  {
    accessorKey: "start",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Start" enableColumnPinning enableColumnOrdering />,
  },
  {
    accessorKey: "expiry",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Expiry" enableColumnPinning enableColumnOrdering />,
  },
  {
    accessorKey: "status",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Status" enableColumnPinning enableColumnOrdering />,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: "includesString",
  },
  {
    accessorKey: "type",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Type" enableColumnPinning enableColumnOrdering />,
    filterFn: "includesString",
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <DataTableRowActions row={row} actions={ROW_ACTIONS} />,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    size: 48,
  },
]

const BASIC_COLUMNS: ColumnDef<LeaseRow>[] = [
  {
    accessorKey: "tenant",
    header: "Tenant",
    cell: ({ row }) => <span className="font-medium">{row.getValue("tenant")}</span>,
  },
  { accessorKey: "building", header: "Building" },
  { accessorKey: "market", header: "Market" },
  {
    accessorKey: "sf",
    header: "SF",
    cell: ({ row }) => (
      <span className="tabular-nums text-right block">
        {(row.getValue("sf") as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
]

// ─── Expandable subcomponent ──────────────────────────────────────────────────

function SubtenantsPanel({ row }: { row: import("@tanstack/react-table").Row<LeaseRow> }) {
  const { subtenants, tenant } = row.original
  if (subtenants.length === 0) return null
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Subtenants under {tenant}
      </p>
      <div className="flex flex-col gap-1">
        {subtenants.map((s) => (
          <div key={s.name} className="flex items-center gap-4 text-sm">
            <span className="text-foreground">{s.name}</span>
            <span className="text-muted-foreground tabular-nums">{s.sf.toLocaleString()} sf</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function LoadingExample() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-fit gap-1.5 text-sm font-medium"
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        Simulate loading
      </Button>
      <DataTable
        columns={BASIC_COLUMNS}
        data={loading ? [] : DATA.slice(0, 5)}
        loading={loading}
        enablePagination={false}
        enableGlobalFilter={false}
        enableColumnVisibility={false}
      />
    </div>
  )
}

// Columns for grouping demo (need enableGrouping-friendly column defs)
const GROUPING_COLUMNS: ColumnDef<LeaseRow>[] = [
  {
    accessorKey: "market",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Market" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
  },
  {
    accessorKey: "tenant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("tenant")}</span>,
    enableGrouping: false,
  },
  {
    accessorKey: "sf",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SF" className="justify-end" />,
    cell: ({ row }) => (
      <span className="tabular-nums text-right block">
        {(row.getValue("sf") as number).toLocaleString()}
      </span>
    ),
    aggregationFn: "sum",
    aggregatedCell: ({ getValue }) => (
      <span className="tabular-nums text-right block font-medium">
        {(getValue() as number).toLocaleString()}
      </span>
    ),
    enableGrouping: false,
  },
  {
    accessorKey: "ner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="NER/sf/yr" className="justify-end" />,
    cell: ({ row }) => (
      <span className="tabular-nums text-right block">${row.getValue("ner")}</span>
    ),
    aggregationFn: "mean",
    aggregatedCell: ({ getValue }) => (
      <span className="tabular-nums text-right block font-medium">
        ${Math.round(getValue() as number)} avg
      </span>
    ),
    enableGrouping: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    enableGrouping: false,
  },
]

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-12">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">Components</p>
            <h1 className="text-2xl font-semibold text-foreground">Data table (TanStack)</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reusable data table built on TanStack Table v8 and shadcn/ui. All controls are functional.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-sm font-medium shrink-0"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        </div>

        {/* 1. Basic */}
        <Section
          title="Basic table"
          description="Read-only table with no interactive features. Ideal for simple display."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={BASIC_COLUMNS}
              data={DATA.slice(0, 6)}
              enablePagination={false}
              enableGlobalFilter={false}
              enableColumnVisibility={false}
              enableSorting={false}
              enableColumnFilters={false}
            />
          </div>
        </Section>

        {/* 2. Sorting & filtering */}
        <Section
          title="Sorting and filtering"
          description="Click column headers to sort. Global search filters across all columns. Per-column filter inputs appear below headers. Enable faceting for low-cardinality columns to show value counts as dropdowns."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enablePagination={false}
              enableRowSelection={false}
              enableColumnFilters
              enableFaceting
            />
          </div>
        </Section>

        {/* 3. Pagination */}
        <Section
          title="Pagination"
          description="Client-side pagination with configurable page sizes."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enablePagination
              pageSize={5}
              pageSizeOptions={[5, 10, 20]}
              enableRowSelection={false}
              enableColumnFilters={false}
            />
          </div>
        </Section>

        {/* 4. Column management */}
        <Section
          title="Column management"
          description="Columns button opens a merged panel: toggle visibility, pin left/right, and reorder with arrows. Column resizing is via drag handles on header edges."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enableColumnPinning
              enableColumnOrdering
              enableColumnResizing
              enableColumnVisibility
              enablePagination
              pageSize={8}
              enableRowSelection={false}
              enableColumnFilters={false}
            />
          </div>
        </Section>

        {/* 5. Row features */}
        <Section
          title="Row features"
          description="Multi-row selection with header checkbox. Rows with subtenants can be expanded. Pin individual rows to top or bottom using the pin icon on hover."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enableRowSelection
              enableMultiRowSelection
              enableExpanding
              enableRowPinning
              enablePagination
              pageSize={8}
              getRowCanExpand={(row) => row.original.subtenants.length > 0}
              renderSubComponent={({ row }) => <SubtenantsPanel row={row} />}
              onRowSelectionChange={(rows) => console.log("Selected:", rows.map(r => r.original.id))}
              enableColumnFilters={false}
            />
          </div>
        </Section>

        {/* 6. Grouping & aggregation */}
        <Section
          title="Grouping and aggregation"
          description="Click the group icon on Market or Type column headers to group rows. Aggregated rows show sum of SF and average NER. Expand groups to see individual rows."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={GROUPING_COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enableGrouping
              enableExpanding
              enablePagination
              pageSize={12}
              enableColumnFilters={false}
              getRowCanExpand={() => true}
            />
          </div>
        </Section>

        {/* 7. Cell selection */}
        <Section
          title="Cell selection"
          description="Click any cell to select it. Hold Shift and click another cell to select a rectangular range. Selected cells are highlighted."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={BASIC_COLUMNS}
              data={DATA.slice(0, 10)}
              enableCellSelection
              enablePagination={false}
              enableColumnFilters={false}
              enableGlobalFilter={false}
              enableColumnVisibility={false}
            />
          </div>
        </Section>

        {/* 8. Full-featured */}
        <Section
          title="Full-featured table"
          description="All features enabled: sorting, search, column filters with faceting, visibility, row selection, expansion, row pinning, pagination, resizing, column pinning, and column ordering."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={COLUMNS}
              data={DATA}
              initialSorting={[{ id: "tenant", desc: false }]}
              enableRowSelection
              enableMultiRowSelection
              enableExpanding
              enableRowPinning
              enablePagination
              enableColumnResizing
              enableColumnPinning
              enableColumnOrdering
              enableColumnFilters
              enableFaceting
              pageSize={10}
              pageSizeOptions={[5, 10, 20, 50]}
              getRowCanExpand={(row) => row.original.subtenants.length > 0}
              renderSubComponent={({ row }) => <SubtenantsPanel row={row} />}
            />
          </div>
        </Section>

        {/* 9. Loading state */}
        <Section
          title="Loading state"
          description="A skeleton animation fills the table while data is being fetched."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <LoadingExample />
          </div>
        </Section>

        {/* 10. Empty state */}
        <Section
          title="Empty state"
          description="Shown when there is no data, or when filters return no results."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">No data</p>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <DataTable
                  columns={BASIC_COLUMNS}
                  data={[]}
                  enablePagination={false}
                  enableGlobalFilter={false}
                  enableColumnVisibility={false}
                  enableColumnFilters={false}
                  emptyMessage="No leases found"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Empty after filter (search to trigger)</p>
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <DataTable
                  columns={BASIC_COLUMNS}
                  data={DATA.slice(0, 5)}
                  enablePagination={false}
                  enableColumnVisibility={false}
                  enableColumnFilters={false}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* 11. Error state */}
        <Section
          title="Error state"
          description="Shown when the data request fails. Displays an inline error message."
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <DataTable
              columns={BASIC_COLUMNS}
              data={[]}
              error="Failed to load lease data. Please try again."
              enablePagination={false}
              enableGlobalFilter={false}
              enableColumnVisibility={false}
              enableColumnFilters={false}
            />
          </div>
        </Section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
