// Mock budget detail for the budget profile, shaped after the frontend's typed client for the Rails
// /api/horse budget endpoints (BudgetForm line items, BudgetCard metrics, ComparativeBudget, BudgetCalculation).
// Fields keep the API's names in camelCase. Values are derived deterministically from the budgets list row.
import { type Budget } from "@/components/budgets-page"
import { DEALS, type Deal } from "@/components/deals-page"
import { hash } from "@/lib/tenant-profile-data"

export type LeaseStructure = "full service" | "triple net" | "modified gross"

/** Everything the add budget form collected, so the profile shows exactly what was entered. */
export interface BudgetInputs {
  leaseStructure: LeaseStructure
  dealType: BudgetDetail["dealType"]
  discountRate: number
  cashFlow: CashFlowInput
  lineItems: Pick<BudgetDetail, "baseRents" | "rentEscalations" | "freeRents" | "tenantImprovements" | "buildingImprovements" | "commissions" | "leaseIncentives" | "reimbursableExpenses" | "otherRevenues">
}

/** Budgets list rows use short asset names; deals and assets use full names. */
export const BUDGET_ASSET_NAME: Record<string, string> = {
  "VTS Tower HQ": "VTS Tower Headquarters",
  "Empire State Bldg": "Empire State Building",
  "One World Trade Ctr": "One World Trade Center",
  "One Peachtree Ctr": "One Peachtree Center",
  "200 Berkeley St": "200 Berkeley Street",
}

export const assetFullName = (asset: string) => BUDGET_ASSET_NAME[asset] ?? asset

export interface BaseRent { beginIn: number; duration: number; period: "monthly"; rent: number; yearlyTotal: number; monthlyTotal: number }
export interface RentEscalation { escalation: number; escalationType: "percentage" | "bump"; recurrenceInterval: number; note?: string }
export interface FreeRent { beginIn: number; duration: number; freeRentType: "net" | "gross"; percentage: number }
export interface Improvement { label: string; allowance: number; allowanceUnit: "total" | "rsf"; occurrenceMonth: number }
export interface CommissionScale { fromYear: number; toYear: number | null; rate: number }
export interface Commission { repType: "landlord" | "tenant_rep"; firm: string; unit: "percentage"; payoutMonth: number; commissionScales: CommissionScale[] }
export interface LeaseIncentive { label: string; amount: number; unit: "total" | "rsf"; occurrenceMonth: number }
export interface ReimbursableExpense { label: string; recoveryMethod: "base year" | "net" | "none" | "gross" | "modified gross" | "amount"; units: "rsf"; amount: number; growthRate: number }
export type OtherRevenueType = "parking" | "storage" | "signage" | "fitout" | "promotional_charges" | "interest" | "other"
export interface OtherRevenue {
  otherRevenueType: OtherRevenueType
  label: string
  monthly: number
  /** Month it starts, defaults to 1. */
  beginIn?: number
  /** Months it runs, defaults to the full term. */
  duration?: number
  /** Percent per year. */
  growthRate?: number
}

/** A rent escalation line item: a percentage or a $/sf/yr bump, annual or one time. */
export interface EscalationItem { beginIn: number; escalation: number; escalationType: "percentage" | "bump"; recurrenceInterval: 12 | 0 }

/** A one-off cost paid in a given month. */
export interface CostItem { category: "ti" | "bi" | "incentive" | "other" | "commission"; month: number; amount: number }

export interface YearRow {
  year: number
  baseRent: number
  freeRent: number
  concessions: number
  recoveries: number
  otherRevenue: number
  net: number
}

export interface DealSpread {
  deal: Deal
  /** (deal NER - budget NER) / budget NER, as a percentage. */
  leasingSpread: number
}

/** ComparativeBudget, applied to every priced deal at the budget's asset. */
export interface BudgetComparison {
  deals: DealSpread[]
  averageNer: number
  averageSpread: number
}

export interface BudgetDetail {
  budget: Budget
  asset: string
  dealType: "New deal" | "Renewal" | "Expansion"
  leaseStructure: LeaseStructure
  commencementDate: string
  expirationDate: string
  totalLeaseTerm: number
  rentableArea: number
  baseRents: BaseRent[]
  rentEscalations: RentEscalation[]
  freeRents: FreeRent[]
  tenantImprovements: Improvement[]
  buildingImprovements: Improvement[]
  commissions: Commission[]
  leaseIncentives: LeaseIncentive[]
  reimbursableExpenses: ReimbursableExpense[]
  otherRevenues: OtherRevenue[]
  years: YearRow[]
  totals: { baseRent: number; freeRent: number; ti: number; bi: number; commissions: number; incentives: number; concessions: number; recoveries: number; otherRevenue: number; net: number }
  ner: number
  npv: number
  discountRate: number
  comparison: BudgetComparison | null
}

const STRUCTURES: LeaseStructure[] = ["full service", "triple net", "modified gross"]
const DEAL_TYPES: BudgetDetail["dealType"][] = ["New deal", "Renewal", "Expansion"]
const FIRMS = ["CBRE", "JLL", "Cushman & Wakefield", "Newmark", "Colliers"]

/** "01/01/26" to "2026-01-01". */
function isoFromShort(d: string) {
  const [m, day, y] = d.split("/")
  return `20${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function addMonthsIso(iso: string, months: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function parseEscalation(esca: string | null): RentEscalation[] {
  if (!esca) return []
  const pct = Number(esca.match(/([\d.]+)%/)?.[1] ?? 0)
  if (!pct) return []
  const capped = /cpi/i.test(esca)
  return [{ escalation: pct, escalationType: "percentage", recurrenceInterval: 12, note: capped ? `CPI, capped at ${pct}%` : undefined }]
}

/** ComparativeBudget against every priced deal at the asset, highest NER first. */
function compareWithDeals(asset: string, budgetNer: number): BudgetComparison | null {
  const priced = DEALS.filter(d => d.asset === asset && d.ner > 0).sort((x, y) => y.ner - x.ner)
  if (!priced.length || !budgetNer) return null
  const spread = (ner: number) => ((ner - budgetNer) / budgetNer) * 100
  const averageNer = priced.reduce((s, d) => s + d.ner, 0) / priced.length
  return { deals: priced.map(deal => ({ deal, leasingSpread: spread(deal.ner) })), averageNer, averageSpread: spread(averageNer) }
}

function detailFromInputs(b: Budget, inp: BudgetInputs): BudgetDetail {
  const commencementDate = isoFromShort(b.startDate)
  const { years, totals, npv } = calculateCashFlow(inp.cashFlow)
  const asset = assetFullName(b.asset)
  return {
    budget: b, asset, dealType: inp.dealType, leaseStructure: inp.leaseStructure, commencementDate,
    expirationDate: addMonthsIso(commencementDate, b.term), totalLeaseTerm: b.term, rentableArea: b.size,
    ...inp.lineItems, years, totals, ner: b.nerSizeYr, npv, discountRate: inp.discountRate,
    comparison: compareWithDeals(asset, b.nerSizeYr),
  }
}

export function budgetDetail(b: Budget): BudgetDetail {
  if (b.inputs) return detailFromInputs(b, b.inputs)
  const h = hash(b.id + b.label)
  const area = b.size
  const term = b.term
  const commencementDate = isoFromShort(b.startDate)
  const leaseStructure = STRUCTURES[h % STRUCTURES.length]
  const dealType = DEAL_TYPES[(h >>> 3) % DEAL_TYPES.length]

  // Base rent periods: one period, or two when the list row carries a rent step.
  const periods = b.baseRentStep
    ? [{ beginIn: 1, duration: b.baseRentStep.month - 1, rent: b.baseRent }, { beginIn: b.baseRentStep.month, duration: term - b.baseRentStep.month + 1, rent: b.baseRentStep.rent }]
    : [{ beginIn: 1, duration: term, rent: b.baseRent }]
  const baseRents: BaseRent[] = periods.map(p => ({ ...p, period: "monthly", yearlyTotal: p.rent * area, monthlyTotal: (p.rent * area) / 12 }))
  const rentEscalations = parseEscalation(b.esca)
  const escRate = (rentEscalations[0]?.escalation ?? 0) / 100

  const freeRents: FreeRent[] = b.freeRent > 0 ? [{ beginIn: 1, duration: b.freeRent, freeRentType: leaseStructure === "triple net" ? "net" : "gross", percentage: 100 }] : []
  const tenantImprovements: Improvement[] = [{ label: "Tenant improvement allowance", allowance: b.ti, allowanceUnit: "rsf", occurrenceMonth: 1 }]
  const biPsf = 8 + (h % 12)
  const buildingImprovements: Improvement[] = biPsf > 0 ? [{ label: "Base building work", allowance: biPsf, allowanceUnit: "rsf", occurrenceMonth: 1 }] : []
  const leaseIncentives: LeaseIncentive[] = h % 3 === 0 ? [{ label: "Moving allowance", amount: 5, unit: "rsf", occurrenceMonth: 1 }] : []
  const commissions: Commission[] = [
    { repType: "landlord", firm: FIRMS[h % FIRMS.length], unit: "percentage", payoutMonth: 1, commissionScales: [{ fromYear: 1, toYear: 5, rate: 4 }, { fromYear: 6, toYear: null, rate: 2 }] },
    { repType: "tenant_rep", firm: FIRMS[(h + 2) % FIRMS.length], unit: "percentage", payoutMonth: 1, commissionScales: [{ fromYear: 1, toYear: 5, rate: 5 }, { fromYear: 6, toYear: null, rate: 2.5 }] },
  ]
  const recovery: ReimbursableExpense["recoveryMethod"] = leaseStructure === "triple net" ? "net" : leaseStructure === "modified gross" ? "base year" : "none"
  const reimbursableExpenses: ReimbursableExpense[] = recovery === "none" ? [] : [
    { label: "Operating expenses", recoveryMethod: recovery, units: "rsf", amount: recovery === "net" ? 14 + (h % 6) : 2 + (h % 3), growthRate: 3 },
    { label: "Real estate taxes", recoveryMethod: recovery, units: "rsf", amount: recovery === "net" ? 9 + (h % 5) : 1 + (h % 2), growthRate: 2.5 },
  ]
  const spaces = Math.max(2, Math.round(area / 2500))
  const otherRevenues: OtherRevenue[] = [
    { otherRevenueType: "parking", label: `${spaces} parking spaces`, monthly: spaces * (250 + (h % 4) * 50) },
    ...(h % 2 === 0 ? [{ otherRevenueType: "storage" as const, label: "Storage unit", monthly: 450 + (h % 5) * 50 }] : []),
    ...(h % 4 === 0 ? [{ otherRevenueType: "signage" as const, label: "Lobby signage", monthly: 1500 }] : []),
  ]

  const tiTotal = tenantImprovements.reduce((sum, t) => sum + (t.allowanceUnit === "rsf" ? t.allowance * area : t.allowance), 0)
  const biTotal = buildingImprovements.reduce((sum, t) => sum + (t.allowanceUnit === "rsf" ? t.allowance * area : t.allowance), 0)
  const incentiveTotal = leaseIncentives.reduce((sum, t) => sum + (t.unit === "rsf" ? t.amount * area : t.amount), 0)
  const discountRate = 7
  const { years, totals, npv } = calculateCashFlow({
    area, term, baseRents, escalationRate: escRate * 100, freeRents, tiTotal, biTotal, incentiveTotal,
    commissions, reimbursableExpenses, otherRevenues, discountRate,
  })

  const asset = assetFullName(b.asset)
  const comparison = compareWithDeals(asset, b.nerSizeYr)

  return {
    budget: b, asset, dealType, leaseStructure, commencementDate, expirationDate: addMonthsIso(commencementDate, term),
    totalLeaseTerm: term, rentableArea: area, baseRents, rentEscalations, freeRents, tenantImprovements, buildingImprovements,
    commissions, leaseIncentives, reimbursableExpenses, otherRevenues, years, totals, ner: b.nerSizeYr, npv, discountRate, comparison,
  }
}

export interface CashFlowInput {
  area: number
  /** Months. */
  term: number
  baseRents: BaseRent[]
  /** Annual escalation within each base rent period, in percent. Ignored when `escalations` is set. */
  escalationRate: number
  /** Escalation line items, applied from their start month. */
  escalations?: EscalationItem[]
  /** One-off costs by month. When set, replaces the allowance totals and commissions below. */
  costs?: CostItem[]
  freeRents: FreeRent[]
  tiTotal: number
  biTotal: number
  incentiveTotal: number
  commissions: Commission[]
  reimbursableExpenses: ReimbursableExpense[]
  otherRevenues: OtherRevenue[]
  /** Percent. */
  discountRate: number
}

export interface MonthRow extends Omit<YearRow, "year"> { month: number }

export interface CashFlowResult {
  years: YearRow[]
  months: MonthRow[]
  totals: BudgetDetail["totals"]
  npv: number
  /** Net effective rent per sf per year: rent after free rent and concessions, spread over the term. */
  ner: number
}

/** BudgetCalculation: yearly cash flow, totals, NPV and NER. Rent escalates annually within each base rent period. */
export function calculateCashFlow(i: CashFlowInput): CashFlowResult {
  const { area, term, baseRents, freeRents, commissions, reimbursableExpenses, otherRevenues } = i
  const escRate = i.escalationRate / 100
  const yearCount = Math.ceil(term / 12)
  const periodFor = (month: number) => baseRents.find(r => month >= r.beginIn && month < r.beginIn + r.duration) ?? baseRents[baseRents.length - 1]
  const monthlyRent = (month: number) => {
    const p = periodFor(month)
    if (!p) return 0
    if (!i.escalations) return p.monthlyTotal * Math.pow(1 + escRate, Math.floor((month - p.beginIn) / 12))
    let annualPsf = p.rent
    for (const e of i.escalations) {
      const from = Math.max(e.beginIn, p.beginIn)
      if (month < from) continue
      const steps = e.recurrenceInterval === 12 ? Math.floor((month - from) / 12) + 1 : 1
      annualPsf = e.escalationType === "percentage" ? annualPsf * Math.pow(1 + e.escalation / 100, steps) : annualPsf + e.escalation * steps
    }
    return (annualPsf * area) / 12
  }
  const commissionTotal = commissions.reduce((sum, c) => sum + c.commissionScales.reduce((s, sc) => {
    let amt = 0
    for (let y = sc.fromYear; y <= Math.min(sc.toYear ?? yearCount, yearCount); y++) {
      for (let m = (y - 1) * 12 + 1; m <= Math.min(y * 12, term); m++) amt += monthlyRent(m) * (sc.rate / 100)
    }
    return s + amt
  }, 0), 0)
  const upFront = i.tiTotal + i.biTotal + i.incentiveTotal + commissionTotal
  const costIn = (m: number) => (i.costs ? i.costs.filter(c => c.month === m).reduce((s, c) => s + c.amount, 0) : m === 1 ? upFront : 0)
  const otherIn = (m: number) => otherRevenues.reduce((s, o) => {
    const begin = o.beginIn ?? 1
    const end = o.duration ? begin + o.duration - 1 : term
    if (m < begin || m > end) return s
    return s + o.monthly * Math.pow(1 + (o.growthRate ?? 0) / 100, Math.floor((m - begin) / 12))
  }, 0)
  const months: MonthRow[] = []
  for (let m = 1; m <= term; m++) {
    const y = Math.ceil(m / 12)
    const baseRent = monthlyRent(m)
    const free = freeRents.find(f => m >= f.beginIn && m < f.beginIn + f.duration)
    const freeRent = free ? baseRent * (free.percentage / 100) : 0
    const recoveries = reimbursableExpenses.reduce((s, r) => s + (r.amount * area * Math.pow(1 + r.growthRate / 100, y - 1)) / 12, 0)
    const otherRevenue = otherIn(m)
    const concessions = costIn(m)
    months.push({ month: m, baseRent, freeRent, concessions, recoveries, otherRevenue, net: baseRent - freeRent - concessions + recoveries + otherRevenue })
  }
  const years: YearRow[] = []
  for (let y = 1; y <= yearCount; y++) {
    const inYear = months.filter(r => Math.ceil(r.month / 12) === y)
    const add = (k: keyof Omit<MonthRow, "month">) => inYear.reduce((s, r) => s + r[k], 0)
    years.push({ year: y, baseRent: add("baseRent"), freeRent: add("freeRent"), concessions: add("concessions"), recoveries: add("recoveries"), otherRevenue: add("otherRevenue"), net: add("net") })
  }
  const sum = (k: keyof YearRow) => years.reduce((s, r) => s + (r[k] as number), 0)
  const byCategory = (c: CostItem["category"]) => (i.costs ?? []).filter(x => x.category === c).reduce((s, x) => s + x.amount, 0)
  const ti = i.costs ? byCategory("ti") : i.tiTotal
  const bi = i.costs ? byCategory("bi") : i.biTotal
  const incentives = i.costs ? byCategory("incentive") + byCategory("other") : i.incentiveTotal
  const commissionsTotal = i.costs ? byCategory("commission") : commissionTotal
  const concessions = ti + bi + incentives + commissionsTotal
  const totals = {
    baseRent: sum("baseRent"), freeRent: sum("freeRent"), ti, bi, commissions: commissionsTotal, incentives,
    concessions, recoveries: sum("recoveries"), otherRevenue: sum("otherRevenue"), net: sum("net"),
  }
  const npv = years.reduce((s, r) => s + r.net / Math.pow(1 + i.discountRate / 100, r.year), 0)
  const ner = area && term ? (totals.baseRent - totals.freeRent - concessions) / area / (term / 12) : 0
  return { years, months, totals, npv, ner }
}
