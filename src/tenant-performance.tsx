import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { toast } from "sonner"
import {
  AlertTriangle,
  CalendarClock,
  Download,
  Lightbulb,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
} from "lucide-react"
import { cn, cardBase } from "@/lib/utils"
import buildingImg from "@/assets/building.jpg"
import { BuildingHeader } from "@/components/building-header"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { KpiBar, type Kpi } from "@/components/kpi-bar"
import { TenantAvatar } from "@/components/tenant-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  type ColumnDef,
  type RowAction,
} from "@/components/ui/data-table"

// ─── Domain model ────────────────────────────────────────────────────────────

type Outlook = "secured" | "likely" | "undecided" | "atRisk"
type Credit = "ig" | "nonRated" | "watch"
type Priority = "High" | "Medium" | "Low"

type Tenant = {
  id: string
  name: string
  floors: string
  sf: number
  rent: number // in-place $/sf/yr
  market: number // market $/sf/yr
  expiry: Date
  credit: Credit
  outlook: Outlook
  renewalProb: number
  priority: Priority
  nextStep: string
}

const TODAY = new Date(2026, 10, 19)
const RBA = 1_050_000

const TENANTS: Tenant[] = [
  { id: "t01", name: "Fidelity Investments", floors: "30-38", sf: 210000, rent: 78, market: 82, expiry: new Date(2031, 8, 30), credit: "ig", outlook: "secured", renewalProb: 0.9, priority: "Low", nextStep: "No action needed" },
  { id: "t02", name: "State Street Corp", floors: "22-29", sf: 165000, rent: 74, market: 80, expiry: new Date(2028, 5, 30), credit: "ig", outlook: "undecided", renewalProb: 0.6, priority: "High", nextStep: "Open early renewal talks" },
  { id: "t03", name: "Liberty Mutual", floors: "16-20", sf: 120000, rent: 70, market: 78, expiry: new Date(2027, 7, 31), credit: "ig", outlook: "atRisk", renewalProb: 0.3, priority: "High", nextStep: "Start backfill plan" },
  { id: "t04", name: "Putnam Investments", floors: "12-14", sf: 82000, rent: 68, market: 79, expiry: new Date(2027, 11, 31), credit: "ig", outlook: "atRisk", renewalProb: 0.4, priority: "High", nextStep: "Send retention proposal" },
  { id: "t05", name: "Wellington Mgmt", floors: "9-11", sf: 76000, rent: 64, market: 78, expiry: new Date(2029, 1, 28), credit: "nonRated", outlook: "likely", renewalProb: 0.75, priority: "Medium", nextStep: "Model blend and extend" },
  { id: "t06", name: "MFS Investment Mgmt", floors: "39-41", sf: 68000, rent: 80, market: 80, expiry: new Date(2033, 2, 31), credit: "ig", outlook: "secured", renewalProb: 0.95, priority: "Medium", nextStep: "Confirm expansion right" },
  { id: "t07", name: "John Hancock", floors: "6-8", sf: 60000, rent: 72, market: 77, expiry: new Date(2029, 4, 31), credit: "ig", outlook: "likely", renewalProb: 0.8, priority: "Low", nextStep: "No action needed" },
  { id: "t08", name: "WeWork", floors: "3-5", sf: 52000, rent: 58, market: 74, expiry: new Date(2029, 0, 31), credit: "watch", outlook: "undecided", renewalProb: 0.5, priority: "High", nextStep: "Review guarantee" },
  { id: "t09", name: "Nuveen", floors: "42-43", sf: 45000, rent: 76, market: 79, expiry: new Date(2030, 5, 30), credit: "ig", outlook: "likely", renewalProb: 0.8, priority: "High", nextStep: "Escalate arrears" },
  { id: "t10", name: "Accenture", floors: "44-45", sf: 40000, rent: 81, market: 80, expiry: new Date(2032, 3, 30), credit: "ig", outlook: "secured", renewalProb: 0.9, priority: "Low", nextStep: "No action needed" },
  { id: "t11", name: "Boston Consulting Grp", floors: "46", sf: 34000, rent: 84, market: 82, expiry: new Date(2034, 10, 30), credit: "nonRated", outlook: "secured", renewalProb: 0.95, priority: "Low", nextStep: "No action needed" },
  { id: "t12", name: "KPMG", floors: "21", sf: 22000, rent: 75, market: 79, expiry: new Date(2028, 2, 31), credit: "nonRated", outlook: "likely", renewalProb: 0.7, priority: "Low", nextStep: "Send renewal outreach" },
  { id: "t13", name: "Starbucks Corporation", floors: "Retail L1", sf: 6000, rent: 95, market: 105, expiry: new Date(2027, 3, 30), credit: "ig", outlook: "undecided", renewalProb: 0.6, priority: "Medium", nextStep: "Decide retail strategy" },
]

const OUTLOOK_LABEL: Record<Outlook, string> = {
  secured: "Secured",
  likely: "Renewal likely",
  undecided: "Undecided",
  atRisk: "At risk",
}

const CREDIT_LABEL: Record<Credit, string> = {
  ig: "Investment grade",
  nonRated: "Non-rated",
  watch: "Credit watch",
}

const PRIORITY_RANK: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }

// ─── Derived metrics ─────────────────────────────────────────────────────────

const abr = (t: Tenant) => t.sf * t.rent
const mtmGap = (t: Tenant) => (t.market - t.rent) * t.sf
const yearsLeft = (t: Tenant) =>
  Math.max(0, (t.expiry.getTime() - TODAY.getTime()) / (365.25 * 24 * 3600 * 1000))

const TOTAL_ABR = TENANTS.reduce((s, t) => s + abr(t), 0)
const TOTAL_SF = TENANTS.reduce((s, t) => s + t.sf, 0)
const share = (t: Tenant) => (abr(t) / TOTAL_ABR) * 100

const WALT = TENANTS.reduce((s, t) => s + yearsLeft(t) * abr(t), 0) / TOTAL_ABR
const ROLL_CUTOFF = new Date(2028, 11, 31)
const ROLLING = TENANTS.filter((t) => t.expiry <= ROLL_CUTOFF)
const ROLLING_ABR = ROLLING.reduce((s, t) => s + abr(t), 0)
const AT_RISK_ABR = TENANTS.filter((t) => t.outlook === "atRisk").reduce((s, t) => s + abr(t), 0)
const BY_ABR = [...TENANTS].sort((a, b) => abr(b) - abr(a))
const TOP3_SHARE = BY_ABR.slice(0, 3).reduce((s, t) => s + share(t), 0)
const MTM_TOTAL = TENANTS.reduce((s, t) => s + Math.max(0, mtmGap(t)), 0)
const MTM_CAPTURABLE = ROLLING.reduce((s, t) => s + Math.max(0, mtmGap(t)), 0)

function fmtM(n: number, digits = 1) {
  return `$${(n / 1_000_000).toFixed(digits)}M`
}
function fmtMoney(n: number) {
  return n >= 1_000_000 ? fmtM(n, 2) : `$${Math.round(n / 1000)}K`
}
function fmtPct(n: number) {
  return `${Math.round(n)}%`
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

// ─── Shared building blocks ──────────────────────────────────────────────────

const OUTLOOK_BADGE: Record<Outlook, string> = {
  secured: "bg-chart-1/15 text-chart-1 border-transparent",
  likely: "bg-success/15 text-success border-transparent",
  undecided: "bg-warning/15 text-warning border-transparent",
  atRisk: "bg-destructive/15 text-destructive border-transparent",
}

const OUTLOOK_DOT: Record<Outlook, string> = {
  secured: "bg-chart-1",
  likely: "bg-success",
  undecided: "bg-warning",
  atRisk: "bg-destructive",
}

const PRIORITY_BADGE: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive border-transparent",
  Medium: "bg-warning/15 text-warning border-transparent",
  Low: "bg-muted text-muted-foreground border-transparent",
}

const OUTLOOK_CONFIG = {
  secured: { label: "Secured", color: "var(--chart-1)" },
  likely: { label: "Renewal likely", color: "var(--success)" },
  undecided: { label: "Undecided", color: "var(--warning)" },
  atRisk: { label: "At risk", color: "var(--destructive)" },
} satisfies ChartConfig

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{eyebrow}</p>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function ChartCard({
  title,
  description,
  insight,
  action,
  className,
  children,
}: {
  title: string
  description: string
  insight: React.ReactNode
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(cardBase, "flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      <div className="flex-1">{children}</div>
      <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2.5">
        <Lightbulb className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <p className="text-sm leading-snug text-foreground/80">{insight}</p>
      </div>
    </div>
  )
}

function OutlookLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {(Object.keys(OUTLOOK_LABEL) as Outlook[]).map((k) => (
        <div key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn("h-2.5 w-2.5 rounded-sm", OUTLOOK_DOT[k])} />
          {OUTLOOK_LABEL[k]}
        </div>
      ))}
    </div>
  )
}

function TooltipRow({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium tabular-nums text-foreground">{value}</span>
    </div>
  )
}

// ─── 1. Rent contribution ────────────────────────────────────────────────────

const CONTRIBUTION_DATA = BY_ABR.map((t) => ({
  name: t.name,
  share: Number(share(t).toFixed(1)),
  abr: abr(t),
  outlook: t.outlook,
  label: `${share(t).toFixed(1)}%`,
}))

function RentContributionChart() {
  return (
    <ChartCard
      className="md:col-span-2"
      title="Rent contribution by tenant"
      description="Share of annual base rent, colored by renewal outlook"
      action={<OutlookLegend />}
      insight={
        <>
          Three tenants pay {fmtPct(TOP3_SHARE)} of rent. Liberty Mutual, the third largest, is also at risk, so
          a single exit would remove {fmtPct(share(TENANTS[2]))} of income.
        </>
      }
    >
      <ChartContainer config={OUTLOOK_CONFIG} className="aspect-auto h-96 w-full">
        <BarChart data={CONTRIBUTION_DATA} layout="vertical" margin={{ left: 0, right: 48 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={170} tickLine={false} axisLine={false} interval={0} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(_v, _n, item) => {
                  const d = item.payload as (typeof CONTRIBUTION_DATA)[number]
                  return (
                    <div className="flex w-full flex-col gap-1">
                      <TooltipRow label="Annual rent" value={fmtM(d.abr, 2)} />
                      <TooltipRow label="Share" value={d.label} />
                      <TooltipRow label="Outlook" value={OUTLOOK_LABEL[d.outlook]} />
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="share" radius={4}>
            {CONTRIBUTION_DATA.map((d) => (
              <Cell key={d.name} fill={`var(--color-${d.outlook})`} />
            ))}
            <LabelList dataKey="label" position="right" className="fill-muted-foreground" fontSize={12} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

// ─── 2. Credit exposure ──────────────────────────────────────────────────────

const CREDIT_CONFIG = {
  ig: { label: "Investment grade", color: "var(--chart-1)" },
  nonRated: { label: "Non-rated", color: "var(--chart-3)" },
  watch: { label: "Credit watch", color: "var(--destructive)" },
} satisfies ChartConfig

const CREDIT_DATA = (Object.keys(CREDIT_LABEL) as Credit[]).map((c) => {
  const v = TENANTS.filter((t) => t.credit === c).reduce((s, t) => s + abr(t), 0)
  return { tier: c, abr: v, pct: (v / TOTAL_ABR) * 100, fill: `var(--color-${c})` }
})

const CREDIT_DOT: Record<Credit, string> = {
  ig: "bg-chart-1",
  nonRated: "bg-chart-3",
  watch: "bg-destructive",
}

function CreditExposureChart() {
  const ig = CREDIT_DATA.find((d) => d.tier === "ig")!
  const watch = CREDIT_DATA.find((d) => d.tier === "watch")!
  return (
    <ChartCard
      title="Credit exposure"
      description="Annual base rent by tenant credit quality"
      insight={
        <>
          {fmtPct(ig.pct)} of rent comes from investment grade tenants. WeWork is the only tenant on credit
          watch, with {fmtM(watch.abr)} of rent behind a guarantee.
        </>
      }
    >
      <ChartContainer config={CREDIT_CONFIG} className="mx-auto aspect-square h-56">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                nameKey="tier"
                formatter={(v, _n, item) => (
                  <TooltipRow
                    label={CREDIT_LABEL[(item.payload as (typeof CREDIT_DATA)[number]).tier]}
                    value={fmtM(Number(v))}
                  />
                )}
              />
            }
          />
          <Pie data={CREDIT_DATA} dataKey="abr" nameKey="tier" innerRadius={64} strokeWidth={4}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                const cx = viewBox.cx as number
                const cy = viewBox.cy as number
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cx} y={cy - 6} className="fill-foreground text-2xl font-semibold">
                      {fmtM(TOTAL_ABR)}
                    </tspan>
                    <tspan x={cx} y={cy + 16} className="fill-muted-foreground text-xs">
                      Annual rent
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2">
        {CREDIT_DATA.map((d) => (
          <div key={d.tier} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-sm", CREDIT_DOT[d.tier])} />
              <span className="text-foreground">{CREDIT_LABEL[d.tier]}</span>
            </div>
            <span className="tabular-nums text-muted-foreground">
              {fmtM(d.abr)} · {fmtPct(d.pct)}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}

// ─── 3. Expiration schedule ──────────────────────────────────────────────────

const EXPIRY_YEARS = [2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034]

const EXPIRY_DATA = EXPIRY_YEARS.map((year) => {
  const row: Record<string, number | string> = { year: String(year), secured: 0, likely: 0, undecided: 0, atRisk: 0 }
  TENANTS.filter((t) => t.expiry.getFullYear() === year).forEach((t) => {
    row[t.outlook] = Number(row[t.outlook]) + Number((abr(t) / 1_000_000).toFixed(2))
  })
  return row
})

function ExpirationChart() {
  const y27 = TENANTS.filter((t) => t.expiry.getFullYear() === 2027).reduce((s, t) => s + abr(t), 0)
  const y28 = TENANTS.filter((t) => t.expiry.getFullYear() === 2028).reduce((s, t) => s + abr(t), 0)
  return (
    <ChartCard
      title="Lease expiration exposure"
      description="Annual rent expiring each year, by renewal outlook"
      insight={
        <>
          {fmtM(y27 + y28)} ({fmtPct(((y27 + y28) / TOTAL_ABR) * 100)} of rent) expires in 2027 and 2028.
          Most of it sits with tenants that are at risk or undecided.
        </>
      }
    >
      <ChartContainer config={OUTLOOK_CONFIG} className="aspect-auto h-72 w-full">
        <BarChart data={EXPIRY_DATA} margin={{ left: 0, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `$${v}M`} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(v, n) => (
              <TooltipRow label={OUTLOOK_CONFIG[n as Outlook]?.label ?? n} value={`$${Number(v).toFixed(1)}M`} />
            )} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="atRisk" stackId="a" fill="var(--color-atRisk)" />
          <Bar dataKey="undecided" stackId="a" fill="var(--color-undecided)" />
          <Bar dataKey="likely" stackId="a" fill="var(--color-likely)" />
          <Bar dataKey="secured" stackId="a" fill="var(--color-secured)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

// ─── 4. Income runoff ────────────────────────────────────────────────────────

const RUNOFF_CONFIG = {
  expected: { label: "Expected with renewals", color: "var(--chart-2)" },
  contracted: { label: "Contracted today", color: "var(--chart-1)" },
} satisfies ChartConfig

const RUNOFF_DATA = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034].map((year) => {
  const yearEnd = new Date(year, 11, 31)
  let contracted = 0
  let expected = 0
  TENANTS.forEach((t) => {
    if (t.expiry > yearEnd) {
      contracted += abr(t)
      expected += abr(t)
    } else {
      expected += abr(t) * t.renewalProb
    }
  })
  return {
    year: String(year),
    contracted: Number((contracted / 1_000_000).toFixed(1)),
    expected: Number((expected / 1_000_000).toFixed(1)),
  }
})

function IncomeRunoffChart() {
  const y28 = RUNOFF_DATA.find((d) => d.year === "2028")!
  const gap = y28.expected - y28.contracted
  return (
    <ChartCard
      title="Income security"
      description="Year-end annual rent from signed leases versus probability-weighted renewals"
      insight={
        <>
          By the end of 2028 only ${y28.contracted}M of rent is contracted. Expected renewals add ${gap.toFixed(1)}M,
          so retention work on 2027 and 2028 expirations protects the most income.
        </>
      }
    >
      <ChartContainer config={RUNOFF_CONFIG} className="aspect-auto h-72 w-full">
        <AreaChart data={RUNOFF_DATA} margin={{ left: 0, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `$${v}M`} domain={[0, 80]} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" formatter={(v, n) => (
              <TooltipRow label={RUNOFF_CONFIG[n as keyof typeof RUNOFF_CONFIG]?.label ?? n} value={`$${v}M`} />
            )} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area dataKey="expected" type="monotone" stroke="var(--color-expected)" fill="var(--color-expected)" fillOpacity={0.15} strokeDasharray="4 4" />
          <Area dataKey="contracted" type="monotone" stroke="var(--color-contracted)" fill="var(--color-contracted)" fillOpacity={0.35} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

// ─── 5. Mark to market ───────────────────────────────────────────────────────

const MTM_CONFIG = {
  actionable: { label: "Expires by 2028", color: "var(--success)" },
  later: { label: "Locked in beyond 2028", color: "var(--muted-foreground)" },
} satisfies ChartConfig

const MTM_DATA = [...TENANTS]
  .filter((t) => mtmGap(t) > 0)
  .sort((a, b) => mtmGap(b) - mtmGap(a))
  .map((t) => ({
    name: t.name,
    gap: Math.round(mtmGap(t) / 1000),
    pct: ((t.market - t.rent) / t.rent) * 100,
    status: t.expiry <= ROLL_CUTOFF ? "actionable" : "later",
    label: fmtMoney(mtmGap(t)),
  }))

function MarkToMarketChart() {
  const top = MTM_DATA[0]
  return (
    <ChartCard
      className="md:col-span-2"
      title="Mark-to-market opportunity"
      description="Annual rent uplift if each lease were reset to current market rent"
      action={
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm bg-success" />
            {MTM_CONFIG.actionable.label}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/35" />
            {MTM_CONFIG.later.label}
          </div>
        </div>
      }
      insight={
        <>
          {fmtM(MTM_CAPTURABLE)} of the {fmtM(MTM_TOTAL)} total uplift can be captured at renewals through 2028.
          {" "}{top.name} is the largest gap at {fmtPct(top.pct)} below market.
        </>
      }
    >
      <ChartContainer config={MTM_CONFIG} className="aspect-auto h-80 w-full">
        <BarChart data={MTM_DATA} layout="vertical" margin={{ left: 0, right: 56 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={170} tickLine={false} axisLine={false} interval={0} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(_v, _n, item) => {
                  const d = item.payload as (typeof MTM_DATA)[number]
                  return (
                    <div className="flex w-full flex-col gap-1">
                      <TooltipRow label="Annual uplift" value={d.label} />
                      <TooltipRow label="Below market" value={fmtPct(d.pct)} />
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="gap" radius={4}>
            {MTM_DATA.map((d) => (
              <Cell key={d.name} fill={`var(--color-${d.status})`} fillOpacity={d.status === "later" ? 0.35 : 1} />
            ))}
            <LabelList dataKey="label" position="right" className="fill-muted-foreground" fontSize={12} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

function ExposureSummary() {
  const watch = TENANTS.find((t) => t.credit === "watch")!
  const stats = [
    { label: "Rent at risk", value: fmtM(AT_RISK_ABR), sub: `${fmtPct((AT_RISK_ABR / TOTAL_ABR) * 100)} of rent across 2 tenants`, tone: "text-destructive" },
    { label: "Arrears", value: "$310K", sub: "Nuveen, 64 days past due", tone: "text-destructive" },
    { label: "Credit watch", value: fmtM(abr(watch)), sub: `${watch.name}, floors ${watch.floors}`, tone: "text-warning" },
    { label: "Below-market rent", value: fmtM(MTM_TOTAL), sub: "Annual uplift at market", tone: "text-success" },
  ]
  return (
    <div className={cn(cardBase, "flex flex-col gap-4")}>
      <div>
        <p className="text-lg font-semibold text-foreground">Exposure at a glance</p>
        <p className="text-sm text-muted-foreground">Where income could be lost or gained</p>
      </div>
      <div className="flex flex-col divide-y divide-border/60">
        {stats.map((s) => (
          <div key={s.label} className="py-3 first:pt-0 last:pb-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
            <p className={cn("text-2xl font-medium", s.tone)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Decisions queue ──────────────────────────────────────────────────────

type Decision = {
  id: string
  tenant: string
  kind: "risk" | "opportunity"
  priority: Priority
  title: string
  detail: string
  impact: string
  due: string
  action: string
  done: string
}

const DECISIONS: Decision[] = [
  { id: "d1", tenant: "Putnam Investments", kind: "risk", priority: "High", title: "Renewal notice date in 72 days", detail: "Franklin Templeton consolidation puts 82K sf in question. Send a retention proposal before the notice date.", impact: "$5.6M rent", due: "Jan 30, 2027", action: "Draft proposal", done: "Retention proposal drafted for Putnam Investments" },
  { id: "d2", tenant: "Liberty Mutual", kind: "risk", priority: "High", title: "40K sf listed for sublease on floors 18-19", detail: "Contraction is likely at the Aug 2027 expiry. Start a backfill plan now to limit downtime.", impact: "$8.4M rent", due: "Aug 31, 2027", action: "Start backfill plan", done: "Backfill plan created for floors 18-19" },
  { id: "d3", tenant: "Nuveen", kind: "risk", priority: "High", title: "$310K in arrears, 64 days past due", detail: "Escalate collections and confirm the $1.1M letter of credit is current.", impact: "$310K", due: "This week", action: "Open collections", done: "Collections case opened for Nuveen" },
  { id: "d4", tenant: "WeWork", kind: "risk", priority: "High", title: "Tenant placed on credit watch", detail: "Review the corporate guarantee and prepare a direct-lease plan for floors 3-5.", impact: "$3.0M rent", due: "Dec 15, 2026", action: "Review guarantee", done: "Guarantee review requested from legal" },
  { id: "d5", tenant: "State Street Corp", kind: "opportunity", priority: "High", title: "Open early renewal talks on the largest 2028 rollover", detail: "Rent is 8% below market. An early extension secures 17% of rent and captures $1.0M of uplift.", impact: "$12.2M rent", due: "Q1 2027", action: "Schedule meeting", done: "Meeting request sent to State Street Corp" },
  { id: "d6", tenant: "Wellington Mgmt", kind: "opportunity", priority: "Medium", title: "18% below market with 27 months left", detail: "A blend and extend could lift rent $1.1M a year and add 5 years of term.", impact: "+$1.1M a year", due: "Q2 2027", action: "Model scenario", done: "Blend and extend scenario added to planning" },
  { id: "d7", tenant: "MFS Investment Mgmt", kind: "opportunity", priority: "Medium", title: "Expansion right on floor 22 due Mar 2027", detail: "Hold floor 22 off the market until MFS confirms. Exercise adds $1.9M of rent at market.", impact: "+$1.9M rent", due: "Mar 1, 2027", action: "Confirm intent", done: "Expansion inquiry sent to MFS Investment Mgmt" },
]

function DecisionsQueue() {
  const [filter, setFilter] = React.useState<"all" | "risk" | "opportunity">("all")
  const [completed, setCompleted] = React.useState<Set<string>>(new Set())
  const items = DECISIONS.filter((d) => filter === "all" || d.kind === filter)
  const riskCount = DECISIONS.filter((d) => d.kind === "risk").length
  const oppCount = DECISIONS.length - riskCount

  return (
    <div className={cn(cardBase, "flex flex-col gap-4")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-foreground">Decision queue</p>
          <p className="text-sm text-muted-foreground">Ranked by rent impact and time to act</p>
        </div>
        <ToggleGroup value={filter} onValueChange={(v) => { if (typeof v === "string" && v) setFilter(v as typeof filter) }} variant="outline">
          <ToggleGroupItem value="all">All {DECISIONS.length}</ToggleGroupItem>
          <ToggleGroupItem value="risk">Risks {riskCount}</ToggleGroupItem>
          <ToggleGroupItem value="opportunity">Opportunities {oppCount}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ItemGroup>
        {items.map((d) => {
          const isDone = completed.has(d.id)
          return (
            <Item key={d.id} variant="outline" className={cn(isDone && "opacity-60")}>
              <ItemMedia>
                <TenantAvatar name={d.tenant} />
              </ItemMedia>
              <ItemContent>
                <div className="flex flex-wrap items-center gap-2">
                  <ItemTitle className="text-base">{d.title}</ItemTitle>
                  <Badge className={PRIORITY_BADGE[d.priority]}>{d.priority}</Badge>
                  {d.kind === "risk" ? (
                    <Badge className="bg-destructive/10 text-destructive border-transparent">
                      <AlertTriangle data-icon="inline-start" />
                      Risk
                    </Badge>
                  ) : (
                    <Badge className="bg-success/15 text-success border-transparent">
                      <TrendingUp data-icon="inline-start" />
                      Opportunity
                    </Badge>
                  )}
                </div>
                <ItemDescription>
                  <span className="font-medium text-foreground">{d.tenant}.</span> {d.detail}
                </ItemDescription>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{d.impact}</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Act by {d.due}
                  </span>
                </div>
              </ItemContent>
              <ItemActions>
                <Button
                  variant={isDone ? "secondary" : "outline"}
                  size="sm"
                  disabled={isDone}
                  onClick={() => {
                    setCompleted((s) => new Set(s).add(d.id))
                    toast.success(d.done)
                  }}
                >
                  {isDone ? "In progress" : d.action}
                </Button>
              </ItemActions>
            </Item>
          )
        })}
      </ItemGroup>
    </div>
  )
}

// ─── 7. Tenant roster table ──────────────────────────────────────────────────

type Row = Tenant & {
  abr: number
  share: number
  vsMarket: number
  outlookLabel: string
  creditLabel: string
  yearsLeft: number
}

const ROWS: Row[] = TENANTS.map((t) => ({
  ...t,
  abr: abr(t),
  share: share(t),
  vsMarket: ((t.market - t.rent) / t.rent) * 100,
  outlookLabel: OUTLOOK_LABEL[t.outlook],
  creditLabel: CREDIT_LABEL[t.credit],
  yearsLeft: yearsLeft(t),
}))

const ROW_ACTIONS: RowAction<Row>[] = [
  { label: "View lease", onClick: (row) => toast(`Opening lease for ${row.original.name}`) },
  { label: "Add to planning", onClick: (row) => toast.success(`${row.original.name} added to planning`) },
  { label: "Flag for review", onClick: (row) => toast(`${row.original.name} flagged for review`), separator: true },
]

const COLUMNS: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Tenant" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <TenantAvatar name={row.original.name} />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">Floors {row.original.floors}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Priority" />,
    cell: ({ row }) => <Badge className={PRIORITY_BADGE[row.original.priority]}>{row.original.priority}</Badge>,
    sortingFn: (a, b) => PRIORITY_RANK[a.original.priority] - PRIORITY_RANK[b.original.priority] || b.original.abr - a.original.abr,
    filterFn: "includesString",
  },
  {
    accessorKey: "outlookLabel",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Renewal outlook" />,
    cell: ({ row }) => <Badge className={OUTLOOK_BADGE[row.original.outlook]}>{row.original.outlookLabel}</Badge>,
    filterFn: "includesString",
  },
  {
    accessorKey: "abr",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Annual rent" className="justify-end" />,
    cell: ({ row }) => <span className="block text-right tabular-nums">{fmtM(row.original.abr, 2)}</span>,
  },
  {
    accessorKey: "share",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Share of rent" className="justify-end" />,
    cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.share.toFixed(1)}%</span>,
  },
  {
    accessorKey: "sf",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="SF" className="justify-end" />,
    cell: ({ row }) => <span className="block text-right tabular-nums">{row.original.sf.toLocaleString()}</span>,
  },
  {
    accessorKey: "rent",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Rent/sf" className="justify-end" />,
    cell: ({ row }) => <span className="block text-right tabular-nums">${row.original.rent}</span>,
  },
  {
    accessorKey: "vsMarket",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Upside to market" className="justify-end" />,
    cell: ({ row }) => {
      const v = row.original.vsMarket
      return (
        <span className={cn("block text-right tabular-nums", v > 10 ? "text-success font-medium" : v <= 0 ? "text-muted-foreground" : "text-foreground")}>
          {v > 0 ? `+${v.toFixed(0)}%` : `${v.toFixed(0)}%`}
        </span>
      )
    },
  },
  {
    accessorKey: "expiry",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Expiry" />,
    cell: ({ row }) => (
      <div>
        <p className="tabular-nums text-foreground">{fmtDate(row.original.expiry)}</p>
        <p className="text-xs text-muted-foreground">{row.original.yearsLeft.toFixed(1)} yrs left</p>
      </div>
    ),
    sortingFn: (a, b) => a.original.expiry.getTime() - b.original.expiry.getTime(),
  },
  {
    accessorKey: "creditLabel",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Credit" />,
    cell: ({ row }) => (
      <span className={cn(row.original.credit === "watch" ? "text-destructive font-medium" : "text-foreground")}>
        {row.original.creditLabel}
      </span>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "nextStep",
    header: ({ column, table }) => <DataTableColumnHeader column={column} table={table} title="Next step" />,
    cell: ({ row }) => (
      <span className={cn(row.original.priority === "Low" ? "text-muted-foreground" : "text-foreground")}>
        {row.original.nextStep}
      </span>
    ),
    enableColumnFilter: false,
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

// ─── Page ────────────────────────────────────────────────────────────────────

const KPIS: Kpi[] = [
  { label: "Annual base rent", value: fmtM(TOTAL_ABR), subtitle: `${TENANTS.length} tenants, ${fmtPct((TOTAL_SF / RBA) * 100)} leased` },
  { label: "WALT", value: `${WALT.toFixed(1)} yrs`, subtitle: "Weighted by rent" },
  { label: "Rent rolling by 2028", value: fmtM(ROLLING_ABR), subtitle: `${fmtPct((ROLLING_ABR / TOTAL_ABR) * 100)} of rent`, trend: "down" },
  { label: "Rent at risk", value: fmtM(AT_RISK_ABR), subtitle: `${fmtPct((AT_RISK_ABR / TOTAL_ABR) * 100)} of rent`, trend: "down" },
  { label: "Top 3 concentration", value: fmtPct(TOP3_SHARE), subtitle: "Share of rent" },
  { label: "Mark-to-market upside", value: `+${fmtM(MTM_TOTAL)}`, subtitle: "Annual uplift at market", trend: "up" },
]

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const el = document.documentElement
    el.classList.add("no-transitions")
    el.classList.toggle("dark", isDark)
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("no-transitions")))
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <PageBreadcrumb crumbs={[{ label: "Portfolio" }, { label: "One Financial Plaza" }, { label: "Tenant performance" }]} />
          <BuildingHeader
            image={buildingImg}
            city="Boston, MA"
            name="One Financial Plaza"
            address="Tenant performance, as of Nov 19, 2026"
            badges={
              <>
                <Badge variant="secondary">Class A office</Badge>
                <Badge variant="secondary">1.05M sf RBA</Badge>
                <Badge variant="secondary">{fmtPct((TOTAL_SF / RBA) * 100)} leased</Badge>
              </>
            }
            actions={
              <>
                <Button variant="outline" className="hidden sm:inline-flex gap-1.5" onClick={() => toast.success("Tenant report exported")}>
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
                <Button variant="outline" size="icon" aria-label={isDark ? "Light mode" : "Dark mode"} onClick={() => setIsDark((d) => !d)}>
                  {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </Button>
              </>
            }
          />
          <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-primary mb-0.5">Income is concentrated and front-loaded</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Three tenants pay {fmtPct(TOP3_SHARE)} of rent and {fmtM(ROLLING_ABR)} rolls by the end of 2028.
                Putnam and Liberty Mutual are the most urgent retention risks. State Street and Wellington offer the
                largest uplift if renewed early at market.
              </p>
            </div>
          </div>
          <KpiBar kpis={KPIS} className="mt-2" />
        </header>

        <Section
          eyebrow="Understand"
          title="How tenants drive performance"
          description="Which tenants the asset depends on, and how strong those tenants are."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RentContributionChart />
            <CreditExposureChart />
          </div>
        </Section>

        <Section
          eyebrow="Assess"
          title="How secure rental income is"
          description="When income comes up for renewal and how much is likely to stay."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ExpirationChart />
            <IncomeRunoffChart />
          </div>
        </Section>

        <Section
          eyebrow="Prioritize"
          title="Where exposure and opportunity sit"
          description="Rent that could be lost, and rent that could be gained by resetting leases to market."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MarkToMarketChart />
            <ExposureSummary />
          </div>
        </Section>

        <Section
          eyebrow="Act"
          title="Decisions that need attention"
          description="The actions with the largest impact on income, ordered by urgency."
        >
          <DecisionsQueue />
        </Section>

        <Section
          eyebrow="Detail"
          title="Tenant roster"
          description="Every tenant with the metrics behind the priorities above. Sorted by priority, then rent."
        >
          <div className={cardBase}>
            <DataTable
              columns={COLUMNS}
              data={ROWS}
              initialSorting={[{ id: "priority", desc: false }]}
              enablePagination={false}
              enableColumnFilters
              enableFaceting
              enableColumnVisibility
              enableRowSelection={false}
              emptyMessage="No tenants match these filters"
            />
          </div>
        </Section>
      </div>
      <Toaster />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
