import { LEASES, type Lease } from "@/components/leases-page"
import { type Deal } from "@/components/deals-page"
import { type FeedEntry } from "@/components/activity-feed"
import { TENANT_DOMAIN } from "@/lib/tenant-data"
import { ASSET_MANAGER, matchingDeals, normalize, tenantMeta, toIso } from "@/lib/tenants-data"

export interface FamilyMember {
  name: string
  role: "Parent" | "Subsidiary"
  hasLeases: boolean
}

export interface TenantFamily {
  parent: string
  members: FamilyMember[]
  otherCount: number
}

export interface Contact {
  name: string
  initials: string
  title: string
  company: string
  group: "tenant" | "broker" | "internal"
  email: string
  phone: string
  touchpoints: number
  lastContact: string
  assets: string[]
}

const KNOWN_SUBSIDIARIES: Record<string, string[]> = {
  "Amazon.com, Inc.": ["Whole Foods Market", "Audible, Inc.", "Zappos.com LLC", "Twitch Interactive"],
  "Microsoft": ["GitHub", "Activision Blizzard"],
  "Salesforce, Inc.": ["Slack Technologies", "MuleSoft"],
  "Citigroup Inc.": ["Citi Ventures"],
  "Verizon": ["Visible Wireless"],
  "Meta Platforms": ["Instagram", "WhatsApp"],
  "Uber Technologies": ["Uber Eats"],
}

const LEASE_TENANTS = [...new Set(LEASES.map(l => l.tenant))]

export const AGGREGATE_PREFIX = "family:"

export function isParentTenant(tenant: string) {
  return normalize(tenant) === normalize(tenantMeta(tenant).parent)
}

export function tenantFamily(tenant: string): TenantFamily {
  const parent = tenantMeta(tenant).parent
  const leaseMembers = LEASE_TENANTS.filter(t => tenantMeta(t).parent === parent)
  const members: FamilyMember[] = leaseMembers.map(name => ({
    name,
    role: isParentTenant(name) ? "Parent" : "Subsidiary",
    hasLeases: true,
  }))
  if (!members.some(m => m.role === "Parent")) members.unshift({ name: parent, role: "Parent", hasLeases: false })
  for (const name of KNOWN_SUBSIDIARIES[parent] ?? []) {
    if (!members.some(m => m.name === name)) members.push({ name, role: "Subsidiary", hasLeases: false })
  }
  members.sort((a, b) => (a.role === "Parent" ? -1 : b.role === "Parent" ? 1 : Number(b.hasLeases) - Number(a.hasLeases)))
  const otherCount = members.filter(m => !m.hasLeases && m.role === "Subsidiary").length
  return { parent, members: members.filter(m => m.hasLeases || m.role === "Parent"), otherCount }
}

export function entityTenants(selection: string): string[] {
  if (selection.startsWith(AGGREGATE_PREFIX)) {
    const parent = selection.slice(AGGREGATE_PREFIX.length)
    return LEASE_TENANTS.filter(t => tenantMeta(t).parent === parent)
  }
  return [selection]
}

export function entityDeals(tenants: string[], scopeAssets: string[] | null): Deal[] {
  const seen = new Set<string>()
  const out: Deal[] = []
  for (const t of tenants) {
    for (const d of matchingDeals(t)) {
      if (seen.has(d.id)) continue
      if (scopeAssets && !scopeAssets.includes(d.asset)) continue
      seen.add(d.id)
      out.push(d)
    }
  }
  return out.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
}

export function rolloverSchedule(leases: Lease[]) {
  const byYear = new Map<string, { year: string; sf: number; revenue: number }>()
  for (const l of leases) {
    const year = l.lxd.split("/")[2]
    const row = byYear.get(year) ?? { year, sf: 0, revenue: 0 }
    row.sf += l.sf
    row.revenue += l.annualRent
    byYear.set(year, row)
  }
  return [...byYear.values()].sort((a, b) => a.year.localeCompare(b.year))
}

export function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

function initialsOf(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function emailFor(name: string, domain: string) {
  const [first, ...rest] = name.toLowerCase().split(" ")
  return `${first}.${rest.join("")}@${domain}`
}

function phoneFor(seed: string) {
  const h = hash(seed)
  return `(212) ${String(200 + (h % 700)).padStart(3, "0")}-${String(1000 + (h % 9000)).slice(0, 4)}`
}

export function fmtShort(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const TENANT_PEOPLE = ["Jordan Ellis", "Morgan Patel", "Avery Brooks", "Casey Nguyen", "Riley Thompson", "Quinn Alvarez", "Taylor Brennan", "Drew Okafor"]
const VP_PEOPLE = ["Dana Whitfield", "Sam Castellano", "Robin Hayes", "Alex Moreno", "Jamie Lindqvist", "Cameron Shah"]
const BROKER_FIRMS = [
  { firm: "CBRE", domain: "cbre.com" },
  { firm: "JLL", domain: "jll.com" },
  { firm: "Cushman & Wakefield", domain: "cushwake.com" },
  { firm: "Newmark", domain: "nmrk.com" },
  { firm: "Colliers", domain: "colliers.com" },
]
const BROKER_PEOPLE = ["Sarah Okonkwo", "Daniel Park", "Elena Rossi", "Marcus Webb", "Priya Raman", "Tom Gallagher"]

export function tenantContacts(primaryName: string, parent: string, leases: Lease[], deals: Deal[]): Contact[] {
  const h = hash(parent)
  const domain = TENANT_DOMAIN[primaryName] ?? `${slug(parent)}.com`
  const lastLease = leases.map(l => toIso(l.lastUpdate)).sort().at(-1) ?? "2026-07-01"
  const assets = [...new Set(leases.map(l => l.asset))]

  const headOfLeasing = TENANT_PEOPLE[h % TENANT_PEOPLE.length]
  const vp = VP_PEOPLE[(h >>> 3) % VP_PEOPLE.length]
  const dealBroker = deals.map(d => d.contact).find(c => c?.includes(" · "))
  const brokerFirm = dealBroker
    ? BROKER_FIRMS.find(f => dealBroker.endsWith(f.firm)) ?? { firm: dealBroker.split(" · ")[1], domain: `${slug(dealBroker.split(" · ")[1])}.com` }
    : BROKER_FIRMS[(h >>> 5) % BROKER_FIRMS.length]
  const brokerName = dealBroker ? dealBroker.split(" · ")[0] : BROKER_PEOPLE[(h >>> 7) % BROKER_PEOPLE.length]

  const contacts: Contact[] = [
    {
      name: headOfLeasing, initials: initialsOf(headOfLeasing), title: "Head of leasing", company: parent, group: "tenant",
      email: emailFor(headOfLeasing, domain), phone: phoneFor(headOfLeasing), touchpoints: 6 + (h % 14), lastContact: lastLease, assets,
    },
    {
      name: vp, initials: initialsOf(vp), title: "VP, real estate and workplace", company: parent, group: "tenant",
      email: emailFor(vp, domain), phone: phoneFor(vp), touchpoints: 2 + (h % 5), lastContact: lastLease, assets,
    },
    {
      name: brokerName, initials: initialsOf(brokerName), title: "Tenant rep broker", company: brokerFirm.firm, group: "broker",
      email: emailFor(brokerName, brokerFirm.domain), phone: phoneFor(brokerName), touchpoints: 4 + (h % 11),
      lastContact: deals[0]?.lastUpdated ?? lastLease, assets,
    },
  ]
  const coFirm = BROKER_FIRMS.filter(f => f.firm !== brokerFirm.firm)[(h >>> 9) % (BROKER_FIRMS.length - 1)]
  const coBroker = BROKER_PEOPLE.filter(p => p !== brokerName)[(h >>> 11) % (BROKER_PEOPLE.length - 1)]
  contacts.push({
    name: coBroker, initials: initialsOf(coBroker), title: h % 2 ? "Co-broker" : "Previous tenant rep", company: coFirm.firm, group: "broker",
    email: emailFor(coBroker, coFirm.domain), phone: phoneFor(coBroker), touchpoints: 1 + (h % 4), lastContact: lastLease, assets,
  })

  const internal = new Map<string, Contact>()
  for (const asset of assets) {
    const manager = ASSET_MANAGER[asset]
    if (!manager) continue
    const existing = internal.get(manager)
    const assetLeases = leases.filter(l => l.asset === asset)
    const last = assetLeases.map(l => toIso(l.lastUpdate)).sort().at(-1) ?? lastLease
    if (existing) {
      existing.assets.push(asset)
      existing.touchpoints += 2 + assetLeases.length * 2
      if (last > existing.lastContact) existing.lastContact = last
    } else {
      internal.set(manager, {
        name: manager, initials: initialsOf(manager), title: "Asset manager", company: "VTS Properties", group: "internal",
        email: emailFor(manager, "vtsproperties.com"), phone: phoneFor(manager), touchpoints: 3 + assetLeases.length * 2 + (hash(manager + parent) % 6),
        lastContact: last, assets: [asset],
      })
    }
  }
  for (const d of deals) {
    const person = d.contact?.split(" · ")[0]
    if (!person || person === brokerName || internal.has(person)) continue
    internal.set(person, {
      name: person, initials: initialsOf(person), title: "Leasing lead", company: "VTS Properties", group: "internal",
      email: emailFor(person, "vtsproperties.com"), phone: phoneFor(person), touchpoints: 4 + (hash(person) % 9),
      lastContact: d.lastUpdated, assets: [d.asset],
    })
  }

  return [...contacts, ...[...internal.values()].sort((a, b) => b.touchpoints - a.touchpoints)]
}

const MEETING_NOTES = [
  { type: "Meeting", sentiment: "positive", text: (t: string) => `Caught up with the ${t} real estate team. They are planning headcount growth over the next two years and want to talk expansion early.` },
  { type: "Call", sentiment: "neutral", text: (t: string) => `${t} asked for an updated operating expense breakdown before they commit to renewal timing.` },
  { type: "Site visit", sentiment: "positive", text: () => "Walked the floors with facilities. Tenant is happy with the new amenity center and lobby upgrades." },
  { type: "Email", sentiment: "negative", text: (t: string) => `${t} flagged after-hours HVAC complaints for the second month in a row. Escalated to property management.` },
  { type: "Meeting", sentiment: "neutral", text: (t: string) => `${t} is benchmarking our space against two competing buildings in the submarket. Need a retention proposal ready.` },
  { type: "Call", sentiment: "positive", text: () => "Broker confirmed multiple requirements coming in 2027. Good opportunity to consolidate across the portfolio." },
] as const

function daysBefore(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export function tenantFeed(displayName: string, leases: Lease[], deals: Deal[], contacts: Contact[]): FeedEntry[] {
  const h = hash(displayName)
  const anchor = leases.map(l => toIso(l.lastUpdate)).sort().at(-1) ?? "2026-07-10"
  const people = contacts.filter(c => c.group !== "tenant")
  const entries: FeedEntry[] = []
  const dated: { date: string; entry: FeedEntry }[] = []

  const expiring = leases.filter(l => l.remaining > 0 && l.remaining <= 12)
  if (expiring.length) {
    const sf = expiring.reduce((a, l) => a + l.sf, 0)
    entries.push({
      initials: "AI", name: "Deal Monitor", kind: "agent", timestamp: "Today, 9:00 AM",
      message: `${sf.toLocaleString()} sf expires within 12 months across ${new Set(expiring.map(l => l.asset)).size} ${expiring.length === 1 ? "lease" : "leases"}. Renewal outreach recommended before the notice window closes.`,
    })
  }

  const noteCount = Math.min(5, 2 + leases.length + deals.length)
  for (let i = 0; i < noteCount; i++) {
    const note = MEETING_NOTES[(h + i) % MEETING_NOTES.length]
    const author = people[i % Math.max(1, people.length)] ?? contacts[0]
    const date = daysBefore(anchor, i * 23 + (h % 9))
    const asset = leases[i % Math.max(1, leases.length)]?.asset
    dated.push({ date, entry: {
      initials: author.initials, name: author.name, kind: "comment", timestamp: fmtShort(date),
      message: note.text(displayName),
      meta: { type: note.type, date: fmtShort(date), sentiment: note.sentiment, asset },
    } })
  }
  for (const d of deals.slice(0, 2)) {
    const dealType = d.dealType.charAt(0) + d.dealType.slice(1).toLowerCase()
    const budget = d.ner > 0 ? ` NER is $${d.ner.toFixed(2)} against a $${d.budgetNer.toFixed(2)} budget.` : ""
    dated.push({ date: d.lastUpdated, entry: {
      initials: "AI", name: "Deal Monitor", kind: "agent", timestamp: fmtShort(d.lastUpdated),
      message: `${dealType} for ${d.sf.toLocaleString()} sf at ${d.asset} moved to ${d.stage}.${budget}`,
    } })
  }
  return [...entries, ...dated.sort((a, b) => b.date.localeCompare(a.date)).map(d => d.entry)]
}

export type DocStatus = "Expert verified" | "AI extracted" | "Needs review"

export interface LeaseDocument {
  id: string
  name: string
  type: string
  status: DocStatus
  modified: string
}

function addYears(iso: string, years: number) {
  const [y, m, d] = iso.split("-")
  return `${Number(y) + years}-${m}-${d}`
}

function fileSlug(tenant: string) {
  return tenant.replace(/\(.*?\)/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "")
}

export function leaseDocuments(lease: Lease): LeaseDocument[] {
  const h = hash(lease.id + lease.tenant)
  const slug = fileSlug(lease.tenant)
  const executed = toIso(lease.executionDate)
  const commenced = toIso(lease.lcd)
  const statusFor = (i: number): DocStatus => {
    const v = (h >>> i) % 7
    return v === 0 ? "Needs review" : v === 1 ? "AI extracted" : "Expert verified"
  }
  const docs: Omit<LeaseDocument, "id">[] = [
    { name: `01_Lease_${slug}.pdf`, type: "Master lease", status: statusFor(0), modified: executed },
    { name: `02_LOC_${slug}.pdf`, type: "Security deposit / LOC", status: statusFor(1), modified: executed },
  ]
  const amendments = h % 3
  for (let i = 1; i <= amendments; i++) {
    docs.push({ name: `0${2 + i}_Amendment${i}_${slug}.pdf`, type: "Amendment", status: statusFor(1 + i), modified: addYears(commenced, i * 2) })
  }
  docs.push({ name: `0${3 + amendments}_CommencementLetter_${slug}.pdf`, type: "Commencement letter", status: statusFor(5), modified: commenced })
  if (lease.type === "Sublease") {
    docs.push({ name: `0${4 + amendments}_SubleaseConsent_${slug}.pdf`, type: "Sublease consent", status: statusFor(6), modified: commenced })
  }
  return docs.map((d, i) => ({ ...d, id: `${lease.id}-doc${i}` }))
}
