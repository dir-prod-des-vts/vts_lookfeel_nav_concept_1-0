import * as React from "react"
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList,
} from "recharts"
import { cn, cardBase } from "@/lib/utils"
import { KpiBar } from "@/components/kpi-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FilterBar, MobileFilterSheet, toggleFilterValue, clearFilterKey, FILTER_TAB_GROUP_CLS, FILTER_TAB_ITEM_CLS } from "@/components/filter-chip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search, ChevronLeft, ChevronRight, ChevronDown, Check,
  MoreHorizontal, Plus, Settings2, GripVertical, Eye, EyeOff, X,
  Download, FileType2, FileSpreadsheet,
} from "lucide-react"
import { AgentBtn } from "@/components/agent-btn"
import { TenantAvatar } from "@/components/tenant-avatar"
import {
  Table, TableHeader, TableBody, TableRow, TableCell, TableHead,
  SortableHead, useSortState,
} from "@/components/sortable-table"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Comp {
  id: string
  label: string
  tenant: string
  currentAddress: string
  citySubmarket: string
  sf: number
  term: number
  rent: number
  esca: string | null
  ti: number
  freeRent: number
  lcd: string
  executedDate: string
  createdDate: string
  note: string | null
  industry: string
  dealType: "New deal" | "Expansion" | "Renewal" | "Sublease"
  archived: boolean
}

type Sector    = "Office" | "Industrial" | "Retail"
type LeaseType = "Gross full service" | "Modified gross" | "Triple net" | "Percentage lease"

interface CompMeta {
  sector: Sector
  leaseType: LeaseType
  recoveries: number | null
  tenantRep: string | null
  leasingBroker: string | null
  discountRate: number
}

const COMP_META: Record<string, CompMeta> = {
  c01: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "Newmark",              discountRate: 8.0 },
  c02: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.0 },
  c03: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Cushman & Wakefield", leasingBroker: "JLL",                  discountRate: 7.5 },
  c04: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Newmark",             leasingBroker: "Cushman & Wakefield",  discountRate: 8.0 },
  c05: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Savills",             leasingBroker: "JLL",                  discountRate: 8.5 },
  c06: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.0 },
  c07: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Eastdil Secured",     leasingBroker: "Newmark",              discountRate: 9.0 },
  c08: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 8.0 },
  c09: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Cushman & Wakefield", leasingBroker: "Newmark",              discountRate: 8.5 },
  c10: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Newmark",             leasingBroker: "JLL",                  discountRate: 8.0 },
  c11: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c12: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Cushman & Wakefield", leasingBroker: "CBRE",                 discountRate: 8.0 },
  c13: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "Newmark",              discountRate: 8.0 },
  c14: { sector: "Office", leaseType: "Modified gross",     recoveries: 14,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 8.0 },
  c15: { sector: "Office", leaseType: "Modified gross",     recoveries: 12,   tenantRep: "Avison Young",        leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  c16: { sector: "Office", leaseType: "Modified gross",     recoveries: 13,   tenantRep: "Newmark",             leasingBroker: "CBRE",                 discountRate: 7.5 },
  c17: { sector: "Office", leaseType: "Modified gross",     recoveries: 16,   tenantRep: "JLL",                 leasingBroker: "Cushman & Wakefield",  discountRate: 8.0 },
  c18: { sector: "Office", leaseType: "Modified gross",     recoveries: 18,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 8.0 },
  c19: { sector: "Office", leaseType: "Modified gross",     recoveries: 16,   tenantRep: "Savills",             leasingBroker: "Cushman & Wakefield",  discountRate: 8.5 },
  c20: { sector: "Office", leaseType: "Modified gross",     recoveries: 17,   tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.0 },
  c21: { sector: "Office", leaseType: "Modified gross",     recoveries: 19,   tenantRep: "Newmark",             leasingBroker: "JLL",                  discountRate: 8.0 },
  c22: { sector: "Office", leaseType: "Modified gross",     recoveries: 12,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 7.5 },
  c23: { sector: "Office", leaseType: "Modified gross",     recoveries: 10,   tenantRep: "Cushman & Wakefield", leasingBroker: "CBRE",                 discountRate: 7.5 },
  c24: { sector: "Office", leaseType: "Modified gross",     recoveries: 11,   tenantRep: "JLL",                 leasingBroker: "Newmark",              discountRate: 7.5 },
  c25: { sector: "Office", leaseType: "Modified gross",     recoveries: 13,   tenantRep: "Newmark",             leasingBroker: "Cushman & Wakefield",  discountRate: 8.0 },
  c26: { sector: "Office", leaseType: "Triple net",         recoveries: 20,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 7.5 },
  c27: { sector: "Office", leaseType: "Triple net",         recoveries: 18,   tenantRep: "Cushman & Wakefield", leasingBroker: "Newmark",              discountRate: 7.5 },
  c28: { sector: "Office", leaseType: "Triple net",         recoveries: 22,   tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c29: { sector: "Office", leaseType: "Triple net",         recoveries: 19,   tenantRep: "Avison Young",        leasingBroker: "JLL",                  discountRate: 7.5 },
  c30: { sector: "Office", leaseType: "Modified gross",     recoveries: 10,   tenantRep: "CBRE",                leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  c31: { sector: "Office", leaseType: "Modified gross",     recoveries: 9,    tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c32: { sector: "Office", leaseType: "Modified gross",     recoveries: 11,   tenantRep: "Newmark",             leasingBroker: "JLL",                  discountRate: 7.5 },
  c33: { sector: "Office", leaseType: "Modified gross",     recoveries: 8,    tenantRep: "Savills",             leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  // Boston / Financial Dist additions
  c34: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 7.5 },
  c35: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Cushman & Wakefield", leasingBroker: "Newmark",              discountRate: 7.5 },
  c36: { sector: "Office", leaseType: "Modified gross",     recoveries: 10,   tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c37: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Newmark",             leasingBroker: "JLL",                  discountRate: 8.0 },
  c38: { sector: "Office", leaseType: "Modified gross",     recoveries: 9,    tenantRep: "Savills",             leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  // New York / Hudson Sq additions
  c39: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.5 },
  c40: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "Newmark",              discountRate: 8.5 },
  c41: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Cushman & Wakefield", leasingBroker: "JLL",                  discountRate: 8.5 },
  c42: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Newmark",             leasingBroker: "CBRE",                 discountRate: 8.5 },
  // New York / Downtown additions
  c43: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  c44: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 7.5 },
  c45: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Savills",             leasingBroker: "Newmark",              discountRate: 8.0 },
  // New York / Midtown additions
  c46: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Eastdil Secured",     leasingBroker: "JLL",                  discountRate: 8.5 },
  c47: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.0 },
  // Chicago / Loop additions
  c48: { sector: "Office", leaseType: "Modified gross",     recoveries: 15,   tenantRep: "CBRE",                leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  c49: { sector: "Office", leaseType: "Modified gross",     recoveries: 14,   tenantRep: "Avison Young",        leasingBroker: "JLL",                  discountRate: 7.5 },
  // San Francisco / Financial Dist additions
  c50: { sector: "Office", leaseType: "Modified gross",     recoveries: 20,   tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 8.0 },
  c51: { sector: "Office", leaseType: "Modified gross",     recoveries: 18,   tenantRep: "Cushman & Wakefield", leasingBroker: "Newmark",              discountRate: 8.0 },
  // Seattle / Downtown additions
  c52: { sector: "Office", leaseType: "Modified gross",     recoveries: 11,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 7.5 },
  c53: { sector: "Office", leaseType: "Modified gross",     recoveries: 12,   tenantRep: "JLL",                 leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  // Atlanta / Midtown additions
  c54: { sector: "Office", leaseType: "Triple net",         recoveries: 21,   tenantRep: "Newmark",             leasingBroker: "JLL",                  discountRate: 7.5 },
  c55: { sector: "Office", leaseType: "Triple net",         recoveries: 19,   tenantRep: "CBRE",                leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
  // Providence / Downtown additions
  c56: { sector: "Office", leaseType: "Modified gross",     recoveries: 8,    tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c57: { sector: "Office", leaseType: "Modified gross",     recoveries: 9,    tenantRep: "Cushman & Wakefield", leasingBroker: "Newmark",              discountRate: 7.5 },
  // Archived
  c58: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "JLL",                 leasingBroker: "Cushman & Wakefield",  discountRate: 8.0 },
  c60: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "Eastdil Secured",     leasingBroker: "Newmark",              discountRate: 9.0 },
  c64: { sector: "Office", leaseType: "Modified gross",     recoveries: 17,   tenantRep: "CBRE",                leasingBroker: "JLL",                  discountRate: 8.0 },
  c68: { sector: "Office", leaseType: "Triple net",         recoveries: 20,   tenantRep: "JLL",                 leasingBroker: "CBRE",                 discountRate: 7.5 },
  c70: { sector: "Office", leaseType: "Gross full service", recoveries: null, tenantRep: "CBRE",                leasingBroker: "Cushman & Wakefield",  discountRate: 7.5 },
}

function calcNer(c: Comp): number {
  const termYrs = c.term / 12
  return (c.rent * (c.term - c.freeRent) / 12 - c.ti) / termYrs
}

function calcNerDiscounted(c: Comp, discountRate: number): number {
  const ner = calcNer(c)
  const termYrs = c.term / 12
  const r = discountRate / 100
  const pvFactor = r > 0 ? (1 - Math.pow(1 + r, -termYrs)) / r / termYrs : 1
  return ner * pvFactor
}

// Bucket helpers — used for range filters
function sfBucket(sf: number) {
  if (sf < 5_000)  return "< 5,000 SF"
  if (sf < 10_000) return "5,000–10,000 SF"
  if (sf < 25_000) return "10,000–25,000 SF"
  if (sf < 50_000) return "25,000–50,000 SF"
  if (sf < 100_000) return "50,000–100,000 SF"
  return "100,000+ SF"
}

function termBucket(mo: number) {
  if (mo <= 36)  return "0–36 mo"
  if (mo <= 60)  return "37–60 mo"
  if (mo <= 84)  return "61–84 mo"
  if (mo <= 120) return "85–120 mo"
  return "120+ mo"
}

function rentBucket(r: number) {
  if (r < 80)  return "< $80"
  if (r < 100) return "$80–$100"
  if (r < 120) return "$100–$120"
  return "$120+"
}


type SortKey = keyof Pick<Comp, "label" | "tenant" | "currentAddress" | "citySubmarket" | "sf" | "term" | "rent" | "esca" | "ti" | "freeRent" | "lcd" | "executedDate" | "createdDate">
type ViewFilter = "active" | "archived" | "all"

interface ColDef {
  id: string
  label: string
  sortable: boolean
  right?: boolean
  defaultVisible: boolean
}

// ── Column definitions ────────────────────────────────────────────────────────

const ALL_COLUMNS: ColDef[] = [
  { id: "status",         label: "Status",              sortable: false, defaultVisible: true  },
  { id: "label",          label: "Label",               sortable: true,  defaultVisible: false },
  { id: "tenant",         label: "Tenant",              sortable: true,  defaultVisible: true  },
  { id: "currentAddress", label: "Building",            sortable: true,  defaultVisible: false },
  { id: "city",           label: "Market",              sortable: false, defaultVisible: true  },
  { id: "submarket",      label: "Submarket",           sortable: false, defaultVisible: true  },
  { id: "sector",         label: "Sector",              sortable: false, defaultVisible: true  },
  { id: "sf",             label: "SF",                  sortable: true,  right: true, defaultVisible: true  },
  { id: "rent",           label: "$/SF/yr",             sortable: true,  right: true, defaultVisible: true  },
  { id: "ner",            label: "NER/SF/yr",           sortable: false, right: true, defaultVisible: true  },
  { id: "freeRent",       label: "Free rent (mo.)",     sortable: true,  right: true, defaultVisible: true  },
  { id: "ti",             label: "TI & LLW/SF",         sortable: true,  right: true, defaultVisible: true  },
  { id: "lcd",            label: "LCD",                 sortable: true,  defaultVisible: false },
  { id: "executedDate",  label: "Executed",            sortable: true,  defaultVisible: true  },
  { id: "term",           label: "Lease term (mo.)",    sortable: true,  right: true, defaultVisible: true  },
  { id: "dealType",       label: "Deal type",           sortable: true,  defaultVisible: true  },
  { id: "leaseType",      label: "Lease type",          sortable: false, defaultVisible: true  },
  { id: "esca",           label: "Escalation %",        sortable: true,  defaultVisible: true  },
  { id: "recoveries",     label: "Recoveries/SF",       sortable: false, right: true, defaultVisible: true  },
  { id: "grossRent",      label: "Gross $/SF/yr",       sortable: false, right: true, defaultVisible: true  },
  { id: "tiPerYear",      label: "TI/yr",               sortable: false, right: true, defaultVisible: true  },
  { id: "tenantRep",      label: "Tenant rep",          sortable: false, defaultVisible: true  },
  { id: "leasingBroker",  label: "Leasing broker",      sortable: false, defaultVisible: true  },
  { id: "payback",        label: "Payback (yrs)",       sortable: false, right: true, defaultVisible: true  },
  { id: "discountRate",   label: "Discount rate",       sortable: false, right: true, defaultVisible: true  },
  { id: "nerDiscounted",  label: "NER/SF/yr (disc.)",   sortable: false, right: true, defaultVisible: true  },
  { id: "note",           label: "Note",                sortable: false, defaultVisible: true  },
  { id: "createdDate",    label: "Created date",        sortable: true,  defaultVisible: false },
  { id: "actions",        label: "",                    sortable: false, defaultVisible: true  },
]

// ── Mock data ─────────────────────────────────────────────────────────────────

export const COMPS: Comp[] = [
  // ── 2020 ─────────────────────────────────────────────────────────────────────
  { id: "c03", label: "Fidelity Boston",            tenant: "Fidelity Investments",    currentAddress: "One Federal St",             citySubmarket: "Boston / Financial Dist",        sf: 22000, term: 60,  rent: 85.00, esca: "CPI cap 3%",  ti: 155.00, freeRent:  7, lcd: "06/01/20", executedDate: "12/01/19", createdDate: "03/10/20", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c11", label: "JPMorgan downtown",          tenant: "JPMorgan Chase",          currentAddress: "383 Madison Ave",            citySubmarket: "New York / Downtown",            sf: 70000, term: 96,  rent: 74.00, esca: "CPI cap 3%",  ti: 138.00, freeRent:  9, lcd: "09/01/20", executedDate: "03/01/20", createdDate: "05/18/20", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c14", label: "United Airlines HQ",         tenant: "United Airlines",         currentAddress: "233 S Wacker Dr",            citySubmarket: "Chicago / Loop",                 sf: 62000, term: 120, rent: 66.00, esca: "3% fixed",    ti: 78.00,  freeRent:  9, lcd: "03/01/20", executedDate: "09/01/19", createdDate: "11/05/19", note: null,                   industry: "Transportation",      dealType: "Renewal",    archived: false },
  { id: "c18", label: "Salesforce SF",              tenant: "Salesforce Inc.",         currentAddress: "415 Mission St",             citySubmarket: "San Francisco / Financial Dist", sf: 75000, term: 132, rent: 100.00, esca: "3% fixed",   ti: 132.00, freeRent: 13, lcd: "07/01/20", executedDate: "01/01/20", createdDate: "03/22/20", note: null,                   industry: "Technology",          dealType: "Renewal",    archived: false },
  { id: "c22", label: "Amazon downtown",            tenant: "Amazon.com",              currentAddress: "410 Terry Ave N",            citySubmarket: "Seattle / Downtown",             sf: 80000, term: 120, rent: 62.00, esca: "3% fixed",    ti: 88.00,  freeRent: 11, lcd: "05/15/20", executedDate: "11/15/19", createdDate: "01/28/20", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "c26", label: "Delta Air Lines office",     tenant: "Delta Air Lines",         currentAddress: "1030 Delta Blvd",            citySubmarket: "Atlanta / Midtown",              sf: 44000, term: 84,  rent: 46.00, esca: "3% fixed",    ti: 48.00,  freeRent:  5, lcd: "04/01/20", executedDate: "10/01/19", createdDate: "12/10/19", note: null,                   industry: "Transportation",      dealType: "New deal",   archived: false },
  { id: "c30", label: "Fidelity Providence",        tenant: "Fidelity Investments",    currentAddress: "100 Westminster St",         citySubmarket: "Providence / Downtown",          sf: 22000, term: 60,  rent: 32.00, esca: "3% fixed",    ti: 36.00,  freeRent:  3, lcd: "08/01/20", executedDate: "02/01/20", createdDate: "04/15/20", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c34", label: "State Street renewal",       tenant: "State Street Corp",       currentAddress: "State Street Financial Ctr", citySubmarket: "Boston / Financial Dist",        sf: 34000, term: 96,  rent: 83.00, esca: "3% fixed",    ti: 148.00, freeRent:  8, lcd: "11/01/20", executedDate: "05/01/20", createdDate: "06/20/20", note: null,                   industry: "Financial services",  dealType: "Renewal",    archived: false },

  // ── 2021 ─────────────────────────────────────────────────────────────────────
  { id: "c02", label: "Sullivan & Cromwell",        tenant: "Sullivan & Cromwell LLP", currentAddress: "125 Broad St",               citySubmarket: "New York / Midtown",             sf: 38000, term: 84,  rent: 88.00, esca: "3% fixed",    ti: 165.00, freeRent:  9, lcd: "02/15/21", executedDate: "08/15/20", createdDate: "10/08/20", note: "Verified with broker", industry: "Legal",               dealType: "New deal",   archived: false },
  { id: "c15", label: "Salesforce Chicago",         tenant: "Salesforce Inc.",         currentAddress: "111 W Illinois St",          citySubmarket: "Chicago / Loop",                 sf: 45000, term: 96,  rent: 62.00, esca: "3% fixed",    ti: 68.00,  freeRent:  7, lcd: "05/01/21", executedDate: "11/01/20", createdDate: "01/12/21", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "c19", label: "Twitter/X sublease",         tenant: "Twitter/X",               currentAddress: "1355 Market St",             citySubmarket: "San Francisco / Financial Dist", sf: 42000, term: 60,  rent: 88.00, esca: null,           ti: 100.00, freeRent:  7, lcd: "08/01/21", executedDate: "02/01/21", createdDate: "04/20/21", note: "Needs confirmation",   industry: "Technology",          dealType: "Sublease",   archived: false },
  { id: "c23", label: "Boeing relocation",          tenant: "Boeing",                  currentAddress: "100 N Riverside",            citySubmarket: "Seattle / Downtown",             sf: 55000, term: 96,  rent: 58.00, esca: "3% fixed",    ti: 72.00,  freeRent:  7, lcd: "03/15/21", executedDate: "09/15/20", createdDate: "11/20/20", note: null,                   industry: "Aerospace",           dealType: "New deal",   archived: false },
  { id: "c27", label: "Cox Media Atlanta",          tenant: "Cox Enterprises",         currentAddress: "6205 Peachtree Dunwoody Rd", citySubmarket: "Atlanta / Midtown",              sf: 38000, term: 72,  rent: 42.00, esca: "3% fixed",    ti: 44.00,  freeRent:  4, lcd: "06/01/21", executedDate: "12/01/20", createdDate: "02/10/21", note: null,                   industry: "Media & entertainment", dealType: "Renewal",  archived: false },
  { id: "c31", label: "Textron renewal",            tenant: "Textron",                 currentAddress: "40 Westminster St",          citySubmarket: "Providence / Downtown",          sf: 18000, term: 72,  rent: 30.00, esca: "3% fixed",    ti: 32.00,  freeRent:  3, lcd: "09/01/21", executedDate: "03/01/21", createdDate: "05/05/21", note: null,                   industry: "Industrials",         dealType: "Renewal",    archived: false },
  { id: "c35", label: "Liberty Mutual expansion",   tenant: "Liberty Mutual",          currentAddress: "175 Berkeley St",            citySubmarket: "Boston / Financial Dist",        sf: 28000, term: 84,  rent: 86.00, esca: "3% fixed",    ti: 152.00, freeRent:  9, lcd: "04/15/21", executedDate: "10/15/20", createdDate: "12/18/20", note: null,                   industry: "Insurance",           dealType: "Expansion",  archived: false },
  { id: "c39", label: "Google Hudson Sq",           tenant: "Google LLC",              currentAddress: "550 Washington St",          citySubmarket: "New York / Hudson Sq",           sf: 62000, term: 144, rent: 92.00, esca: "3% fixed",    ti: 182.00, freeRent: 14, lcd: "11/01/21", executedDate: "05/01/21", createdDate: "07/08/21", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },

  // ── 2022 ─────────────────────────────────────────────────────────────────────
  { id: "c04", label: "Credit Suisse renewal",      tenant: "Credit Suisse",           currentAddress: "1221 Ave Americas",          citySubmarket: "New York / Midtown",             sf: 62000, term: 120, rent: 92.00, esca: "3% fixed",    ti: 182.00, freeRent: 12, lcd: "01/15/22", executedDate: "07/15/21", createdDate: "09/05/21", note: null,                   industry: "Financial services",  dealType: "Renewal",    archived: false },
  { id: "c16", label: "PwC expansion",              tenant: "PwC",                     currentAddress: "One North Wacker",           citySubmarket: "Chicago / Loop",                 sf: 38000, term: 84,  rent: 60.00, esca: "CPI cap 3%",  ti: 62.00,  freeRent:  6, lcd: "05/01/22", executedDate: "11/01/21", createdDate: "01/15/22", note: "Verified with broker",  industry: "Professional services", dealType: "Expansion", archived: false },
  { id: "c20", label: "Airbnb HQ renewal",          tenant: "Airbnb",                  currentAddress: "888 Brannan St",             citySubmarket: "San Francisco / Financial Dist", sf: 48000, term: 96,  rent: 95.00, esca: "3% fixed",    ti: 120.00, freeRent:  9, lcd: "08/15/22", executedDate: "02/15/22", createdDate: "04/28/22", note: null,                   industry: "Technology",          dealType: "Renewal",    archived: false },
  { id: "c24", label: "Microsoft Seattle office",   tenant: "Microsoft",               currentAddress: "320 Westlake Ave N",         citySubmarket: "Seattle / Downtown",             sf: 48000, term: 84,  rent: 60.00, esca: "CPI cap 3%",  ti: 76.00,  freeRent:  6, lcd: "03/01/22", executedDate: "09/01/21", createdDate: "10/20/21", note: "Verified with broker",  industry: "Technology",          dealType: "Expansion",  archived: false },
  { id: "c28", label: "Home Depot expansion",       tenant: "Home Depot",              currentAddress: "2455 Paces Ferry Rd",        citySubmarket: "Atlanta / Midtown",              sf: 52000, term: 96,  rent: 50.00, esca: "3% fixed",    ti: 52.00,  freeRent:  6, lcd: "06/01/22", executedDate: "12/01/21", createdDate: "02/14/22", note: "Comp list",            industry: "Retail",              dealType: "Expansion",  archived: false },
  { id: "c32", label: "CVS Health offices",         tenant: "CVS Health",              currentAddress: "1 CVS Dr",                   citySubmarket: "Providence / Downtown",          sf: 28000, term: 84,  rent: 35.00, esca: "3% fixed",    ti: 38.00,  freeRent:  4, lcd: "10/15/22", executedDate: "04/15/22", createdDate: "06/25/22", note: "Verified with broker",  industry: "Healthcare",          dealType: "Expansion",  archived: false },
  { id: "c36", label: "Wellington Management",      tenant: "Wellington Mgmt",         currentAddress: "280 Congress St",            citySubmarket: "Boston / Financial Dist",        sf: 42000, term: 120, rent: 88.00, esca: "CPI cap 3%",  ti: 158.00, freeRent: 11, lcd: "04/01/22", executedDate: "10/01/21", createdDate: "12/05/21", note: "Comp list",            industry: "Financial services",  dealType: "Renewal",    archived: false },
  { id: "c43", label: "HSBC Americas HQ",           tenant: "HSBC",                    currentAddress: "452 Fifth Ave",              citySubmarket: "New York / Downtown",            sf: 55000, term: 120, rent: 72.00, esca: "3% fixed",    ti: 140.00, freeRent: 11, lcd: "07/01/22", executedDate: "01/01/22", createdDate: "03/18/22", note: null,                   industry: "Financial services",  dealType: "Renewal",    archived: false },

  // ── 2023 ─────────────────────────────────────────────────────────────────────
  { id: "c05", label: "Davis Polk new deal",        tenant: "Davis Polk & Wardwell",   currentAddress: "450 Lexington Ave",          citySubmarket: "New York / Midtown",             sf: 55000, term: 132, rent: 96.00, esca: "3.5% fixed",  ti: 195.00, freeRent: 14, lcd: "02/01/23", executedDate: "08/01/22", createdDate: "10/10/22", note: "Comp list",            industry: "Legal",               dealType: "New deal",   archived: false },
  { id: "c17", label: "Citadel renewal",            tenant: "Citadel",                 currentAddress: "131 S Dearborn St",          citySubmarket: "Chicago / Loop",                 sf: 55000, term: 120, rent: 70.00, esca: "3.5% fixed",  ti: 84.00,  freeRent: 11, lcd: "06/15/23", executedDate: "12/15/22", createdDate: "02/22/23", note: null,                   industry: "Financial services",  dealType: "Renewal",    archived: false },
  { id: "c21", label: "Stripe expansion",           tenant: "Stripe",                  currentAddress: "510 Townsend St",            citySubmarket: "San Francisco / Financial Dist", sf: 35000, term: 84,  rent: 102.00, esca: "3.5% fixed", ti: 140.00, freeRent: 11, lcd: "09/01/23", executedDate: "03/01/23", createdDate: "05/10/23", note: "Comp list",            industry: "Technology",          dealType: "Expansion",  archived: false },
  { id: "c25", label: "Starbucks headquarters",     tenant: "Starbucks Corporation",   currentAddress: "2401 Utah Ave S",            citySubmarket: "Seattle / Downtown",             sf: 65000, term: 144, rent: 64.00, esca: "3.5% fixed",  ti: 92.00,  freeRent: 13, lcd: "04/01/23", executedDate: "10/01/22", createdDate: "12/05/22", note: null,                   industry: "Food & beverage",     dealType: "Renewal",    archived: false },
  { id: "c29", label: "NCR Corporation HQ",         tenant: "NCR Corporation",         currentAddress: "864 Spring St NW",           citySubmarket: "Atlanta / Midtown",              sf: 30000, term: 60,  rent: 44.00, esca: "CPI cap 3%",  ti: 42.00,  freeRent:  4, lcd: "07/15/23", executedDate: "01/15/23", createdDate: "03/20/23", note: null,                   industry: "Technology",          dealType: "Renewal",    archived: false },
  { id: "c33", label: "Brown University offices",   tenant: "Brown University",        currentAddress: "164 Angell St",              citySubmarket: "Providence / Downtown",          sf: 15000, term: 60,  rent: 30.00, esca: "CPI cap 2.5%", ti: 32.00,  freeRent:  3, lcd: "11/01/23", executedDate: "05/01/23", createdDate: "07/08/23", note: null,                   industry: "Education",           dealType: "New deal",   archived: false },
  { id: "c37", label: "Putnam Investments",         tenant: "Putnam Investments",      currentAddress: "100 Federal St",             citySubmarket: "Boston / Financial Dist",        sf: 18000, term: 72,  rent: 80.00, esca: "3% fixed",    ti: 142.00, freeRent:  7, lcd: "03/01/23", executedDate: "09/01/22", createdDate: "11/05/22", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c44", label: "American Express expansion", tenant: "American Express",        currentAddress: "200 Vesey St",               citySubmarket: "New York / Downtown",            sf: 42000, term: 96,  rent: 72.00, esca: "CPI cap 3%",  ti: 135.00, freeRent:  9, lcd: "08/01/23", executedDate: "02/01/23", createdDate: "04/15/23", note: null,                   industry: "Financial services",  dealType: "Expansion",  archived: false },

  // ── 2024 ─────────────────────────────────────────────────────────────────────
  { id: "c06", label: "Marsh McLennan sublease",    tenant: "Marsh & McLennan",        currentAddress: "1166 Ave Americas",          citySubmarket: "New York / Midtown",             sf: 30000, term: 96,  rent: 94.00, esca: null,           ti: 182.00, freeRent: 11, lcd: "01/15/24", executedDate: "07/15/23", createdDate: "09/12/23", note: null,                   industry: "Insurance",           dealType: "Sublease",   archived: false },
  { id: "c07", label: "KKR flagship",               tenant: "KKR & Co.",               currentAddress: "9 W 57th St",                citySubmarket: "New York / Hudson Yards",        sf: 80000, term: 144, rent: 112.00, esca: "3% fixed",   ti: 238.00, freeRent: 17, lcd: "05/01/24", executedDate: "11/01/23", createdDate: "01/08/24", note: null,                   industry: "Private equity",      dealType: "New deal",   archived: false },
  { id: "c40", label: "Meta NYC office",            tenant: "Meta Platforms",          currentAddress: "770 Broadway",               citySubmarket: "New York / Hudson Sq",           sf: 48000, term: 120, rent: 92.00, esca: "3% fixed",    ti: 178.00, freeRent: 12, lcd: "03/15/24", executedDate: "09/15/23", createdDate: "11/20/23", note: null,                   industry: "Technology",          dealType: "Expansion",  archived: false },
  { id: "c45", label: "LinkedIn NY offices",        tenant: "LinkedIn",                currentAddress: "222 W 39th St",              citySubmarket: "New York / Downtown",            sf: 30000, term: 84,  rent: 72.00, esca: "3% fixed",    ti: 132.00, freeRent:  8, lcd: "07/01/24", executedDate: "01/01/24", createdDate: "03/25/24", note: "Needs confirmation",   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "c46", label: "Skadden Arps flagship",      tenant: "Skadden Arps",            currentAddress: "One Manhattan West",         citySubmarket: "New York / Midtown",             sf: 70000, term: 132, rent: 100.00, esca: "3.5% fixed", ti: 205.00, freeRent: 15, lcd: "02/01/24", executedDate: "08/01/23", createdDate: "10/05/23", note: null,                   industry: "Legal",               dealType: "New deal",   archived: false },
  { id: "c48", label: "Accenture Chicago",          tenant: "Accenture",               currentAddress: "161 N Clark St",             citySubmarket: "Chicago / Loop",                 sf: 42000, term: 84,  rent: 66.00, esca: "3% fixed",    ti: 75.00,  freeRent:  8, lcd: "09/15/24", executedDate: "03/15/24", createdDate: "05/28/24", note: null,                   industry: "Professional services", dealType: "New deal",  archived: false },
  { id: "c50", label: "Dropbox SF office",          tenant: "Dropbox Inc.",            currentAddress: "333 Brannan St",             citySubmarket: "San Francisco / Financial Dist", sf: 30000, term: 72,  rent: 95.00, esca: "3% fixed",    ti: 115.00, freeRent:  8, lcd: "04/01/24", executedDate: "10/01/23", createdDate: "12/10/23", note: null,                   industry: "Technology",          dealType: "Sublease",   archived: false },
  { id: "c52", label: "Nordstrom headquarters",     tenant: "Nordstrom",               currentAddress: "1600 Seventh Ave",           citySubmarket: "Seattle / Downtown",             sf: 50000, term: 120, rent: 62.00, esca: "3% fixed",    ti: 82.00,  freeRent: 10, lcd: "06/01/24", executedDate: "12/01/23", createdDate: "02/12/24", note: null,                   industry: "Retail",              dealType: "Renewal",    archived: false },

  // ── 2025 ─────────────────────────────────────────────────────────────────────
  { id: "c08", label: "Warner Media relocation",    tenant: "Warner Media",            currentAddress: "30 Rockefeller Plaza",       citySubmarket: "New York / Hudson Yards",        sf: 48000, term: 120, rent: 110.00, esca: "3% fixed",   ti: 222.00, freeRent: 14, lcd: "02/15/25", executedDate: "08/15/24", createdDate: "10/18/24", note: null,                   industry: "Media & entertainment", dealType: "New deal", archived: false },
  { id: "c09", label: "Pfizer sublease",            tenant: "Pfizer Inc.",             currentAddress: "235 E 42nd St",              citySubmarket: "New York / Hudson Yards",        sf: 35000, term: 84,  rent: 106.00, esca: null,          ti: 212.00, freeRent: 13, lcd: "05/01/25", executedDate: "11/01/24", createdDate: "01/22/25", note: "Needs confirmation",   industry: "Pharmaceuticals",     dealType: "Sublease",   archived: false },
  { id: "c10", label: "BofA anchor renewal",        tenant: "Bank of America",         currentAddress: "One Bryant Park",            citySubmarket: "New York / Midtown",             sf: 95000, term: 120, rent: 101.00, esca: "3% fixed",   ti: 198.00, freeRent: 15, lcd: "08/01/25", executedDate: "02/01/25", createdDate: "04/05/25", note: null,                   industry: "Financial services",  dealType: "Renewal",    archived: false },
  { id: "c38", label: "Nuveen office",              tenant: "Nuveen",                  currentAddress: "Two International Place",    citySubmarket: "Boston / Financial Dist",        sf: 22000, term: 60,  rent: 80.00, esca: "3% fixed",    ti: 136.00, freeRent:  6, lcd: "03/15/25", executedDate: "09/15/24", createdDate: "11/25/24", note: "Verified with broker",  industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c41", label: "Spotify US HQ",              tenant: "Spotify",                 currentAddress: "4 World Trade Center",       citySubmarket: "New York / Hudson Sq",           sf: 35000, term: 96,  rent: 90.00, esca: "3.5% fixed",  ti: 172.00, freeRent: 10, lcd: "06/01/25", executedDate: "12/01/24", createdDate: "02/15/25", note: "Comp list",            industry: "Media & entertainment", dealType: "Renewal",  archived: false },
  { id: "c47", label: "Blackstone Midtown",         tenant: "Blackstone",              currentAddress: "345 Park Ave",               citySubmarket: "New York / Midtown",             sf: 58000, term: 120, rent: 105.00, esca: "3% fixed",   ti: 212.00, freeRent: 13, lcd: "10/01/25", executedDate: "04/01/25", createdDate: "06/05/25", note: "Comp list",            industry: "Private equity",      dealType: "Renewal",    archived: false },
  { id: "c49", label: "KPMG Chicago offices",       tenant: "KPMG",                    currentAddress: "200 E Randolph St",          citySubmarket: "Chicago / Loop",                 sf: 35000, term: 96,  rent: 65.00, esca: "CPI cap 3%",  ti: 70.00,  freeRent:  7, lcd: "04/15/25", executedDate: "10/15/24", createdDate: "12/20/24", note: null,                   industry: "Professional services", dealType: "Renewal",   archived: false },
  { id: "c51", label: "DocuSign SF headquarters",   tenant: "DocuSign",                currentAddress: "221 Main St",                citySubmarket: "San Francisco / Financial Dist", sf: 44000, term: 108, rent: 100.00, esca: "3.5% fixed", ti: 130.00, freeRent: 10, lcd: "07/01/25", executedDate: "01/01/25", createdDate: "03/12/25", note: "Verified with broker",  industry: "Technology",          dealType: "Renewal",    archived: false },

  // ── 2026 ─────────────────────────────────────────────────────────────────────
  { id: "c01", label: "Goldman Sachs expansion",    tenant: "Goldman Sachs",           currentAddress: "200 West St",                citySubmarket: "New York / Hudson Sq",           sf: 45000, term: 120, rent: 96.00, esca: "3% fixed",    ti: 185.00, freeRent: 12, lcd: "03/01/26", executedDate: "09/01/25", createdDate: "01/26/26", note: null,                   industry: "Financial services",  dealType: "Expansion",  archived: false },
  { id: "c42", label: "Disney NYC offices",         tenant: "Warner Media",            currentAddress: "77 West 66th St",            citySubmarket: "New York / Hudson Sq",           sf: 40000, term: 108, rent: 96.00, esca: "3% fixed",    ti: 188.00, freeRent: 12, lcd: "05/01/26", executedDate: "11/01/25", createdDate: "01/30/26", note: null,                   industry: "Media & entertainment", dealType: "New deal",  archived: false },
  { id: "c53", label: "Expedia Seattle office",     tenant: "Expeditors Intl",         currentAddress: "1111 Expedia Group Way W",   citySubmarket: "Seattle / Downtown",             sf: 38000, term: 84,  rent: 63.00, esca: "3% fixed",    ti: 76.00,  freeRent:  7, lcd: "02/15/26", executedDate: "08/15/25", createdDate: "10/22/25", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "c54", label: "Invesco Atlanta",            tenant: "Invesco",                 currentAddress: "1555 Peachtree St NE",       citySubmarket: "Atlanta / Midtown",              sf: 36000, term: 84,  rent: 54.00, esca: "3% fixed",    ti: 58.00,  freeRent:  6, lcd: "01/15/26", executedDate: "07/15/25", createdDate: "09/18/25", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "c55", label: "Equifax HQ renewal",         tenant: "Equifax",                 currentAddress: "1550 Peachtree St NW",       citySubmarket: "Atlanta / Midtown",              sf: 48000, term: 96,  rent: 58.00, esca: "3% fixed",    ti: 62.00,  freeRent:  7, lcd: "04/01/26", executedDate: "10/01/25", createdDate: "12/05/25", note: "Comp list",            industry: "Technology",          dealType: "Renewal",    archived: false },
  { id: "c56", label: "Amica Mutual offices",       tenant: "Liberty Mutual (Berk)",   currentAddress: "100 Amica Way",              citySubmarket: "Providence / Downtown",          sf: 20000, term: 72,  rent: 36.00, esca: "3% fixed",    ti: 40.00,  freeRent:  4, lcd: "03/15/26", executedDate: "09/15/25", createdDate: "11/18/25", note: null,                   industry: "Insurance",           dealType: "New deal",   archived: false },
  { id: "c57", label: "GTECH Providence",           tenant: "Wayfair Inc.",            currentAddress: "10 Memorial Blvd",           citySubmarket: "Providence / Downtown",          sf: 24000, term: 84,  rent: 38.00, esca: "3% fixed",    ti: 43.00,  freeRent:  5, lcd: "05/15/26", executedDate: "11/15/25", createdDate: "02/05/26", note: null,                   industry: "Technology",          dealType: "Expansion",  archived: false },

  // ── Archived (selective) ─────────────────────────────────────────────────────
  { id: "c12", label: "Deloitte 2020",              tenant: "Deloitte LLP",            currentAddress: "30 Rockefeller Plaza",       citySubmarket: "New York / Downtown",            sf: 52000, term: 84,  rent: 72.00, esca: "3% fixed",    ti: 132.00, freeRent:  8, lcd: "06/01/20", executedDate: "12/01/19", createdDate: "02/10/20", note: "Comp list",            industry: "Professional services", dealType: "Renewal",   archived: true },
  { id: "c13", label: "AIG sublease 2021",          tenant: "AIG",                     currentAddress: "175 Water St",               citySubmarket: "New York / Downtown",            sf: 28000, term: 60,  rent: 70.00, esca: null,           ti: 125.00, freeRent:  7, lcd: "09/01/21", executedDate: "03/01/21", createdDate: "05/12/21", note: null,                   industry: "Insurance",           dealType: "Sublease",  archived: true },
  { id: "c58", label: "Morgan Stanley 2022",        tenant: "Morgan Stanley",          currentAddress: "1585 Broadway",              citySubmarket: "New York / Midtown",             sf: 68000, term: 120, rent: 90.00, esca: "3% fixed",    ti: 180.00, freeRent: 13, lcd: "04/01/22", executedDate: "10/01/21", createdDate: "12/10/21", note: null,                   industry: "Financial services",  dealType: "Renewal",   archived: true },
  { id: "c60", label: "JPMorgan Hudson Yards 2023", tenant: "JPMorgan Chase",          currentAddress: "383 Madison Ave",            citySubmarket: "New York / Hudson Yards",        sf: 72000, term: 132, rent: 108.00, esca: "3.5% fixed", ti: 225.00, freeRent: 16, lcd: "03/01/23", executedDate: "09/01/22", createdDate: "11/20/22", note: "Comp list",            industry: "Financial services",  dealType: "New deal",  archived: true },
  { id: "c64", label: "Adobe SF 2021",              tenant: "Adobe Systems",           currentAddress: "601 Townsend St",            citySubmarket: "San Francisco / Financial Dist", sf: 38000, term: 96,  rent: 95.00, esca: "3% fixed",    ti: 125.00, freeRent: 10, lcd: "07/01/21", executedDate: "01/01/21", createdDate: "03/15/21", note: null,                   industry: "Technology",          dealType: "New deal",  archived: true },
  { id: "c68", label: "Delta Atlanta 2020",         tenant: "Delta Air Lines",         currentAddress: "1030 Delta Blvd",            citySubmarket: "Atlanta / Midtown",              sf: 40000, term: 96,  rent: 44.00, esca: "3% fixed",    ti: 46.00,  freeRent:  4, lcd: "05/01/20", executedDate: "11/01/19", createdDate: "01/08/20", note: null,                   industry: "Transportation",      dealType: "Renewal",   archived: true },
  { id: "c70", label: "Fidelity Boston 2021",       tenant: "Fidelity Investments",    currentAddress: "245 Summer St",              citySubmarket: "Boston / Financial Dist",        sf: 30000, term: 84,  rent: 80.00, esca: "3% fixed",    ti: 142.00, freeRent:  8, lcd: "08/01/21", executedDate: "02/01/21", createdDate: "04/20/21", note: null,                   industry: "Financial services",  dealType: "Renewal",   archived: true },

  // ── Not owned markets ─────────────────────────────────────────────────────────
  { id: "cx01", label: "AT&T Dallas HQ",             tenant: "AT&T Inc.",               currentAddress: "208 S Akard St",             citySubmarket: "Dallas / Uptown",                sf: 62000, term: 120, rent: 48.00, esca: "3% fixed",    ti: 68.00,  freeRent:  8, lcd: "04/01/21", executedDate: "10/01/20", createdDate: "12/10/20", note: null,                   industry: "Telecommunications",  dealType: "Renewal",    archived: false },
  { id: "cx02", label: "Goldman Dallas office",       tenant: "Goldman Sachs",           currentAddress: "2001 Ross Ave",              citySubmarket: "Dallas / Uptown",                sf: 45000, term: 96,  rent: 50.00, esca: "3% fixed",    ti: 72.00,  freeRent:  7, lcd: "09/01/22", executedDate: "03/01/22", createdDate: "05/15/22", note: "Verified with broker", industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "cx03", label: "JPMorgan Dallas expansion",   tenant: "JPMorgan Chase",          currentAddress: "2200 Ross Ave",              citySubmarket: "Dallas / Uptown",                sf: 38000, term: 84,  rent: 46.00, esca: "3% fixed",    ti: 62.00,  freeRent:  6, lcd: "03/15/24", executedDate: "09/15/23", createdDate: "11/20/23", note: null,                   industry: "Financial services",  dealType: "Expansion",  archived: false },
  { id: "cx04", label: "Booz Allen DC office",        tenant: "Booz Allen Hamilton",     currentAddress: "8283 Greensboro Dr",         citySubmarket: "Washington DC / Tysons",         sf: 55000, term: 120, rent: 56.00, esca: "CPI cap 3%",  ti: 82.00,  freeRent:  9, lcd: "06/01/21", executedDate: "12/01/20", createdDate: "02/08/21", note: null,                   industry: "Professional services", dealType: "Renewal",  archived: false },
  { id: "cx05", label: "Deloitte DC renewal",         tenant: "Deloitte LLP",            currentAddress: "1919 N Lynn St",             citySubmarket: "Washington DC / Crystal City",   sf: 48000, term: 108, rent: 58.00, esca: "3% fixed",    ti: 88.00,  freeRent: 10, lcd: "11/01/22", executedDate: "05/01/22", createdDate: "07/14/22", note: "Comp list",            industry: "Professional services", dealType: "Renewal",  archived: false },
  { id: "cx06", label: "Amazon DC hub",               tenant: "Amazon.com",              currentAddress: "2100 Crystal Dr",            citySubmarket: "Washington DC / Crystal City",   sf: 70000, term: 144, rent: 62.00, esca: "3.5% fixed",  ti: 98.00,  freeRent: 12, lcd: "05/01/24", executedDate: "11/01/23", createdDate: "01/22/24", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "cx07", label: "Netflix LA offices",          tenant: "Netflix Inc.",            currentAddress: "5808 Sunset Blvd",           citySubmarket: "Los Angeles / Hollywood",        sf: 42000, term: 96,  rent: 72.00, esca: "3% fixed",    ti: 105.00, freeRent:  9, lcd: "08/01/21", executedDate: "02/01/21", createdDate: "04/18/21", note: null,                   industry: "Media & entertainment", dealType: "New deal",  archived: false },
  { id: "cx08", label: "Apple LA office",             tenant: "Apple Inc.",              currentAddress: "8777 Washington Blvd",       citySubmarket: "Los Angeles / Culver City",      sf: 58000, term: 120, rent: 78.00, esca: "3% fixed",    ti: 120.00, freeRent: 11, lcd: "02/01/23", executedDate: "08/01/22", createdDate: "10/05/22", note: "Verified with broker", industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "cx09", label: "Sony Pictures renewal",       tenant: "Sony Pictures",           currentAddress: "10202 W Washington Blvd",    citySubmarket: "Los Angeles / Culver City",      sf: 65000, term: 132, rent: 76.00, esca: "3% fixed",    ti: 112.00, freeRent: 10, lcd: "07/01/25", executedDate: "01/01/25", createdDate: "03/28/25", note: null,                   industry: "Media & entertainment", dealType: "Renewal",   archived: false },
  { id: "cx10", label: "Citadel Miami office",        tenant: "Citadel",                 currentAddress: "701 Brickell Ave",           citySubmarket: "Miami / Brickell",               sf: 38000, term: 120, rent: 88.00, esca: "3.5% fixed",  ti: 145.00, freeRent: 12, lcd: "01/01/23", executedDate: "07/01/22", createdDate: "09/12/22", note: null,                   industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "cx11", label: "Blackstone Miami",            tenant: "Blackstone",              currentAddress: "1450 Brickell Ave",          citySubmarket: "Miami / Brickell",               sf: 28000, term: 96,  rent: 84.00, esca: "3% fixed",    ti: 132.00, freeRent: 10, lcd: "09/01/24", executedDate: "03/01/24", createdDate: "05/20/24", note: "Comp list",            industry: "Financial services",  dealType: "New deal",   archived: false },
  { id: "cx12", label: "Google Denver office",        tenant: "Google LLC",              currentAddress: "1600 Glenarm Pl",            citySubmarket: "Denver / CBD",                   sf: 32000, term: 84,  rent: 42.00, esca: "3% fixed",    ti: 58.00,  freeRent:  6, lcd: "04/01/22", executedDate: "10/01/21", createdDate: "12/15/21", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
  { id: "cx13", label: "Charles Schwab Denver HQ",    tenant: "Charles Schwab",          currentAddress: "215 Fremont St",             citySubmarket: "Denver / CBD",                   sf: 55000, term: 120, rent: 44.00, esca: "3% fixed",    ti: 62.00,  freeRent:  7, lcd: "06/01/23", executedDate: "12/01/22", createdDate: "02/10/23", note: "Verified with broker", industry: "Financial services",  dealType: "Renewal",    archived: false },
  { id: "cx14", label: "Palantir Denver office",      tenant: "Palantir Technologies",   currentAddress: "1555 Blake St",              citySubmarket: "Denver / CBD",                   sf: 25000, term: 84,  rent: 40.00, esca: "3% fixed",    ti: 52.00,  freeRent:  5, lcd: "10/01/25", executedDate: "04/01/25", createdDate: "06/18/25", note: null,                   industry: "Technology",          dealType: "New deal",   archived: false },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtRent(n: number) { return `$${n.toFixed(2)}` }
function fmtSf(n: number)   { return n.toLocaleString() }

// ── Column manager ────────────────────────────────────────────────────────────

function ColumnManager({
  columns, visible, order, onToggle, onReorder,
}: {
  columns: ColDef[]
  visible: Set<string>
  order: string[]
  onToggle: (id: string) => void
  onReorder: (next: string[]) => void
}) {
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [dragOver, setDragOver] = React.useState<string | null>(null)

  const colMap = Object.fromEntries(columns.map(c => [c.id, c]))
  const manageable = order.filter(id => colMap[id]?.label)

  function onDragStart(id: string) { setDragging(id) }
  function onDragEnd() { setDragging(null); setDragOver(null) }
  function onDropItem(targetId: string) {
    if (!dragging || dragging === targetId) return
    const next = [...order]
    const from = next.indexOf(dragging)
    const to   = next.indexOf(targetId)
    next.splice(from, 1)
    next.splice(to, 0, dragging)
    onReorder(next)
    setDragging(null); setDragOver(null)
  }

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-primary text-primary text-xs font-medium bg-transparent hover:bg-primary/10 transition-colors">
        <Settings2 className="h-3.5 w-3.5" />
        Columns
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <p className="text-xs font-medium text-muted-foreground px-2 pb-2">Drag to reorder</p>
        <div className="flex flex-col gap-0.5">
          {manageable.map(id => {
            const col = colMap[id]
            if (!col) return null
            const isVisible = visible.has(id)
            return (
              <div
                key={id}
                draggable
                onDragStart={() => onDragStart(id)}
                onDragEnd={onDragEnd}
                onDragOver={e => { e.preventDefault(); setDragOver(id) }}
                onDrop={() => onDropItem(id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing select-none",
                  dragOver === id && dragging !== id ? "bg-primary/10" : "hover:bg-muted/60"
                )}
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <span className="flex-1 text-sm text-foreground">{col.label}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => onToggle(id)}>
                  {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ── Static filter options (not market-scoped) ─────────────────────────────────

const SF_BUCKETS        = ["< 5,000 SF", "5,000–10,000 SF", "10,000–25,000 SF", "25,000–50,000 SF", "50,000–100,000 SF", "100,000+ SF"]
const ALL_LEASE_TYPES   = Array.from(new Set(Object.values(COMP_META).map(m => m.leaseType))).sort()
const ALL_DEAL_TYPES    = Array.from(new Set(COMPS.map(c => c.dealType))).sort()

// ── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE = 15

export function CompsPage({ cityFilter, ownedMarkets }: { cityFilter?: string[]; ownedMarkets?: string[] }) {
  const { sortKey, sortDir, handleSort: _handleSort } = useSortState<SortKey>("lcd")
  const [search, setSearch] = React.useState("")
  const [viewFilter, setViewFilter] = React.useState<ViewFilter>("active")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>(() => {
    if (!cityFilter?.length) return {}
    const allMarkets = Array.from(new Set(COMPS.map(c => c.citySubmarket.split(" / ")[0])))
    const matched = allMarkets.filter(m => cityFilter.some(f => m.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(m.toLowerCase())))
    return matched.length ? { _market: matched } : {} as Record<string, string[]>
  })
  const [page, setPage] = React.useState(1)
  const [chartView, setChartView] = React.useState<"year" | "market" | "submarket">("year")
  const [chartVisible, setChartVisible] = React.useState(true)

  function handleSort(key: SortKey) { _handleSort(key); setPage(1) }
  function onToggle(key: string, value: string) { setActiveFilters(prev => toggleFilterValue(prev, key, value)); setPage(1) }
  function onClear(key: string) { setActiveFilters(prev => clearFilterKey(prev, key)); setPage(1) }
  function onClearAll() { setActiveFilters({}); setPage(1) }
  function onSelectAll(key: string, values: string[]) { setActiveFilters(prev => ({ ...prev, [key]: values })); setPage(1) }

  // Reset filters and pre-select asset markets when the asset selection changes
  const prevCityFilter = React.useRef(cityFilter)
  if (prevCityFilter.current !== cityFilter) {
    prevCityFilter.current = cityFilter
    const allMarkets = Array.from(new Set(COMPS.map(c => c.citySubmarket.split(" / ")[0])))
    const matched = cityFilter?.length
      ? allMarkets.filter(m => cityFilter.some(f => m.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(m.toLowerCase())))
      : []
    setActiveFilters(matched.length ? { _market: matched } : {})
    setPage(1)
  }

  // Filter options scoped to asset-selector markets
  const scopedComps = React.useMemo(
    () => cityFilter?.length ? COMPS.filter(c => cityFilter.some(city => c.citySubmarket.toLowerCase().includes(city.toLowerCase()))) : COMPS,
    [cityFilter]
  )
  const FILTER_DEFS = React.useMemo(() => {
    const selectedMarkets = activeFilters["_market"] ?? []
    const marketFilteredComps = selectedMarkets.length
      ? scopedComps.filter(c => selectedMarkets.includes(c.citySubmarket.split(" / ")[0] ?? c.citySubmarket))
      : scopedComps
    return [
    { key: "_market",    label: "Market",     options: (() => {
      const allMarkets = Array.from(new Set(COMPS.map(c => c.citySubmarket.split(" / ")[0]))).sort()
      const assetMarkets = cityFilter?.length
        ? allMarkets.filter(m => cityFilter.some(f => m.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(m.toLowerCase())))
        : []
      if (!assetMarkets.length) return allMarkets.map(v => ({ label: ownedMarkets?.includes(v) ? v : `${v} (Not owned)`, value: v }))
      const other = allMarkets.filter(m => !assetMarkets.includes(m))
      return [
        ...assetMarkets.map(v => ({ label: v, value: v, group: "This asset" })),
        ...other.map(v => ({ label: ownedMarkets?.includes(v) ? v : `${v} (Not owned)`, value: v, group: "Other markets" })),
      ]
    })() },
    { key: "_submarket", label: "Submarket",  options: Array.from(new Set(marketFilteredComps.map(c => c.citySubmarket.split(" / ")[1]).filter(Boolean))).sort().map(v => ({ label: v, value: v })) },
    { key: "_sfBucket",  label: "SF",         options: SF_BUCKETS.map(v => ({ label: v, value: v })) },
    { key: "_lcdYear",   label: "Executed year", options: Array.from(new Set(COMPS.map(c => `20${c.executedDate.slice(-2)}`))).sort().map(v => ({ label: v, value: v })) },
    { key: "dealType",   label: "Deal type",  options: ALL_DEAL_TYPES.map(v => ({ label: v, value: v })) },
    { key: "_leaseType", label: "Lease type", options: ALL_LEASE_TYPES.map(v => ({ label: v, value: v })) },
  ]}, [scopedComps, activeFilters, ownedMarkets, cityFilter])

  const [visible, setVisible] = React.useState<Set<string>>(
    () => new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.id))
  )
  const [colOrder, setColOrder] = React.useState<string[]>(ALL_COLUMNS.map(c => c.id))

  function toggleCol(id: string) {
    setVisible(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const orderedCols = colOrder
    .map(id => ALL_COLUMNS.find(c => c.id === id))
    .filter((c): c is ColDef => !!c && (c.id === "actions" || visible.has(c.id)))

  const filtered = React.useMemo(() => {
    let r = [...COMPS]
    if (viewFilter === "active")   r = r.filter(c => !c.archived)
    if (viewFilter === "archived") r = r.filter(c => c.archived)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(c =>
        c.label.toLowerCase().includes(q) ||
        c.tenant.toLowerCase().includes(q) ||
        c.currentAddress.toLowerCase().includes(q) ||
        c.citySubmarket.toLowerCase().includes(q)
      )
    }
    for (const [key, values] of Object.entries(activeFilters)) {
      if (!values.length) continue
      if (key === "_market")     { r = r.filter(c => values.includes(c.citySubmarket.split(" / ")[0] ?? c.citySubmarket)); continue }
      if (key === "_submarket")  { r = r.filter(c => values.includes(c.citySubmarket.split(" / ")[1] ?? c.citySubmarket)); continue }
      if (key === "_sfBucket")   { r = r.filter(c => values.includes(sfBucket(c.sf)));     continue }
      if (key === "_termBucket") { r = r.filter(c => values.includes(termBucket(c.term))); continue }
      if (key === "_rentBucket") { r = r.filter(c => values.includes(rentBucket(c.rent))); continue }
      if (key === "_lcdYear")    { r = r.filter(c => values.includes(`20${c.executedDate.slice(-2)}`)); continue }
      if (key === "_leaseType")  { r = r.filter(c => values.includes(COMP_META[c.id]?.leaseType ?? "")); continue }
      r = r.filter(c => values.includes(String(c[key as keyof Comp] ?? "")))
    }
    r.sort((a, b) => {
      const av = a[sortKey] ?? ""
      const bv = b[sortKey] ?? ""
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
    return r
  }, [search, viewFilter, activeFilters, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allOnPage = paginated.length > 0 && paginated.every(c => selected.has(c.id))
  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev)
      if (allOnPage) paginated.forEach(c => next.delete(c.id))
      else paginated.forEach(c => next.add(c.id))
      return next
    })
  }
  function toggleRow(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  // KPIs and chart derive from the same filtered set as the table
  const base          = filtered
  const totalSf       = React.useMemo(() => base.reduce((s, c) => s + c.sf, 0), [base])
  const avgRent       = React.useMemo(() => totalSf > 0 ? base.reduce((s, c) => s + c.rent * c.sf, 0) / totalSf : 0, [base, totalSf])
  const avgTi         = React.useMemo(() => totalSf > 0 ? base.reduce((s, c) => s + c.ti   * c.sf, 0) / totalSf : 0, [base, totalSf])
  const avgNer        = React.useMemo(() => base.length > 0 ? base.reduce((s, c) => s + calcNer(c), 0) / base.length : 0, [base])
  const avgTerm       = React.useMemo(() => base.length > 0 ? base.reduce((s, c) => s + c.term, 0) / base.length : 0, [base])
  const avgFreeRent   = React.useMemo(() => base.length > 0 ? base.reduce((s, c) => s + c.freeRent, 0) / base.length : 0, [base])


  // Chart data — group by year, market, or submarket based on toggle
  const chartGroups = React.useMemo(() => {
    const map = new Map<string, Comp[]>()
    filtered.forEach(c => {
      const key = chartView === "year"
        ? `20${c.executedDate.slice(-2)}`
        : chartView === "market"
          ? (c.citySubmarket.split(" / ")[0] ?? c.citySubmarket)
          : (c.citySubmarket.split(" / ")[1] ?? c.citySubmarket)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(c)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, comps]) => {
        const sf = comps.reduce((s, c) => s + c.sf, 0)
        return {
          label,
          count: comps.length,
          rent:  sf > 0 ? comps.reduce((s, c) => s + c.rent * c.sf, 0) / sf : 0,
          ner:   comps.reduce((s, c) => s + calcNer(c), 0) / comps.length,
          ti:    sf > 0 ? comps.reduce((s, c) => s + c.ti * c.sf, 0) / sf : 0,
        }
      })
  }, [filtered, chartView])

  const VIEW_LABELS: Record<ViewFilter, string> = {
    active:   "Active comps",
    archived: "Archived comps",
    all:      "All comps",
  }

  function renderCell(col: ColDef, c: Comp) {
    switch (col.id) {
      case "status": return (
        <TableCell key={col.id} className="py-3 whitespace-nowrap">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            c.archived ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"
          )}>
            {c.archived ? "Archived" : "Active"}
          </span>
        </TableCell>
      )
      case "label":          return <TableCell key={col.id} className="py-3 text-sm text-foreground whitespace-nowrap">{c.label || <span className="text-muted-foreground/40">—</span>}</TableCell>
      case "tenant":         return (
        <TableCell key={col.id} className="py-3 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <TenantAvatar name={c.tenant} />
            <span className="text-sm text-muted-foreground">{c.tenant}</span>
          </div>
        </TableCell>
      )
      case "currentAddress": return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.currentAddress || <span className="text-muted-foreground/40">—</span>}</TableCell>
      case "city": {
        const city = c.citySubmarket.split(" / ")[0] ?? c.citySubmarket
        const notOwned = ownedMarkets?.length && !ownedMarkets.includes(city)
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">
          {city ? <>{city}{notOwned && <span className="text-muted-foreground/50"> (Not owned)</span>}</> : <span className="text-muted-foreground/40">—</span>}
        </TableCell>
      }
      case "submarket": {
        const submarket = c.citySubmarket.split(" / ")[1] ?? ""
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{submarket || <span className="text-muted-foreground/40">—</span>}</TableCell>
      }
      case "sf":             return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtSf(c.sf)}</TableCell>
      case "term":           return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{c.term}</TableCell>
      case "rent":           return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(c.rent)}</TableCell>
      case "esca":           return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.esca ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      case "ti":             return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(c.ti)}</TableCell>
      case "freeRent":       return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{c.freeRent}</TableCell>
      case "lcd":            return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.lcd}</TableCell>
      case "executedDate":   return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.executedDate}</TableCell>
      case "createdDate":    return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.createdDate}</TableCell>
      case "note":           return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap max-w-48 truncate">{c.note ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      case "dealType":       return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{c.dealType}</TableCell>
      case "sector": {
        const meta = COMP_META[c.id]
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{meta?.sector ?? "Office"}</TableCell>
      }
      case "leaseType": {
        const meta = COMP_META[c.id]
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{meta?.leaseType ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      }
      case "recoveries": {
        const meta = COMP_META[c.id]
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{meta?.recoveries != null ? fmtRent(meta.recoveries) : <span className="text-muted-foreground/40">—</span>}</TableCell>
      }
      case "grossRent": {
        const meta = COMP_META[c.id]
        const gross = c.rent + (meta?.recoveries ?? 0)
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(gross)}</TableCell>
      }
      case "tiPerYear": {
        const termYrs = c.term / 12
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(c.ti / termYrs)}</TableCell>
      }
      case "tenantRep": {
        const meta = COMP_META[c.id]
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{meta?.tenantRep ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      }
      case "leasingBroker": {
        const meta = COMP_META[c.id]
        return <TableCell key={col.id} className="py-3 text-sm text-muted-foreground whitespace-nowrap">{meta?.leasingBroker ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      }
      case "payback": {
        const payback = c.ti / c.rent
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{payback.toFixed(1)}</TableCell>
      }
      case "ner": {
        const ner = calcNer(c)
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(ner)}</TableCell>
      }
      case "discountRate": {
        const meta = COMP_META[c.id]
        const dr = meta?.discountRate ?? 8.0
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{dr.toFixed(1)}%</TableCell>
      }
      case "nerDiscounted": {
        const meta = COMP_META[c.id]
        const dr = meta?.discountRate ?? 8.0
        const nerD = calcNerDiscounted(c, dr)
        return <TableCell key={col.id} className="py-3 text-right tabular-nums text-sm text-muted-foreground whitespace-nowrap">{fmtRent(nerD)}</TableCell>
      }
      case "actions": return (
        <TableCell key={col.id} className="py-3 pl-1 sticky right-0 bg-card [box-shadow:-1px_0_0_0_color-mix(in_oklab,var(--color-border)_40%,transparent)]">
          <div className="flex items-center gap-1">
            <AgentBtn entity="Comp" label={`${c.label || "Unlabeled"} · ${c.tenant} · ${fmtSf(c.sf)} sf · rent ${fmtRent(c.rent)} · TI ${fmtRent(c.ti)} · LCD ${c.lcd}`} />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button>} />
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem>{c.archived ? "Unarchive" : "Archive"}</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      )
      default: return null
    }
  }


  return (
    <div className="space-y-4">
      {/* Filter bar above KPIs */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium">{VIEW_LABELS[viewFilter]}<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></Button>} />
          <DropdownMenuContent align="start" className="w-44">
            {(["active", "archived", "all"] as ViewFilter[]).map(v => (
              <DropdownMenuItem key={v} onClick={() => { setViewFilter(v); setPage(1) }}
                className="flex items-center justify-between">
                {VIEW_LABELS[v]}
                {viewFilter === v && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop filters */}
        <FilterBar
          filters={FILTER_DEFS}
          active={activeFilters}
          onToggle={onToggle}
          onClear={onClear}
          onClearAll={onClearAll}
          onSelectAll={onSelectAll}
          visibleCount={6}
          className="hidden md:flex"
        />

        {/* Mobile filters */}
        <div className="md:hidden">
          <MobileFilterSheet
            filters={FILTER_DEFS}
            active={activeFilters}
            onToggle={onToggle}
            onClear={onClear}
            onClearAll={onClearAll}
            onSelectAll={onSelectAll}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium"
            onClick={() => setChartVisible(v => !v)}>
            {chartVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {chartVisible ? "Hide chart" : "Show chart"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium" />}>
              <Download className="h-3.5 w-3.5" />
              Export
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="gap-2 text-sm">
                <FileType2 className="h-3.5 w-3.5" />Download as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-sm">
                <FileSpreadsheet className="h-3.5 w-3.5" />Download as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 gap-1.5 text-sm font-medium">
            <Plus className="h-3.5 w-3.5" />
            Add comp
          </Button>
        </div>
      </div>

      {/* Analytics KPIs */}
      <KpiBar kpis={[
        { label: "Comps",              value: String(filtered.length) },
        { label: "Avg $/SF/yr",        value: `$${avgRent.toFixed(2)}` },
        { label: "Avg NER/SF/yr",      value: `$${avgNer.toFixed(2)}` },
        { label: "Avg TI/SF",          value: `$${avgTi.toFixed(2)}` },
        { label: "Avg term (mo)",      value: avgTerm.toFixed(1) },
        { label: "Avg free rent (mo)", value: avgFreeRent.toFixed(1) },
      ]} />

      {/* Chart card */}
      <div className={cn("grid transition-all duration-300 ease-in-out", chartVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
      <div className="overflow-hidden">
      <div className={cn(cardBase, "min-w-0 mb-0")}>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Comps</p>
            <h2 className="text-xl font-semibold text-foreground">
              {chartView === "year" ? "By commencement year" : chartView === "market" ? "By market" : "By submarket"}
            </h2>
          </div>
          <ToggleGroup type="single" value={chartView}
            onValueChange={v => { if (v) setChartView(v as "year" | "market" | "submarket") }}
            className={FILTER_TAB_GROUP_CLS}>
            <ToggleGroupItem value="year" size="sm" className={FILTER_TAB_ITEM_CLS}>Year</ToggleGroupItem>
            <ToggleGroupItem value="market" size="sm" className={FILTER_TAB_ITEM_CLS}>Market</ToggleGroupItem>
            <ToggleGroupItem value="submarket" size="sm" className={FILTER_TAB_ITEM_CLS}>Submarket</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ResponsiveContainer width="100%" height={200} className="[&>svg]:overflow-visible">
          <ComposedChart data={chartGroups} margin={{ top: 48, right: 40, left: 4, bottom: 4 }} barCategoryGap="35%">
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tick={(props: unknown) => {
                const { x, y, payload } = props as { x: number; y: number; payload: { value: string } }
                const entry = chartGroups.find(g => g.label === payload.value)
                return (
                  <g>
                    <text x={x} y={y + 10} textAnchor="middle" fontSize={11} fill="var(--color-muted-foreground)">{payload.value}</text>
                    <text x={x} y={y + 22} textAnchor="middle" fontSize={10} fill="var(--color-muted-foreground)" opacity={0.7}>({entry?.count ?? ""})</text>
                  </g>
                )
              }}
              height={36}
              axisLine={false} tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={v => `$${v}`}
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false} tickLine={false} width={46}
            />
            <YAxis
              yAxisId="right" orientation="right"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false} tickLine={false} width={28}
            />
            <Tooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const entry = chartGroups.find(g => g.label === label)
                const order = ["$/SF/yr", "NER/SF/yr", "TI/SF"]
                const sorted = [...payload].filter(e => e.name !== "Count").sort((a, b) => order.indexOf(a.name as string) - order.indexOf(b.name as string))
                return (
                  <div style={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12, color: "var(--color-popover-foreground)", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", padding: "10px 14px" }}>
                    <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}{entry ? ` (${entry.count})` : ""}</p>
                    {sorted.map(e => (
                      <p key={e.name as string} style={{ color: e.color, margin: "2px 0" }}>
                        {e.name} : ${Number(e.value).toFixed(2)}
                      </p>
                    ))}
                  </div>
                )
              }}
            />
            <Bar yAxisId="right" dataKey="count" name="Count"
              fill="var(--color-muted-foreground)" fillOpacity={0.25} radius={[4, 4, 0, 0]} maxBarSize={72} minPointSize={6} />
            <Line yAxisId="left" type="monotone" dataKey="rent" name="$/SF/yr"
              stroke="var(--color-chart-1)" strokeWidth={2.5}
              dot={{ r: 5, fill: "var(--color-chart-1)", stroke: "var(--color-card)", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}>
              <LabelList dataKey="rent" position="top" formatter={(v: unknown) => `$${Number(v).toFixed(0)}`}
                content={(props: unknown) => {
                  const { x, y, value } = props as { x: number; y: number; value: number }
                  const text = `$${Number(value).toFixed(0)}`
                  return <g><rect x={x - 18} y={y - 22} width={36} height={16} rx={3} fill="var(--color-card)" opacity={0.85} /><text x={x} y={y - 10} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-chart-1)">{text}</text></g>
                }} />
            </Line>
            <Line yAxisId="left" type="monotone" dataKey="ner" name="NER/SF/yr"
              stroke="var(--color-chart-3)" strokeWidth={2.5}
              dot={{ r: 5, fill: "var(--color-chart-3)", stroke: "var(--color-card)", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}>
              <LabelList dataKey="ner" position="bottom" formatter={(v: unknown) => `$${Number(v).toFixed(0)}`}
                content={(props: unknown) => {
                  const { x, y, value } = props as { x: number; y: number; value: number }
                  const text = `$${Number(value).toFixed(0)}`
                  return <g><rect x={x - 18} y={y + 8} width={36} height={16} rx={3} fill="var(--color-card)" opacity={0.85} /><text x={x} y={y + 20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-chart-3)">{text}</text></g>
                }} />
            </Line>
            <Line yAxisId="left" type="monotone" dataKey="ti" name="TI/SF"
              stroke="var(--color-chart-2)" strokeWidth={2.5}
              dot={{ r: 5, fill: "var(--color-chart-2)", stroke: "var(--color-card)", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}>
              <LabelList dataKey="ti" position="top" formatter={(v: unknown) => `$${Number(v).toFixed(0)}`}
                content={(props: unknown) => {
                  const { x, y, value } = props as { x: number; y: number; value: number }
                  const text = `$${Number(value).toFixed(0)}`
                  return <g><rect x={x - 18} y={y - 40} width={36} height={16} rx={3} fill="var(--color-card)" opacity={0.85} /><text x={x} y={y - 28} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-chart-2)">{text}</text></g>
                }} />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-muted-foreground/35" />
            <span className="text-sm text-muted-foreground">Count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full shrink-0 bg-[var(--color-chart-1)]" />
            <span className="text-sm text-muted-foreground">$/SF/yr</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full shrink-0 bg-[var(--color-chart-3)]" />
            <span className="text-sm text-muted-foreground">NER/SF/yr</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full shrink-0 bg-[var(--color-chart-2)]" />
            <span className="text-sm text-muted-foreground">TI/SF</span>
          </div>
        </div>
      </div>
      </div>
      </div>

      <div className={cardBase}>
        {/* Toolbar */}
        <div className={cn("flex flex-wrap items-center gap-2 mb-4", selected.size > 0 && "hidden")}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search comps..."
              className="pl-8 h-8 text-sm w-44"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ColumnManager
              columns={ALL_COLUMNS}
              visible={visible}
              order={colOrder}
              onToggle={toggleCol}
              onReorder={setColOrder}
            />
          </div>
        </div>

        {/* Selection bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-sm font-medium" onClick={() => setSelected(new Set())}>
              <span>{selected.size} selected</span>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">Archive</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">Duplicate</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" disabled>Edit</Button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="border-b-2 border-border/60 hover:bg-transparent">
                <th className="pb-2 pt-0 w-8 pr-2 text-left">
                  <Checkbox checked={allOnPage} onCheckedChange={toggleAll} className="h-3.5 w-3.5" />
                </th>
                {orderedCols.map(col => col.id === "actions" ? (
                  <th key="actions" className="pb-2 pt-0 w-8 sticky right-0 bg-card [box-shadow:-1px_0_0_0_color-mix(in_oklab,var(--color-border)_40%,transparent)]" />
                ) : (!col.sortable) ? (
                  <TableHead key={col.id} className={cn("pb-2 pt-0 text-[10px] font-medium uppercase tracking-widest text-foreground/50 whitespace-nowrap", col.right ? "text-right" : "text-left")}>{col.label}</TableHead>
                ) : (
                  <SortableHead
                    key={col.id}
                    col={col.sortable ? col.id as SortKey : null}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                    right={col.right}
                  >
                    {col.label}
                  </SortableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={orderedCols.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                    No comps match your filters.
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((c, i) => (
                <TableRow
                  key={c.id}
                  className={cn(
                    "transition-colors hover:bg-muted/40",
                    i > 0 ? "border-t border-border/40" : "border-0",
                    selected.has(c.id) && "bg-primary/5"
                  )}
                >
                  <td className="py-3 pr-2 w-8">
                    <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleRow(c.id)} className="h-3.5 w-3.5" />
                  </td>
                  {orderedCols.map(col => renderCell(col, c))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
          <span className="text-xs text-muted-foreground">
            {filtered.length === 0 ? "0 comps" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
