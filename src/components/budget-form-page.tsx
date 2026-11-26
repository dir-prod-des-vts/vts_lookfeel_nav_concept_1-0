import * as React from "react"
import { CalendarIcon, ChevronDown, Plus, Trash2, Wallet, X } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { cn, cardBase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { FILTER_TAB_GROUP_CLS, FILTER_TAB_ITEM_CLS } from "@/components/filter-chip"
import { StatStrip } from "@/components/tenant-profile"
import { type Budget } from "@/components/budgets-page"
import {
  BUDGET_ASSET_NAME, assetFullName, budgetDetail, calculateCashFlow, type BudgetDetail,
  type BaseRent, type BudgetInputs, type CashFlowInput, type CostItem, type EscalationItem, type LeaseStructure,
  type MonthRow, type OtherRevenue, type OtherRevenueType, type ReimbursableExpense, type YearRow,
} from "@/lib/budget-profile-data"

// Fields, labels and options follow the viewthespace budget form (deals/forms/budget-form and financials/terms-tab).

const subCard = "rounded-xl border border-border bg-card p-4"
const TABLE_PROPS = { enableColumnFilters: false, enableGlobalFilter: false, enableColumnVisibility: false } as const

type Opt<T extends string = string> = { value: T; label: string }
type RentPeriod = "rsf/year" | "rsf/month" | "year" | "month"
type OtherPeriod = RentPeriod | "quantity/month" | "quantity/year"
type RecoveryMethod = "net" | "gross" | "modified_gross" | "amount"
type CostType = "tenant_improvement" | "building_improvement" | "lease_incentive" | "other_credit"
type CommissionStructure = "%" | "months" | "total" | "rsf" | "rsf/year"

const LEASE_TYPES: Opt<LeaseStructure>[] = [
  { value: "full service", label: "Full service gross" },
  { value: "modified gross", label: "Modified gross" },
  { value: "triple net", label: "Triple net" },
]
const YEARS: Opt[] = [2025, 2026, 2027, 2028].map(y => ({ value: String(y), label: String(y) }))
const TERM_TYPES: Opt<BudgetInputs["dealType"]>[] = [
  { value: "New deal", label: "New deal" }, { value: "Renewal", label: "Renewal" }, { value: "Expansion", label: "Expansion" },
]
const BUILDOUT_UNITS: Opt[] = [{ value: "months", label: "Months" }, { value: "weeks", label: "Weeks" }, { value: "days", label: "Days" }]
const RENT_UNITS: Opt<RentPeriod>[] = [
  { value: "rsf/year", label: "$/sf/yr" }, { value: "rsf/month", label: "$/sf/mo" }, { value: "year", label: "$/yr" }, { value: "month", label: "$/mo" },
]
const ESCALATION_UNITS: Opt<EscalationItem["escalationType"]>[] = [{ value: "percentage", label: "%" }, { value: "bump", label: "$/sf/yr" }]
const ESCALATION_OCCURS: Opt[] = [{ value: "12", label: "Annual" }, { value: "0", label: "One time" }]
const FREE_RENT_UNITS: Opt<"net" | "gross">[] = [{ value: "net", label: "% of net: base rent" }, { value: "gross", label: "% of gross: base rent and recoveries" }]
const BREAKPOINTS: Opt<"natural" | "unnatural">[] = [{ value: "natural", label: "Natural breakpoint" }, { value: "unnatural", label: "Unnatural breakpoint" }]
const OTHER_TYPES: Opt<OtherRevenueType>[] = [
  { value: "parking", label: "Parking" }, { value: "storage", label: "Storage" }, { value: "signage", label: "Signage" }, { value: "fitout", label: "Fitout" },
  { value: "promotional_charges", label: "Promotional charges" }, { value: "interest", label: "Interest" }, { value: "other", label: "Other" },
]
const PARKING_UNITS: Opt<OtherPeriod>[] = [{ value: "quantity/month", label: "$/space/mo" }, { value: "quantity/year", label: "$/space/yr" }]
const EXPENSE_TYPES: Opt[] = ["Operating expenses", "Real estate taxes", "Insurance", "Utilities", "Common area maintenance"].map(v => ({ value: v, label: v }))
const RECOVERY_METHODS: Opt<RecoveryMethod>[] = [
  { value: "net", label: "Net" }, { value: "gross", label: "Gross" }, { value: "modified_gross", label: "Modified gross" }, { value: "amount", label: "Amount" },
]
const EXPENSE_UNITS: Opt<"rsf/year" | "rsf/month">[] = [{ value: "rsf/year", label: "$/sf/yr" }, { value: "rsf/month", label: "$/sf/mo" }]
const COST_TYPES: Opt<CostType>[] = [
  { value: "tenant_improvement", label: "Tenant improvements" }, { value: "building_improvement", label: "Building improvements" },
  { value: "lease_incentive", label: "Lease incentives" }, { value: "other_credit", label: "Other fees" },
]
const COST_UNITS: Opt<"rsf" | "total">[] = [{ value: "rsf", label: "$/sf" }, { value: "total", label: "Total" }]
const COMMISSION_TYPES: Opt<"tenant_rep" | "landlord">[] = [{ value: "tenant_rep", label: "Tenant" }, { value: "landlord", label: "Landlord" }]
const COMMISSION_STRUCTURES: Opt<CommissionStructure>[] = [
  { value: "%", label: "% of rent" }, { value: "months", label: "Base rent months" }, { value: "total", label: "$" }, { value: "rsf", label: "$/sf" }, { value: "rsf/year", label: "$/sf/yr" },
]
const NET_OR_GROSS: Opt<"gross" | "net">[] = [{ value: "gross", label: "Gross: base rent and recoveries" }, { value: "net", label: "Net: base rent" }]
const COMMISSION_FREE_RENT: Opt<"amortized" | "free_rent_month" | "excluded">[] = [
  { value: "amortized", label: "Amortized over term" }, { value: "free_rent_month", label: "Occurs in free rent months" }, { value: "excluded", label: "Excluded from commissions calculation" },
]

interface BaseRentRow { id: number; beginIn: string; rent: string; period: RentPeriod }
interface EscalationRow { id: number; beginIn: string; escalation: string; escalationType: EscalationItem["escalationType"]; recurrence: string }
interface FreeRentRow { id: number; beginIn: string; duration: string; percentage: string; freeRentType: "net" | "gross" }
interface PercentageRentRow { id: number; beginIn: string; minimumGuarantee: string; sales: string; salesGrowth: string; breakpoint: "natural" | "unnatural"; unnaturalBreakpoint: string; rate: string }
interface OtherIncomeRow { id: number; type: OtherRevenueType; beginIn: string; duration: string; amount: string; period: OtherPeriod; growth: string; quantity: string }
interface ExpenseRow { id: number; type: string; recoveryMethod: RecoveryMethod; baseYear: string; amount: string; period: "rsf/year" | "rsf/month"; growth: string; expenseStop: string; recoveryAmount: string; description: string }
interface CostRow { id: number; type: CostType; occurs: string; amount: string; unit: "rsf" | "total"; description: string }
interface CommissionPeriodRow { id: number; fromYear: string; toYear: string; amount: string }
interface CommissionRow { id: number; repType: "tenant_rep" | "landlord"; broker: string; date: Date | null; structure: CommissionStructure; amount: string; periods: CommissionPeriodRow[]; payoutMonth: string; netOrGross: "gross" | "net"; freeRent: "amortized" | "free_rent_month" | "excluded"; description: string }

interface FormValues {
  label: string; budgetYear: string; enteredDate: Date; leaseStructure: LeaseStructure; discountRate: string; executionDate: Date | null
  asset: string; space: string; rentableArea: string; termType: BudgetInputs["dealType"]; downtime: string; possessionDate: Date | null
  buildout: string; buildoutUnits: string; commencementDate: Date | null; term: string; rentCommencementDate: Date | null; lockInEndDate: Date | null
  baseRents: BaseRentRow[]; escalations: EscalationRow[]; freeRents: FreeRentRow[]; percentageRents: PercentageRentRow[]
  otherIncome: OtherIncomeRow[]; expenses: ExpenseRow[]; costs: CostRow[]; commissions: CommissionRow[]
}
type ListKey = "baseRents" | "escalations" | "freeRents" | "percentageRents" | "otherIncome" | "expenses" | "costs" | "commissions"

const num = (v: string) => (v.trim() === "" ? NaN : Number(v.replace(/,/g, "")))
const pos = (v: string) => { const n = num(v); return Number.isFinite(n) && n > 0 ? n : 0 }
const month = (v: string, fallback = 1) => Math.max(1, Math.round(pos(v)) || fallback)
const money = (v: number) => {
  const a = Math.abs(v)
  const s = a >= 1e6 ? `${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${Math.round(a / 1e3)}K` : `${Math.round(a)}`
  return `${v < 0 ? "-" : ""}$${s}`
}
const psf = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(v).toFixed(2)}`
const shortDate = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`
const SHORT_ASSET = Object.fromEntries(Object.entries(BUDGET_ASSET_NAME).map(([short, full]) => [full, short]))
const labelOf = <T extends string>(opts: Opt<T>[], v: T) => opts.find(o => o.value === v)?.label ?? v
let nextId = 100
const newId = () => ++nextId

/** Annual $/sf from an amount in any rent unit. */
const toAnnualPsf = (amount: number, period: RentPeriod, area: number) =>
  period === "rsf/year" ? amount : period === "rsf/month" ? amount * 12 : period === "year" ? (area ? amount / area : 0) : area ? (amount * 12) / area : 0

/** "11/15/25" to a Date. */
function fromShort(d: string) {
  const [m, day, y] = d.split("/").map(Number)
  return m && day && y !== undefined ? new Date(2000 + y, m - 1, day) : new Date()
}

const BLANK: FormValues = {
  label: "", budgetYear: "", enteredDate: new Date(), leaseStructure: "full service", discountRate: "", executionDate: null,
  asset: "", space: "", rentableArea: "", termType: "New deal", downtime: "", possessionDate: null,
  buildout: "", buildoutUnits: "months", commencementDate: null, term: "", rentCommencementDate: null, lockInEndDate: null,
  baseRents: [{ id: 1, beginIn: "1", rent: "", period: "rsf/year" }], escalations: [], freeRents: [], percentageRents: [],
  otherIncome: [], expenses: [], costs: [], commissions: [],
}

/** Fill the form from an existing budget, line item by line item. */
function valuesFromBudget(b: Budget): FormValues {
  const d: BudgetDetail = budgetDetail(b)
  const str = (n: number) => String(Math.round(n * 100) / 100)
  const methodFor = (m: ReimbursableExpense["recoveryMethod"]): RecoveryMethod =>
    m === "net" ? "net" : m === "amount" ? "amount" : m === "base year" || m === "modified gross" ? "modified_gross" : "gross"
  return {
    ...BLANK,
    label: b.label, budgetYear: b.budgetYear ? String(b.budgetYear) : "", enteredDate: fromShort(b.dateEntered),
    leaseStructure: d.leaseStructure, discountRate: d.discountRate === 7 ? "" : str(d.discountRate),
    asset: assetFullName(b.asset), space: b.space ? `${b.floor}, Suite ${b.space}` : "", rentableArea: str(d.rentableArea),
    termType: d.dealType, commencementDate: new Date(`${d.commencementDate}T00:00:00`), term: String(d.totalLeaseTerm),
    baseRents: d.baseRents.map((r, i) => ({ id: i + 1, beginIn: String(r.beginIn), rent: str(r.rent), period: "rsf/year" as const })),
    escalations: d.rentEscalations.map(e => ({ id: newId(), beginIn: "13", escalation: str(e.escalation), escalationType: e.escalationType, recurrence: e.recurrenceInterval ? "12" : "0" })),
    freeRents: d.freeRents.map(f => ({ id: newId(), beginIn: String(f.beginIn), duration: String(f.duration), percentage: str(f.percentage), freeRentType: f.freeRentType })),
    costs: [
      ...d.tenantImprovements.map(t => ({ id: newId(), type: "tenant_improvement" as const, occurs: String(t.occurrenceMonth), amount: str(t.allowance), unit: t.allowanceUnit, description: "" })),
      ...d.buildingImprovements.map(t => ({ id: newId(), type: "building_improvement" as const, occurs: String(t.occurrenceMonth), amount: str(t.allowance), unit: t.allowanceUnit, description: "" })),
      ...d.leaseIncentives.map(t => ({ id: newId(), type: "lease_incentive" as const, occurs: String(t.occurrenceMonth), amount: str(t.amount), unit: t.unit, description: t.label === "Lease incentives" ? "" : t.label })),
    ],
    commissions: d.commissions.map(c => ({
      id: newId(), repType: c.repType, broker: c.firm, date: null, structure: "%" as const, amount: "",
      periods: c.commissionScales.length
        ? c.commissionScales.map(sc => ({ id: newId(), fromYear: String(sc.fromYear), toYear: sc.toYear ? String(sc.toYear) : "", amount: str(sc.rate) }))
        : [{ id: newId(), fromYear: "1", toYear: "", amount: "" }],
      payoutMonth: String(c.payoutMonth), netOrGross: "net" as const, freeRent: "amortized" as const, description: "",
    })),
    expenses: d.reimbursableExpenses.map(r => {
      const method = methodFor(r.recoveryMethod)
      const known = EXPENSE_TYPES.some(t => t.value === r.label)
      return {
        id: newId(), type: known ? r.label : "Operating expenses", recoveryMethod: method, baseYear: "",
        amount: str(r.amount), period: "rsf/year" as const, growth: str(r.growthRate), expenseStop: "",
        recoveryAmount: method === "amount" ? str(r.amount) : "", description: known ? "" : r.label,
      }
    }),
    otherIncome: d.otherRevenues
      .filter(o => o.label !== "Percentage rent")
      .map(o => ({
        id: newId(), type: o.otherRevenueType, beginIn: String(o.beginIn ?? 1), duration: o.duration ? String(o.duration) : "",
        amount: str(o.monthly), period: "month" as const, growth: o.growthRate ? str(o.growthRate) : "", quantity: "",
      })),
  }
}

export interface BudgetFormPageProps {
  /** When set, the form edits this budget instead of adding a new one. */
  budget?: Budget
  /** Full asset names for the building picker. */
  assets: string[]
  /** Known spaces per building, for the spaces picker. */
  spacesByAsset: Record<string, string[]>
  /** Preselects the building when the form is opened from one asset. */
  defaultAsset?: string
  onClose: () => void
  onSave: (budget: Budget) => void
}

export function BudgetFormPage({ budget, assets, spacesByAsset, defaultAsset, onClose, onSave }: BudgetFormPageProps) {
  const editing = Boolean(budget)
  const [tab, setTab] = React.useState("info")
  const [v, setV] = React.useState<FormValues>(() => (budget ? valuesFromBudget(budget) : { ...BLANK, enteredDate: new Date(), asset: defaultAsset ?? "" }))
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setV(prev => ({ ...prev, [key]: value }))
  const patch = <K extends ListKey>(key: K, id: number, change: Partial<FormValues[K][number]>) =>
    setV(prev => ({ ...prev, [key]: (prev[key] as { id: number }[]).map(r => (r.id === id ? { ...r, ...change } : r)) }))
  const add = <K extends ListKey>(key: K, row: FormValues[K][number]) => setV(prev => ({ ...prev, [key]: [...(prev[key] as unknown[]), row] }))
  const remove = (key: ListKey, id: number) => setV(prev => ({ ...prev, [key]: (prev[key] as { id: number }[]).filter(r => r.id !== id) }))

  const area = pos(v.rentableArea)
  const term = Math.round(pos(v.term))
  const missing = [
    !v.asset && "Building",
    !area && "Rentable size",
    !v.commencementDate && "Commencement date",
    !term && "Term duration",
    !pos(v.baseRents[0]?.rent ?? "") && "Base rent",
  ].filter(Boolean) as string[]
  const ready = missing.length === 0
  const discountRate = Number.isFinite(num(v.discountRate)) ? num(v.discountRate) : 7

  const built = React.useMemo(() => (ready ? buildBudget(v, area, term, discountRate) : null), [v, area, term, discountRate, ready])
  const result = React.useMemo(() => (built ? calculateCashFlow(built.cashFlow) : null), [built])

  function save() {
    if (!built || !result || !v.commencementDate) return
    const first = built.lineItems.baseRents[0]
    const second = built.lineItems.baseRents[1]
    const esc = built.lineItems.rentEscalations[0]
    const ti = built.lineItems.tenantImprovements[0]
    const [floor, suite] = v.space ? v.space.split(", Suite ") : ["", ""]
    onSave({
      id: budget?.id ?? `new-${Date.now()}`,
      label: v.label.trim() || "Untitled budget",
      asset: SHORT_ASSET[v.asset] ?? v.asset,
      budgetYear: v.budgetYear ? Number(v.budgetYear) : null,
      floor: floor || "Whole building",
      space: suite ?? "",
      size: area,
      startDate: shortDate(v.commencementDate),
      term,
      baseRent: first.rent,
      baseRentStep: second ? { month: second.beginIn, rent: second.rent } : undefined,
      esca: esc ? (esc.escalationType === "percentage" ? `${esc.escalation}% ${esc.recurrenceInterval ? "annual" : "one time"}` : `$${esc.escalation} bump`) : null,
      ti: ti ? (ti.allowanceUnit === "rsf" ? ti.allowance : ti.allowance / area) : 0,
      freeRent: built.lineItems.freeRents.reduce((s, f) => s + f.duration, 0),
      nerSizeYr: Math.round(result.ner * 100) / 100,
      dateEntered: shortDate(v.enteredDate),
      archived: budget?.archived ?? false,
      inputs: { leaseStructure: v.leaseStructure, dealType: v.termType, discountRate, cashFlow: built.cashFlow, lineItems: built.lineItems },
    })
  }

  const spaces = (spacesByAsset[v.asset] ?? []).map(s => ({ value: s, label: s }))

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4 py-3">
        <div className="flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary w-12 h-12 sm:w-16 sm:h-16" aria-hidden="true">
          <Wallet className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Budgets</p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-foreground leading-tight">{editing ? `Edit ${budget!.label}` : "Add budget"}</h1>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Close and go back" onClick={onClose}><X /></Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:flex-1">
        <div className={cn(cardBase, "@container lg:grow-4 lg:basis-0 min-w-0 w-full")}>
          <Tabs value={tab} onValueChange={t => setTab(t as string)} className="w-full">
            <TabsList variant="line" className="mb-4 max-w-full overflow-x-auto justify-start">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
            </TabsList>
            <p className="mb-4 text-xs text-muted-foreground"><span className="text-destructive">*</span> Required information</p>

            <TabsContent value="info" className="flex flex-col gap-4">
              <FormSection title="Budget info">
                <Row label="Budget name" htmlFor="b-label"><Input id="b-label" value={v.label} onChange={e => set("label", e.target.value)} /></Row>
                <Row label="Budget year"><Choice label="Budget year" items={YEARS} value={v.budgetYear} onChange={x => set("budgetYear", x)} placeholder="Select a year" /></Row>
                <Row label="Date entered" required><DatePick label="Date entered" value={v.enteredDate} onChange={d => d && set("enteredDate", d)} /></Row>
                <Row label="Lease type"><Choice label="Lease type" items={LEASE_TYPES} value={v.leaseStructure} onChange={x => set("leaseStructure", x as LeaseStructure)} /></Row>
                <Row label="Discount rate" htmlFor="b-discount" hint="NPV uses 7% when empty."><Unit id="b-discount" unit="%" value={v.discountRate} onChange={x => set("discountRate", x)} /></Row>
                <Row label="Execution date" hint="Can be estimated"><DatePick label="Execution date" value={v.executionDate} onChange={d => set("executionDate", d ?? null)} /></Row>
              </FormSection>
              <div className="flex justify-end"><Button variant="outline" onClick={() => setTab("terms")}>Next: terms</Button></div>
            </TabsContent>

            <TabsContent value="terms" className="flex flex-col gap-4">
              <FormSection title="Overview">
                <Row label="Building" required><Choice label="Building" items={assets.map(a => ({ value: a, label: a }))} value={v.asset} onChange={x => setV(p => ({ ...p, asset: x, space: "" }))} placeholder="Select a building" /></Row>
                <Row label="Spaces"><Choice label="Spaces" items={spaces} value={v.space} onChange={x => set("space", x)} placeholder={v.asset ? (spaces.length ? "Select a space" : "No spaces on file") : "Select a building first"} disabled={!spaces.length} /></Row>
                <Row label="Rentable size" required htmlFor="b-area"><Unit id="b-area" unit="sf" value={v.rentableArea} onChange={x => set("rentableArea", x)} /></Row>
                <Row label="Term type"><Choice label="Term type" items={TERM_TYPES} value={v.termType} onChange={x => set("termType", x as BudgetInputs["dealType"])} /></Row>
                <Row label="Downtime" htmlFor="b-downtime"><Unit id="b-downtime" unit="mo" value={v.downtime} onChange={x => set("downtime", x)} /></Row>
                <Row label="Tenant possession"><DatePick label="Tenant possession" value={v.possessionDate} onChange={d => set("possessionDate", d ?? null)} /></Row>
                <Row label="Tenant buildout" htmlFor="b-buildout"><AmountWithUnit id="b-buildout" label="Tenant buildout" value={v.buildout} onChange={x => set("buildout", x)} unit={v.buildoutUnits} units={BUILDOUT_UNITS} onUnit={x => set("buildoutUnits", x)} /></Row>
                <Row label="Commencement date" required hint="Can be estimated or floating"><DatePick label="Commencement date" value={v.commencementDate} onChange={d => set("commencementDate", d ?? null)} /></Row>
                <Row label="Term duration" required htmlFor="b-term"><Unit id="b-term" unit="mo" value={v.term} onChange={x => set("term", x)} /></Row>
                <Row label="Rent commencement"><DatePick label="Rent commencement" value={v.rentCommencementDate} onChange={d => set("rentCommencementDate", d ?? null)} /></Row>
                <Row label="Lock-in end"><DatePick label="Lock-in end" value={v.lockInEndDate} onChange={d => set("lockInEndDate", d ?? null)} /></Row>
              </FormSection>

              <FormSection title="Income">
                <Repeatable title="Base rent" required items={v.baseRents} onRemove={id => remove("baseRents", id)}
                  onAdd={() => add("baseRents", { id: newId(), beginIn: String(term ? Math.min(term, Math.round(term / 2) + 1) : 13), rent: "", period: v.baseRents[0]?.period ?? "rsf/year" })}>
                  {(r, i) => <>
                    <Row label="Starts (mo)" required htmlFor={`br-start-${r.id}`}><Input id={`br-start-${r.id}`} inputMode="numeric" value={r.beginIn} disabled={i === 0} onChange={e => patch("baseRents", r.id, { beginIn: e.target.value })} /></Row>
                    <Row label="Amount" required htmlFor={`br-rent-${r.id}`}><AmountWithUnit id={`br-rent-${r.id}`} label="Base rent" value={r.rent} onChange={x => patch("baseRents", r.id, { rent: x })} unit={r.period} units={RENT_UNITS} onUnit={x => patch("baseRents", r.id, { period: x as RentPeriod })} /></Row>
                  </>}
                </Repeatable>
                <Repeatable title="Base rent escalation" items={v.escalations} onRemove={id => remove("escalations", id)}
                  onAdd={() => add("escalations", { id: newId(), beginIn: "13", escalation: "", escalationType: "percentage", recurrence: "12" })}>
                  {r => <>
                    <Row label="Starts (mo)" required htmlFor={`esc-start-${r.id}`}><Input id={`esc-start-${r.id}`} inputMode="numeric" value={r.beginIn} onChange={e => patch("escalations", r.id, { beginIn: e.target.value })} /></Row>
                    <Row label="Amount" required htmlFor={`esc-amt-${r.id}`}><AmountWithUnit id={`esc-amt-${r.id}`} label="Escalation" value={r.escalation} onChange={x => patch("escalations", r.id, { escalation: x })} unit={r.escalationType} units={ESCALATION_UNITS} onUnit={x => patch("escalations", r.id, { escalationType: x as EscalationItem["escalationType"] })} /></Row>
                    <Row label="Occurs"><Choice label="Occurs" items={ESCALATION_OCCURS} value={r.recurrence} onChange={x => patch("escalations", r.id, { recurrence: x })} /></Row>
                  </>}
                </Repeatable>
                <Repeatable title="Free rent" items={v.freeRents} onRemove={id => remove("freeRents", id)}
                  onAdd={() => add("freeRents", { id: newId(), beginIn: "1", duration: "", percentage: "100", freeRentType: "net" })}>
                  {r => <>
                    <Row label="Starts (mo)" required htmlFor={`fr-start-${r.id}`}><Input id={`fr-start-${r.id}`} inputMode="numeric" value={r.beginIn} onChange={e => patch("freeRents", r.id, { beginIn: e.target.value })} /></Row>
                    <Row label="Duration" required htmlFor={`fr-dur-${r.id}`}><Unit id={`fr-dur-${r.id}`} unit="mo" value={r.duration} onChange={x => patch("freeRents", r.id, { duration: x })} /></Row>
                    <Row label="Amount free" required htmlFor={`fr-pct-${r.id}`}><AmountWithUnit id={`fr-pct-${r.id}`} label="Amount free" value={r.percentage} onChange={x => patch("freeRents", r.id, { percentage: x })} unit={r.freeRentType} units={FREE_RENT_UNITS} onUnit={x => patch("freeRents", r.id, { freeRentType: x as "net" | "gross" })} /></Row>
                  </>}
                </Repeatable>
                <Repeatable title="Percentage rent" items={v.percentageRents} onRemove={id => remove("percentageRents", id)}
                  onAdd={() => add("percentageRents", { id: newId(), beginIn: "1", minimumGuarantee: "", sales: "", salesGrowth: "", breakpoint: "natural", unnaturalBreakpoint: "", rate: "6" })}>
                  {r => <>
                    <Row label="Start month" htmlFor={`pr-start-${r.id}`}><Input id={`pr-start-${r.id}`} inputMode="numeric" value={r.beginIn} onChange={e => patch("percentageRents", r.id, { beginIn: e.target.value })} /></Row>
                    <Row label="Minimum guarantee" htmlFor={`pr-min-${r.id}`}><Unit id={`pr-min-${r.id}`} prefix="$" unit="/yr" value={r.minimumGuarantee} onChange={x => patch("percentageRents", r.id, { minimumGuarantee: x })} /></Row>
                    <Row label="Projected year 1 sales" htmlFor={`pr-sales-${r.id}`}><Unit id={`pr-sales-${r.id}`} prefix="$" unit="/yr" value={r.sales} onChange={x => patch("percentageRents", r.id, { sales: x })} /></Row>
                    <Row label="Annual sales growth" htmlFor={`pr-growth-${r.id}`}><Unit id={`pr-growth-${r.id}`} unit="%/yr" value={r.salesGrowth} onChange={x => patch("percentageRents", r.id, { salesGrowth: x })} /></Row>
                    <Row label="Sales overage breakpoints"><Choice label="Breakpoint" items={BREAKPOINTS} value={r.breakpoint} onChange={x => patch("percentageRents", r.id, { breakpoint: x as "natural" | "unnatural" })} /></Row>
                    {r.breakpoint === "unnatural" && (
                      <Row label="Sales exceeding" htmlFor={`pr-bp-${r.id}`}><Unit id={`pr-bp-${r.id}`} prefix="$" unit="/yr" value={r.unnaturalBreakpoint} onChange={x => patch("percentageRents", r.id, { unnaturalBreakpoint: x })} /></Row>
                    )}
                    <Row label="Overage rate" htmlFor={`pr-rate-${r.id}`}><Unit id={`pr-rate-${r.id}`} unit="% of sales" value={r.rate} onChange={x => patch("percentageRents", r.id, { rate: x })} /></Row>
                  </>}
                </Repeatable>
              </FormSection>

              <FormSection title="Other income">
                <Repeatable title="Other income" items={v.otherIncome} onRemove={id => remove("otherIncome", id)}
                  onAdd={() => add("otherIncome", { id: newId(), type: "parking", beginIn: "1", duration: "", amount: "", period: "quantity/month", growth: "", quantity: "" })}>
                  {r => {
                    const units = r.type === "parking" ? [...RENT_UNITS, ...PARKING_UNITS] : RENT_UNITS
                    return <>
                      <Row label="Type"><Choice label="Other income type" items={OTHER_TYPES} value={r.type} onChange={x => patch("otherIncome", r.id, { type: x as OtherRevenueType, period: x === "parking" ? r.period : (r.period.startsWith("quantity") ? "month" : r.period) })} /></Row>
                      <Row label="Starts (mo)" htmlFor={`oi-start-${r.id}`}><Input id={`oi-start-${r.id}`} inputMode="numeric" value={r.beginIn} onChange={e => patch("otherIncome", r.id, { beginIn: e.target.value })} /></Row>
                      <Row label="Duration (mo)" htmlFor={`oi-dur-${r.id}`}><Input id={`oi-dur-${r.id}`} inputMode="numeric" value={r.duration} placeholder="Full term" onChange={e => patch("otherIncome", r.id, { duration: e.target.value })} /></Row>
                      <Row label="Amount" htmlFor={`oi-amt-${r.id}`}><AmountWithUnit id={`oi-amt-${r.id}`} label="Other income" value={r.amount} onChange={x => patch("otherIncome", r.id, { amount: x })} unit={r.period} units={units} onUnit={x => patch("otherIncome", r.id, { period: x as OtherPeriod })} /></Row>
                      <Row label="Growth rate" htmlFor={`oi-growth-${r.id}`}><Unit id={`oi-growth-${r.id}`} unit="%/yr" value={r.growth} onChange={x => patch("otherIncome", r.id, { growth: x })} /></Row>
                      {r.type === "parking" && (
                        <Row label="Quantity" htmlFor={`oi-qty-${r.id}`} hint={r.period.startsWith("quantity") ? undefined : "Does not affect calculations"}>
                          <Input id={`oi-qty-${r.id}`} inputMode="numeric" value={r.quantity} onChange={e => patch("otherIncome", r.id, { quantity: e.target.value })} />
                        </Row>
                      )}
                    </>
                  }}
                </Repeatable>
              </FormSection>

              <FormSection title="Expenses and recoveries">
                <Repeatable title="Expense or recovery" items={v.expenses} onRemove={id => remove("expenses", id)}
                  onAdd={() => add("expenses", { id: newId(), type: "", recoveryMethod: "net", baseYear: "", amount: "", period: "rsf/year", growth: "3", expenseStop: "", recoveryAmount: "", description: "" })}>
                  {r => <>
                    <Row label="Type"><Choice label="Expense type" items={EXPENSE_TYPES} value={r.type} onChange={x => patch("expenses", r.id, { type: x })} placeholder="Select expense or recovery" /></Row>
                    <Row label="Recovery method"><Choice label="Recovery method" items={RECOVERY_METHODS} value={r.recoveryMethod} onChange={x => patch("expenses", r.id, { recoveryMethod: x as RecoveryMethod })} /></Row>
                    {r.recoveryMethod === "modified_gross" && (
                      <Row label="Base year"><Choice label="Base year" items={YEARS} value={r.baseYear} onChange={x => patch("expenses", r.id, { baseYear: x })} placeholder="Select a year" /></Row>
                    )}
                    <Row label="Expense amount" htmlFor={`ex-amt-${r.id}`}><AmountWithUnit id={`ex-amt-${r.id}`} label="Expense amount" value={r.amount} onChange={x => patch("expenses", r.id, { amount: x })} unit={r.period} units={EXPENSE_UNITS} onUnit={x => patch("expenses", r.id, { period: x as "rsf/year" | "rsf/month" })} /></Row>
                    <Row label="Growth rate" htmlFor={`ex-growth-${r.id}`}><Unit id={`ex-growth-${r.id}`} unit="%/yr" value={r.growth} onChange={x => patch("expenses", r.id, { growth: x })} /></Row>
                    {r.recoveryMethod === "modified_gross" && (
                      <Row label="Expense stop" htmlFor={`ex-stop-${r.id}`}><Unit id={`ex-stop-${r.id}`} prefix="$" unit="/sf/yr" value={r.expenseStop} onChange={x => patch("expenses", r.id, { expenseStop: x })} /></Row>
                    )}
                    {r.recoveryMethod === "amount" && (
                      <Row label="Recovery amount" htmlFor={`ex-rec-${r.id}`}><Unit id={`ex-rec-${r.id}`} prefix="$" unit="/sf/yr" value={r.recoveryAmount} onChange={x => patch("expenses", r.id, { recoveryAmount: x })} /></Row>
                    )}
                    <Description id={`ex-desc-${r.id}`} value={r.description} onChange={x => patch("expenses", r.id, { description: x })} />
                  </>}
                </Repeatable>
                <Repeatable title="Cost" items={v.costs} onRemove={id => remove("costs", id)}
                  onAdd={() => add("costs", { id: newId(), type: "tenant_improvement", occurs: "1", amount: "", unit: "rsf", description: "" })}>
                  {r => <>
                    <Row label="Type"><Choice label="Cost type" items={COST_TYPES} value={r.type} onChange={x => patch("costs", r.id, { type: x as CostType })} /></Row>
                    <Row label="Occurs (mo)" htmlFor={`co-occ-${r.id}`}><Input id={`co-occ-${r.id}`} inputMode="numeric" value={r.occurs} onChange={e => patch("costs", r.id, { occurs: e.target.value })} /></Row>
                    <Row label="Amount" htmlFor={`co-amt-${r.id}`}><AmountWithUnit id={`co-amt-${r.id}`} label="Cost amount" value={r.amount} onChange={x => patch("costs", r.id, { amount: x })} unit={r.unit} units={COST_UNITS} onUnit={x => patch("costs", r.id, { unit: x as "rsf" | "total" })} /></Row>
                    <Description id={`co-desc-${r.id}`} value={r.description} onChange={x => patch("costs", r.id, { description: x })} />
                  </>}
                </Repeatable>
                <Repeatable title="Commission" items={v.commissions} onRemove={id => remove("commissions", id)}
                  onAdd={() => add("commissions", { id: newId(), repType: "tenant_rep", broker: "", date: null, structure: "%", amount: "", periods: [{ id: newId(), fromYear: "1", toYear: "", amount: "" }], payoutMonth: "1", netOrGross: "gross", freeRent: "amortized", description: "" })}>
                  {r => <>
                    <Row label="Type"><Choice label="Commission type" items={COMMISSION_TYPES} value={r.repType} onChange={x => patch("commissions", r.id, { repType: x as "tenant_rep" | "landlord" })} /></Row>
                    <Row label="Broker" htmlFor={`cm-broker-${r.id}`}><Input id={`cm-broker-${r.id}`} value={r.broker} onChange={e => patch("commissions", r.id, { broker: e.target.value })} /></Row>
                    <Row label="Date"><DatePick label="Commission date" value={r.date} onChange={d => patch("commissions", r.id, { date: d ?? null })} /></Row>
                    <Row label="Structure"><Choice label="Commission structure" items={COMMISSION_STRUCTURES} value={r.structure} onChange={x => patch("commissions", r.id, { structure: x as CommissionStructure })} /></Row>
                    {r.structure === "%" ? (
                      <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
                        <p className="text-sm font-medium text-foreground">Commission period</p>
                        {r.periods.map(p => (
                          <div key={p.id} className="flex items-end gap-2">
                            <div className="flex basis-0 grow flex-col gap-1.5">
                              <Label htmlFor={`cp-from-${p.id}`} className="text-xs font-normal text-muted-foreground">From year</Label>
                              <Input id={`cp-from-${p.id}`} inputMode="numeric" value={p.fromYear} onChange={e => patch("commissions", r.id, { periods: r.periods.map(x => x.id === p.id ? { ...x, fromYear: e.target.value } : x) })} />
                            </div>
                            <div className="flex basis-0 grow flex-col gap-1.5">
                              <Label htmlFor={`cp-to-${p.id}`} className="text-xs font-normal text-muted-foreground">To year</Label>
                              <Input id={`cp-to-${p.id}`} inputMode="numeric" placeholder="End of term" value={p.toYear} onChange={e => patch("commissions", r.id, { periods: r.periods.map(x => x.id === p.id ? { ...x, toYear: e.target.value } : x) })} />
                            </div>
                            <div className="flex basis-0 grow flex-col gap-1.5">
                              <Label htmlFor={`cp-amt-${p.id}`} className="text-xs font-normal text-muted-foreground">Amount</Label>
                              <Unit id={`cp-amt-${p.id}`} unit="%" value={p.amount} onChange={x => patch("commissions", r.id, { periods: r.periods.map(y => y.id === p.id ? { ...y, amount: x } : y) })} />
                            </div>
                            {r.periods.length > 1 && (
                              <Button variant="ghost" size="icon" aria-label="Remove commission period" onClick={() => patch("commissions", r.id, { periods: r.periods.filter(x => x.id !== p.id) })}><Trash2 /></Button>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" size="xs" className="self-end" onClick={() => patch("commissions", r.id, { periods: [...r.periods, { id: newId(), fromYear: "", toYear: "", amount: "" }] })}>
                          <Plus />Add commission period
                        </Button>
                      </div>
                    ) : (
                      <Row label="Amount" htmlFor={`cm-amt-${r.id}`}><Unit id={`cm-amt-${r.id}`} unit={labelOf(COMMISSION_STRUCTURES, r.structure)} value={r.amount} onChange={x => patch("commissions", r.id, { amount: x })} /></Row>
                    )}
                    <Row label="Payout month" htmlFor={`cm-pay-${r.id}`}><Input id={`cm-pay-${r.id}`} inputMode="numeric" value={r.payoutMonth} onChange={e => patch("commissions", r.id, { payoutMonth: e.target.value })} /></Row>
                    {r.structure === "%" && <>
                      <Row label="Net or gross"><Choice label="Net or gross" items={NET_OR_GROSS} value={r.netOrGross} onChange={x => patch("commissions", r.id, { netOrGross: x as "gross" | "net" })} /></Row>
                      <Row label="Free rent"><Choice label="Commission free rent" items={COMMISSION_FREE_RENT} value={r.freeRent} onChange={x => patch("commissions", r.id, { freeRent: x as CommissionRow["freeRent"] })} /></Row>
                    </>}
                    <Description id={`cm-desc-${r.id}`} value={r.description} onChange={x => patch("commissions", r.id, { description: x })} />
                  </>}
                </Repeatable>
              </FormSection>
            </TabsContent>
          </Tabs>
        </div>

        <div className="@container lg:grow-5 lg:basis-0 min-w-0 w-full flex flex-col gap-4">
          <MetricsCard missing={missing} result={result} term={term} area={area} discountRate={discountRate} />
          <NetCashFlowCard result={result} area={area} />
        </div>
      </div>

      {/* Always-visible actions. Spans the page edge to edge, flush with the bottom of the scroll area. */}
      <div className="sticky -bottom-4 z-10 -mx-4 -mb-4 md:-mx-6 flex items-center gap-3 border-t border-border bg-card px-4 py-3 md:px-6">
        <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground" aria-live="polite">
          {ready ? "" : `Still needed: ${missing.join(", ").toLowerCase()}.`}
        </p>
        <Button variant="outline" size="lg" className="shrink-0" onClick={onClose}>Cancel</Button>
        <Button size="lg" className="shrink-0" onClick={save} disabled={!ready}>Save</Button>
      </div>
    </div>
  )
}

/* ------------------------- Form values to a budget ------------------------- */

function buildBudget(v: FormValues, area: number, term: number, discountRate: number): Pick<BudgetInputs, "cashFlow" | "lineItems"> {
  // Base rent periods: each runs until the next one starts.
  const steps = v.baseRents
    .map((r, i) => ({ start: i === 0 ? 1 : month(r.beginIn), rent: toAnnualPsf(pos(r.rent), r.period, area) }))
    .filter(s => s.rent > 0 && s.start <= term)
    .sort((a, b) => a.start - b.start)
  const baseRents: BaseRent[] = steps.map((s, i) => {
    const next = steps[i + 1]?.start ?? term + 1
    return { beginIn: s.start, duration: Math.max(1, next - s.start), period: "monthly", rent: s.rent, yearlyTotal: s.rent * area, monthlyTotal: (s.rent * area) / 12 }
  })
  const escalations: EscalationItem[] = v.escalations
    .filter(e => pos(e.escalation))
    .map(e => ({ beginIn: month(e.beginIn, 13), escalation: pos(e.escalation), escalationType: e.escalationType, recurrenceInterval: e.recurrence === "12" ? 12 : 0 }))
  const freeRents = v.freeRents
    .filter(f => pos(f.duration))
    .map(f => ({ beginIn: month(f.beginIn), duration: Math.round(pos(f.duration)), freeRentType: f.freeRentType, percentage: Math.min(100, pos(f.percentage) || 100) }))

  // What the tenant pays back, per sf per year, by recovery method.
  const reimbursableExpenses: ReimbursableExpense[] = v.expenses
    .map(e => {
      const expense = e.period === "rsf/month" ? pos(e.amount) * 12 : pos(e.amount)
      const recovered = e.recoveryMethod === "net" ? expense
        : e.recoveryMethod === "modified_gross" ? Math.max(0, expense - pos(e.expenseStop))
        : e.recoveryMethod === "amount" ? pos(e.recoveryAmount) : 0
      const method: ReimbursableExpense["recoveryMethod"] = e.recoveryMethod === "modified_gross" ? "modified gross" : e.recoveryMethod
      return { label: e.description.trim() || e.type || "Expense", recoveryMethod: method, units: "rsf" as const, amount: recovered, growthRate: pos(e.growth) }
    })
    .filter(e => e.amount > 0)

  // Percentage rent becomes other income: overage on sales above the breakpoint, growing with sales.
  const firstYearRent = (baseRents[0]?.rent ?? 0) * area
  const percentageIncome: OtherRevenue[] = v.percentageRents
    .filter(p => pos(p.sales) && pos(p.rate))
    .map(p => {
      const rate = pos(p.rate) / 100
      const breakpoint = p.breakpoint === "natural" ? firstYearRent / rate : pos(p.unnaturalBreakpoint)
      const annual = Math.max(Math.max(0, pos(p.sales) - breakpoint) * rate, pos(p.minimumGuarantee))
      return { otherRevenueType: "other" as const, label: "Percentage rent", monthly: annual / 12, beginIn: month(p.beginIn), growthRate: pos(p.salesGrowth) }
    })
    .filter(o => o.monthly > 0)
  const otherRevenues: OtherRevenue[] = [
    ...v.otherIncome
      .filter(o => pos(o.amount))
      .map(o => {
        const a = pos(o.amount)
        const qty = pos(o.quantity) || 1
        const monthly = o.period === "quantity/month" ? a * qty : o.period === "quantity/year" ? (a * qty) / 12
          : o.period === "rsf/year" ? (a * area) / 12 : o.period === "rsf/month" ? a * area : o.period === "year" ? a / 12 : a
        const label = o.type === "parking" && pos(o.quantity) ? `${pos(o.quantity)} parking spaces` : labelOf(OTHER_TYPES, o.type)
        return { otherRevenueType: o.type, label, monthly, beginIn: month(o.beginIn), duration: pos(o.duration) ? Math.round(pos(o.duration)) : undefined, growthRate: pos(o.growth) }
      }),
    ...percentageIncome,
  ]

  const costRows = v.costs.filter(c => pos(c.amount)).map(c => ({ ...c, total: c.unit === "rsf" ? pos(c.amount) * area : pos(c.amount), m: month(c.occurs) }))
  const costCategory: Record<CostType, CostItem["category"]> = { tenant_improvement: "ti", building_improvement: "bi", lease_incentive: "incentive", other_credit: "other" }

  // Commissions depend on rent, so run the cash flow once without them first.
  const cashFlowBase: CashFlowInput = {
    area, term, baseRents, escalationRate: 0, escalations, freeRents, tiTotal: 0, biTotal: 0, incentiveTotal: 0,
    commissions: [], reimbursableExpenses, otherRevenues, discountRate,
    costs: costRows.map(c => ({ category: costCategory[c.type], month: c.m, amount: c.total })),
  }
  const pre = calculateCashFlow(cashFlowBase)
  const commissionCosts: CostItem[] = []
  const commissions = v.commissions.map(c => {
    let amount = 0
    if (c.structure === "%") {
      for (const p of c.periods) {
        const from = month(p.fromYear)
        const to = pos(p.toYear) ? Math.round(pos(p.toYear)) : Math.ceil(term / 12)
        const rate = pos(p.amount) / 100
        for (const y of pre.years.filter(r => r.year >= from && r.year <= to)) {
          const rent = c.freeRent === "excluded" ? y.baseRent - y.freeRent : y.baseRent
          amount += (rent + (c.netOrGross === "gross" ? y.recoveries : 0)) * rate
        }
      }
    } else {
      const a = pos(c.amount)
      amount = c.structure === "months" ? (pre.months[0]?.baseRent ?? 0) * a : c.structure === "total" ? a : c.structure === "rsf" ? a * area : a * area * (term / 12)
    }
    if (amount > 0) commissionCosts.push({ category: "commission", month: month(c.payoutMonth), amount })
    return {
      repType: c.repType, firm: c.broker.trim(), unit: "percentage" as const, payoutMonth: month(c.payoutMonth),
      commissionScales: c.structure === "%"
        ? c.periods.filter(p => pos(p.amount)).map(p => ({ fromYear: month(p.fromYear), toYear: pos(p.toYear) ? Math.round(pos(p.toYear)) : null, rate: pos(p.amount) }))
        : [],
    }
  })

  const improvement = (type: CostType) => costRows.filter(c => c.type === type).map(c => ({
    label: c.description.trim() || labelOf(COST_TYPES, c.type), allowance: pos(c.amount), allowanceUnit: c.unit, occurrenceMonth: c.m,
  }))
  return {
    cashFlow: { ...cashFlowBase, costs: [...(cashFlowBase.costs ?? []), ...commissionCosts] },
    lineItems: {
      baseRents,
      rentEscalations: escalations.map(e => ({
        escalation: e.escalation, escalationType: e.escalationType, recurrenceInterval: e.recurrenceInterval,
        note: `${e.escalationType === "bump" ? `$${e.escalation}/sf/yr` : `${e.escalation}%`} ${e.recurrenceInterval ? "every year" : "once"}, from month ${e.beginIn}`,
      })),
      freeRents,
      tenantImprovements: improvement("tenant_improvement"),
      buildingImprovements: improvement("building_improvement"),
      leaseIncentives: costRows.filter(c => c.type === "lease_incentive" || c.type === "other_credit").map(c => ({ label: c.description.trim() || labelOf(COST_TYPES, c.type), amount: pos(c.amount), unit: c.unit, occurrenceMonth: c.m })),
      commissions,
      reimbursableExpenses,
      otherRevenues,
    },
  }
}

/* ------------------------------- Field helpers ------------------------------- */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn(subCard, "flex flex-col gap-4")}>
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3">{children}</CollapsibleContent>
    </Collapsible>
  )
}

/** Label on the left, control on the right, like the VTS form's horizontal labels. Stacks in narrow columns. */
function Row({ label, required, htmlFor, hint, children }: { label: string; required?: boolean; htmlFor?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 @md:flex-row @md:items-start @md:gap-4">
      <Label htmlFor={htmlFor} className="shrink-0 @md:w-2/5 @md:pt-2 font-normal text-muted-foreground">
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {children}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}

/** A repeatable group: title with an add button when empty, a remove button per item, and add another after the last. */
function Repeatable<T extends { id: number }>({ title, items, required, onAdd, onRemove, children }: {
  title: string; items: T[]; required?: boolean; onAdd: () => void; onRemove: (id: number) => void; children: (item: T, index: number) => React.ReactNode
}) {
  if (!items.length) {
    return (
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <Button variant="outline" size="icon-sm" aria-label={`Add ${title.toLowerCase()}`} onClick={onAdd}><Plus /></Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
      {items.map((item, i) => (
        <div key={item.id} className={cn("flex flex-col gap-3", i > 0 && "border-t border-border/60 pt-3")}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            {!(required && i === 0) && (
              <Button variant="ghost" size="icon-sm" aria-label={`Remove ${title.toLowerCase()}`} onClick={() => onRemove(item.id)}><Trash2 /></Button>
            )}
          </div>
          {children(item, i)}
        </div>
      ))}
      <Button variant="outline" size="xs" className="self-end" onClick={onAdd}><Plus />Add another {title.toLowerCase()}</Button>
    </div>
  )
}

function Unit({ id, unit, prefix, value, onChange }: { id: string; unit: string; prefix?: string; value: string; onChange: (v: string) => void }) {
  return (
    <InputGroup>
      {prefix && <InputGroupAddon><InputGroupText>{prefix}</InputGroupText></InputGroupAddon>}
      <InputGroupInput id={id} inputMode="decimal" value={value} onChange={e => onChange(e.target.value.replace(/,/g, ""))} />
      <InputGroupAddon align="inline-end"><InputGroupText>{unit}</InputGroupText></InputGroupAddon>
    </InputGroup>
  )
}

/** A number with a unit picker beside it, like the VTS NumericInputWithUnits. */
function AmountWithUnit({ id, label, value, onChange, unit, units, onUnit }: {
  id: string; label: string; value: string; onChange: (v: string) => void; unit: string; units: Opt[]; onUnit: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      <Input id={id} inputMode="decimal" className="min-w-0 flex-1" value={value} onChange={e => onChange(e.target.value.replace(/,/g, ""))} />
      <Select items={units} value={unit} onValueChange={x => x && onUnit(x as string)}>
        <SelectTrigger className={cn("shrink-0", units.some(u => u.label.length > 10) ? "w-48" : "w-32")} aria-label={`${label} unit`}><SelectValue /></SelectTrigger>
        <SelectContent>{units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  )
}

function Choice({ label, items, value, onChange, placeholder, disabled }: { label: string; items: Opt[]; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <Select items={items} value={value || null} onValueChange={x => x && onChange(x as string)} disabled={disabled}>
      <SelectTrigger className="w-full" aria-label={label}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{items.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}

const toMDY = (d: Date) => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`
const fromMDY = (text: string) => {
  const m = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]))
  return d.getMonth() === Number(m[1]) - 1 && d.getDate() === Number(m[2]) ? d : null
}

/** A typeable MM/DD/YYYY field with a calendar button inside it, styled like the other inputs. */
function DatePick({ label, value, onChange }: { label: string; value: Date | null; onChange: (d: Date | undefined) => void }) {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState(value ? toMDY(value) : "")
  React.useEffect(() => { setText(value ? toMDY(value) : "") }, [value])
  const invalid = text.trim() !== "" && !fromMDY(text)
  return (
    <InputGroup>
      <InputGroupInput
        aria-label={label} placeholder="MM/DD/YYYY" inputMode="numeric" value={text} aria-invalid={invalid || undefined}
        onChange={e => {
          setText(e.target.value)
          const d = fromMDY(e.target.value)
          if (d) onChange(d)
          else if (!e.target.value.trim()) onChange(undefined)
        }}
        onBlur={() => { if (invalid) setText(value ? toMDY(value) : "") }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<InputGroupButton size="icon-xs" aria-label={`Pick ${label.toLowerCase()} from a calendar`} />}>
            <CalendarIcon />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar mode="single" selected={value ?? undefined} defaultMonth={value ?? undefined} onSelect={d => { onChange(d); setOpen(false) }} />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}

/** "Add description" link that reveals a text field, like the VTS form. */
function Description({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(Boolean(value))
  if (!open) {
    return <Button variant="link" size="sm" className="h-auto self-start p-0" onClick={() => setOpen(true)}><Plus className="h-3.5 w-3.5" />Add description</Button>
  }
  return (
    <Row label="Description" htmlFor={id}>
      <div className="flex gap-2">
        <Input id={id} className="min-w-0 flex-1" value={value} onChange={e => onChange(e.target.value)} />
        <Button variant="ghost" size="icon" aria-label="Remove description" onClick={() => { onChange(""); setOpen(false) }}><X /></Button>
      </div>
    </Row>
  )
}

/* ------------------------------- Preview cards ------------------------------- */

function MetricsCard({ missing, result, term, area, discountRate }: {
  missing: string[]; result: ReturnType<typeof calculateCashFlow> | null; term: number; area: number; discountRate: number
}) {
  return (
    <section className={cn(cardBase, "flex flex-col gap-4")}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Metrics</h2>
        <p className="text-xs text-muted-foreground mt-1">Updates as you fill in the form</p>
      </div>
      {!result
        ? <p className="py-8 text-center text-sm text-muted-foreground">Please enter all the required information. Still needed: {missing.join(", ").toLowerCase()}.</p>
        : (
          <div className="flex flex-col gap-3">
            <StatStrip stats={[
              { label: "NER", value: psf(result.ner), hint: "Per sf per year" },
              { label: "NPV", value: money(result.npv), hint: `${discountRate}% discount rate` },
              { label: "Net over term", value: money(result.totals.net), hint: `${term} months` },
            ]} />
            <StatStrip stats={[
              { label: "Base rent", value: money(result.totals.baseRent), hint: `${psf(result.totals.baseRent / area / (term / 12))} avg per sf per year` },
              { label: "Concessions", value: money(result.totals.concessions + result.totals.freeRent), hint: "Free rent, costs, commissions" },
              { label: "Other income", value: money(result.totals.recoveries + result.totals.otherRevenue), hint: "Recoveries and other income" },
            ]} />
          </div>
        )}
    </section>
  )
}

type Frequency = "yearly" | "monthly"
type Display = "chart" | "table"
type Basis = "total" | "psf"
type FlowRow = { label: string; baseRent: number; concessions: number; income: number; net: number }

const FREQUENCIES = [{ value: "yearly", label: "Yearly" }, { value: "monthly", label: "Monthly" }]
const FLOW_CONFIG = { net: { label: "Net cash flow", color: "var(--chart-1)" } } satisfies ChartConfig
const FLOW_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }
const FLOW_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

function colHeader<T>(title: string, right = false): ColumnDef<T>["header"] {
  return ({ column, table }) => <DataTableColumnHeader column={column} table={table} title={title} className={right ? "justify-end" : undefined} />
}

function NetCashFlowCard({ result, area }: { result: ReturnType<typeof calculateCashFlow> | null; area: number }) {
  const [frequency, setFrequency] = React.useState<Frequency>("yearly")
  const [display, setDisplay] = React.useState<Display>("chart")
  const [basis, setBasis] = React.useState<Basis>("total")
  const scale = basis === "psf" && area ? 1 / area : 1
  const fmt = React.useCallback((n: number) => (basis === "psf" ? psf(n) : money(n)), [basis])
  const rows: FlowRow[] = React.useMemo(() => {
    if (!result) return []
    const src: (YearRow | MonthRow)[] = frequency === "yearly" ? result.years : result.months
    return src.map(r => ({
      label: "year" in r ? `Yr ${r.year}` : `Mo ${r.month}`,
      baseRent: r.baseRent * scale,
      concessions: -(r.freeRent + r.concessions) * scale,
      income: (r.recoveries + r.otherRevenue) * scale,
      net: r.net * scale,
    }))
  }, [result, frequency, scale])
  const columns = React.useMemo<ColumnDef<FlowRow>[]>(() => {
    const cell = (key: keyof Omit<FlowRow, "label">, strong = false): ColumnDef<FlowRow>["cell"] => ({ row }) => {
      const n = row.original[key]
      return <p className={cn("text-right tabular-nums", strong && "font-semibold", strong && n < 0 && "text-destructive")}>{n ? fmt(n) : "None"}</p>
    }
    return [
      { id: "label", accessorKey: "label", header: colHeader<FlowRow>("Period"), enableSorting: false },
      { id: "baseRent", accessorKey: "baseRent", header: colHeader<FlowRow>("Base rent", true), cell: cell("baseRent") },
      { id: "concessions", accessorKey: "concessions", header: colHeader<FlowRow>("Concessions", true), cell: cell("concessions") },
      { id: "income", accessorKey: "income", header: colHeader<FlowRow>("Other income", true), cell: cell("income") },
      { id: "net", accessorKey: "net", header: colHeader<FlowRow>("Net", true), cell: cell("net", true) },
    ]
  }, [fmt])
  return (
    <section className={cn(cardBase, "flex flex-col gap-4 lg:flex-1")}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-foreground mr-auto">Net cash flow</h2>
        <Select items={FREQUENCIES} value={frequency} onValueChange={x => x && setFrequency(x as Frequency)}>
          <SelectTrigger size="sm" className="w-28" aria-label="Frequency"><SelectValue /></SelectTrigger>
          <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
        </Select>
        <ToggleGroup type="single" value={display} onValueChange={x => { if (x === "chart" || x === "table") setDisplay(x) }} className={FILTER_TAB_GROUP_CLS} aria-label="Show as">
          <ToggleGroupItem value="chart" size="sm" className={FILTER_TAB_ITEM_CLS}>Chart</ToggleGroupItem>
          <ToggleGroupItem value="table" size="sm" className={FILTER_TAB_ITEM_CLS}>Table</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={basis} onValueChange={x => { if (x === "total" || x === "psf") setBasis(x) }} className={FILTER_TAB_GROUP_CLS} aria-label="Amounts">
          <ToggleGroupItem value="total" size="sm" className={FILTER_TAB_ITEM_CLS}>Total</ToggleGroupItem>
          <ToggleGroupItem value="psf" size="sm" className={FILTER_TAB_ITEM_CLS}>Per sf</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {!result
        ? <p className="py-16 text-center text-sm text-muted-foreground">Please enter all the required information.</p>
        : display === "chart"
          ? (
            <ChartContainer config={FLOW_CONFIG} className="aspect-auto h-72 w-full">
              <BarChart data={rows} margin={FLOW_MARGIN}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={6} minTickGap={12} />
                <YAxis tickFormatter={fmt} width={56} tickLine={false} axisLine={false} />
                <ReferenceLine y={0} stroke="var(--color-border)" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator formatter={x => fmt(Number(x))} />} />
                <Bar dataKey="net" fill="var(--color-net)" radius={FLOW_RADIUS} maxBarSize={frequency === "yearly" ? 40 : 10} />
              </BarChart>
            </ChartContainer>
          )
          : <DataTable columns={columns} data={rows} enablePagination={rows.length > 12} pageSize={12} {...TABLE_PROPS} />}
    </section>
  )
}
