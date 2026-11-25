import * as React from "react"
import { CalendarClock, FileText, HandCoins, Layers, Percent, Receipt, Sparkle, TrendingUp, Wallet } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { cn, cardBase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { AgentBtn } from "@/components/agent-btn"
import { PanelErrorBoundary } from "@/components/panel-error-boundary"
import { TenantAvatar } from "@/components/tenant-avatar"
import { AgentKpi, EntityCard, InsightCardHeader, StatStrip } from "@/components/tenant-profile"
import { type Budget } from "@/components/budgets-page"
import { type Deal } from "@/components/deals-page"
import { budgetDetail, type BaseRent, type BudgetDetail, type YearRow } from "@/lib/budget-profile-data"
import { dealTypeLabel } from "@/lib/tenant-intelligence"

// Same tokens the tenant profile uses for inner cards and tables.
const subCard = "rounded-xl border border-border bg-card p-4"
const TABLE_PROPS = { enableColumnFilters: false, enableGlobalFilter: false, enableColumnVisibility: false, enablePagination: false } as const

function colHeader<T>(title: string, right = false): ColumnDef<T>["header"] {
  return ({ column, table }) => <DataTableColumnHeader column={column} table={table} title={title} className={right ? "justify-end" : undefined} />
}

function money(v: number) {
  const a = Math.abs(v)
  const s = a >= 1e6 ? `${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${Math.round(a / 1e3)}K` : `${Math.round(a)}`
  return `${v < 0 ? "-" : ""}$${s}`
}
const psf = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(v).toFixed(2)}`
const sf = (v: number) => `${v.toLocaleString()} sf`
const date = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
const months = (from: number, duration: number) => `Months ${from} to ${from + duration - 1}`
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export interface BudgetProfileProps {
  budget: Budget
  onDealClick: (deal: Deal) => void
}

export function BudgetProfile({ budget, onDealClick }: BudgetProfileProps) {
  const d = React.useMemo(() => budgetDetail(budget), [budget])
  const [tab, setTab] = React.useState("overview")
  const [rightTab, setRightTab] = React.useState("deal")

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:flex-1">
      <div className={cn(cardBase, "@container lg:grow-5 lg:basis-0 min-w-0 w-full")}>
        <Tabs value={tab} onValueChange={v => setTab(v as string)} className="w-full">
          <TabsList variant="line" className="mb-4 max-w-full overflow-x-auto justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
            <TabsTrigger value="concessions">Concessions</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="recoveries">Recoveries</TabsTrigger>
            <TabsTrigger value="cashflow">Cash flow</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><PanelErrorBoundary label="Overview" resetKey={budget.id}><OverviewTab d={d} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="rent"><PanelErrorBoundary label="Rent" resetKey={budget.id}><RentTab d={d} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="concessions"><PanelErrorBoundary label="Concessions" resetKey={budget.id}><ConcessionsTab d={d} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="commissions"><PanelErrorBoundary label="Commissions" resetKey={budget.id}><CommissionsTab d={d} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="recoveries"><PanelErrorBoundary label="Recoveries" resetKey={budget.id}><RecoveriesTab d={d} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="cashflow"><PanelErrorBoundary label="Cash flow" resetKey={budget.id}><CashFlowTab d={d} /></PanelErrorBoundary></TabsContent>
        </Tabs>
      </div>

      <div className={cn(cardBase, "@container lg:grow-3 lg:basis-0 min-w-0 w-full")}>
        <Tabs value={rightTab} onValueChange={v => setRightTab(v as string)} className="w-full">
          <TabsList variant="line" className="mb-4 max-w-full overflow-x-auto justify-start">
            <TabsTrigger value="deal">Versus deals</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="deal"><PanelErrorBoundary label="Versus deals" resetKey={budget.id}><VersusDealTab d={d} onDealClick={onDealClick} /></PanelErrorBoundary></TabsContent>
          <TabsContent value="details"><PanelErrorBoundary label="Details" resetKey={budget.id}><DetailsTab d={d} /></PanelErrorBoundary></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/* ---------------------------------- Overview ---------------------------------- */

function OverviewTab({ d }: { d: BudgetDetail }) {
  const c = d.comparison
  const headline = c
    ? `${c.deals.length} priced ${c.deals.length === 1 ? "deal" : "deals"} at ${d.asset} ${c.deals.length === 1 ? "is" : "average"} ${psf(c.averageNer)} NER, ${Math.abs(c.averageSpread).toFixed(1)}% ${c.averageSpread >= 0 ? "above" : "below"} this budget.`
    : `No priced deals at ${d.asset} to compare yet.`
  const concessionShare = d.totals.baseRent ? (d.totals.concessions + d.totals.freeRent) / d.totals.baseRent : 0
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl p-4 flex flex-col gap-4 bg-sidebar-accent">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1 text-sidebar-foreground/70">VTS agents</p>
          <h2 className="text-xl font-semibold text-sidebar-foreground">Budget intelligence</h2>
        </div>
        <div className="rounded-lg px-3 py-2 flex items-center gap-2 bg-sidebar-foreground/10">
          <Sparkle className="h-4 w-4 shrink-0 text-sidebar-primary" />
          <p className="text-sm leading-snug text-sidebar-foreground/80"><span className="font-medium text-sidebar-primary">Versus deals:</span> {headline}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <AgentKpi label="NER" value={psf(d.ner)} sub="per sf per year" />
          <AgentKpi label="NPV" value={money(d.npv)} sub={`at ${d.discountRate}% discount`} />
          <AgentKpi label="Base rent" value={money(d.totals.baseRent)} sub={`over ${d.totalLeaseTerm} months`} />
          <AgentKpi label="Concessions" value={money(d.totals.concessions + d.totals.freeRent)} sub={`${Math.round(concessionShare * 100)}% of base rent`} tone={concessionShare > 0.35 ? "alert" : undefined} />
        </div>
      </section>

      <section className={cn(subCard, "flex flex-col gap-4")}>
        <InsightCardHeader
          icon={FileText} title="Deal terms" sub={`${capitalize(d.leaseStructure)}, ${d.totalLeaseTerm} months`}
          action={<AgentBtn entity="Budget" label={`${d.budget.label} at ${d.asset}, ${sf(d.rentableArea)}, ${d.totalLeaseTerm} months, ${d.leaseStructure}, NER ${psf(d.ner)}`} />}
        />
        <dl className="grid grid-cols-2 @lg:grid-cols-3 gap-x-4 gap-y-3">
          {[
            { label: "Deal type", value: d.dealType },
            { label: "Lease structure", value: capitalize(d.leaseStructure) },
            { label: "Rentable area", value: sf(d.rentableArea) },
            { label: "Commencement", value: date(d.commencementDate) },
            { label: "Expiration", value: date(d.expirationDate) },
            { label: "Term", value: `${d.totalLeaseTerm} months` },
            { label: "Space", value: `${d.budget.floor}, Suite ${d.budget.space}` },
            { label: "Budget year", value: d.budget.budgetYear ? String(d.budget.budgetYear) : "None" },
            { label: "Entered", value: d.budget.dateEntered },
          ].map(r => (
            <div key={r.label} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{r.label}</dt>
              <dd className="text-sm font-medium text-foreground truncate">{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CashFlowChart years={d.years} />
    </div>
  )
}

const CASH_CONFIG = { net: { label: "Net cash flow", color: "var(--chart-1)" } } satisfies ChartConfig
const CASH_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }
const CASH_RADIUS: [number, number, number, number] = [4, 4, 0, 0]
const yearTick = (y: number) => `Yr ${y}`

function CashFlowChart({ years }: { years: YearRow[] }) {
  return (
    <section className={cn(subCard, "flex flex-col gap-3")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Net cash flow by year</h3>
        <span className="text-xs text-muted-foreground">After concessions</span>
      </div>
      <ChartContainer config={CASH_CONFIG} className="aspect-auto h-48 w-full">
        <BarChart data={years} margin={CASH_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickFormatter={yearTick} tickLine={false} axisLine={false} tickMargin={6} />
          <YAxis tickFormatter={money} width={52} tickLine={false} axisLine={false} />
          <ReferenceLine y={0} stroke="var(--color-border)" />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator formatter={v => money(Number(v))} />} />
          <Bar dataKey="net" fill="var(--color-net)" radius={CASH_RADIUS} maxBarSize={36} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}

/* ------------------------------------ Rent ------------------------------------ */

function RentTab({ d }: { d: BudgetDetail }) {
  const columns = React.useMemo<ColumnDef<BaseRent>[]>(() => [
    { id: "period", accessorKey: "beginIn", header: colHeader<BaseRent>("Period"), cell: ({ row }) => months(row.original.beginIn, row.original.duration) },
    { id: "rent", accessorKey: "rent", header: colHeader<BaseRent>("Rent per sf", true), cell: ({ row }) => <p className="text-right tabular-nums">{psf(row.original.rent)}</p> },
    { id: "yearly", accessorKey: "yearlyTotal", header: colHeader<BaseRent>("Annual", true), cell: ({ row }) => <p className="text-right tabular-nums">{money(row.original.yearlyTotal)}</p> },
    { id: "monthly", accessorKey: "monthlyTotal", header: colHeader<BaseRent>("Monthly", true), cell: ({ row }) => <p className="text-right tabular-nums">{money(row.original.monthlyTotal)}</p> },
  ], [])
  const esc = d.rentEscalations[0]
  const free = d.freeRents[0]
  return (
    <div className="flex flex-col gap-4">
      <section className={cn(subCard, "flex flex-col gap-3")}>
        <InsightCardHeader icon={Wallet} title="Base rent" sub={`${d.baseRents.length} ${d.baseRents.length === 1 ? "period" : "periods"}, ${money(d.totals.baseRent)} over the term`} action={null} />
        <div className="hidden @xl:block">
          <DataTable columns={columns} data={d.baseRents} {...TABLE_PROPS} />
        </div>
        <ul className="flex flex-col gap-2 @xl:hidden">
          {d.baseRents.map(r => (
            <li key={r.beginIn}>
              <EntityCard>
                <p className="text-sm font-semibold text-foreground">{months(r.beginIn, r.duration)}</p>
                <StatStrip stats={[
                  { label: "Per sf", value: psf(r.rent) },
                  { label: "Annual", value: money(r.yearlyTotal) },
                  { label: "Monthly", value: money(r.monthlyTotal) },
                ]} />
              </EntityCard>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        <EntityCard>
          <InsightCardHeader icon={TrendingUp} title="Escalations" sub={esc ? esc.note ?? `${esc.escalation}% every ${esc.recurrenceInterval} months` : "No escalations"} action={null} />
          {esc && <StatStrip stats={[
            { label: "Rate", value: `${esc.escalation}%` },
            { label: "Type", value: capitalize(esc.escalationType) },
            { label: "Every", value: `${esc.recurrenceInterval} months` },
          ]} />}
        </EntityCard>
        <EntityCard>
          <InsightCardHeader icon={CalendarClock} title="Free rent" sub={free ? months(free.beginIn, free.duration) : "No free rent"} action={null} />
          {free && <StatStrip stats={[
            { label: "Duration", value: `${free.duration} months` },
            { label: "Type", value: capitalize(free.freeRentType) },
            { label: "Value", value: money(d.totals.freeRent) },
          ]} />}
        </EntityCard>
      </div>
    </div>
  )
}

/* -------------------------------- Concessions -------------------------------- */

function ConcessionsTab({ d }: { d: BudgetDetail }) {
  const a = d.rentableArea
  const items = [
    ...d.tenantImprovements.map(t => ({ icon: Layers, title: t.label, sub: `Paid in month ${t.occurrenceMonth}`, allowance: t.allowanceUnit === "rsf" ? psf(t.allowance) : money(t.allowance), unit: t.allowanceUnit === "rsf" ? "Per sf" : "Total", total: d.totals.ti })),
    ...d.buildingImprovements.map(t => ({ icon: Layers, title: t.label, sub: `Paid in month ${t.occurrenceMonth}`, allowance: t.allowanceUnit === "rsf" ? psf(t.allowance) : money(t.allowance), unit: t.allowanceUnit === "rsf" ? "Per sf" : "Total", total: d.totals.bi })),
    ...d.leaseIncentives.map(t => ({ icon: HandCoins, title: t.label, sub: `Paid in month ${t.occurrenceMonth}`, allowance: t.unit === "rsf" ? psf(t.amount) : money(t.amount), unit: t.unit === "rsf" ? "Per sf" : "Total", total: t.unit === "rsf" ? t.amount * a : t.amount })),
    ...(d.freeRents.length ? [{ icon: CalendarClock, title: "Free rent", sub: months(d.freeRents[0].beginIn, d.freeRents[0].duration), allowance: `${d.freeRents[0].duration} months`, unit: "Duration", total: d.totals.freeRent }] : []),
  ]
  const total = items.reduce((s, i) => s + i.total, 0)
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{money(total)} in concessions, {psf(total / a)} per sf.</p>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        {items.map(i => (
          <EntityCard key={i.title}>
            <InsightCardHeader icon={i.icon} title={i.title} sub={i.sub} action={null} />
            <StatStrip stats={[
              { label: i.unit, value: i.allowance },
              { label: "Total", value: money(i.total) },
              { label: "Per sf", value: psf(i.total / a) },
            ]} />
          </EntityCard>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------- Commissions -------------------------------- */

function CommissionsTab({ d }: { d: BudgetDetail }) {
  const share = d.totals.baseRent ? d.totals.commissions / d.totals.baseRent : 0
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{money(d.totals.commissions)} in commissions, {(share * 100).toFixed(1)}% of base rent.</p>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
        {d.commissions.map(c => (
          <EntityCard key={c.repType}>
            <InsightCardHeader icon={Percent} title={c.repType === "landlord" ? "Landlord broker" : "Tenant rep broker"} sub={c.firm ? `${c.firm}, paid in month ${c.payoutMonth}` : `Paid in month ${c.payoutMonth}`} action={null} />
            {c.commissionScales.length > 0 && <ul className="flex flex-col divide-y divide-border/60 rounded-lg bg-muted/40 px-3">
              {c.commissionScales.map(s => (
                <li key={s.fromYear} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="text-muted-foreground">{s.toYear ? `Years ${s.fromYear} to ${s.toYear}` : `Year ${s.fromYear} onward`}</span>
                  <span className="font-semibold tabular-nums text-foreground">{s.rate}%</span>
                </li>
              ))}
            </ul>}
          </EntityCard>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------- Recoveries -------------------------------- */

function RecoveriesTab({ d }: { d: BudgetDetail }) {
  const termYears = d.totalLeaseTerm / 12
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Reimbursable expenses</h3>
        {d.reimbursableExpenses.length === 0
          ? <p className="text-sm text-muted-foreground">Full service lease. Expenses are included in rent.</p>
          : (
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
              {d.reimbursableExpenses.map(r => (
                <EntityCard key={r.label}>
                  <InsightCardHeader icon={Receipt} title={r.label} sub={`Recovered on a ${r.recoveryMethod} basis`} action={null} />
                  <StatStrip stats={[
                    { label: "Per sf", value: psf(r.amount) },
                    { label: "Growth", value: `${r.growthRate}% a year` },
                    { label: "Year 1", value: money(r.amount * d.rentableArea) },
                  ]} />
                </EntityCard>
              ))}
            </div>
          )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Other revenue</h3>
        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
          {d.otherRevenues.map(o => (
            <EntityCard key={o.otherRevenueType}>
              <InsightCardHeader icon={HandCoins} title={capitalize(o.otherRevenueType)} sub={o.label} action={null} />
              <StatStrip stats={[
                { label: "Monthly", value: money(o.monthly) },
                { label: "Annual", value: money(o.monthly * 12) },
                { label: "Over term", value: money(o.monthly * 12 * termYears) },
              ]} />
            </EntityCard>
          ))}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Cash flow --------------------------------- */

function CashFlowTab({ d }: { d: BudgetDetail }) {
  const columns = React.useMemo<ColumnDef<YearRow>[]>(() => {
    const num = (id: string, title: string, value: (r: YearRow) => number, strong = false): ColumnDef<YearRow> => ({
      id, accessorFn: value, header: colHeader<YearRow>(title, true),
      cell: ({ row }) => {
        const v = value(row.original)
        return <p className={cn("text-right tabular-nums", strong && "font-semibold", strong && v < 0 && "text-destructive")}>{v ? money(v) : "None"}</p>
      },
    })
    return [
      { id: "year", accessorKey: "year", header: colHeader<YearRow>("Year"), cell: ({ row }) => `Year ${row.original.year}` },
      num("baseRent", "Base rent", r => r.baseRent),
      num("concessions", "Concessions", r => -(r.freeRent + r.concessions)),
      num("income", "Other income", r => r.recoveries + r.otherRevenue),
      num("net", "Net", r => r.net, true),
    ]
  }, [])
  return (
    <div className="flex flex-col gap-4">
      <StatStrip stats={[
        { label: "Net over term", value: money(d.totals.net) },
        { label: "NPV", value: money(d.npv), hint: `${d.discountRate}% discount rate` },
        { label: "NER", value: psf(d.ner), hint: "Per sf per year" },
      ]} />
      <div className="hidden @xl:block">
        <DataTable columns={columns} data={d.years} {...TABLE_PROPS} />
      </div>
      <ul className="flex flex-col gap-2 @xl:hidden">
        {d.years.map(y => (
          <li key={y.year}>
            <EntityCard>
              <InsightCardHeader icon={Wallet} title={`Year ${y.year}`} sub={`Base rent ${money(y.baseRent)}`} action={<span className={cn("text-sm font-semibold tabular-nums", y.net < 0 ? "text-destructive" : "text-foreground")}>{money(y.net)}</span>} />
            </EntityCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* -------------------------------- Right panel -------------------------------- */

function VersusDealTab({ d, onDealClick }: { d: BudgetDetail; onDealClick: (deal: Deal) => void }) {
  const c = d.comparison
  if (!c) return <p className="text-sm text-muted-foreground">No priced deals at {d.asset} to compare yet.</p>
  const spreadTone = (v: number) => (Math.abs(v) < 0.5 ? "bg-muted text-muted-foreground" : v >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")
  const spreadLabel = (v: number) => (Math.abs(v) < 0.5 ? "On budget" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">Priced deals at {d.asset}, compared with this budget's NER.</p>
      <StatStrip stats={[
        { label: "Budget NER", value: psf(d.ner) },
        { label: "Average deal NER", value: psf(c.averageNer) },
        { label: "Leasing spread", value: spreadLabel(c.averageSpread), tone: Math.abs(c.averageSpread) < 0.5 ? undefined : c.averageSpread >= 0 ? "text-success" : "text-destructive" },
      ]} />
      <ul className="flex flex-col gap-2">
        {c.deals.map(({ deal, leasingSpread }) => (
          <li key={deal.id}>
            <Button
              variant="outline" onClick={() => onDealClick(deal)} aria-label={`Open ${deal.tenant} deal at ${deal.asset}`}
              className="w-full h-auto justify-start gap-3 rounded-lg border-border bg-card px-3 py-2.5 text-left font-normal whitespace-normal group hover:bg-muted/40"
            >
              <TenantAvatar name={deal.tenant} />
              <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">{deal.tenant}</span>
                  <Badge variant="secondary" className="h-4 px-1.5">{deal.stage}</Badge>
                </span>
                <span className="text-xs text-muted-foreground">{dealTypeLabel(deal.dealType)}, {sf(deal.sf)}{deal.space ? `, ${deal.space}` : ""}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold tabular-nums text-foreground">{psf(deal.ner)}</span>
                <Badge className={cn("h-4 px-1.5 tabular-nums", spreadTone(leasingSpread))}>{spreadLabel(leasingSpread)}</Badge>
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DetailsTab({ d }: { d: BudgetDetail }) {
  const b = d.budget
  const rows = [
    { label: "Status", value: <Badge className={b.archived ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"}>{b.archived ? "Archived" : "Active"}</Badge> },
    { label: "Label", value: b.label },
    { label: "Asset", value: d.asset },
    { label: "Floor", value: b.floor },
    { label: "Suite", value: b.space },
    { label: "Budget year", value: b.budgetYear ? String(b.budgetYear) : "None" },
    { label: "Entered", value: b.dateEntered },
    { label: "Budget ID", value: b.id },
  ]
  return (
    <dl className="flex flex-col divide-y divide-border/60">
      {rows.map(r => (
        <div key={r.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
          <dt className="text-xs text-muted-foreground">{r.label}</dt>
          <dd className="text-sm font-medium text-foreground text-right truncate">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
