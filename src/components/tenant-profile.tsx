import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip } from "recharts"
import { ChevronDown, ChevronRight, Mail, Phone, Building2, Layers, FileText, Eye } from "lucide-react"
import { cn, cardBase } from "@/lib/utils"
import { KpiBar, type Kpi } from "@/components/kpi-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { TenantAvatar } from "@/components/tenant-avatar"
import { ActivityFeed } from "@/components/activity-feed"
import { PortfolioMap, type MapAsset } from "@/components/portfolio-map"
import { AssetCard } from "@/components/portfolio-grid"
import { LEASES, type Lease } from "@/components/leases-page"
import { type Deal } from "@/components/deals-page"
import { tenantMeta } from "@/lib/tenants-data"
import {
  AGGREGATE_PREFIX, entityDeals, entityTenants, fmtShort, rolloverSchedule,
  tenantContacts, tenantFamily, tenantFeed, leaseDocuments, type Contact, type DocStatus, type LeaseDocument,
} from "@/lib/tenant-profile-data"

const RENEWAL_RISK = ["Not renewing", "Negotiating", "In talks", "Renewal option", "Committed"]

function fmtCompact(v: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v)
}

function pct(part: number, whole: number) {
  return whole ? `${((part / whole) * 100).toFixed(1)}%` : "0%"
}

function lxdIso(l: Lease) {
  const [m, d, y] = l.lxd.split("/")
  return `${y}-${m}-${d}`
}

interface Place {
  where: string
  share: string
  narrowed: boolean
}

function describePlace(scopeAssets: string[] | null, scopeLabel: string): Place {
  if (!scopeAssets) return { where: "in your portfolio", share: "portfolio", narrowed: false }
  if (scopeAssets.length === 1 && scopeAssets[0] === scopeLabel) return { where: `at ${scopeLabel}`, share: "building", narrowed: true }
  return { where: `in ${scopeLabel}`, share: scopeLabel, narrowed: true }
}

export function entityLabel(selection: string) {
  return selection.startsWith(AGGREGATE_PREFIX) ? `All of ${selection.slice(AGGREGATE_PREFIX.length)}` : selection
}

interface TenantProfileProps {
  selection: string
  scopeAssets: string[] | null
  scopeLabel: string
  assets: MapAsset[]
  onSelect: (selection: string) => void
  onDealClick: (deal: Deal) => void
  onShowAllAssets: () => void
}

export function TenantProfile({ selection, scopeAssets, scopeLabel, assets, onSelect, onDealClick, onShowAllAssets }: TenantProfileProps) {
  const [tab, setTab] = React.useState("exposure")
  const [rightTab, setRightTab] = React.useState("updates")
  const [rightCollapsed, setRightCollapsed] = React.useState(false)

  const tenants = React.useMemo(() => entityTenants(selection), [selection])
  const family = React.useMemo(() => tenantFamily(tenants[0] ?? selection), [tenants, selection])
  const inScope = React.useCallback((l: Lease) => !scopeAssets || scopeAssets.includes(l.asset), [scopeAssets])

  const scopeLeases = React.useMemo(() => LEASES.filter(inScope), [inScope])
  const allEntityLeases = React.useMemo(() => LEASES.filter(l => tenants.includes(l.tenant)), [tenants])
  const leases = React.useMemo(() => allEntityLeases.filter(inScope), [allEntityLeases, inScope])
  const deals = React.useMemo(() => entityDeals(tenants, scopeAssets), [tenants, scopeAssets])
  const contacts = React.useMemo(
    () => tenantContacts(tenants[0] ?? family.parent, family.parent, leases.length ? leases : allEntityLeases, deals),
    [tenants, family.parent, leases, allEntityLeases, deals],
  )
  const feed = React.useMemo(() => tenantFeed(tenantMeta(tenants[0] ?? family.parent).parent, leases, deals, contacts), [tenants, family.parent, leases, deals, contacts])

  const isAggregate = selection.startsWith(AGGREGATE_PREFIX)
  const place = describePlace(scopeAssets, scopeLabel)

  return (
    <div className="flex flex-col gap-4 pb-8">
      <FamilyStrip family={family} selection={selection} scopeLeases={scopeLeases} place={place} onSelect={onSelect} />

      {leases.length === 0 ? (
        <div className={cn(cardBase, "flex flex-col items-center gap-3 py-12 text-center")}>
          <p className="text-lg font-semibold text-foreground">No leases {place.where}</p>
          <p className="text-sm text-muted-foreground max-w-md">
            {allEntityLeases.length
              ? `${entityLabel(selection)} leases ${fmtCompact(allEntityLeases.reduce((a, l) => a + l.sf, 0))} sf at other assets in your portfolio.`
              : `${entityLabel(selection)} has no leases yet. You can still track contacts and updates below.`}
          </p>
          {allEntityLeases.length > 0 && place.narrowed && <Button variant="outline" onClick={onShowAllAssets}>Show all assets</Button>}
        </div>
      ) : (
        <ExposureKpis leases={leases} allEntityLeases={allEntityLeases} scopeLeases={scopeLeases} deals={deals} place={place} />
      )}

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="flex-[5] min-w-0 flex flex-col gap-4">
          <div className={cn(cardBase, "flex-1")}>
            <Tabs value={tab} onValueChange={v => setTab(v as string)} className="w-full">
              <TabsList variant="line" className="mb-4">
                <TabsTrigger value="exposure">Exposure</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="deals">
                  Deals
                  {deals.length ? <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">{deals.length}</span> : null}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="exposure"><ExposureTab leases={leases} showTenant={isAggregate} where={place.where} /></TabsContent>
              <TabsContent value="map">
                {tab === "map" && <TenantMap leases={leases} assets={assets} where={place.where} />}
              </TabsContent>
              <TabsContent value="deals"><DealsTab deals={deals} onDealClick={onDealClick} where={place.where} /></TabsContent>
            </Tabs>
          </div>
        </div>

        <div className={cn("flex flex-col gap-4 transition-all duration-300", rightCollapsed ? "lg:w-14 lg:shrink-0" : "lg:flex-[3] min-w-0")}>
          <div className={cn(cardBase, "overflow-hidden h-full", rightCollapsed && "lg:!px-3 lg:!py-3")}>
            <Tabs value={rightTab} onValueChange={v => setRightTab(v as string)} className="w-full">
              <div className="flex items-center mb-4">
                <Tooltip>
                  <TooltipTrigger render={<div className="hidden lg:block shrink-0 pb-1 mr-1" />}>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => setRightCollapsed(c => !c)}
                      aria-label={rightCollapsed ? "Expand relationships" : "Collapse relationships"}
                      className="hidden lg:flex h-6 w-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", rightCollapsed && "rotate-180")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium">{rightCollapsed ? "Expand" : "Collapse"}</TooltipContent>
                </Tooltip>
                <TabsList variant="line" className={cn("mb-4", rightCollapsed && "lg:hidden")}>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="contacts">
                    Contacts
                    <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">{contacts.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
              </div>
              <div className={cn("flex flex-col gap-4", rightCollapsed && "lg:hidden")}>
                <TabsContent value="updates">
                  <ActivityFeed
                    key={selection}
                    entries={feed}
                    showLogTour={false}
                    draftPrompt={`Draft a relationship update for ${entityLabel(selection)} covering their footprint ${place.where}, upcoming expirations, and recent conversations.`}
                  />
                </TabsContent>
                <TabsContent value="contacts"><ContactsTab contacts={contacts} /></TabsContent>
                <TabsContent value="documents"><DocumentsTab leases={leases} where={place.where} /></TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function FamilyStrip({ family, selection, scopeLeases, place, onSelect }: {
  family: ReturnType<typeof tenantFamily>
  selection: string
  scopeLeases: Lease[]
  place: Place
  onSelect: (s: string) => void
}) {
  const sfFor = (names: string[]) => scopeLeases.filter(l => names.includes(l.tenant)).reduce((a, l) => a + l.sf, 0)
  const leaseMembers = family.members.filter(m => m.hasLeases).map(m => m.name)
  const aggregateKey = `${AGGREGATE_PREFIX}${family.parent}`
  const items = [
    ...(leaseMembers.length > 1 ? [{ key: aggregateKey, name: `All of ${family.parent}`, logo: family.parent, role: "Aggregate view", sf: sfFor(leaseMembers), hasLeases: true, aggregate: true }] : []),
    ...family.members.map(m => ({ key: m.name, name: m.name, logo: m.name, role: m.role, sf: sfFor([m.name]), hasLeases: m.hasLeases, aggregate: false })),
  ]

  return (
    <div className={cn(cardBase, "!p-3")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-1 mb-2">
        <p className="text-sm font-semibold text-foreground">Corporate family</p>
        <p className="text-xs text-muted-foreground">Square footage {place.where}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map(item => {
          const selected = item.key === selection
          const status = !item.hasLeases ? "No leases" : item.sf ? `${fmtCompact(item.sf)} sf` : "In portfolio"
          return (
            <button
              key={item.key}
              type="button"
              disabled={!item.hasLeases}
              onClick={() => onSelect(item.key)}
              aria-pressed={selected}
              className={cn(
                "flex items-center gap-2.5 shrink-0 rounded-xl border px-3 py-2 text-left transition-colors",
                selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/60",
                !item.hasLeases && "opacity-50 cursor-not-allowed hover:bg-card",
                item.hasLeases && !item.sf && !selected && "opacity-70",
              )}
            >
              {item.aggregate
                ? <span className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0"><Layers className="h-3.5 w-3.5" /></span>
                : <TenantAvatar name={item.logo} />}
              <span className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate max-w-44">{item.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.role} · {status}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ExposureKpis({ leases, allEntityLeases, scopeLeases, deals, place }: {
  leases: Lease[]
  allEntityLeases: Lease[]
  scopeLeases: Lease[]
  deals: Deal[]
  place: Place
}) {
  const sum = (ls: Lease[], f: (l: Lease) => number) => ls.reduce((a, l) => a + f(l), 0)
  const sf = sum(leases, l => l.sf)
  const revenue = sum(leases, l => l.annualRent)
  const walt = sf ? sum(leases, l => l.remaining * l.sf) / sf / 12 : 0
  const upcoming = leases.filter(l => l.remaining > 0).sort((a, b) => lxdIso(a).localeCompare(lxdIso(b)))[0]
  const risk = RENEWAL_RISK.find(r => leases.some(l => l.renewalStatus === r)) ?? "None"
  const riskCount = leases.filter(l => l.renewalStatus === risk).length
  const hasLeasesElsewhere = allEntityLeases.length > leases.length
  const totalNote = (v: string) => place.narrowed && hasLeasesElsewhere ? ` · ${v} total` : ""

  const kpis: Kpi[] = [
    {
      label: "Leased sf", value: `${fmtCompact(sf)} sf`,
      subtitle: `${pct(sf, sum(scopeLeases, l => l.sf))} of ${place.share} sf${totalNote(`${fmtCompact(sum(allEntityLeases, l => l.sf))} sf`)}`,
    },
    {
      label: "Annual revenue", value: `$${fmtCompact(revenue)}`,
      subtitle: `${pct(revenue, sum(scopeLeases, l => l.annualRent))} of ${place.share} rent${totalNote(`$${fmtCompact(sum(allEntityLeases, l => l.annualRent))}`)}`,
    },
    { label: "WALT", value: `${walt.toFixed(1)} yrs`, subtitle: `${leases.length} ${leases.length === 1 ? "lease" : "leases"}`, trend: walt < 2 ? "down" : undefined },
    {
      label: "Next expiration", value: upcoming ? fmtShort(lxdIso(upcoming)) : "None",
      subtitle: upcoming ? `${upcoming.remaining} months · ${upcoming.asset}` : undefined,
      trend: upcoming && upcoming.remaining <= 12 ? "down" : undefined,
    },
    {
      label: "Renewal risk", value: risk,
      subtitle: `${riskCount} of ${leases.length} ${leases.length === 1 ? "lease" : "leases"}`,
      trend: risk === "Not renewing" || risk === "Negotiating" ? "down" : undefined,
    },
    { label: "Active deals", value: String(deals.length), subtitle: deals.length ? `${fmtCompact(deals.reduce((a, d) => a + d.sf, 0))} sf in pipeline` : "No sf in pipeline" },
  ]
  return <KpiBar kpis={kpis} />
}

function colHeader<T>(title: string, right = false): ColumnDef<T>["header"] {
  return ({ column, table }) => <DataTableColumnHeader column={column} table={table} title={title} className={right ? "justify-end" : undefined} />
}

const LEASE_COLUMNS: ColumnDef<Lease>[] = [
  {
    id: "tenant", accessorKey: "tenant", header: colHeader("Tenant"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <TenantAvatar name={row.original.tenant} />
        <span className="font-medium">{row.original.tenant}</span>
      </div>
    ),
  },
  { id: "asset", accessorKey: "asset", header: colHeader("Asset"), cell: ({ row }) => <span className="font-medium">{row.original.asset}</span> },
  {
    id: "suite", accessorFn: l => [l.floor, l.suite].filter(Boolean).join(" · "), header: colHeader("Suite"),
    cell: ({ getValue }) => <span className="text-muted-foreground whitespace-nowrap">{getValue() as string}</span>,
  },
  { id: "sf", accessorKey: "sf", header: colHeader("Size (sf)", true), cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.sf.toLocaleString()}</span> },
  { id: "rent", accessorKey: "baseRent", header: colHeader("Rent ($/sf/yr)", true), cell: ({ row }) => <span className="block text-right tabular-nums">${row.original.baseRent.toFixed(2)}</span> },
  {
    id: "expiration", accessorFn: lxdIso, header: colHeader("Expiration"),
    cell: ({ row }) => (
      <span className={cn("tabular-nums whitespace-nowrap", row.original.remaining <= 12 && "text-destructive font-medium")}>{fmtShort(lxdIso(row.original))}</span>
    ),
  },
  {
    id: "renewal", accessorKey: "renewalStatus", header: colHeader("Renewal"),
    cell: ({ row }) => row.original.renewalStatus
      ? <Badge variant={row.original.renewalStatus === "Not renewing" ? "destructive" : "secondary"}>{row.original.renewalStatus}</Badge>
      : <span className="text-muted-foreground">None</span>,
  },
  {
    id: "options", accessorFn: l => l.options.join(", "), header: colHeader("Options"),
    cell: ({ getValue }) => <span className="text-muted-foreground">{(getValue() as string) || "None"}</span>,
  },
]

function ExposureTab({ leases, showTenant, where }: { leases: Lease[]; showTenant: boolean; where: string }) {
  const schedule = rolloverSchedule(leases)
  if (!leases.length) return <p className="py-8 text-center text-sm text-muted-foreground">No leases {where}.</p>

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Rollover schedule</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={schedule} margin={{ top: 4, right: 4, left: 4, bottom: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.6} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
            <YAxis tickFormatter={v => fmtCompact(v)} axisLine={false} tickLine={false} width={44} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
            <ChartTooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload as { sf: number; revenue: number }
                return (
                  <div className="rounded-lg border border-border bg-popover px-3.5 py-2.5 text-xs text-popover-foreground shadow-md tabular-nums">
                    <p className="font-semibold mb-1">Expiring in {label}</p>
                    <p>{d.sf.toLocaleString()} sf</p>
                    <p>${d.revenue.toLocaleString()} /yr</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="sf" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Leases</h3>
        <DataTable
          columns={showTenant ? LEASE_COLUMNS : LEASE_COLUMNS.filter(c => c.id !== "tenant")}
          data={leases}
          initialSorting={[{ id: "expiration", desc: false }]}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          enableColumnVisibility={false}
          enablePagination={leases.length > 10}
          emptyMessage={`No leases ${where}.`}
        />
      </section>
    </div>
  )
}

function TenantMap({ leases, assets, where }: { leases: Lease[]; assets: MapAsset[]; where: string }) {
  const byAsset = React.useMemo(() => {
    const m = new Map<string, Lease[]>()
    for (const l of leases) m.set(l.asset, [...(m.get(l.asset) ?? []), l])
    return m
  }, [leases])
  const mapAssets = React.useMemo(() => assets.filter(a => byAsset.has(a.name)), [assets, byAsset])
  const markerLabel = React.useCallback((id: string) => {
    const name = assets.find(a => a.id === id)?.name ?? ""
    return `${fmtCompact((byAsset.get(name) ?? []).reduce((a, l) => a + l.sf, 0))} sf`
  }, [assets, byAsset])
  const renderPopup = React.useCallback((asset: MapAsset) => {
    const ls = [...(byAsset.get(asset.name) ?? [])].sort((a, b) => lxdIso(a).localeCompare(lxdIso(b)))
    const sf = ls.reduce((a, l) => a + l.sf, 0)
    const rent = ls.reduce((a, l) => a + l.annualRent, 0)
    const next = ls.find(l => l.remaining > 0)
    const stats = [
      { label: "Leased sf", value: `${fmtCompact(sf)} sf`, sub: `${ls.length} ${ls.length === 1 ? "lease" : "leases"}`, tone: "" },
      { label: "Annual rent", value: `$${fmtCompact(rent)}`, sub: `$${sf ? (rent / sf).toFixed(2) : "0.00"}/sf avg`, tone: "" },
      {
        label: "Next expiration", value: next ? next.lxd.split("/")[2] : "None",
        sub: next ? `${next.remaining} months` : "No upcoming",
        tone: next && next.remaining <= 12 ? "text-destructive" : "",
      },
    ]
    const body = (
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 divide-x divide-border/60">
          {stats.map((s, i) => (
            <div key={s.label} className={cn(i === 0 ? "pr-3" : i === 1 ? "px-3" : "pl-3")}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
              <p className={cn("text-xs font-medium text-muted-foreground", s.tone)}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-border/60 border-t border-border/60">
          {ls.map(l => (
            <div key={l.id} className="flex items-baseline justify-between gap-2 py-1.5 text-xs">
              <span className="truncate text-foreground">{l.tenant} · {[l.floor, l.suite].filter(Boolean).join(" · ")}</span>
              <span className="tabular-nums text-muted-foreground shrink-0">{l.sf.toLocaleString()} sf · {fmtShort(lxdIso(l))}</span>
            </div>
          ))}
        </div>
      </div>
    )
    return (
      <div className="w-[min(400px,calc(100vw-6rem))]">
        <AssetCard asset={asset} deals={[]} onClick={() => {}} body={body} />
      </div>
    )
  }, [byAsset])

  if (!mapAssets.length) return <p className="py-8 text-center text-sm text-muted-foreground">No assets to map {where}.</p>
  return (
    <PortfolioMap
      assets={mapAssets}
      onAssetClick={() => {}}
      fixedHeight={560}
      hideLegend
      markerLabel={markerLabel}
      renderPopup={renderPopup}
    />
  )
}

function DealsTab({ deals, onDealClick, where }: { deals: Deal[]; onDealClick: (d: Deal) => void; where: string }) {
  const columns = React.useMemo<ColumnDef<Deal>[]>(() => [
    {
      id: "deal", accessorFn: d => `${d.tenant} ${d.dealType}`, header: colHeader("Deal"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TenantAvatar name={row.original.tenant} />
          <div className="flex flex-col items-start">
            <Button variant="link" className="h-auto p-0 font-medium text-foreground hover:text-primary" onClick={() => onDealClick(row.original)}>
              {row.original.tenant}
            </Button>
            <span className="text-xs text-muted-foreground">{row.original.dealType}</span>
          </div>
        </div>
      ),
    },
    { id: "asset", accessorKey: "asset", header: colHeader("Asset") },
    { id: "stage", accessorKey: "stage", header: colHeader("Stage"), cell: ({ row }) => <Badge variant="secondary">{row.original.stage}</Badge> },
    { id: "sf", accessorKey: "sf", header: colHeader("Size (sf)", true), cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.sf.toLocaleString()}</span> },
    {
      id: "ner", accessorFn: d => d.ner - d.budgetNer, header: colHeader("NER vs budget", true),
      cell: ({ row }) => {
        const d = row.original
        const diff = d.ner - d.budgetNer
        return (
          <span className="block text-right tabular-nums whitespace-nowrap">
            {d.ner > 0
              ? <span className={diff >= 0 ? "text-success" : "text-destructive"}>${d.ner.toFixed(2)} ({diff >= 0 ? "+" : ""}{diff.toFixed(2)})</span>
              : <span className="text-muted-foreground">Pending</span>}
          </span>
        )
      },
    },
    {
      id: "updated", accessorKey: "lastUpdated", header: colHeader("Updated"),
      cell: ({ row }) => <span className="text-muted-foreground tabular-nums whitespace-nowrap">{fmtShort(row.original.lastUpdated)}</span>,
    },
  ], [onDealClick])

  if (!deals.length) return <p className="py-8 text-center text-sm text-muted-foreground">No active deals {where}.</p>
  return (
    <DataTable
      columns={columns}
      data={deals}
      initialSorting={[{ id: "updated", desc: true }]}
      enableColumnFilters={false}
      enableGlobalFilter={false}
      enableColumnVisibility={false}
      enablePagination={deals.length > 10}
    />
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  const isInternal = contact.group === "internal"
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
          isInternal ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
        )}>{contact.initials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">{contact.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {contact.title}{contact.group === "broker" && `, ${contact.company}`}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 pl-12 text-xs">
        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 min-w-0 text-foreground hover:text-primary">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{contact.email}</span>
        </a>
        <a href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`} className="flex items-center gap-2 text-foreground hover:text-primary">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap tabular-nums">{contact.phone}</span>
        </a>
        <div className="flex items-start gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {contact.assets.map(a => (
              <span key={a} className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">{a}</span>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground pt-1">
          <span className="font-medium text-foreground tabular-nums">{contact.touchpoints}</span> touchpoints · Last contact {fmtShort(contact.lastContact)}
        </p>
      </div>
    </div>
  )
}

const DOC_STATUS_CLS: Record<DocStatus, string> = {
  "Expert verified": "bg-success/15 text-success border-transparent",
  "AI extracted": "bg-primary/10 text-primary border-transparent",
  "Needs review": "bg-warning/15 text-warning border-transparent",
}

const DOC_STATUS_RANK: DocStatus[] = ["Needs review", "AI extracted", "Expert verified"]

function DocStatusBadge({ status }: { status: DocStatus }) {
  return <Badge className={DOC_STATUS_CLS[status]}>{status}</Badge>
}

const DOC_COLUMNS: ColumnDef<LeaseDocument>[] = [
  {
    id: "name", accessorKey: "name", header: colHeader("Document"),
    cell: ({ row }) => (
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-3 min-w-0">
        <div className="flex items-start gap-2 min-w-0">
          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm text-foreground whitespace-normal">
              {row.original.name.split(/(?<=_)/).map((part, i) => <React.Fragment key={i}>{part}<wbr /></React.Fragment>)}
            </p>
            <p className="text-xs text-muted-foreground whitespace-normal">{row.original.type} · {fmtShort(row.original.modified)}</p>
          </div>
        </div>
        <div className="pl-5.5 sm:pl-0 shrink-0">
          <DocStatusBadge status={row.original.status} />
        </div>
      </div>
    ),
  },
]

function LeaseDocumentsCard({ lease }: { lease: Lease }) {
  const [open, setOpen] = React.useState(true)
  const docs = React.useMemo(() => leaseDocuments(lease), [lease])
  const status = DOC_STATUS_RANK.find(s => docs.some(d => d.status === s)) ?? "Expert verified"
  const unit = [lease.floor, lease.suite && `Unit ${lease.suite}`].filter(Boolean).join(" · ")

  return (
    <section className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start gap-3 px-3 py-3">
        <Button variant="ghost" size="icon-sm" aria-label={open ? "Collapse documents" : "Expand documents"} aria-expanded={open} onClick={() => setOpen(o => !o)} className="text-muted-foreground shrink-0">
          <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
        </Button>
        <TenantAvatar name={lease.tenant} />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-foreground">{lease.tenant}</p>
            <DocStatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground">{lease.asset} · {unit} · {docs.length} documents</p>
          <Button variant="link" size="sm" className="h-auto p-0 gap-1 text-xs self-start">
            <Eye className="h-3.5 w-3.5" />
            View abstract
          </Button>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-2">
          <DataTable
            columns={DOC_COLUMNS}
            data={docs}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enableColumnVisibility={false}
            enablePagination={false}
          />
        </div>
      )}
    </section>
  )
}

function DocumentsTab({ leases, where }: { leases: Lease[]; where: string }) {
  if (!leases.length) return <p className="py-8 text-center text-sm text-muted-foreground">No lease documents {where}.</p>
  return (
    <div className="flex flex-col gap-3">
      {leases.map(l => <LeaseDocumentsCard key={l.id} lease={l} />)}
    </div>
  )
}

function ContactsTab({ contacts }: { contacts: Contact[] }) {
  const groups = [
    { key: "tenant", label: "Tenant" },
    { key: "broker", label: "Brokers" },
    { key: "internal", label: "Our team" },
  ] as const
  return (
    <div className="flex flex-col gap-3">
      {groups.map(g => {
        const list = contacts.filter(c => c.group === g.key)
        if (!list.length) return null
        const company = g.key === "broker" ? `${list.length} ${list.length === 1 ? "broker" : "brokers"}` : list[0].company
        return (
          <section key={g.key} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">{g.label}</h3>
              <span className="text-xs text-muted-foreground truncate">{company}</span>
            </div>
            <div className="flex flex-col divide-y divide-border/60">
              {list.map(c => (
                <div key={c.name} className="py-4 first:pt-0 last:pb-0">
                  <ContactRow contact={c} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
