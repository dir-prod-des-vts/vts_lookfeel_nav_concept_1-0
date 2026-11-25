import { LEASES, type Lease } from "@/components/leases-page"
import { type Deal } from "@/components/deals-page"
import { type FeedEntry } from "@/components/activity-feed"
import { TENANT_DOMAIN } from "@/lib/tenant-data"
import { ASSET_MANAGER, buildTenantRows, normalize, tenantMeta, toIso } from "@/lib/tenants-data"
import { fmtShort, hash, type Contact, type TenantFamily } from "@/lib/tenant-profile-data"

export type Severity = "critical" | "warning" | "info"

export interface Signal {
  id: string
  severity: Severity
  title: string
  detail: string
  due?: string
  leaseId?: string
  dealId?: string
  target?: "operations"
  summary?: string
}

export type ActionKind = "email" | "task" | "ask"

export interface RecommendedAction {
  id: string
  kind: ActionKind
  title: string
  reason: string
  cta: string
  contactName?: string
  subject?: string
  body?: string
  taskTitle?: string
  taskOwner?: string
  prompt?: string
  leaseId?: string
}

export interface LeaseInsight {
  lease: Lease
  options: string[]
  marketGapPsf: number
  noticeDeadline?: string
  noticeMonths?: number
  terminationDate?: string
  terminationMonths?: number
  linkedDeal?: Deal
  rofoDeadline?: string
  rofoMonths?: number
  restoration?: boolean
  deposit?: { amount: number; type: "Cash deposit" | "Letter of credit"; renewal?: string; renewalMonths?: number }
  coTenancy?: string
  insight: string
  /** Only what a lease card doesn't already show in its stats, badge and chips. Empty when nothing is left. */
  note: string
  severity: Severity | null
}

export interface Exposure {
  rentShare: number
  rank: number
  rolling24Sf: number
  rolling24Share: number
}

export interface Change {
  date: string
  text: string
  dealId?: string
  leaseId?: string
}

export interface TenantSignals {
  brief: string
  footprint: string
  changes: Change[]
  exposure: Exposure | null
  risks: Signal[]
  opportunities: Signal[]
  actions: RecommendedAction[]
  insights: LeaseInsight[]
}

export interface CompanyProfile {
  website: string
  industry: string
  headquarters: string
  employees: string
  founded: string
  ownership: string
  description: string
}

export interface DeadDeal {
  id: string
  tenant: string
  asset: string
  dealType: string
  sf: number
  lostOn: string
  stageReached: string
  reason: string
}

export interface TenantTask {
  id: string
  title: string
  owner: string
  due: string
  reminder: "none" | "1d" | "1w"
  link?: string
  contactName?: string
  done: boolean
}

export type OpsTrend = "up" | "down" | "flat"

export interface WorkOrderType {
  category: string
  open: number
  total90d: number
  avgHours: number
  slaPct: number
  trend: OpsTrend
  lastIssue: string
}

export interface TenantOperations {
  openWorkOrders: number
  total90d: number
  avgHours: number
  avgHoursChangePct: number
  slaPct: number
  monthly: { month: string; count: number }[]
  satisfaction: TenantSatisfaction
  types: WorkOrderType[]
  health: OpsHealth
}

export type Sentiment = "promoter" | "passive" | "detractor"

export interface TenantSatisfaction {
  score: number
  trend: OpsTrend
  nps: number
  npsChange: number
  history: { quarter: string; score: number; nps: number }[]
  split: Record<Sentiment, number>
  responses: number
  surveyed: string
  comments: { sentiment: Sentiment; text: string; who: string }[]
}

export interface OpsRec {
  /** Short imperative, e.g. "Order an HVAC root-cause inspection". */
  title: string
  /** The evidence behind it, e.g. "25% of tickets in 90 days". */
  detail: string
  /** Full sentence used as the chat prompt. */
  action: string
  agent: string
}

export interface OpsHealth {
  score: "at-risk" | "caution" | "on-track"
  recs: OpsRec[]
}

function addMonths(iso: string, months: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().slice(0, 10)
}

function monthsBetween(fromIso: string, toIsoDate: string) {
  const a = new Date(`${fromIso}T00:00:00`)
  const b = new Date(`${toIsoDate}T00:00:00`)
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
}

function fmtMonthYear(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function fmtCompact(v: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v)
}

function countdown(months: number) {
  if (months <= 0) return "Now"
  if (months < 24) return `in ${months} ${months === 1 ? "month" : "months"}`
  return `in ${(months / 12).toFixed(1)} years`
}

export function dealTypeLabel(t: string) {
  return t.charAt(0) + t.slice(1).toLowerCase()
}

export function leaseUnit(l: Lease) {
  return [l.floor, l.suite && `Unit ${l.suite}`].filter(Boolean).join(", ")
}

function leaseLabel(l: Lease) {
  return `${l.asset.replace(" Headquarters", "")}, ${l.suite ? `Unit ${l.suite}` : l.floor}`
}

// The mock leases count `remaining` months from a shared "as of" date; derive it per lease so all countdowns agree.
function asOf(l: Lease) {
  return addMonths(toIso(l.lxd), -l.remaining)
}

export function leaseInsight(l: Lease, deals: Deal[]): LeaseInsight {
  const options = [...l.options]
  if (!options.some(o => o.startsWith("Contraction")) && hash(l.id) % 6 === 0) options.push("Contraction Option")
  const lxd = toIso(l.lxd)
  const now = asOf(l)
  const marketGapPsf = l.marketRentPsf - l.baseRent
  const hasRenewal = options.includes("Renewal Option")
  const noticeDeadline = hasRenewal ? addMonths(lxd, -12) : undefined
  const noticeMonths = noticeDeadline ? monthsBetween(now, noticeDeadline) : undefined
  const termOption = options.includes("Termination Option")
  const terminationDate = l.terminationDate ? toIso(l.terminationDate) : termOption ? addMonths(lxd, -24) : undefined
  const terminationMonths = terminationDate ? monthsBetween(now, terminationDate) : undefined
  const linkedDeal = deals.find(d => d.asset === l.asset)
  const hh = hash(`${l.id}-obligations`)
  const hasRofo = options.some(o => o === "ROFO" || o === "ROFR")
  const rofoDeadline = hasRofo ? addMonths(lxd, -18) : undefined
  const rofoMonths = rofoDeadline ? monthsBetween(now, rofoDeadline) : undefined
  const restoration = hh % 4 === 0
  const isLoc = hh % 5 === 0
  const depositMonths = 2 + (hh % 3)
  const depositRenewal = isLoc ? addMonths(now, 1 + (hh % 10)) : undefined
  const deposit = {
    amount: Math.round((l.annualRent / 12) * depositMonths),
    type: (isLoc ? "Letter of credit" : "Cash deposit") as "Letter of credit" | "Cash deposit",
    renewal: depositRenewal,
    renewalMonths: depositRenewal ? monthsBetween(now, depositRenewal) : undefined,
  }
  const coTenancy = l.floor === "Ground" ? "Rent drops 50% if the anchor tenant goes dark" : undefined
  if (restoration && !options.includes("Restoration")) options.push("Restoration")
  if (coTenancy) options.push("Co-tenancy")
  if (isLoc) options.push("LOC")

  const parts: string[] = []
  const note: string[] = []
  let severity: Severity | null = null
  if (l.renewalStatus === "Not renewing") { parts.push("Tenant has signaled they will not renew."); severity = "critical" }
  if (terminationMonths !== undefined && terminationMonths >= 0 && terminationMonths <= 24) {
    parts.push(`Termination option ${terminationMonths <= 0 ? "is exercisable now" : `opens ${fmtMonthYear(terminationDate!)}`}.`)
    note.push(parts[parts.length - 1])
    severity = severity ?? "warning"
  }
  if (noticeMonths !== undefined && noticeMonths >= 0 && noticeMonths <= 18) {
    parts.push(`Renewal notice due ${fmtShort(noticeDeadline!)}.`)
    note.push(parts[parts.length - 1])
    severity = severity ?? (noticeMonths <= 6 ? "critical" : "warning")
  } else if (l.remaining <= 24) {
    parts.push(`Expires ${fmtShort(lxd)}, ${countdown(l.remaining)}.`)
    severity = severity ?? (l.remaining <= 12 ? "critical" : "warning")
  }
  if (["In talks", "Negotiating"].includes(l.renewalStatus)) parts.push(`Renewal is ${l.renewalStatus.toLowerCase()}.`)
  const gapPct = l.marketRentPsf ? Math.round((marketGapPsf / l.marketRentPsf) * 100) : 0
  if (gapPct >= 5) parts.push(`Rent is ${gapPct}% below market.`)
  else if (gapPct <= -5) parts.push(`Rent is ${Math.abs(gapPct)}% above market.`)
  if (options.includes("Contraction Option")) parts.push("Tenant holds a contraction right.")
  if (linkedDeal) parts.push(`Linked ${linkedDeal.dealType.toLowerCase()} in ${linkedDeal.stage}.`)
  if (rofoMonths !== undefined && rofoMonths >= 0 && rofoMonths <= 12) { parts.push(`${options.includes("ROFR") ? "ROFR" : "ROFO"} response due ${fmtShort(rofoDeadline!)}.`); note.push(parts[parts.length - 1]) }
  if (deposit.renewalMonths !== undefined && deposit.renewalMonths <= 3) { parts.push(`Letter of credit renews ${fmtShort(deposit.renewal!)}.`); note.push(parts[parts.length - 1]) }
  if (restoration && l.remaining <= 24) parts.push("Restoration is required at move-out.")
  if (!parts.length) parts.push(`Stable. ${countdown(l.remaining).replace("in ", "")} of term remaining with no near-term obligations.`)

  return { lease: l, options, marketGapPsf, noticeDeadline, noticeMonths, terminationDate, terminationMonths, linkedDeal, rofoDeadline, rofoMonths, restoration, deposit, coTenancy, insight: parts.join(" "), note: note.join(" "), severity }
}

const SEVERITY_ORDER: Record<Severity, number> = { critical: 0, warning: 1, info: 2 }

function firstName(name?: string) {
  return name?.split(" ")[0] ?? "the tenant"
}

export function tenantSignals(args: {
  displayName: string
  leases: Lease[]
  allEntityLeases: Lease[]
  scopeLeases: Lease[]
  deals: Deal[]
  family: TenantFamily
  contacts: Contact[]
}): TenantSignals {
  const { displayName, leases, allEntityLeases, scopeLeases, deals, family, contacts } = args
  const insights = leases.map(l => leaseInsight(l, deals)).sort((a, b) => a.lease.remaining - b.lease.remaining)
  const head = contacts.find(c => c.title === "Head of leasing")
  const broker = contacts.find(c => c.group === "broker")
  const risks: Signal[] = []
  const opportunities: Signal[] = []

  for (const i of insights) {
    const l = i.lease
    const where = leaseLabel(l)
    if (l.renewalStatus === "Not renewing") {
      risks.push({ id: `nr-${l.id}`, severity: "critical", title: "Not renewing", detail: `${l.sf.toLocaleString()} sf at ${where}`, due: `Expires ${fmtShort(toIso(l.lxd))}`, leaseId: l.id })
    } else if (l.remaining <= 24) {
      risks.push({ id: `ex-${l.id}`, severity: l.remaining <= 12 ? "critical" : "warning", title: `Expires ${countdown(l.remaining)}`, detail: `${l.sf.toLocaleString()} sf at ${where}`, due: fmtShort(toIso(l.lxd)), leaseId: l.id, summary: `The lease at ${where} expires ${countdown(l.remaining)}.` })
    }
    if (i.terminationMonths !== undefined && i.terminationMonths >= 0 && i.terminationMonths <= 24) {
      risks.push({ id: `tm-${l.id}`, severity: i.terminationMonths <= 12 ? "critical" : "warning", title: "Termination option", detail: `${l.terminationType || "Tenant"} right at ${where}`, due: `Opens ${fmtShort(i.terminationDate!)}`, leaseId: l.id, summary: `A termination option at ${where} opens ${fmtShort(i.terminationDate!)}.` })
    }
    if (i.noticeMonths !== undefined && i.noticeMonths >= 0 && i.noticeMonths <= 18 && l.renewalStatus !== "Not renewing") {
      risks.push({ id: `nt-${l.id}`, severity: i.noticeMonths <= 6 ? "critical" : "warning", title: "Renewal notice deadline", detail: `Option at ${where}`, due: fmtShort(i.noticeDeadline!), leaseId: l.id, summary: `The renewal notice at ${where} is due ${fmtShort(i.noticeDeadline!)}.` })
    }
    if (i.options.includes("Contraction Option")) {
      risks.push({ id: `ct-${l.id}`, severity: "warning", title: "Contraction right", detail: `Tenant can give back space at ${where}`, leaseId: l.id, summary: `The tenant can give back space at ${where} under a contraction right.` })
    }
    if (i.rofoMonths !== undefined && i.rofoMonths >= 0 && i.rofoMonths <= 12) {
      const kind = i.options.includes("ROFR") ? "ROFR" : "ROFO"
      risks.push({ id: `rf-${l.id}`, severity: i.rofoMonths <= 6 ? "critical" : "warning", title: `${kind} response deadline`, detail: `Tenant right on adjacent space at ${where}`, due: fmtShort(i.rofoDeadline!), leaseId: l.id, summary: `The ${kind} response at ${where} is due ${fmtShort(i.rofoDeadline!)}.` })
    }
    if (i.deposit?.renewalMonths !== undefined && i.deposit.renewalMonths <= 3) {
      risks.push({ id: `lc-${l.id}`, severity: i.deposit.renewalMonths <= 1 ? "critical" : "warning", title: "Letter of credit renewal", detail: `$${fmtCompact(i.deposit.amount)} LOC at ${where}`, due: fmtShort(i.deposit.renewal!), leaseId: l.id, summary: `The $${fmtCompact(i.deposit.amount)} letter of credit at ${where} renews ${fmtShort(i.deposit.renewal!)}.` })
    }
    if (i.restoration && l.remaining <= 24) {
      risks.push({ id: `rs-${l.id}`, severity: "warning", title: "Restoration obligation", detail: `Tenant must restore the space at ${where}`, due: `At expiration ${fmtMonthYear(toIso(l.lxd))}`, leaseId: l.id, summary: `The tenant must restore the space at ${where} at move-out.` })
    }
    if (i.coTenancy) {
      risks.push({ id: `co-${l.id}`, severity: "info", title: "Co-tenancy clause", detail: `${i.coTenancy} at ${where}`, leaseId: l.id, summary: `A co-tenancy clause at ${where} cuts rent if the anchor goes dark.` })
    }
    const gapPct = l.marketRentPsf ? Math.round((i.marketGapPsf / l.marketRentPsf) * 100) : 0
    if (gapPct <= -5) {
      risks.push({ id: `am-${l.id}`, severity: "info", title: `Rent ${Math.abs(gapPct)}% above market`, detail: `Renewal pressure at ${where}`, leaseId: l.id, summary: `Rent at ${where} is ${Math.abs(gapPct)}% above market, which adds renewal pressure.` })
    }
    if (gapPct >= 5) {
      opportunities.push({ id: `mm-${l.id}`, severity: "info", title: `$${fmtCompact(i.marketGapPsf * l.sf)}/yr mark-to-market`, detail: `Rent ${gapPct}% below market at ${where}`, due: `At renewal ${fmtMonthYear(toIso(l.lxd))}`, leaseId: l.id })
    }
    for (const o of i.options.filter(o => o === "Expansion Option" || o === "ROFO" || o === "ROFR")) {
      opportunities.push({ id: `op-${l.id}-${o}`, severity: "info", title: o === "Expansion Option" ? "Expansion option" : `${o} on adjacent space`, detail: `Held at ${where}`, leaseId: l.id })
    }
  }

  for (const d of deals) {
    if (d.status === "stalled" || d.status === "at-risk") {
      risks.push({ id: `dl-${d.id}`, severity: d.status === "at-risk" ? "critical" : "warning", title: d.status === "at-risk" ? "Deal at risk" : `Deal stalled ${d.stalledDays ?? ""} days`.replace("  ", " "), detail: `${d.sf.toLocaleString()} sf ${d.dealType.toLowerCase()} at ${d.asset}`, dealId: d.id, summary: `The ${d.dealType.toLowerCase()} at ${d.asset} ${d.status === "at-risk" ? "is at risk" : `has stalled${d.stalledDays ? ` for ${d.stalledDays} days` : ""}`}.` })
    }
    if (["Inquiry", "Touring", "Proposal"].includes(d.stage)) {
      opportunities.push({ id: `rq-${d.id}`, severity: "info", title: `Active ${fmtCompact(d.sf)} sf requirement`, detail: `${dealTypeLabel(d.dealType)} at ${d.asset}, in ${d.stage}`, dealId: d.id })
    }
  }

  const leaseMembers = family.members.filter(m => m.hasLeases).map(m => m.name)
  for (const member of leaseMembers) {
    const outside = LEASES.filter(l => l.tenant === member && !leases.some(x => x.id === l.id))
    if (!outside.length) continue
    const sf = outside.reduce((a, l) => a + l.sf, 0)
    opportunities.push({ id: `fm-${member}`, severity: "info", title: "Consolidation opportunity", detail: `${member} leases ${fmtCompact(sf)} sf at ${[...new Set(outside.map(l => l.asset))].join(", ")}` })
  }

  risks.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

  const actions: RecommendedAction[] = []
  const urgent = insights.find(i => i.lease.renewalStatus === "Not renewing" || i.lease.remaining <= 24 || (i.noticeMonths !== undefined && i.noticeMonths >= 0 && i.noticeMonths <= 18))
  if (urgent && head) {
    const l = urgent.lease
    actions.push({
      id: `a-email-${l.id}`, kind: "email", cta: "Email",
      title: `Email ${firstName(head.name)} about renewal timing`,
      reason: `${leaseLabel(l)} ${l.renewalStatus === "Not renewing" ? "is marked not renewing" : `expires ${fmtShort(toIso(l.lxd))}`}.`,
      contactName: head.name,
      subject: `Renewal timing for ${l.asset}, ${l.suite ? `Unit ${l.suite}` : l.floor}`,
      body: `Hi ${firstName(head.name)},\n\nAs we look ahead to your lease expiration at ${l.asset} on ${fmtShort(toIso(l.lxd))}, I would like to understand your plans for the space and timing for a renewal conversation.\n\nDo you have 30 minutes in the next two weeks?\n\nBest,`,
      leaseId: l.id,
    })
  }
  const term = insights.find(i => i.terminationMonths !== undefined && i.terminationMonths >= 0 && i.terminationMonths <= 24)
  if (term) {
    const l = term.lease
    actions.push({
      id: `a-task-${l.id}`, kind: "task", cta: "New task",
      title: "Model the termination scenario",
      reason: `Option at ${leaseLabel(l)} opens ${fmtShort(term.terminationDate!)}.`,
      taskTitle: `Model termination scenario for ${leaseLabel(l)}`,
      taskOwner: ASSET_MANAGER[l.asset],
      leaseId: l.id,
    })
  }
  const below = insights.filter(i => i.lease.marketRentPsf && i.marketGapPsf / i.lease.marketRentPsf >= 0.05).sort((a, b) => b.marketGapPsf * b.lease.sf - a.marketGapPsf * a.lease.sf)[0]
  if (below) {
    const l = below.lease
    actions.push({
      id: `a-ask-${l.id}`, kind: "ask", cta: "Draft",
      title: "Draft a renewal proposal at market",
      reason: `${leaseLabel(l)} is $${below.marketGapPsf.toFixed(2)}/sf below market.`,
      prompt: `Draft a renewal proposal for ${l.tenant} at ${l.asset}, ${l.suite ? `Unit ${l.suite}` : l.floor}. Current base rent is $${l.baseRent.toFixed(2)}/sf against a market rent of $${l.marketRentPsf.toFixed(2)}/sf. Lease expires ${fmtShort(toIso(l.lxd))}.`,
      leaseId: l.id,
    })
  }
  const stalled = deals.find(d => d.status === "stalled" || d.status === "at-risk")
  if (stalled && broker) {
    actions.push({
      id: `a-broker-${stalled.id}`, kind: "email", cta: "Email",
      title: `Follow up with ${firstName(broker.name)} on the stalled deal`,
      reason: stalled.stalledDays ? `${dealTypeLabel(stalled.dealType)} at ${stalled.asset} has stalled for ${stalled.stalledDays} days.` : `${dealTypeLabel(stalled.dealType)} at ${stalled.asset} is at risk.`,
      contactName: broker.name,
      subject: `Next steps on ${stalled.asset}`,
      body: `Hi ${firstName(broker.name)},\n\nChecking in on the ${stalled.dealType.toLowerCase()} for ${stalled.sf.toLocaleString()} sf at ${stalled.asset}. What do you need from us to keep this moving?\n\nBest,`,
    })
  }
  const expansion = insights.find(i => i.options.includes("Expansion Option"))
  if (expansion && actions.length < 4) {
    const l = expansion.lease
    actions.push({
      id: `a-exp-${l.id}`, kind: "task", cta: "New task",
      title: "Pitch expansion space",
      reason: `Tenant holds an expansion option at ${leaseLabel(l)}.`,
      taskTitle: `Identify expansion space for ${l.tenant} at ${l.asset}`,
      taskOwner: ASSET_MANAGER[l.asset],
      leaseId: l.id,
    })
  }
  if (!actions.length && head) {
    actions.push({
      id: "a-checkin", kind: "email", cta: "Email",
      title: `Schedule a check-in with ${firstName(head.name)}`,
      reason: "No near-term obligations. A quarterly touchpoint keeps the relationship warm.",
      contactName: head.name,
      subject: "Quarterly check-in",
      body: `Hi ${firstName(head.name)},\n\nIt has been a little while since we last connected. Do you have time for a quick check-in on how the space is working for your team?\n\nBest,`,
    })
  }

  const sf = leases.reduce((a, l) => a + l.sf, 0)
  const rent = leases.reduce((a, l) => a + l.annualRent, 0)
  const assetCount = new Set(leases.map(l => l.asset)).size
  const footprint = `${fmtCompact(sf)} sf across ${assetCount} ${assetCount === 1 ? "asset" : "assets"}, $${fmtCompact(rent)} annual rent, ${leases.length} ${leases.length === 1 ? "lease" : "leases"}`

  const sentences: string[] = []
  if (leases.length) sentences.push(`${displayName} leases ${fmtCompact(sf)} sf across ${assetCount} ${assetCount === 1 ? "asset" : "assets"}, $${fmtCompact(rent)} a year.`)
  else if (allEntityLeases.length) sentences.push(`${displayName} has no leases here but leases ${fmtCompact(allEntityLeases.reduce((a, l) => a + l.sf, 0))} sf elsewhere in your portfolio.`)
  const notRenewing = insights.filter(i => i.lease.renewalStatus === "Not renewing")
  if (notRenewing.length) sentences.push(`${notRenewing.length === 1 ? "One lease is" : `${["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][notRenewing.length - 2] ?? notRenewing.length} leases are`} marked not renewing, and the first expires ${fmtMonthYear(toIso(notRenewing[0].lease.lxd))}.`)
  else if (risks.some(r => r.summary)) sentences.push(risks.find(r => r.summary)!.summary!)
  else sentences.push("There are no lease obligations in the next 24 months.")
  const bigDeal = [...deals].sort((a, b) => b.sf - a.sf)[0]
  if (bigDeal) {
    const growth = sf ? bigDeal.sf / sf : 0
    const type = bigDeal.dealType.toLowerCase()
    const article = /^[aeiou]/.test(type) ? "an" : "a"
    const grows = bigDeal.dealType !== "Renewal" && growth >= 1
    sentences.push(`${bigDeal.tenant} has ${article} ${type} for ${fmtCompact(bigDeal.sf)} sf at ${bigDeal.asset}, now in ${bigDeal.stage}${grows ? ", which would more than double their footprint" : ""}.`)
  } else if (opportunities[0]) {
    sentences.push(`Biggest opportunity: ${opportunities[0].title.toLowerCase()}.`)
  }

  const dates = [...leases.map(l => toIso(l.lastUpdate)), ...deals.map(d => d.lastUpdated)].sort()
  const latest = dates.at(-1)
  const windowStart = latest ? addMonths(latest, -2) : ""
  const changes: Change[] = []
  for (const d of deals) if (d.lastUpdated >= windowStart) changes.push({ date: d.lastUpdated, text: `${dealTypeLabel(d.dealType)} at ${d.asset} moved to ${d.stage}`, dealId: d.id })
  for (const l of leases) {
    const u = toIso(l.lastUpdate)
    if (u >= windowStart && l.renewalStatus && l.renewalStatus !== "Renewal option") changes.push({ date: u, text: `Renewal status at ${leaseLabel(l)} updated to ${l.renewalStatus.toLowerCase()}`, leaseId: l.id })
  }
  changes.sort((a, b) => b.date.localeCompare(a.date))

  let exposure: Exposure | null = null
  if (leases.length) {
    const scopeRent = scopeLeases.reduce((a, l) => a + l.annualRent, 0)
    const rentShare = scopeRent ? rent / scopeRent : 0
    const ranked = buildTenantRows(scopeLeases).map(r => ({ parent: r.parent, rent: r.annualRevenue }))
    const byParent = new Map<string, number>()
    for (const r of ranked) byParent.set(r.parent, (byParent.get(r.parent) ?? 0) + r.rent)
    const ordered = [...byParent.entries()].sort((a, b) => b[1] - a[1]).map(([p]) => p)
    const rank = ordered.indexOf(family.parent) + 1
    const rolling24Sf = leases.filter(l => l.remaining <= 24).reduce((a, l) => a + l.sf, 0)
    const rolling24Share = sf ? rolling24Sf / sf : 0
    if ((rank > 0 && rank <= 10) || rentShare >= 0.01 || rolling24Share >= 0.25) exposure = { rentShare, rank, rolling24Sf, rolling24Share }
  }

  return { brief: sentences.join(" "), footprint, changes, exposure, risks, opportunities, actions: actions.slice(0, 4), insights }
}

const COMPANY_FACTS: Record<string, Omit<CompanyProfile, "website" | "industry">> = {
  amazoncom: { headquarters: "Seattle, WA", employees: "1.5M+", founded: "1994", ownership: "Public (NASDAQ: AMZN)", description: "E-commerce, cloud computing and digital media company." },
  microsoft: { headquarters: "Redmond, WA", employees: "228K", founded: "1975", ownership: "Public (NASDAQ: MSFT)", description: "Software, cloud and AI platform company." },
  goldmansachs: { headquarters: "New York, NY", employees: "46K", founded: "1869", ownership: "Public (NYSE: GS)", description: "Global investment banking and asset management firm." },
  jpmorganchase: { headquarters: "New York, NY", employees: "317K", founded: "1799", ownership: "Public (NYSE: JPM)", description: "Global financial services and banking firm." },
  morganstanley: { headquarters: "New York, NY", employees: "80K", founded: "1935", ownership: "Public (NYSE: MS)", description: "Investment banking and wealth management firm." },
  citigroup: { headquarters: "New York, NY", employees: "229K", founded: "1812", ownership: "Public (NYSE: C)", description: "Global bank serving consumers, corporations and institutions." },
  metaplatforms: { headquarters: "Menlo Park, CA", employees: "74K", founded: "2004", ownership: "Public (NASDAQ: META)", description: "Social technology company behind Facebook, Instagram and WhatsApp." },
  blackstone: { headquarters: "New York, NY", employees: "4.9K", founded: "1985", ownership: "Public (NYSE: BX)", description: "Alternative asset manager across real estate, private equity and credit." },
  kkr: { headquarters: "New York, NY", employees: "4.8K", founded: "1976", ownership: "Public (NYSE: KKR)", description: "Global investment firm in private equity, credit and infrastructure." },
  deloitte: { headquarters: "London, UK", employees: "460K", founded: "1845", ownership: "Private partnership", description: "Professional services network in audit, consulting and tax." },
  accenture: { headquarters: "Dublin, Ireland", employees: "774K", founded: "1989", ownership: "Public (NYSE: ACN)", description: "IT services and consulting company." },
  salesforce: { headquarters: "San Francisco, CA", employees: "76K", founded: "1999", ownership: "Public (NYSE: CRM)", description: "Customer relationship management software company." },
  stripe: { headquarters: "San Francisco, CA", employees: "8K", founded: "2010", ownership: "Private", description: "Payments infrastructure for internet businesses." },
  openai: { headquarters: "San Francisco, CA", employees: "3K", founded: "2015", ownership: "Private", description: "AI research and deployment company." },
  pfizer: { headquarters: "New York, NY", employees: "88K", founded: "1849", ownership: "Public (NYSE: PFE)", description: "Biopharmaceutical company." },
  blackrock: { headquarters: "New York, NY", employees: "21K", founded: "1988", ownership: "Public (NYSE: BLK)", description: "Global investment management company." },
}

export function companyProfile(tenant: string): CompanyProfile {
  const meta = tenantMeta(tenant)
  const facts = COMPANY_FACTS[normalize(meta.parent)] ?? COMPANY_FACTS[normalize(tenant)]
  const domain = TENANT_DOMAIN[tenant] ?? TENANT_DOMAIN[meta.parent] ?? `${meta.parent.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
  return {
    website: domain,
    industry: meta.industry,
    headquarters: facts?.headquarters ?? "United States",
    employees: facts?.employees ?? "Not available",
    founded: facts?.founded ?? "Not available",
    ownership: facts?.ownership ?? "Private",
    description: facts?.description ?? `${meta.industry} company leasing space in your portfolio.`,
  }
}

const LOSS_REASONS = ["Lost to competitor", "Requirement paused", "Economics did not work", "Went direct with landlord", "Chose to renew in place"]

export function deadDeals(tenants: string[], scopeAssets: string[] | null, today: string): DeadDeal[] {
  const out: DeadDeal[] = []
  for (const t of tenants) {
    const h = hash(t)
    const count = h % 3
    const assets = [...new Set(LEASES.map(l => l.asset))].filter(a => !scopeAssets || scopeAssets.includes(a))
    for (let i = 0; i < count && assets.length; i++) {
      const asset = assets[(h >>> (i * 3)) % assets.length]
      out.push({
        id: `dd-${normalize(t)}-${i}`,
        tenant: t,
        asset,
        dealType: ["New deal", "Expansion", "Renewal"][(h >>> (i + 2)) % 3],
        sf: 8000 + ((h >>> (i + 4)) % 30) * 2000,
        lostOn: addMonths(today, -(4 + i * 7 + (h % 5))),
        stageReached: ["Touring", "Proposal", "LOI"][(h >>> (i + 5)) % 3],
        reason: LOSS_REASONS[(h >>> (i + 6)) % LOSS_REASONS.length],
      })
    }
  }
  return out.sort((a, b) => b.lostOn.localeCompare(a.lostOn))
}

export function emailHistory(displayName: string, contacts: Contact[], leases: Lease[], anchor: string): FeedEntry[] {
  const head = contacts.find(c => c.title === "Head of leasing")
  const broker = contacts.find(c => c.group === "broker")
  const owner = contacts.find(c => c.group === "internal")
  const l = leases[0]
  const out: FeedEntry[] = []
  if (head && owner) {
    out.push({
      initials: owner.initials, name: owner.name, kind: "email", timestamp: fmtShort(addMonths(anchor, -1)), date: addMonths(anchor, -1),
      message: `Thanks for the walkthrough last week. Attaching the updated floor plan and the amenity schedule for ${l?.asset ?? "the building"}.`,
      email: { direction: "sent", subject: "Floor plan and amenity schedule", counterpart: head.name },
    })
    out.push({
      initials: head.initials, name: head.name, kind: "email", timestamp: fmtShort(addMonths(anchor, -2)), date: addMonths(anchor, -2),
      message: `We are reviewing our ${Number(anchor.slice(0, 4)) + 1} footprint and want to understand flexibility on our current space before we commit to renewal timing.`,
      email: { direction: "received", subject: `${displayName} footprint planning`, counterpart: head.name },
    })
  }
  if (broker && owner) {
    out.push({
      initials: broker.initials, name: broker.name, kind: "email", timestamp: fmtShort(addMonths(anchor, -3)), date: addMonths(anchor, -3),
      message: "Sharing a summary of the requirement and target timing. Our client would like to tour options in the next 60 days.",
      email: { direction: "received", subject: "Requirement summary", counterpart: broker.name },
    })
  }
  return out
}

export function seedTasks(contacts: Contact[], insights: LeaseInsight[], anchor: string): TenantTask[] {
  const head = contacts.find(c => c.title === "Head of leasing")
  const owner = contacts.find(c => c.group === "internal")
  const first = insights[0]
  const tasks: TenantTask[] = []
  if (owner && head) {
    tasks.push({ id: "t-seed-1", title: `Send ${head.name.split(" ")[0]} the renewal options summary`, owner: owner.name, due: addMonths(anchor, 0), reminder: "1d", contactName: head.name, link: first ? leaseLabel(first.lease) : undefined, done: false })
  }
  if (owner && first) {
    tasks.push({ id: "t-seed-2", title: "Pull market comps for the renewal discussion", owner: owner.name, due: addMonths(anchor, 1), reminder: "1w", link: leaseLabel(first.lease), done: false })
  }
  const shift = (days: number) => {
    const d = new Date(`${anchor}T00:00:00`)
    d.setDate(d.getDate() + days)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  const broker = contacts.find(c => c.group === "broker")
  if (owner) {
    tasks.push({ id: "t-seed-3", title: "Confirm the HVAC fix with property management", owner: owner.name, due: shift(-2), reminder: "none", link: first ? leaseLabel(first.lease) : undefined, done: false })
    tasks.push({ id: "t-seed-4", title: "Schedule the quarterly relationship check-in", owner: owner.name, due: shift(4), reminder: "1d", contactName: head?.name, done: false })
  }
  if (owner && broker) {
    tasks.push({ id: "t-seed-5", title: `Share the availability report with ${broker.name.split(" ")[0]}`, owner: owner.name, due: shift(-6), reminder: "none", contactName: broker.name, done: true })
  }
  return tasks
}

const OPS_TYPES: { category: string; issue: string; baseHours: number }[] = [
  { category: "HVAC", issue: "Hot spots on the north side", baseHours: 18 },
  { category: "Electrical", issue: "Flickering lights in the pantry", baseHours: 9 },
  { category: "Janitorial", issue: "Missed nightly cleaning", baseHours: 6 },
  { category: "Access control", issue: "Badge reader offline at the lobby", baseHours: 4 },
  { category: "Plumbing", issue: "Slow drain in the restrooms", baseHours: 12 },
]

function npsFromScore(score: number) {
  return Math.round(Math.max(-60, Math.min(80, (score - 3.4) * 60)))
}

const SAT_COMMENTS: Record<Sentiment, string[]> = {
  promoter: [
    "The building team is quick to respond and always follows up.",
    "Lobby and amenity spaces make it easy to bring people back to the office.",
    "Property management feels like a partner, not a vendor.",
  ],
  passive: [
    "Things get fixed, but it usually takes a couple of follow-ups.",
    "Good building overall. The conference center books up too fast.",
  ],
  detractor: [
    "Recurring {issue} problems are hurting how our team feels about the space.",
    "We keep logging the same {issue} tickets and nothing changes.",
  ],
}

const SAT_ROLES = ["Office manager", "Head of workplace", "Facilities lead", "Head of leasing"]

export function tenantOperations(displayName: string, leases: Lease[], anchor: string): TenantOperations {
  const h = hash(displayName)
  const scale = Math.max(1, leases.length)
  const types: WorkOrderType[] = OPS_TYPES.map((t, i) => {
    const th = hash(displayName + t.category)
    const total90d = (th % 5) + (i === 0 ? 3 : 0) + Math.min(scale, 3)
    const trend: OpsTrend = th % 3 === 0 ? "up" : th % 3 === 1 ? "flat" : "down"
    return {
      category: t.category,
      open: Math.min(total90d, th % 3 + (i === 0 ? 1 : 0)),
      total90d,
      avgHours: Math.round(t.baseHours * (0.7 + (th % 7) / 10)),
      slaPct: 72 + (th % 27),
      trend,
      lastIssue: t.issue,
    }
  }).sort((a, b) => b.total90d - a.total90d)

  const end = new Date(`${anchor}T00:00:00`)
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(end.getFullYear(), end.getMonth() - 5 + i, 1)
    return { month: d.toLocaleDateString("en-US", { month: "short" }), count: 3 + ((h >>> (i * 3)) % 6) + (i >= 4 && h % 3 === 0 ? 3 : 0) }
  })

  const trend: OpsTrend = h % 3 === 0 ? "down" : h % 3 === 1 ? "flat" : "up"
  const score = 3.4 + (h % 13) / 10
  const history = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(end.getFullYear(), end.getMonth() - 9 + i * 3, 1)
    const step = trend === "down" ? (3 - i) * 0.2 : trend === "up" ? -(3 - i) * 0.2 : ((i % 2) - 0.5) * 0.1
    const s = Math.round(Math.min(5, score + step) * 10) / 10
    return { quarter: `Q${Math.floor(d.getMonth() / 3) + 1} ${String(d.getFullYear()).slice(2)}`, score: s, nps: npsFromScore(s) }
  })
  const latest = history[3]
  const passives = 18 + (h % 14)
  const nps = Math.max(-(100 - passives), Math.min(100 - passives, latest.nps))
  const promoters = Math.round((100 - passives + nps) / 2)
  const detractors = promoters - nps
  const sentimentFor = (s: Sentiment) => SAT_COMMENTS[s][(h >>> 5) % SAT_COMMENTS[s].length]
  const order: Sentiment[] = nps < 0 ? ["detractor", "passive", "promoter"] : ["promoter", "detractor", "passive"]
  const satisfaction: TenantSatisfaction = {
    score: latest.score,
    trend,
    nps,
    npsChange: nps - history[0].nps,
    history,
    split: { promoter: promoters, passive: 100 - promoters - detractors, detractor: detractors },
    responses: 12 + (h % 30),
    surveyed: fmtMonthYear(`${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-01`),
    comments: order.slice(0, 2).map((s, i) => ({ sentiment: s, text: sentimentFor(s).replace("{issue}", issueName(types[0]?.category)), who: SAT_ROLES[(h + i) % SAT_ROLES.length] })),
  }

  const total90d = types.reduce((a, t) => a + t.total90d, 0)
  const avgHours = Math.round(types.reduce((a, t) => a + t.avgHours * t.total90d, 0) / Math.max(1, total90d))
  const top = types[0]
  const next = [...leases].filter(l => l.remaining > 0).sort((a, b) => a.remaining - b.remaining)[0]
  const expiry = next ? fmtMonthYear(addMonths(asOf(next), next.remaining)) : null
  const avgHoursChangePct = trend === "down" ? 12 + (h % 15) : trend === "up" ? -(8 + (h % 12)) : 0
  const recs: OpsRec[] = []
  const rec = (title: string, detail: string, agent: string) => recs.push({ title, detail, action: `${title}. ${detail}.`, agent })
  if (top && top.trend === "up") {
    rec(`Order ${/^[AEIOU]/.test(top.category) ? "an" : "a"} ${top.category} root-cause inspection`, `${Math.round((top.total90d / Math.max(1, total90d)) * 100)}% of tickets in 90 days`, "Property manager")
  }
  const slow = types.filter(t => t.slaPct < 80).sort((a, b) => a.slaPct - b.slaPct)[0]
  if (slow) rec(`Move ${slow.category.toLowerCase()} work orders to a faster vendor`, `${slow.slaPct}% closed within SLA`, "Dispatch")
  if (trend === "down") rec("Send a satisfaction pulse survey", expiry ? `Ahead of the ${expiry} expiration` : "Satisfaction is slipping", "Aria")
  if (avgHoursChangePct > 0) rec("Triage open tickets", `Bring resolution back under ${avgHours - Math.round(avgHours * avgHoursChangePct / 100)} hrs`, "Triage")
  const healthScore: OpsHealth["score"] = trend === "down" && next && next.remaining <= 36 ? "at-risk" : recs.length ? "caution" : "on-track"

  return {
    openWorkOrders: types.reduce((a, t) => a + t.open, 0),
    total90d,
    avgHours,
    avgHoursChangePct,
    slaPct: Math.round(types.reduce((a, t) => a + t.slaPct * t.total90d, 0) / Math.max(1, total90d)),
    monthly,
    satisfaction,
    types,
    health: { score: healthScore, recs },
  }
}

export interface TenantRequirement {
  id: string
  deal: Deal
  sizeMin: number
  sizeMax: number
  targetRent: number
  occupancy: string
  floors: string
  mustHaves: string[]
}

const REQ_FLOORS = ["Any floor", "6th floor or above", "Top half of the building", "Contiguous floors", "Ground floor access"]
const REQ_MUST_HAVES = [
  "Open plan", "Dedicated server room", "Outdoor terrace", "Bike storage", "24/7 access", "Private elevator lobby",
  "Wellness room", "Large training room", "Back-up power", "Showers on floor",
]

export function tenantRequirements(deals: Deal[]): TenantRequirement[] {
  return deals
    .filter(d => d.dealType !== "Renewal" && d.stage !== "Executed")
    .map(d => {
      const h = hash(d.id)
      const updated = new Date(`${d.lastUpdated}T00:00:00`)
      const occupancyDate = new Date(updated.getFullYear(), updated.getMonth() + 6 + (h % 9), 1)
      const quarter = Math.floor(occupancyDate.getMonth() / 3) + 1
      const picks = [h % REQ_MUST_HAVES.length, (h >>> 4) % REQ_MUST_HAVES.length, (h >>> 8) % REQ_MUST_HAVES.length]
      return {
        id: `req-${d.id}`,
        deal: d,
        sizeMin: Math.round(d.sf * 0.9 / 500) * 500,
        sizeMax: Math.round(d.sf * 1.1 / 500) * 500,
        targetRent: d.budgetNer,
        occupancy: `Q${quarter} ${occupancyDate.getFullYear()}`,
        floors: REQ_FLOORS[(h >>> 12) % REQ_FLOORS.length],
        mustHaves: [...new Set(picks)].map(i => REQ_MUST_HAVES[i]),
      }
    })
}

function issueName(category?: string) {
  if (!category) return "maintenance"
  return category === category.toUpperCase() ? category : category.toLowerCase()
}

export interface AssetFinancials {
  arrears: number
  daysPastDue: number
  onTimePct: number
  noi: number
  budgetVariancePct: number
}

export function assetFinancials(displayName: string, leases: Lease[]): AssetFinancials {
  const h = hash(`${displayName}-finance`)
  const rent = leases.reduce((a, l) => a + l.annualRent, 0)
  const sf = leases.reduce((a, l) => a + l.sf, 0)
  const late = h % 4 === 0
  return {
    arrears: late ? Math.round((rent / 12) * (0.2 + (h % 5) / 10)) : 0,
    daysPastDue: late ? 31 + (h % 40) : 0,
    onTimePct: late ? 75 + (h % 12) : 92 + (h % 9),
    noi: Math.round(rent - sf * (14 + (h % 6))),
    budgetVariancePct: ((h >>> 4) % 9) - 3,
  }
}
