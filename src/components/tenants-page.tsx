import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
} from "recharts"
import { ChevronLeft, ChevronRight, Eye, EyeOff, Info, Plus } from "lucide-react"
import { cn, cardBase } from "@/lib/utils"
import { KpiBar } from "@/components/kpi-bar"
import { FilterBar, MobileFilterSheet, toggleFilterValue, clearFilterKey, FILTER_TAB_GROUP_CLS, FILTER_TAB_ITEM_CLS, type FilterDef } from "@/components/filter-chip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { TenantAvatar } from "@/components/tenant-avatar"
import { LEASES } from "@/components/leases-page"
import {
  buildTenantRows, groupTenantRows,
  type TenantGrouping, type TenantRow, type TenantUpdate,
} from "@/lib/tenants-data"

const CHART_PAGE_SIZE = 10

const GROUPING_TITLE: Record<TenantGrouping, string> = {
  parent: "Top parent companies by revenue and size",
  industry: "Industries by revenue and size",
  tenant: "Tenants by revenue and size",
}

const GROUPING_AXIS: Record<TenantGrouping, string> = {
  parent: "Ultimate parents",
  industry: "Industries",
  tenant: "Tenants",
}

const SORT_OPTIONS = [
  { value: "revenue-desc", label: "Revenue (descending)" },
  { value: "revenue-asc", label: "Revenue (ascending)" },
  { value: "sf-desc", label: "Size (descending)" },
  { value: "sf-asc", label: "Size (ascending)" },
]

const RENEWAL_ORDER = ["Not renewing", "Negotiating", "In talks", "Renewal option", "Committed"]

const WALT_BUCKETS = [
  { value: "lt1", label: "Under 1 year", test: (y: number) => y < 1 },
  { value: "1to3", label: "1 to 3 years", test: (y: number) => y >= 1 && y < 3 },
  { value: "3to5", label: "3 to 5 years", test: (y: number) => y >= 3 && y < 5 },
  { value: "5plus", label: "5+ years", test: (y: number) => y >= 5 },
]

const SIZE_BUCKETS = [
  { value: "lt10", label: "Under 10,000 sf", test: (sf: number) => sf < 10000 },
  { value: "10to25", label: "10,000 to 25,000 sf", test: (sf: number) => sf >= 10000 && sf < 25000 },
  { value: "25to50", label: "25,000 to 50,000 sf", test: (sf: number) => sf >= 25000 && sf < 50000 },
  { value: "50plus", label: "50,000+ sf", test: (sf: number) => sf >= 50000 },
]

const DEAL_OPTIONS = [
  { value: "active", label: "Has active deals" },
  { value: "none", label: "No active deals" },
]

const bucketOf = <T,>(buckets: { value: string; test: (v: T) => boolean }[], v: T) => buckets.find(b => b.test(v))?.value ?? ""

function fmtCompact(v: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v)
}

const TenantCommentsContext = React.createContext<{
  comments: Record<string, TenantUpdate>
  post: (tenant: string, message: string) => void
}>({ comments: {}, post: () => {} })

const TenantClickContext = React.createContext<((tenant: string) => void) | undefined>(undefined)

function TenantNameCell({ tenant }: { tenant: string }) {
  const onClick = React.useContext(TenantClickContext)
  return (
    <div className="flex items-center gap-2">
      <TenantAvatar name={tenant} />
      {onClick
        ? <Button variant="link" className="h-auto p-0 font-medium text-foreground hover:text-primary" onClick={() => onClick(tenant)}>{tenant}</Button>
        : <span className="font-medium">{tenant}</span>}
    </div>
  )
}

function LatestUpdateCell({ row }: { row: TenantRow }) {
  const { comments, post } = React.useContext(TenantCommentsContext)
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const u = comments[row.tenant] ?? row.latestUpdate

  function submit() {
    const text = draft.trim()
    if (!text) return
    post(row.tenant, text)
    setDraft("")
    setOpen(false)
  }
  function cancel() { setOpen(false); setDraft("") }

  if (open) return (
    <div className="flex flex-col gap-1.5 w-[164px]">
      <Textarea
        autoFocus
        rows={2}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() } if (e.key === "Escape") cancel() }}
        placeholder="Leave an update..."
        className="min-h-0 resize-none px-2 py-1 text-xs md:text-xs"
      />
      <div className="flex items-center gap-1.5">
        <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={submit}>Post</Button>
        <Button variant="ghost" size="sm" className="text-xs h-auto p-0 text-muted-foreground" onClick={cancel}>Cancel</Button>
      </div>
    </div>
  )

  if (!u) return (
    <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={() => setOpen(true)}>Leave an update</Button>
  )

  return (
    <div className="flex flex-col gap-0.5 w-[164px]">
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-xs font-semibold text-foreground truncate">{u.name}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{u.timestamp}</span>
      </div>
      <span className="text-xs text-muted-foreground line-clamp-2 leading-snug whitespace-normal">{u.message}</span>
      <Button variant="link" size="sm" className="text-xs h-auto p-0 self-start" onClick={() => setOpen(true)}>Leave an update</Button>
    </div>
  )
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function NumCell({ children }: { children: React.ReactNode }) {
  return <span className="tabular-nums text-right block">{children}</span>
}

function numHeader(title: string): ColumnDef<TenantRow>["header"] {
  return ({ column, table }) => <DataTableColumnHeader column={column} table={table} title={title} className="justify-end" enableColumnPinning />
}

const COLUMNS: ColumnDef<TenantRow>[] = [
  {
    accessorKey: "tenant",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Tenant" enableColumnPinning />,
    cell: ({ row }) => <TenantNameCell tenant={row.original.tenant} />,
    size: 260,
  },
  { accessorKey: "inPlaceLeases", header: numHeader("In-place leases"), cell: ({ row }) => <NumCell>{row.original.inPlaceLeases}</NumCell> },
  { accessorKey: "sf", header: numHeader("Size (sf)"), cell: ({ row }) => <NumCell>{row.original.sf.toLocaleString()}</NumCell> },
  { accessorKey: "revenuePsfMo", header: numHeader("Revenue ($/sf/mo)"), cell: ({ row }) => <NumCell>${row.original.revenuePsfMo.toFixed(2)}</NumCell> },
  { accessorKey: "waltYears", header: numHeader("WALT (years)"), cell: ({ row }) => <NumCell>{row.original.waltYears.toFixed(1)}</NumCell> },
  { accessorKey: "subleasesAsSubtenant", header: numHeader("Subleases (as subtenant)"), cell: ({ row }) => <NumCell>{row.original.subleasesAsSubtenant}</NumCell> },
  { accessorKey: "activeDeals", header: numHeader("Active deals"), cell: ({ row }) => <NumCell>{row.original.activeDeals}</NumCell> },
  {
    accessorKey: "lastUpdate",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Last update" enableColumnPinning />,
    cell: ({ row }) => <LatestUpdateCell row={row.original} />,
    size: 196,
  },
]

export function TenantsPage({ assetContext, allowedAssets, onTenantClick }: { assetContext?: string; allowedAssets?: string[]; onTenantClick?: (tenant: string) => void }) {
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({})
  const [grouping, setGrouping] = React.useState<TenantGrouping>("parent")
  const [sort, setSort] = React.useState("revenue-desc")
  const [chartPage, setChartPage] = React.useState(1)
  const [slotWidth, setSlotWidth] = React.useState(120)
  const narrowChart = slotWidth < 96
  const labelChars = narrowChart ? 14 : Math.min(20, Math.floor(slotWidth / 6.4))
  const [chartVisible, setChartVisible] = React.useState(true)
  const [comments, setComments] = React.useState<Record<string, TenantUpdate>>({})
  const commentsValue = React.useMemo(() => ({
    comments,
    post: (tenant: string, message: string) => setComments(prev => ({ ...prev, [tenant]: { message, name: "You", timestamp: "Just now" } })),
  }), [comments])

  function onToggle(key: string, value: string) { setActiveFilters(prev => toggleFilterValue(prev, key, value)); setChartPage(1) }
  function onClear(key: string) { setActiveFilters(prev => clearFilterKey(prev, key)); setChartPage(1) }
  function onClearAll() { setActiveFilters({}); setChartPage(1) }
  function onSelectAll(key: string, values: string[]) { setActiveFilters(prev => ({ ...prev, [key]: values })); setChartPage(1) }

  const scopedLeases = React.useMemo(() => {
    if (assetContext) return LEASES.filter(l => l.asset === assetContext)
    if (allowedAssets) return LEASES.filter(l => allowedAssets.includes(l.asset))
    return LEASES
  }, [assetContext, allowedAssets])

  const filterDefs: FilterDef[] = React.useMemo(() => {
    const industries = [...new Set(buildTenantRows(scopedLeases).map(r => r.industry))].sort()
    const renewals = RENEWAL_ORDER.filter(v => scopedLeases.some(l => l.renewalStatus === v))
    const defs: FilterDef[] = [
      { key: "industry", label: "Industry", options: industries.map(v => ({ label: v, value: v })) },
      { key: "renewalStatus", label: "Renewal status", options: renewals.map(v => ({ label: v, value: v })) },
      { key: "walt", label: "WALT", options: WALT_BUCKETS.map(({ value, label }) => ({ value, label })) },
      { key: "size", label: "Size", options: SIZE_BUCKETS.map(({ value, label }) => ({ value, label })) },
      { key: "deals", label: "Deal activity", options: DEAL_OPTIONS },
    ]
    if (assetContext) return defs
    const assets = [...new Set(scopedLeases.map(l => l.asset))].sort()
    return [{ key: "asset", label: "Asset", options: assets.map(v => ({ label: v, value: v })) }, ...defs]
  }, [scopedLeases, assetContext])

  const assetLeases = React.useMemo(() => {
    const assets = activeFilters.asset ?? []
    return assets.length ? scopedLeases.filter(l => assets.includes(l.asset)) : scopedLeases
  }, [scopedLeases, activeFilters.asset])

  const rows = React.useMemo(() => {
    const has = (key: string) => (activeFilters[key]?.length ?? 0) > 0
    const sel = (key: string) => activeFilters[key] ?? []
    const renewalTenants = has("renewalStatus")
      ? new Set(assetLeases.filter(l => sel("renewalStatus").includes(l.renewalStatus)).map(l => l.tenant))
      : null
    return buildTenantRows(assetLeases).filter(r =>
      (!renewalTenants || renewalTenants.has(r.tenant)) &&
      (!has("industry") || sel("industry").includes(r.industry)) &&
      (!has("walt") || sel("walt").includes(bucketOf(WALT_BUCKETS, r.waltYears))) &&
      (!has("size") || sel("size").includes(bucketOf(SIZE_BUCKETS, r.sf))) &&
      (!has("deals") || sel("deals").includes(r.activeDeals > 0 ? "active" : "none"))
    )
  }, [assetLeases, activeFilters])

  const totalSf = rows.reduce((a, r) => a + r.sf, 0)
  const totalRevenue = rows.reduce((a, r) => a + r.annualRevenue, 0)
  const assetCount = new Set(rows.flatMap(r => r.assets)).size
  const inPlaceCount = rows.reduce((a, r) => a + r.inPlaceLeases, 0)

  const groups = React.useMemo(() => {
    const [metric, dir] = sort.split("-") as ["revenue" | "sf", "asc" | "desc"]
    return groupTenantRows(rows, grouping).sort((a, b) => dir === "asc" ? a[metric] - b[metric] : b[metric] - a[metric])
  }, [rows, grouping, sort])

  const chartPages = Math.max(1, Math.ceil(groups.length / CHART_PAGE_SIZE))
  const chartStart = (chartPage - 1) * CHART_PAGE_SIZE
  const chartData = groups.slice(chartStart, chartStart + CHART_PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterBar filters={filterDefs} active={activeFilters} onToggle={onToggle} onClear={onClear} onClearAll={onClearAll} onSelectAll={onSelectAll} visibleCount={6} className="hidden md:flex" />
        <div className="md:hidden">
          <MobileFilterSheet filters={filterDefs} active={activeFilters} onToggle={onToggle} onClear={onClear} onClearAll={onClearAll} onSelectAll={onSelectAll} />
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium" onClick={() => setChartVisible(v => !v)}>
            {chartVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {chartVisible ? "Hide chart" : "Show chart"}
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-sm font-medium">
            <Plus className="h-3.5 w-3.5" />
            Add tenant
          </Button>
        </div>
      </div>

      <KpiBar kpis={[
        { label: "Total size", value: `${fmtCompact(totalSf)} sf`, subtitle: `${assetCount} ${assetCount === 1 ? "asset" : "assets"}` },
        { label: "Total revenue", value: `$${fmtCompact(totalRevenue)}`, subtitle: "USD/yr" },
        { label: "Tenants", value: String(rows.length), subtitle: `${inPlaceCount} in-place leases` },
      ]} />

      <div className={cn("grid transition-all duration-300 ease-in-out", chartVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
      <div className="overflow-hidden">
      <div className={cn(cardBase, "min-w-0")}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">{GROUPING_TITLE[grouping]}</h2>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="About this chart" className="text-muted-foreground" />}>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Annual base rent and leased square feet, summed across the filtered leases.</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup type="single" value={grouping}
              onValueChange={v => { if (typeof v === "string" && v) { setGrouping(v as TenantGrouping); setChartPage(1) } }}
              className={FILTER_TAB_GROUP_CLS}>
              <ToggleGroupItem value="parent" size="sm" className={FILTER_TAB_ITEM_CLS}>Parent companies</ToggleGroupItem>
              <ToggleGroupItem value="industry" size="sm" className={FILTER_TAB_ITEM_CLS}>Industries</ToggleGroupItem>
              <ToggleGroupItem value="tenant" size="sm" className={FILTER_TAB_ITEM_CLS}>Tenants</ToggleGroupItem>
            </ToggleGroup>
            <Select items={SORT_OPTIONS} value={sort} onValueChange={v => { if (v) { setSort(v as string); setChartPage(1) } }}>
              <SelectTrigger size="sm" className="w-48" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-chart-1" />
            <span className="text-sm text-muted-foreground">Revenue (USD/yr)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full shrink-0 bg-chart-5" />
            <span className="text-sm text-muted-foreground">Size (sf)</span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No tenants match these filters.</p>
        ) : (
          <ResponsiveContainer width="100%" height={narrowChart ? 400 : 340} onResize={w => setSlotWidth((w - 136) / CHART_PAGE_SIZE)}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.6} />
              <XAxis
                dataKey="name"
                interval={0}
                height={narrowChart ? 110 : 48}
                axisLine={false}
                tickLine={false}
                tick={(props: unknown) => {
                  const { x, y, payload } = props as { x: number; y: number; payload: { value: string } }
                  return (
                    <text
                      x={x} y={y + 12} fontSize={11} fill="var(--color-muted-foreground)"
                      textAnchor={narrowChart ? "end" : "middle"}
                      transform={narrowChart ? `rotate(-45 ${x} ${y + 12})` : undefined}
                    >
                      <title>{payload.value}</title>
                      {truncate(payload.value, labelChars)}
                    </text>
                  )
                }}
                label={{ value: GROUPING_AXIS[grouping], position: "insideBottom", fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={v => fmtCompact(v)}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false} tickLine={false} width={56}
                label={{ value: "Revenue (USD/yr)", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                yAxisId="right" orientation="right"
                tickFormatter={v => fmtCompact(v)}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                axisLine={false} tickLine={false} width={56}
                label={{ value: "Size (sf)", angle: 90, position: "insideRight", fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <ChartTooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload as { revenue: number; sf: number }
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3.5 py-2.5 text-xs text-popover-foreground shadow-md">
                      <p className="font-semibold mb-1.5">{label}</p>
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <span className="h-2 w-2 rounded-full bg-chart-1" />
                        Revenue: ${d.revenue.toLocaleString()} /yr
                      </p>
                      <p className="flex items-center gap-1.5 tabular-nums mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-chart-5" />
                        Size: {d.sf.toLocaleString()} sf
                      </p>
                    </div>
                  )
                }}
              />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={72} />
              <Line
                yAxisId="right" type="linear" dataKey="sf" name="Size"
                stroke="var(--color-chart-5)" strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-chart-5)", stroke: "var(--color-card)", strokeWidth: 2 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border/60">
          <p className="text-sm text-muted-foreground tabular-nums">
            {groups.length ? `${chartStart + 1} - ${chartStart + chartData.length} of ${groups.length}` : "0 of 0"}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="gap-1" disabled={chartPage <= 1} onClick={() => setChartPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <Button variant="outline" size="sm" className="gap-1" disabled={chartPage >= chartPages} onClick={() => setChartPage(p => p + 1)}>
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
      </div>
      </div>

      <div className={cn(cardBase, "min-w-0")}>
        <h2 className="text-xl font-semibold text-foreground mb-4">All tenants</h2>
        <TenantClickContext.Provider value={onTenantClick}>
        <TenantCommentsContext.Provider value={commentsValue}>
        <DataTable
          columns={COLUMNS}
          data={rows}
          initialSorting={[{ id: "revenuePsfMo", desc: true }]}
          enableColumnFilters={false}
          enableColumnPinning
          pageSize={15}
          pageSizeOptions={[15, 30, 50]}
          emptyMessage="No tenants match these filters."
        />
        </TenantCommentsContext.Provider>
        </TenantClickContext.Provider>
      </div>
    </div>
  )
}
