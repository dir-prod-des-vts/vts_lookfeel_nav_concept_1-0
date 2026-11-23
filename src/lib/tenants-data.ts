import { type Lease } from "@/components/leases-page"
import { DEALS } from "@/components/deals-page"

export interface TenantUpdate {
  message: string
  name: string
  timestamp: string
}

export interface TenantRow {
  tenant: string
  parent: string
  industry: string
  assets: string[]
  inPlaceLeases: number
  sf: number
  annualRevenue: number
  revenuePsfMo: number
  waltYears: number
  subleasesAsSubtenant: number
  activeDeals: number
  lastUpdate: string
  latestUpdate: TenantUpdate | null
}

export type TenantGrouping = "parent" | "industry" | "tenant"

export interface TenantGroup {
  name: string
  revenue: number
  sf: number
}

const INDUSTRY_TENANTS: Record<string, string[]> = {
  "Financial services": [
    "Acadian Asset Mgmt", "American Express", "Apollo Global Mgmt", "Blackrock", "Blackstone", "Blackstone Inc.",
    "Charles Schwab", "Citi", "Citi Private Bank", "Citigroup", "Deutsche Bank", "Fidelity Investments", "First Republic",
    "Goldman Sachs", "HSBC Holdings", "Invesco", "JPMorgan Chase", "KKR & Co.", "MFS Investment Mgmt", "Morgan Stanley",
    "Nuveen", "Pacific Wealth Management", "Putnam Investments", "State Street Corp", "The Carlyle Group Inc.",
    "Truist Financial", "Vantage Point Capital LP", "Wellington Mgmt", "Wells Fargo", "Equifax",
  ],
  "Insurance": ["Aon plc", "John Hancock", "Liberty Mutual", "Liberty Mutual (Berk)", "Marsh & McLennan"],
  "Technology": [
    "Adobe Systems", "Amazon Web Services", "Brightcove", "ByteDance", "Cloudflare", "Cloudflare (WTC)", "Databricks",
    "DocuSign", "Dropbox Inc.", "F5 Networks", "GE Digital", "LinkedIn", "Meta Platforms", "Microsoft", "NCR Corporation",
    "OpenAI", "Rapid7", "Ripple Labs", "Snap Inc.", "Stripe", "Tableau Software", "Twitter/X (Pyramid)", "Uber Technologies",
    "Lyft", "DraftKings", "Spotify (WTC)",
  ],
  "Legal services": ["Arthur & Brennan LLP", "Latham & Watkins", "Skadden Arps", "Sullivan & Cromwell LLP"],
  "Professional services": ["Accenture", "Deloitte LLP", "Ernst & Young", "KPMG", "McKinsey & Co.", "PwC"],
  "Healthcare": ["Abbott Laboratories", "Biogen", "CVS Health Corporation", "Meridian Health Partners", "Pfizer", "Vertex Pharmaceuticals"],
  "Retail": ["Amazon.com Inc.", "Gap Inc.", "L'Oreal USA", "Levi Strauss", "Nordstrom", "PVH Corp", "REI Co-op", "Wayfair Inc.", "Grainger"],
  "Transportation": ["Alaska Airlines", "Delta Air Lines", "Expeditors Intl", "Norfolk Southern", "United Airlines"],
  "Media and telecom": ["Conde Nast", "Conde Nast (WTC)", "Cox Enterprises", "T-Mobile", "Verizon", "Verizon Media"],
  "Consumer goods": ["Kraft Heinz"],
  "Hospitality": ["Hyatt Hotels"],
  "Energy and materials": ["Exelon", "Weyerhaeuser"],
}

const TENANT_INDUSTRY: Record<string, string> = Object.fromEntries(
  Object.entries(INDUSTRY_TENANTS).flatMap(([industry, names]) => names.map(n => [n, industry]))
)

export const TENANT_PARENT: Record<string, string> = {
  "Amazon.com Inc.": "Amazon.com, Inc.",
  "Amazon Web Services": "Amazon.com, Inc.",
  "Blackrock": "BlackRock, Inc.",
  "Blackstone": "Blackstone Inc.",
  "Citi": "Citigroup Inc.",
  "Citi Private Bank": "Citigroup Inc.",
  "Citigroup": "Citigroup Inc.",
  "Conde Nast": "Advance Publications",
  "Conde Nast (WTC)": "Advance Publications",
  "Liberty Mutual (Berk)": "Liberty Mutual",
  "LinkedIn": "Microsoft",
  "Tableau Software": "Salesforce, Inc.",
  "Twitter/X (Pyramid)": "X Corp.",
  "Verizon Media": "Verizon",
  "John Hancock": "Manulife Financial",
}

export const ASSET_MANAGER: Record<string, string> = {
  "VTS Tower Headquarters": "Sarah Chen",
  "One Financial Plaza": "Marcus Reid",
  "Salesforce Tower": "Priya Nair",
  "Empire State Building": "Sarah Chen",
  "Willis Tower": "James Wu",
  "30 Hudson Yards": "Laura Kim",
  "One World Trade Center": "Laura Kim",
  "Transamerica Pyramid": "Priya Nair",
  "200 Berkeley Street": "Marcus Reid",
  "One Peachtree Center": "James Wu",
  "Two Union Square": "Tom Reyes",
}

function stripLocation(name: string) {
  return name.replace(/\s*\(.*?\)\s*/g, "").trim()
}

export function normalize(name: string) {
  return stripLocation(name)
    .toLowerCase()
    .replace(/\b(inc|llc|llp|lp|corp|corporation|plc|co|group|partners)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
}

export function tenantMeta(tenant: string) {
  return {
    parent: TENANT_PARENT[tenant] ?? stripLocation(tenant),
    industry: TENANT_INDUSTRY[tenant] ?? "Other",
  }
}

export function toIso(mmddyyyy: string) {
  const [m, d, y] = mmddyyyy.split("/")
  return `${y}-${m}-${d}`
}

const ACTIVE_DEALS = DEALS.filter(d => d.status !== "executed")

export function matchingDeals(tenant: string) {
  const key = normalize(tenant)
  return ACTIVE_DEALS.filter(d => {
    const dk = normalize(d.tenant)
    return dk === key || dk.startsWith(key) || key.startsWith(dk)
  })
}

const TENANT_NOTES = [
  "Renewal conversation scheduled for next week.",
  "Requested an updated certificate of insurance for the suite.",
  "Confirmed after-hours HVAC billing for Q3.",
  "Tenant asked about expansion space on an adjacent floor.",
  "Sent the annual operating expense reconciliation.",
  "Walked the space with facilities. No open issues.",
  "Tenant flagged a sublease inquiry for part of the floor.",
]

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

function fmtShortDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const STAGE_NOTE: Record<string, (sf: string, asset: string) => string> = {
  "Inquiry": sf => `Inbound inquiry for ${sf}. Tour request pending.`,
  "Touring": (sf, asset) => `Tour scheduled for ${sf} at ${asset}.`,
  "Proposal": sf => `Proposal out for ${sf}. Waiting on tenant feedback.`,
  "LOI": (sf, asset) => `LOI in review for ${sf} at ${asset}.`,
  "Legal": () => "Lease in legal review. Redlines due this week.",
  "Lease Out": (_, asset) => `Lease out for signature at ${asset}.`,
}

function latestUpdateFor(tenant: string, ls: Lease[], deals: typeof DEALS, lastUpdate: string): TenantUpdate | null {
  const deal = [...deals].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))[0]
  if (deal) {
    const note = STAGE_NOTE[deal.stage]
    const sf = `${deal.sf.toLocaleString()} sf`
    return {
      message: note ? note(sf, deal.asset) : `Deal update for ${sf} at ${deal.asset}.`,
      name: deal.contact?.split(" · ")[0] ?? ASSET_MANAGER[deal.asset] ?? "Leasing team",
      timestamp: fmtShortDate(deal.lastUpdated),
    }
  }
  if (!lastUpdate) return null
  const h = hash(tenant)
  if (h % 5 === 0) return null
  return {
    message: TENANT_NOTES[h % TENANT_NOTES.length],
    name: ASSET_MANAGER[ls[0].asset] ?? "Asset manager",
    timestamp: fmtShortDate(lastUpdate),
  }
}

export function buildTenantRows(leases: Lease[]): TenantRow[] {
  const byTenant = new Map<string, Lease[]>()
  for (const l of leases) {
    const list = byTenant.get(l.tenant)
    if (list) list.push(l)
    else byTenant.set(l.tenant, [l])
  }

  return [...byTenant.entries()].map(([tenant, ls]) => {
    const sf = ls.reduce((a, l) => a + l.sf, 0)
    const annualRevenue = ls.reduce((a, l) => a + l.annualRent, 0)
    const deals = matchingDeals(tenant)
    const dates = [...ls.map(l => toIso(l.lastUpdate)), ...deals.map(d => d.lastUpdated)].sort()
    const lastUpdate = dates[dates.length - 1] ?? ""
    return {
      tenant,
      ...tenantMeta(tenant),
      assets: [...new Set(ls.map(l => l.asset))],
      inPlaceLeases: ls.filter(l => l.leaseStatus === "In Place" || l.leaseStatus === "Subleased").length,
      sf,
      annualRevenue,
      revenuePsfMo: sf ? annualRevenue / sf / 12 : 0,
      waltYears: sf ? ls.reduce((a, l) => a + l.remaining * l.sf, 0) / sf / 12 : 0,
      subleasesAsSubtenant: ls.filter(l => l.type === "Sublease").length,
      activeDeals: deals.length,
      lastUpdate,
      latestUpdate: latestUpdateFor(tenant, ls, deals, lastUpdate),
    }
  })
}

export function groupTenantRows(rows: TenantRow[], grouping: TenantGrouping): TenantGroup[] {
  const groups = new Map<string, TenantGroup>()
  for (const r of rows) {
    const name = r[grouping]
    const g = groups.get(name) ?? { name, revenue: 0, sf: 0 }
    g.revenue += r.annualRevenue
    g.sf += r.sf
    groups.set(name, g)
  }
  return [...groups.values()]
}

