import * as React from "react"
import { AppNav } from "@/components/app-nav"
import { BuildingHeader } from "@/components/building-header"
import { AvailabilityOverview } from "@/components/availability-overview"
import type { VacantSpace } from "@/components/availability-overview"
import { LeasingActivity } from "@/components/leasing-activity"
import { CriticalDates } from "@/components/critical-dates"
import type { CriticalDate } from "@/components/critical-dates"
import { FinancialPerformance } from "@/components/financial-performance"
import { ActionLevers } from "@/components/action-levers"
import { DealActions } from "@/components/deal-actions"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { KpiBar } from "@/components/kpi-bar"
import { AgentsPage } from "@/components/agents-page"
import { DealsPage, DEALS, CardManager } from "@/components/deals-page"
import type { Deal as DealsPageDeal } from "@/components/deals-page"
import { DealProfile, TenantLogoImage, getDealHealth, type DealStatus } from "@/components/deal-profile"
import { ThemeShowcase } from "@/components/theme-showcase"
import { AgentPrinciples } from "@/components/agent-principles"
import { StackingPlan, type StackingPlanSpaceRef, type StackingPlanHandle, type StackingPlanCommand } from "@/components/stacking-plan"
import { SpacesPage, type Space as SpacesPageSpace } from "@/components/spaces-page"
import { SpaceDetailPage, SpaceStatusBadge, type SpaceRef, type SpaceStatus } from "@/components/space-detail-page"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { LeasesPage, LEASES, type Lease } from "@/components/leases-page"
import { LeaseDetailPage, LeaseStatusBadge, type LeaseStatus } from "@/components/lease-detail-page"
import { EmailFlow } from "@/components/email-flow"
import { AskVTSPage } from "@/components/ask-vts"
import { DocumentAgentPage } from "@/components/document-agent-page"
import { ProposalBuilderPage } from "@/components/proposal-builder-page"
import { DealStewardPage } from "@/components/deal-steward-page"
import { AmPipelineEmailPage, BrokerActionEmailPage, TenantFollowupEmailPage, LawyerLeaseEmailPage, OwnerUpdateEmailPage } from "@/components/deal-steward-emails"
import { OptionsRightsPage } from "@/components/options-rights-page"
import { CriticalDatesPage } from "@/components/critical-dates-page"
import { BudgetsPage } from "@/components/budgets-page"
import { AppraisalsPage } from "@/components/appraisals-page"
import { CompsPage } from "@/components/comps-page"
import { PlanningPage } from "@/components/planning-page"
import { DealTasksPage } from "@/components/deal-tasks-page"
import { ChatPatternProvider, type ChatCommand } from "@/contexts/chat-pattern"
import { ChatSideOver } from "@/components/chat-side-over"
import { ChatSidePush, SIDE_PUSH_WIDTH } from "@/components/chat-side-push"
import { useChatPattern } from "@/contexts/chat-pattern"

const STACKING_COMMANDS: ChatCommand[] = [
  { label: "Fast-forward 18 months", reply: "Showing the stacking plan 18 months from now. Several leases expire in this window.", cmd: { type: "setSliderMonths", months: 18 } },
  { label: "Show 2028 expirations", reply: "Filtered to spaces expiring in 2028. Three tenants are in their renewal windows.", cmd: { type: "replaceFilters", filters: { expBucket: ["2028"] } } },
  { label: "Show vacant spaces", reply: "Filtered to all currently vacant spaces across the building.", cmd: { type: "replaceFilters", filters: { occupancy: ["vacant"] } } },
  { label: "Show near-term renewal risks", reply: "Filtered to leases expiring in 2027 and 2028. Five tenants are within their renewal windows — I'd recommend initiating outreach for Pacific Wealth, Meridian Health, and Carlyle first given their encumbrance positions.", cmd: { type: "replaceFilters", filters: { expBucket: ["2027", "2028"] } } },
]

// Maps stacking-plan display names → standardized LEASES tenant names
const TENANT_ALIAS: Record<string, string> = {
  "Blackstone Group":         "Blackstone Inc.",
  "Vantage Point Capital":    "Vantage Point Capital LP",
  "Amazon MGM Studios":       "Amazon.com Inc.",
  "Sullivan & Cromwell":      "Sullivan & Cromwell LLP",
  "Pacific Wealth Mngt.":     "Pacific Wealth Management LLC",
  "Meridian Health Partners": "Meridian Health Partners Inc.",
  "Carlyle & Associates":     "The Carlyle Group Inc.",
  "CVS Health":               "CVS Health Corporation",
}
function findLease(tenant: string, assetName?: string) {
  const key = TENANT_ALIAS[tenant] ?? tenant
  if (assetName) return LEASES.find(x => x.tenant === key && x.asset === assetName) ?? LEASES.find(x => x.tenant === key)
  return LEASES.find(x => x.tenant === key)
}

function AgentsViewAwareNav(props: React.ComponentProps<typeof AppNav>) {
  const { agentsView } = useChatPattern()
  return <AppNav {...props} hideAgentsPage={agentsView === "ask-vts"} />
}

function SidePushMain({ children, navCollapsed }: { children: React.ReactNode; navCollapsed: boolean }) {
  const { sidePushOpen } = useChatPattern()
  return (
    <main
      className={cn(
        "transition-all duration-300 ease-in-out pr-4 pb-4 overflow-x-hidden flex-1 flex flex-col overflow-y-auto",
        "pt-[72px] pl-4",
        navCollapsed ? "md:pt-4 md:pl-[104px]" : "md:pt-4 md:pl-[264px]"
      )}
      style={sidePushOpen ? { paddingRight: SIDE_PUSH_WIDTH + 16 } : undefined}
    >
      {children}
    </main>
  )
}
import { cn, cardBase } from "@/lib/utils"
import { type LucideIcon, UserCircle, BellRing, Activity, Plus, Pencil, Trash2, Bookmark, ChevronDownIcon, Sparkles, AlertTriangle, Clock, Download, Share2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import buildingImg from "@/assets/building.jpg"

// ── Overview view switcher ─────────────────────────────────────────────────────

type OverviewCardId = "kpis" | "availability" | "financial" | "leasing" | "deal-actions" | "critical-dates" | "action-levers" | "asset-valuation" | "leasing-strategy"

interface OverviewView {
  id: string
  name: string
  cards: OverviewCardId[]
  isDefault: boolean
  builtIn?: boolean
}

const OVERVIEW_CARD_DEFS: { id: OverviewCardId; label: string; span: 1 | 2 | 3 }[] = [
  { id: "kpis",            label: "KPIs",                span: 3 },
  { id: "availability",    label: "Availability",        span: 1 },
  { id: "financial",       label: "Financial performance", span: 2 },
  { id: "leasing",         label: "Leasing activity",    span: 2 },
  { id: "deal-actions",    label: "Deal actions",         span: 1 },
  { id: "critical-dates",  label: "Critical dates",       span: 2 },
  { id: "action-levers",   label: "Action levers",        span: 1 },
]

const BUILT_IN_VIEWS: OverviewView[] = [
  { id: "view-full",      name: "Full overview",    cards: ["kpis","availability","financial","leasing","deal-actions","critical-dates","action-levers"], isDefault: true,  builtIn: true },
  { id: "view-leasing",   name: "Leasing focus",    cards: ["kpis","availability","leasing","deal-actions"],                                             isDefault: false, builtIn: true },
  { id: "view-financial", name: "Financial focus",  cards: ["kpis","financial","critical-dates","action-levers"],                                        isDefault: false, builtIn: true },
]

function AssetValuationCard({ deals, dates, assetId, className, onNavigate }: {
  deals: DealsPageDeal[]
  dates: CriticalDate[]
  assetId: string
  className?: string
  onNavigate?: (page: string) => void
}) {
  const kpis = ASSET_KPIS[assetId] ?? ASSET_KPIS["vts-tower"]
  const lateStage = deals.filter(d => ["LOI", "Legal", "Lease Out"].includes(d.stage) && d.status !== "executed")
  const lateStageNewSf = lateStage.reduce((a, d) => a + d.sf, 0)
  const totalSf = 1368054
  const occupiedSf = Math.round(totalSf * kpis.occupancy / 100)
  const projectedOccupancy = Math.min(100, Math.round((occupiedSf + lateStageNewSf) / totalSf * 100))
  const monthlyNer = lateStage.filter(d => d.ner > 0).reduce((a, d) => a + (d.ner * d.sf) / 12, 0)
  const expiringDates = dates.filter(d => d.category === "expiring")
  const netAbsorption = lateStageNewSf - _expiringSf

  const statTiles = [
    { label: "Avg NER",        value: kpis.avgNer,             sub: "Per sf / yr",         colorCls: "" },
    { label: "NER vs budget",  value: kpis.nerBudgetDelta,     sub: "Year to date",        colorCls: kpis.nerBudgetUp ? "text-success" : "text-destructive" },
    { label: "Net absorption", value: `${netAbsorption >= 0 ? "+" : ""}${(netAbsorption / 1000).toFixed(0)}K sf`, sub: "Pipeline vs expiring", colorCls: netAbsorption >= 0 ? "text-success" : "text-destructive" },
  ]

  return (
    <div className={cn(cardBase, "!p-0 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 pb-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Asset overview</p>
          <h2 className="text-xl font-semibold text-foreground">Asset performance & valuation</h2>
        </div>
      </div>

      {/* KPI tiles row — flush with card edges, border-separated */}
      <div className="flex divide-x divide-border/60 border-y border-border/60">
        {statTiles.map(t => (
          <div key={t.label} className="flex-1 px-5 py-3 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{t.label}</p>
            <p className={cn("text-xl font-medium", t.colorCls || "text-foreground")}>{t.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Occupancy outlook */}
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">Occupancy outlook</p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className="text-xs font-medium tabular-nums text-foreground">{kpis.occupancy}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/40" style={{ width: `${kpis.occupancy}%` }} />
              </div>
            </div>
            {lateStage.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Projected ({lateStage.length} late-stage)</span>
                  <span className="text-xs font-medium tabular-nums text-foreground">{projectedOccupancy}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${projectedOccupancy}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insight + alert items */}
        <div className="flex flex-col gap-2">
          {lateStage.length > 0 && (
            <button onClick={() => onNavigate?.("deals")} className="w-full text-left rounded-lg border border-primary/25 bg-primary/15 p-3 hover:bg-primary/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">Occupancy upside from late-stage deals</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                    {lateStage.length} deal{lateStage.length !== 1 ? "s" : ""} totaling{" "}
                    <span className="font-medium text-foreground">{(lateStageNewSf / 1000).toFixed(0)}K sf</span> could add{" "}
                    <span className="font-medium text-foreground">${(monthlyNer / 1000).toFixed(0)}K/mo</span> NER and lift occupancy to{" "}
                    <span className="font-medium text-foreground">{projectedOccupancy}%</span>.
                  </p>
                </div>
              </div>
            </button>
          )}
          {expiringDates.length > 0 && (
            <button onClick={() => onNavigate?.("critical-dates")} className="w-full text-left rounded-lg border border-primary/25 bg-primary/15 p-3 hover:bg-primary/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">Leases expiring within 12 months</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-snug truncate">
                    {expiringDates.map(d => d.tenant).join(", ")}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
      {/* Added by Ask VTS footer */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-t border-border/60">
        <Sparkles className="h-3 w-3 text-primary/60" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-primary/60">Added by Ask VTS</span>
      </div>
    </div>
  )
}

function LeasingStrategyCard({ deals, dates, className, onNavigate }: {
  deals: DealsPageDeal[]
  dates: CriticalDate[]
  className?: string
  onNavigate?: (page: string) => void
}) {
  const PIPELINE_STAGES = ["Inquiry", "Touring", "Proposal", "LOI", "Legal", "Lease Out"] as const
  const activeDeals = deals.filter(d => d.status !== "executed")
  const stageCounts = PIPELINE_STAGES.map(s => ({
    stage: s,
    count: activeDeals.filter(d => d.stage === s).length,
    isLate: ["LOI", "Legal", "Lease Out"].includes(s),
  })).filter(s => s.count > 0)

  const lateStage = activeDeals.filter(d => ["LOI", "Legal", "Lease Out"].includes(d.stage))
  const atRisk = activeDeals.filter(d => getDealHealth(d.id, d.stage as any).score === "at-risk")
  const stalled = activeDeals.filter(d => d.status === "stalled")
  const belowBudget = activeDeals.filter(d => d.ner > 0 && d.ner < d.budgetNer)
  const renewalWindows = dates.filter(d => d.category === "renewal")
  const maxCount = Math.max(...stageCounts.map(s => s.count), 1)

  const statTiles = [
    { label: "Active deals", value: String(activeDeals.length), sub: "In pipeline",   colorCls: "" },
    { label: "Late stage",   value: String(lateStage.length),   sub: "LOI, legal & out", colorCls: "" },
    { label: "At risk",      value: String(atRisk.length),      sub: "Need attention", colorCls: atRisk.length > 0 ? "text-destructive" : "" },
    { label: "Renewals",     value: String(renewalWindows.length), sub: "Windows open", colorCls: renewalWindows.length > 0 ? "text-warning" : "" },
  ]

  const alertItems = [
    belowBudget.length > 0 && {
      icon: AlertTriangle,
      title: `${belowBudget.length} deal${belowBudget.length !== 1 ? "s" : ""} below budget NER`,
      desc: `${belowBudget.map(d => d.tenant).slice(0, 3).join(", ")}${belowBudget.length > 3 ? ` +${belowBudget.length - 3} more` : ""}`,
      navTo: "deals",
    },
    stalled.length > 0 && {
      icon: Clock,
      title: `${stalled.length} stalled deal${stalled.length !== 1 ? "s" : ""} need follow-up`,
      desc: `${stalled.map(d => d.tenant).slice(0, 3).join(", ")}${stalled.length > 3 ? ` +${stalled.length - 3} more` : ""}`,
      navTo: "deals",
    },
    renewalWindows.length > 0 && {
      icon: Sparkles,
      title: `${renewalWindows.length} renewal window${renewalWindows.length !== 1 ? "s" : ""} opening`,
      desc: renewalWindows.map(d => d.tenant).join(", "),
      navTo: "critical-dates",
    },
  ].filter(Boolean) as { icon: React.ElementType; title: string; desc: string; navTo: string }[]

  return (
    <div className={cn(cardBase, "!p-0 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 pb-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Pipeline</p>
          <h2 className="text-xl font-semibold text-foreground">Leasing pipeline & negotiation</h2>
        </div>
      </div>

      {/* KPI tiles row */}
      <div className="flex divide-x divide-border/60 border-y border-border/60">
        {statTiles.map(t => (
          <div key={t.label} className="flex-1 px-5 py-3 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{t.label}</p>
            <p className={cn("text-xl font-medium", t.colorCls || "text-foreground")}>{t.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Pipeline by stage chart */}
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">Pipeline by stage</p>
          <div className="flex items-end gap-3 h-16">
            {stageCounts.map(({ stage, count, isLate }) => (
              <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium tabular-nums text-foreground">{count}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: "40px" }}>
                  <div
                    className={cn("w-full rounded-sm", isLate ? "bg-primary" : "bg-primary/30")}
                    style={{ height: `${Math.max((count / maxCount) * 32 + 6, 6)}px` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight whitespace-nowrap">{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert items */}
        <div className="flex flex-col gap-2">
          {alertItems.map((item, i) => (
            <button key={i} onClick={() => onNavigate?.(item.navTo)} className="w-full text-left rounded-lg border border-primary/25 bg-primary/15 p-3 hover:bg-primary/20 transition-colors cursor-pointer">
              <div className="flex items-start gap-2.5">
                <item.icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">{item.title}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground truncate">{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Added by Ask VTS footer */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-t border-border/60">
        <Sparkles className="h-3 w-3 text-primary/60" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-primary/60">Added by Ask VTS</span>
      </div>
    </div>
  )
}

function migrateViews(saved: OverviewView[]): OverviewView[] {
  // Keep built-in views in sync with BUILT_IN_VIEWS definition (handles new cards added to built-ins)
  return saved.map(v => {
    const builtIn = BUILT_IN_VIEWS.find(b => b.id === v.id)
    return builtIn ? { ...builtIn, isDefault: v.isDefault } : v
  })
}

function initialViewId(storageViewsKey: string, storageActiveKey: string, builtIns: OverviewView[], migrate: (v: OverviewView[]) => OverviewView[] = x => x): string {
  try {
    const s = localStorage.getItem(storageViewsKey)
    const views = s ? migrate(JSON.parse(s)) : builtIns
    return localStorage.getItem(storageActiveKey) ?? views.find(v => v.isDefault)?.id ?? builtIns[0].id
  } catch { return builtIns[0].id }
}

function initialLiveCards(storageViewsKey: string, storageActiveKey: string, builtIns: OverviewView[], migrate: (v: OverviewView[]) => OverviewView[] = x => x): OverviewCardId[] {
  try {
    const s = localStorage.getItem(storageViewsKey)
    const views = s ? migrate(JSON.parse(s)) : builtIns
    const id = localStorage.getItem(storageActiveKey) ?? views.find(v => v.isDefault)?.id ?? builtIns[0].id
    return views.find(v => v.id === id)?.cards ?? builtIns[0].cards
  } catch { return builtIns[0].cards }
}

function useOverviewViews() {
  const [views, setViews] = React.useState<OverviewView[]>(() => {
    try {
      const saved = localStorage.getItem("overview:views")
      return saved ? migrateViews(JSON.parse(saved)) : BUILT_IN_VIEWS
    } catch { return BUILT_IN_VIEWS }
  })
  const [activeViewId, setActiveViewId] = React.useState<string>(() => initialViewId("overview:views", "overview:activeViewId", BUILT_IN_VIEWS, migrateViews))
  const [liveCards, setLiveCards] = React.useState<OverviewCardId[]>(() => initialLiveCards("overview:views", "overview:activeViewId", BUILT_IN_VIEWS, migrateViews))

  function persistViews(next: OverviewView[]) {
    setViews(next)
    localStorage.setItem("overview:views", JSON.stringify(next))
  }
  function selectView(id: string) {
    setActiveViewId(id)
    localStorage.setItem("overview:activeViewId", id)
    const v = views.find(v => v.id === id)
    if (v) setLiveCards(v.cards)
  }
  function saveView(name: string) {
    const id = `view-${Date.now()}`
    const newView: OverviewView = { id, name, cards: liveCards, isDefault: false }
    persistViews([...views, newView])
    selectView(id)
  }
  function renameView(id: string, name: string) {
    persistViews(views.map(v => v.id === id ? { ...v, name } : v))
  }
  function deleteView(id: string) {
    const next = views.filter(v => v.id !== id)
    persistViews(next)
    if (activeViewId === id) selectView(next[0]?.id ?? BUILT_IN_VIEWS[0].id)
  }
  function setDefault(id: string) {
    persistViews(views.map(v => ({ ...v, isDefault: v.id === id })))
  }
  function toggleCard(cardId: OverviewCardId) {
    setLiveCards(prev => prev.includes(cardId) ? prev.filter(c => c !== cardId) : [...prev, cardId])
  }
  function reorderCards(next: OverviewCardId[]) { setLiveCards(next) }

  const activeView = views.find(v => v.id === activeViewId) ?? views[0]
  return { views, activeView, liveCards, selectView, saveView, renameView, deleteView, setDefault, toggleCard, reorderCards }
}

// Portfolio card views use the same OverviewCardId set but exclude "kpis" (portfolio has its own KPI bar)
type PortfolioCardId = Exclude<OverviewCardId, "kpis" | "asset-valuation" | "leasing-strategy">
const PORTFOLIO_CARD_DEFS = OVERVIEW_CARD_DEFS.filter(c => c.id !== "kpis") as { id: PortfolioCardId; label: string; span: 1 | 2 | 3 }[]

const BUILT_IN_PORTFOLIO_VIEWS: OverviewView[] = [
  { id: "pv-assets",    name: "Assets",           cards: [],                                                                              isDefault: true,  builtIn: true },
  { id: "pv-full",      name: "Full overview",     cards: ["availability","financial","leasing","deal-actions","critical-dates","action-levers"] as OverviewCardId[], isDefault: false, builtIn: true },
  { id: "pv-leasing",   name: "Leasing focus",     cards: ["availability","leasing","deal-actions"] as OverviewCardId[],                  isDefault: false, builtIn: true },
  { id: "pv-financial", name: "Financial focus",   cards: ["financial","critical-dates","action-levers"] as OverviewCardId[],             isDefault: false, builtIn: true },
]

function usePortfolioViews() {
  const [views, setViews] = React.useState<OverviewView[]>(() => {
    try { const s = localStorage.getItem("portfolio:views"); return s ? JSON.parse(s) : BUILT_IN_PORTFOLIO_VIEWS } catch { return BUILT_IN_PORTFOLIO_VIEWS }
  })
  const [activeViewId, setActiveViewId] = React.useState<string>(() => initialViewId("portfolio:views", "portfolio:activeViewId", BUILT_IN_PORTFOLIO_VIEWS))
  const [liveCards, setLiveCards] = React.useState<OverviewCardId[]>(() => initialLiveCards("portfolio:views", "portfolio:activeViewId", BUILT_IN_PORTFOLIO_VIEWS))

  function persist(next: OverviewView[]) { setViews(next); localStorage.setItem("portfolio:views", JSON.stringify(next)) }
  function selectView(id: string) {
    setActiveViewId(id); localStorage.setItem("portfolio:activeViewId", id)
    const v = views.find(v => v.id === id)
    if (v) setLiveCards(v.cards)
  }
  function saveView(name: string) {
    const id = `pv-${Date.now()}`
    const newView: OverviewView = { id, name, cards: liveCards, isDefault: false }
    persist([...views, newView]); selectView(id)
  }
  function renameView(id: string, name: string) { persist(views.map(v => v.id === id ? { ...v, name } : v)) }
  function deleteView(id: string) {
    const next = views.filter(v => v.id !== id); persist(next)
    if (activeViewId === id) selectView(next[0]?.id ?? BUILT_IN_PORTFOLIO_VIEWS[0].id)
  }
  function setDefault(id: string) { persist(views.map(v => ({ ...v, isDefault: v.id === id }))) }
  function toggleCard(cardId: OverviewCardId) {
    setLiveCards(prev => prev.includes(cardId) ? prev.filter(c => c !== cardId) : [...prev, cardId])
  }
  function reorderCards(next: OverviewCardId[]) { setLiveCards(next) }

  const activeView = views.find(v => v.id === activeViewId) ?? views[0]
  return { views, activeView, liveCards, selectView, saveView, renameView, deleteView, setDefault, toggleCard, reorderCards }
}

function ViewSwitcher({ views, activeView, onSelect, onSave, onRename, onDelete, onSetDefault, prefix = "Asset:" }: {
  views: OverviewView[]
  activeView: OverviewView
  onSelect: (id: string) => void
  onSave: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  prefix?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [saveName, setSaveName] = React.useState("")

  function commitRename(id: string) {
    if (editName.trim()) onRename(id, editName.trim())
    setEditingId(null)
  }
  function commitSave() {
    if (saveName.trim()) { onSave(saveName.trim()); setSaveName(""); setSaving(false); setOpen(false) }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="h-8 gap-1 font-normal whitespace-nowrap" />}>
        <span>{prefix}</span>
        {activeView?.name ?? "Select view"}
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <p className="text-xs font-medium text-muted-foreground px-2 pb-2">Views</p>
        <div className="flex flex-col gap-0.5">
          {views.map(v => (
            <div key={v.id} className={cn("flex items-center gap-1 px-2 py-1.5 rounded-md group", v.id === activeView?.id ? "bg-primary/10" : "hover:bg-muted/60")}>
              {editingId === v.id ? (
                <Input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => commitRename(v.id)}
                  onKeyDown={e => { if (e.key === "Enter") commitRename(v.id); if (e.key === "Escape") setEditingId(null) }}
                  className="flex-1 h-6 text-sm px-1 py-0 border-0 border-b border-primary rounded-none shadow-none focus-visible:ring-0 bg-transparent"
                />
              ) : (
                <Button variant="ghost" size="sm" className={cn("flex-1 justify-start h-auto py-0 px-0 text-sm hover:bg-transparent truncate", v.id === activeView?.id ? "font-semibold text-primary" : "font-normal text-foreground")} onClick={() => { onSelect(v.id); setOpen(false) }}>
                  {v.name}
                </Button>
              )}
              <div className="flex items-center gap-0.5 w-[52px] shrink-0 justify-end">
                {!v.builtIn ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 text-primary/30 hover:text-primary" onClick={() => { setEditingId(v.id); setEditName(v.name) }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0 text-primary/30 hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(v.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <span className="w-[42px] shrink-0" />
                )}
                <Button variant="ghost" size="icon" title="Set as default" className="h-5 w-5 shrink-0" onClick={() => onSetDefault(v.id)}>
                  <Bookmark className={cn("h-3 w-3", v.isDefault ? "fill-primary text-primary" : "text-primary/30")} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 mt-2 pt-2">
          {saving ? (
            <div className="flex items-center gap-1.5 px-2">
              <Input
                autoFocus
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") commitSave(); if (e.key === "Escape") { setSaving(false); setSaveName("") } }}
                placeholder="View name"
                className="flex-1 h-7 text-sm px-2 py-0"
              />
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary" onClick={commitSave}>Save</Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="w-full justify-start gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2" onClick={() => setSaving(true)}>
              <Plus className="h-3.5 w-3.5" />
              Save current as view
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GlobalPlaceholderPage({ icon: Icon, title, description }: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 rounded-2xl bg-card/70 backdrop-blur-md border border-border/70 min-h-[calc(100vh-1rem)]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-medium text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-xs">{description ?? "This page is a placeholder. Content coming soon."}</p>
    </div>
  )
}

const ASSET_MARKET: Record<string, string> = {
  "vts-tower":     "New York",
  "one-financial": "Providence",
  "empire-state":  "New York",
  "salesforce":    "San Francisco",
  "willis":        "Chicago",
  "hudson-yards":  "New York",
  "one-wtc":       "New York",
  "transamerica":  "San Francisco",
  "peachtree":     "Atlanta",
  "union-square":  "Seattle",
  "200-berkeley":  "Boston",
}

const PILL_BASE = "inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-sm font-medium tabular-nums transition-colors cursor-pointer select-none hover:bg-primary/20"

function HeaderPill({ label, items, onItemClick }: {
  label: string
  items: string[]
  onItemClick?: (index: number) => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <span className={PILL_BASE} onClick={() => setOpen(o => !o)}>{label}</span>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-52 rounded-xl border border-sidebar-border bg-sidebar shadow-xl shadow-black/40 overflow-hidden flex flex-col">
          {items.map((item, i) => (
            <button
              key={item}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                onItemClick
                  ? "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  : "text-sidebar-foreground/80 cursor-default"
              )}
              onClick={() => { if (onItemClick) { onItemClick(i); setOpen(false) } }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiImage({ assetIds }: { assetIds: string[] }) {
  const ids = assetIds.slice(0, 4)
  return (
    <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 grid grid-cols-2 gap-px rounded-xl overflow-hidden">
      {ids.map(id => (
        <img key={id} src={ASSET_DETAILS[id]?.image} alt="" className="w-full h-full object-cover" />
      ))}
    </div>
  )
}

export const ASSETS = [
  { id: "vts-tower",     name: "VTS Tower Headquarters",  address: "114 West 41st Street, New York, NY 10036" },
  { id: "one-financial", name: "One Financial Plaza",      address: "1 Financial Plaza, Providence, RI 02903" },
  { id: "empire-state",  name: "Empire State Building",    address: "350 5th Ave, New York, NY 10118" },
  { id: "salesforce",    name: "Salesforce Tower",         address: "415 Mission St, San Francisco, CA 94105" },
  { id: "willis",        name: "Willis Tower",             address: "233 S Wacker Dr, Chicago, IL 60606" },
  { id: "hudson-yards",  name: "30 Hudson Yards",          address: "30 Hudson Yards, New York, NY 10001" },
  { id: "one-wtc",       name: "One World Trade Center",   address: "285 Fulton St, New York, NY 10007" },
  { id: "transamerica",  name: "Transamerica Pyramid",     address: "600 Montgomery St, San Francisco, CA 94111" },
  { id: "peachtree",     name: "One Peachtree Center",     address: "303 Peachtree St NE, Atlanta, GA 30308" },
  { id: "union-square",  name: "Two Union Square",         address: "601 Union St, Seattle, WA 98101" },
  { id: "200-berkeley",  name: "200 Berkeley Street",      address: "200 Berkeley St, Boston, MA 02116" },
]

export const PORTFOLIOS = [
  { id: "northeast",   name: "Northeast Corridor",  assetIds: ["vts-tower", "one-financial", "empire-state", "one-wtc", "200-berkeley"] },
  { id: "west-coast",  name: "West Coast Portfolio", assetIds: ["salesforce", "transamerica", "union-square"] },
  { id: "midwest",     name: "Midwest Holdings",     assetIds: ["willis", "hudson-yards", "peachtree"] },
]

export const ASSET_DETAILS: Record<string, { city: string; image: string }> = {
  "vts-tower":     { city: "Built 2017 · 52 floors · Office",   image: "https://images.unsplash.com/photo-1583009640887-eafd1a994d30?w=800&h=500&fit=crop&crop=center&auto=format" },
  "one-financial": { city: "Built 1992 · 36 floors · Office",   image: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=800&h=500&fit=crop&auto=format" },
  "empire-state":  { city: "Built 1931 · 102 floors · Office",  image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&h=500&fit=crop&auto=format" },
  "salesforce":    { city: "Built 2018 · 61 floors · Office",   image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&h=500&fit=crop&auto=format" },
  "willis":        { city: "Built 1973 · 110 floors · Office",  image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=500&fit=crop&auto=format" },
  "hudson-yards":  { city: "Built 2019 · 73 floors · Office",   image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=500&fit=crop&auto=format" },
  "one-wtc":       { city: "Built 2014 · 104 floors · Office",  image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=500&fit=crop&auto=format" },
  "transamerica":  { city: "Built 1972 · 48 floors · Office",   image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop&auto=format" },
  "peachtree":     { city: "Built 1992 · 60 floors · Office",   image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&auto=format" },
  "union-square":  { city: "Built 1989 · 56 floors · Office",   image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop&auto=format" },
  "200-berkeley":  { city: "Built 1947 · 28 floors · Office",   image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop&auto=format" },
}

export const ASSET_KPIS: Record<string, {
  occupancy: number; avgNer: string; nerBudgetDelta: string; nerBudgetUp: boolean;
  expiring12mo: number; activeDeals: number; alert?: string
}> = {
  "vts-tower":     { occupancy: 70, avgNer: "$74/sf", nerBudgetDelta: "+9.4%", nerBudgetUp: true,  expiring12mo: 3, activeDeals: 6 },
  "one-financial": { occupancy: 88, avgNer: "$43/sf", nerBudgetDelta: "+2.1%", nerBudgetUp: true,  expiring12mo: 1, activeDeals: 2 },
  "empire-state":  { occupancy: 94, avgNer: "$57/sf", nerBudgetDelta: "-1.3%", nerBudgetUp: false, expiring12mo: 5, activeDeals: 4, alert: "2 options expiring" },
  "salesforce":    { occupancy: 82, avgNer: "$88/sf", nerBudgetDelta: "+5.7%", nerBudgetUp: true,  expiring12mo: 2, activeDeals: 3 },
  "willis":        { occupancy: 76, avgNer: "$46/sf", nerBudgetDelta: "-3.1%", nerBudgetUp: false, expiring12mo: 4, activeDeals: 1, alert: "Below occupancy target" },
  "hudson-yards":  { occupancy: 97, avgNer: "$83/sf", nerBudgetDelta: "+11.2%", nerBudgetUp: true, expiring12mo: 0, activeDeals: 5 },
  "one-wtc":       { occupancy: 91, avgNer: "$76/sf", nerBudgetDelta: "+3.8%", nerBudgetUp: true,  expiring12mo: 2, activeDeals: 2 },
  "transamerica":  { occupancy: 68, avgNer: "$38/sf", nerBudgetDelta: "-6.5%", nerBudgetUp: false, expiring12mo: 6, activeDeals: 3, alert: "High vacancy risk" },
  "peachtree":     { occupancy: 85, avgNer: "$33/sf", nerBudgetDelta: "+1.9%", nerBudgetUp: true,  expiring12mo: 1, activeDeals: 0 },
  "union-square":  { occupancy: 93, avgNer: "$56/sf", nerBudgetDelta: "+4.4%", nerBudgetUp: true,  expiring12mo: 3, activeDeals: 4 },
  "200-berkeley":  { occupancy: 79, avgNer: "$71/sf", nerBudgetDelta: "-0.8%", nerBudgetUp: false, expiring12mo: 2, activeDeals: 1 },
}

const _expiring12mo = LEASES.filter(l => l.remaining > 0 && l.remaining <= 12)
const _expiringSf   = _expiring12mo.reduce((a, l) => a + l.sf, 0)
const _lateStage    = DEALS.filter(d => ["LOI", "Legal", "Lease Out"].includes(d.stage) && d.status !== "executed")
const _lateStageNer = _lateStage.filter(d => d.ner > 0).reduce((a, d) => a + (d.ner * d.sf) / 12, 0)

const KPIS = [
  { label: "Avg NER",                value: "$74/sf",   subtitle: "+9.4% vs budget", trend: "up" as const },
  {
    label: "Expiring leases (12mo)",
    value: String(_expiring12mo.length),
    subtitle: `${(_expiringSf / 1000).toFixed(0)}K sf at risk`,
    trend: _expiring12mo.length > 3 ? "down" as const : undefined,
  },
  {
    label: "Late-stage deals",
    value: String(_lateStage.length),
    subtitle: `$${(_lateStageNer / 1000).toFixed(0)}K/mo projected NER`,
    trend: "up" as const,
  },
  { label: "WALT", value: "4.2 yrs", subtitle: "Weighted avg lease" },
]




const CRITICAL_DATES: CriticalDate[] = [
  { tenant: "Pfizer",              asset: "VTS Tower Headquarters", type: "Lease Expiration",              space: "Suite 1200",   sf: 117000, date: "Sep 15, 2026", monthsOut: 2,  category: "expiring" },
  { tenant: "Morgan Stanley",      asset: "VTS Tower Headquarters", type: "Lease Expiration",              space: "Floors 8–11",  sf: 116000, date: "Nov 1, 2026",  monthsOut: 4,  category: "expiring" },
  { tenant: "Deloitte LLP",        asset: "VTS Tower Headquarters", type: "Rent Commencement Date",        space: "Suite 500",    sf: 43000,  date: "Dec 1, 2026",  monthsOut: 5,  category: "expiring" },
  { tenant: "KPMG",                asset: "VTS Tower Headquarters", type: "Renewal Window Opens",          space: "Suite 3400",   sf: 117000, date: "Jan 31, 2027", monthsOut: 6,  category: "renewal"  },
  { tenant: "Ernst & Young",       asset: "One Financial Plaza",    type: "Contraction Option Deadline",   space: "Suite 2200",   sf: 80100,  date: "Mar 1, 2027",  monthsOut: 8,  category: "options"  },
  { tenant: "HSBC Holdings",       asset: "One Financial Plaza",    type: "ROFO Latest Notice Date",       space: "Suite 900",    sf: 69300,  date: "Apr 15, 2027", monthsOut: 9,  category: "options"  },
  { tenant: "Latham & Watkins",    asset: "Willis Tower",           type: "Renewal Window Opens",          space: "Floors 14–15", sf: 119000, date: "May 1, 2027",  monthsOut: 10, category: "renewal"  },
  { tenant: "JPMorgan Chase",      asset: "Willis Tower",           type: "Expansion Option Deadline",     space: "Floor 6",      sf: 55800,  date: "Jun 30, 2027", monthsOut: 11, category: "options"  },
]

const VACANT_SPACES: VacantSpace[] = [
  { space: "Suite 2100",  sf: 34200, daysVacant: 210 },
  { space: "Suite 1800",  sf: 33000, daysVacant: 145 },
  { space: "Suite 500",   sf: 43000, daysVacant: 62  },
  { space: "Floors 9–10", sf: 88000, daysVacant: 30  },
]

export default function App() {
  const [navCollapsed, setNavCollapsed] = React.useState(false)
  function parseHash() {
    const raw = window.location.hash.replace(/^#\//, "")
    const [pathPart, queryPart] = raw.split("?")
    const parts = pathPart.split("/")
    const page = parts[0] || "dashboard"
    const asset = parts[1] || "vts-tower"
    const params = new URLSearchParams(queryPart ?? "")
    return { page, asset, dealId: params.get("deal"), agentId: params.get("agent"), view: params.get("view") }
  }

  const programmaticNav = React.useRef(false)
  const [selectedAssetId, setSelectedAssetId] = React.useState(() => parseHash().asset)
  const [currentPage, setCurrentPage] = React.useState(() => parseHash().page)
  const [defaultAgentId, setDefaultAgentId] = React.useState(() => parseHash().agentId ?? undefined)
  const [agentView, setAgentView] = React.useState<"list" | "grid">(() => parseHash().view === "grid" ? "grid" : "list")
  const [selectedDeal, setSelectedDeal] = React.useState<DealsPageDeal | null>(() => {
    const { dealId } = parseHash()
    return dealId ? (DEALS.find(d => d.id === dealId) ?? null) : null
  })
  const [selectedDealStatus, setSelectedDealStatus] = React.useState<DealStatus>("active")
  const [selectedDealInitialTab, setSelectedDealInitialTab] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    if (selectedDeal) setSelectedDealStatus(selectedDeal.status as DealStatus)
  }, [selectedDeal])
  const overviewViews = useOverviewViews()
  const [overviewInsightCards, setOverviewInsightCards] = React.useState<Array<"asset-valuation" | "leasing-strategy">>([])
  const [insightCardsNew, setInsightCardsNew] = React.useState(false)
  const portfolioViews = usePortfolioViews()
  const [pipelineToast, setPipelineToast] = React.useState(() => parseHash().dealId === "d00")
  const [selectedSpace, setSelectedSpace] = React.useState<SpaceRef | null>(null)
  const [selectedSpaceStatus, setSelectedSpaceStatus] = React.useState<SpaceStatus>("Available")
  const [selectedLease, setSelectedLease] = React.useState<Lease | null>(null)
  const [selectedLeaseStatus, setSelectedLeaseStatus] = React.useState<LeaseStatus>("Active")
  const [askVtsKey, setAskVtsKey] = React.useState(0)
  const stackingPlanRef = React.useRef<StackingPlanHandle>(null)
  useChatPattern()
  const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains("dark"))

  React.useEffect(() => {
    const globalPages = ["ai", "theme", "principles", "activity", "reminders", "avatar", "inquiry-email", "inquiry-email-forward", "inquiry-email-confirm", "ask-vts", "document-agent", "proposal-builder", "deal-monitor", "deal-monitor-email-am", "deal-monitor-email-broker", "deal-monitor-email-tenant", "deal-monitor-email-lawyer", "deal-monitor-email-owner"]
    let base = globalPages.includes(currentPage)
      ? `/${currentPage}`
      : `/${currentPage}/${selectedAssetId}`
    const params: string[] = []
    if (selectedDeal) params.push(`deal=${selectedDeal.id}`)
    if (currentPage === "ai" && agentView === "grid") params.push("view=grid")
    if (params.length) base += `?${params.join("&")}`
    if (window.location.hash !== `#${base}`) {
      programmaticNav.current = true
      window.location.hash = base
    }
  }, [currentPage, selectedAssetId, selectedDeal, agentView])

  React.useEffect(() => {
    if (pipelineToast) {
      const t = setTimeout(() => setPipelineToast(false), 3000)
      return () => clearTimeout(t)
    }
  }, [pipelineToast])

  React.useEffect(() => {
    const onHashChange = () => {
      if (programmaticNav.current) { programmaticNav.current = false; return }
      const { page, asset, dealId, agentId } = parseHash()
      setCurrentPage(page)
      if (page === "spaces") setSelectedSpace(null)
      if (page === "leases") setSelectedLease(null)
      setSelectedAssetId(asset)
      setDefaultAgentId(agentId ?? undefined)
      if (dealId) {
        const deal = DEALS.find(d => d.id === dealId) ?? null
        setSelectedDeal(deal)
        if (dealId === "d00") setPipelineToast(true)
      } else {
        setSelectedDeal(null)
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const goAskVts = React.useCallback(() => {
    setCurrentPage("ask-vts")
    setAskVtsKey(k => k + 1)
  }, [])

  const toggleDark = () => {
    setIsDark(d => {
      const next = !d
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  const PAGE_LABELS: Record<string, string> = {
    "dashboard": "Overview",
    "stacking": "Stacking plan", "spaces": "Spaces",
    "leases": "Leases", "critical-dates": "Critical dates", "options-rights": "Options & rights", "tenants": "Tenants",
    "deals": "Deals", "deal-tasks": "Deal tasks", "tenant-coord": "Tenant coordination", "requirements": "Requirements",
    "planning": "Planning", "budgets": "Budgets", "appraisals": "Appraisals", "comps": "Comps", "doc-vault": "Doc vault",
    "market": "Market", "buildings": "Buildings", "listings": "Listings", "tourbooks": "My tourbooks",
    "shares": "My shares", "marketing-analytics": "Marketing analytics", "inquiries": "Inquiries",
    "insights": "Insights", "leasing-activity": "Leasing activity report", "portfolio-dashboards": "Portfolio dashboards",
    "portfolio-alerts": "Portfolio alerts", "portfolio-reports": "Portfolio reports", "lease-charts": "Lease charts",
    "abstraction": "Abstraction", "activity": "Activity feed", "reminders": "Reminders",
    "assets": "Assets", "markets": "Markets", "cities": "Cities",
    "ai": "VTS Agents",
  }

  const selectedPortfolio = PORTFOLIOS.find(p => p.id === selectedAssetId)
  const selectedAsset = ASSETS.find(a => a.id === selectedAssetId)
  const isMultiAsset = selectedAssetId === "all" || !!selectedPortfolio

  // Asset names currently in scope — used to scope asset filter options on list pages
  const allowedAssets: string[] = React.useMemo(() => {
    if (selectedAssetId === "all") return ASSETS.map(a => a.name)
    if (selectedPortfolio) return ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id)).map(a => a.name)
    if (selectedAsset) return [selectedAsset.name]
    return ASSETS.map(a => a.name)
  }, [selectedAssetId, selectedPortfolio, selectedAsset])

  // Maps App asset IDs → names used in budget/appraisal data
  const PLANNING_ASSET_NAMES: Record<string, string> = {
    "vts-tower":     "VTS Tower HQ",
    "salesforce":    "Salesforce Tower",
    "one-financial": "One Financial Plaza",
    "empire-state":  "Empire State Bldg",
    "willis":        "Willis Tower",
    "hudson-yards":  "30 Hudson Yards",
    "one-wtc":       "One World Trade Ctr",
    "transamerica":  "Transamerica Pyramid",
    "200-berkeley":  "200 Berkeley St",
    "peachtree":     "One Peachtree Ctr",
    "union-square":  "Two Union Square",
  }
  // Maps App asset IDs → city substrings used to filter comps by citySubmarket
  const PLANNING_CITY_PREFIXES: Record<string, string[]> = {
    "vts-tower":     ["New York"],
    "salesforce":    ["San Francisco"],
    "one-financial": ["Boston", "Providence"],
    "empire-state":  ["New York"],
    "willis":        ["Chicago"],
    "one-wtc":       ["New York"],
    "200-berkeley":  ["Boston"],
    "hudson-yards":  ["New York"],
    "transamerica":  ["San Francisco"],
    "union-square":  ["Seattle"],
    "peachtree":     ["Atlanta"],
  }

  const assetFilter: string[] = React.useMemo(() => {
    if (selectedAssetId === "all") return []
    if (selectedPortfolio) return selectedPortfolio.assetIds.map(id => PLANNING_ASSET_NAMES[id]).filter((v): v is string => !!v)
    if (selectedAsset) { const n = PLANNING_ASSET_NAMES[selectedAsset.id]; return n ? [n] : [] }
    return []
  }, [selectedAssetId, selectedPortfolio, selectedAsset])

  const cityFilter: string[] = React.useMemo(() => {
    if (selectedAssetId === "all") return []
    if (selectedPortfolio) return [...new Set(selectedPortfolio.assetIds.flatMap(id => PLANNING_CITY_PREFIXES[id] ?? []))]
    if (selectedAsset) return PLANNING_CITY_PREFIXES[selectedAsset.id] ?? []
    return []
  }, [selectedAssetId, selectedPortfolio, selectedAsset])

  const renderPage = (page: string) => {
    if (page === "theme") {
      return <ThemeShowcase isDark={isDark} onToggleDark={toggleDark} />
    }

    if (page === "principles") {
      return <AgentPrinciples isDark={isDark} onToggleDark={toggleDark} />
    }

    if (page === "avatar")    return <GlobalPlaceholderPage icon={UserCircle} title="Profile" />
    if (page === "reminders") return <GlobalPlaceholderPage icon={BellRing}    title="Reminders" />
    if (page === "activity")  return <GlobalPlaceholderPage icon={Activity}    title="Activity Feed" />

    if (page === "ask-vts") return <AskVTSPage className="h-[calc(100vh-2rem)] flex-1" newChatKey={askVtsKey} />
    if (page === "inquiry-email") return <EmailFlow step="inbox" />
    if (page === "inquiry-email-forward") return <EmailFlow step="forward" />
    if (page === "inquiry-email-confirm") return <EmailFlow step="confirm" />


    const assetDetail = ASSET_DETAILS[selectedAssetId]

    // Compute header props depending on selection
    const headerProps = (() => {
      if (selectedAssetId === "all") {
        const allMarkets = [...new Set(ASSETS.map(a => ASSET_MARKET[a.id]).filter(Boolean))].sort()
        return {
          city: "Overview",
          name: "All assets",
          address: "",
          image: <MultiImage assetIds={ASSETS.map(a => a.id)} />,
          badges: <>
            <HeaderPill label={`${ASSETS.length} Assets`} items={ASSETS.map(a => a.name)} onItemClick={i => { setSelectedAssetId(ASSETS[i].id); setCurrentPage("dashboard") }} />
            <HeaderPill label={`${allMarkets.length} Markets`} items={allMarkets} />
          </>,
        }
      }
      if (selectedPortfolio) {
        const portfolioAssets = ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id))
        const portfolioMarkets = [...new Set(selectedPortfolio.assetIds.map(id => ASSET_MARKET[id]).filter(Boolean))].sort()
        return {
          city: "Portfolio",
          name: selectedPortfolio.name,
          address: "",
          image: <MultiImage assetIds={selectedPortfolio.assetIds} />,
          badges: <>
            <HeaderPill label={`${selectedPortfolio.assetIds.length} Assets`} items={portfolioAssets.map(a => a.name)} onItemClick={i => { setSelectedAssetId(portfolioAssets[i].id); setCurrentPage("dashboard") }} />
            <HeaderPill label={`${portfolioMarkets.length} Market${portfolioMarkets.length !== 1 ? "s" : ""}`} items={portfolioMarkets} />
          </>,
        }
      }
      return {
        city: assetDetail?.city ?? "Built 2017 · 52 floors · Office",
        name: selectedAsset?.name ?? "VTS Tower Headquarters",
        address: selectedAsset?.address ?? "114 West 41st Street, New York, NY 10036",
        image: assetDetail?.image ?? buildingImg,
      }
    })()

    // Show "AssetName PageLabel" with page label in mid-grey (includes "Overview" on dashboard)
    const pageLabel = PAGE_LABELS[page]
    const pagedHeaderProps = pageLabel
      ? { ...headerProps, name: (
          <span>
            <span className="font-semibold">{headerProps.name}</span>{" "}
            <span className="text-muted-foreground font-light whitespace-nowrap">| {pageLabel}</span>
          </span>
        )}
      : headerProps

    if (page === "ai") {
      const agentsHeaderProps = {
        ...headerProps,
        image: undefined,
        name: (
          <span className="flex items-center gap-2">
            <svg width="555" height="160" viewBox="0 0 555 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 sm:h-8 lg:h-10 w-auto shrink-0">
              <path d="M262.948 37.923L282.271 99.5913L301.591 37.923H321.723L293.26 121.804H270.12L241.889 37.923H262.948Z" fill="currentColor"/>
              <path d="M378.745 55.2793H351.903V37.923H425.601V55.2793H398.645V121.804H378.745V55.2793Z" fill="currentColor"/>
              <path d="M491.06 52.3862C483.422 52.3862 477.756 55.2794 477.756 60.4835C477.756 64.6518 481.688 67.6581 487.475 68.9305L498.928 71.2439C512.464 74.021 529.588 78.1862 529.588 95.7721C529.588 113.358 511.885 123.31 494.416 123.31C472.895 123.31 458.78 112.549 455.771 94.4997H475.441C477.639 103.293 484.581 107.342 494.879 107.342C501.588 107.342 509.224 105.144 509.224 98.2023C509.224 92.7658 502.747 90.1023 493.604 88.1371L483.422 86.0533C469.77 83.1633 457.392 76.6841 457.392 61.6418C457.392 44.519 475.788 36.5351 492.217 36.5351C508.646 36.5351 524.265 43.7095 527.158 62.2215H507.604C505.636 55.9721 499.506 52.3862 491.06 52.3862Z" fill="currentColor"/>
              <path d="M108.553 46.9088L136.165 65.2593L156.596 51.7396L108.553 19.812L108.485 19.8573L60.427 51.7926L80.8551 65.3125L108.485 46.953L108.553 46.9088Z" fill="currentColor"/>
              <path d="M108.47 105.303L25.0786 53.0043V87.8887L108.47 140.187L108.485 140.179L191.889 87.8741V52.9871L108.485 105.293L108.47 105.303Z" fill="currentColor"/>
            </svg>
            <span className="font-light text-muted-foreground">| Agents</span>
          </span>
        ),
        address: undefined,
        city: undefined,
      }
      return (
        <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">
          <BuildingHeader {...agentsHeaderProps} />
          <AgentsPage className="flex-1 min-h-0" defaultAgentId={defaultAgentId} defaultView={agentView} onViewChange={setAgentView} />
        </div>
      )
    }

    if (page === "deals") {
      const dealHeaderProps = selectedDeal ? {
        city: selectedDeal.asset,
        name: (<span><span className="font-semibold">{selectedDeal.tenant}</span>{" "}<span className="text-muted-foreground font-light">| {selectedDeal.dealType}</span></span>),
        address: [selectedDeal.space, `${selectedDeal.sf.toLocaleString()} sf`].filter(Boolean).join(" · "),
        image: <div className="relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border border-border/30 shadow-sm"><TenantLogoImage name={selectedDeal.tenant} /></div>,
        actions: undefined,
      } : pagedHeaderProps
      return (
        <div className="space-y-4">
          {pipelineToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg bg-foreground text-background text-sm font-medium shadow-lg pointer-events-none animate-in fade-in slide-in-from-bottom-2">
              Amazon deal added to your pipeline.
            </div>
          )}
          <BuildingHeader {...dealHeaderProps} />
          {selectedDeal && (
            <PageBreadcrumb crumbs={[
              { label: "Deals", onClick: () => { setSelectedDeal(null); setSelectedDealInitialTab(undefined) } },
              { label: selectedDeal.tenant },
            ]} />
          )}
          {selectedDeal
            ? <DealProfile deal={selectedDeal} onBack={() => { setSelectedDeal(null); setSelectedDealInitialTab(undefined) }} status={selectedDealStatus} onStatusChange={setSelectedDealStatus} initialTab={selectedDealInitialTab} onAddProposal={() => setCurrentPage("proposal-builder")} />
            : <DealsPage key={selectedAssetId} onDealClick={(deal, initialTab) => { setSelectedDeal(deal); setSelectedDealInitialTab(initialTab) }} assetContext={isMultiAsset ? undefined : selectedAsset?.name} allowedAssets={isMultiAsset ? allowedAssets : undefined} />
          }
        </div>
      )
    }

    if (page === "dashboard" && (selectedAssetId === "all" || selectedPortfolio)) {
      const visibleAssets = selectedPortfolio
        ? ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id))
        : ASSETS
      const visibleAssetNames = new Set(visibleAssets.map(a => a.name))
      const portfolioExpiring = CRITICAL_DATES.filter(d => d.category === "expiring" && d.monthsOut <= 12 && (!d.asset || visibleAssetNames.has(d.asset)))
      const expiringCount = portfolioExpiring.length
      const expiringSf = portfolioExpiring.reduce((s, d) => s + d.sf, 0)
      const expiringSfStr = expiringSf >= 1000000 ? `${(expiringSf / 1000000).toFixed(1)}M sf` : `${Math.round(expiringSf / 1000)}K sf`
      const portfolioDeals = DEALS.filter(d => visibleAssetNames.has(d.asset))
      const portfolioAtRisk = portfolioDeals.filter(d => getDealHealth(d.id, d.stage as any).score === "at-risk")
      const portfolioCaution = portfolioDeals.filter(d => getDealHealth(d.id, d.stage as any).score === "caution")
      const portfolioNeedAttention = portfolioAtRisk.length + portfolioCaution.length

      const activePortfolioViewId = portfolioViews.activeView?.id ?? "pv-assets"
      const portfolioDates = CRITICAL_DATES.filter(d => visibleAssetNames.has(d.asset ?? ""))

      // Card grid for non-Assets portfolio views (same greedy packing as asset overview)
      const portfolioCardRows: OverviewCardId[][] = []
      for (const id of portfolioViews.liveCards) {
        const def = OVERVIEW_CARD_DEFS.find(c => c.id === id)
        if (!def) continue
        const lastRow = portfolioCardRows[portfolioCardRows.length - 1]
        const lastRowSpan = lastRow?.reduce((s, c) => s + (OVERVIEW_CARD_DEFS.find(d => d.id === c)?.span ?? 1), 0) ?? 3
        if (!lastRow || lastRowSpan + def.span > 3) portfolioCardRows.push([id])
        else lastRow.push(id)
      }

      function renderPortfolioCard(id: OverviewCardId, stretched: number) {
        const colSpan = stretched === 3 ? "md:col-span-3" : stretched === 2 ? "md:col-span-2" : ""
        const cls = `${colSpan} rounded-2xl`
        switch (id) {
          case "availability":    {
            const totalSf = 1368054 * visibleAssets.length
            const occupiedSf = visibleAssets.reduce((s, a) => { const k = ASSET_KPIS[a.id]; return s + (k ? Math.round(1368054 * k.occupancy / 100) : 0) }, 0)
            const vacantSf = totalSf - occupiedSf
            return <AvailabilityOverview key={id} className={cls} occupiedSf={occupiedSf} vacantSf={vacantSf} vacantSpaces={VACANT_SPACES} deals={portfolioDeals} onViewStackingPlan={() => setCurrentPage("spaces")} onSpaceClick={v => { setSelectedSpace({ suite: v.space, floor: "–", sf: v.sf, status: "Available" }); setSelectedSpaceStatus("Available"); setCurrentPage("spaces") }} />
          }
          case "financial":       return <FinancialPerformance key={id} className={cls} criticalDates={portfolioDates} deals={portfolioDeals} onViewReport={() => setCurrentPage("leases")} onNavigate={setCurrentPage} />
          case "leasing":         return <LeasingActivity key={id} className={cls} deals={portfolioDeals} onViewAll={() => setCurrentPage("deals")} onDealClick={(d, tab) => { setSelectedDeal(d); setSelectedDealStatus(d.status as DealStatus); setSelectedDealInitialTab(tab); setCurrentPage("deals") }} />
          case "deal-actions":    return <DealActions key={id} deals={portfolioDeals} className={cls} />
          case "critical-dates":  return <CriticalDates key={id} dates={portfolioDates} className={cls} onViewAll={() => setCurrentPage("critical-dates")} onRowClick={tenant => { const l = findLease(tenant); if (l) { setSelectedLease(l); setSelectedLeaseStatus(l.status as LeaseStatus); setCurrentPage("leases") } }} />
          case "action-levers":   return <ActionLevers key={id} deals={portfolioDeals} criticalDates={portfolioDates} onNavigate={setCurrentPage} className={cls} />
          default: return null
        }
      }

      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />

          {/* Portfolio view switcher — above KPIs */}
          <div className="flex flex-wrap items-center gap-2">
            <ViewSwitcher
              views={portfolioViews.views}
              activeView={portfolioViews.activeView}
              onSelect={portfolioViews.selectView}
              onSave={portfolioViews.saveView}
              onRename={portfolioViews.renameView}
              onDelete={portfolioViews.deleteView}
              onSetDefault={portfolioViews.setDefault}
              prefix="Portfolio:"
            />
            {activePortfolioViewId !== "pv-assets" && (
              <CardManager
                defs={PORTFOLIO_CARD_DEFS}
                visible={new Set(portfolioViews.liveCards)}
                order={[...portfolioViews.liveCards, ...PORTFOLIO_CARD_DEFS.map(c => c.id).filter(id => !portfolioViews.liveCards.includes(id as OverviewCardId))]}
                onToggle={id => portfolioViews.toggleCard(id as OverviewCardId)}
                onReorder={next => portfolioViews.reorderCards(next.filter(id => portfolioViews.liveCards.includes(id as OverviewCardId)) as OverviewCardId[])}
              />
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8"><Download className="size-4" />Export</Button>
              <Button variant="outline" size="sm" className="h-8"><Share2 className="size-4" />Share</Button>
            </div>
          </div>

          <KpiBar kpis={[
            { label: "Avg portfolio NER",  value: "$62/sf",  subtitle: "+4.2% vs budget",  trend: "up" as const },
            { label: "Occupancy",          value: "91.4%",  subtitle: "+0.8% vs budget",  trend: "up" as const },
            { label: "Expiring < 12 mo",   value: `${expiringCount} lease${expiringCount !== 1 ? "s" : ""}`, subtitle: expiringSf > 0 ? expiringSfStr : "None expiring", trend: expiringCount > 2 ? "down" as const : undefined },
            {
              label: "Need attention",
              value: `${portfolioNeedAttention} deal${portfolioNeedAttention !== 1 ? "s" : ""}`,
              subtitleNode: (
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {portfolioAtRisk.length > 0 && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-destructive/20 text-destructive bg-destructive/10">{portfolioAtRisk.length} At risk</span>
                  )}
                  {portfolioCaution.length > 0 && (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-warning/20 text-warning bg-warning/10">{portfolioCaution.length} Critical</span>
                  )}
                  {portfolioNeedAttention === 0 && <span className="text-xs text-muted-foreground">None</span>}
                </div>
              ),
            },
          ]} />

          {/* View content */}
          {activePortfolioViewId === "pv-assets" && (
            <PortfolioGrid
              assets={visibleAssets}
              deals={DEALS}
              onAssetClick={id => { setSelectedAssetId(id); setCurrentPage("dashboard") }}
            />
          )}
          {activePortfolioViewId !== "pv-assets" && portfolioCardRows.map((row, i) => {
            const rowSpan = row.reduce((s, id) => s + (OVERVIEW_CARD_DEFS.find(c => c.id === id)?.span ?? 1), 0)
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {row.map(id => {
                  const def = OVERVIEW_CARD_DEFS.find(c => c.id === id)!
                  const stretched = rowSpan < 3 && row.length === 1 ? 3 : def.span
                  return renderPortfolioCard(id, stretched)
                })}
              </div>
            )
          })}
        </div>
      )
    }
    if (page === "spaces") {
      const spacesAssets = selectedAssetId === "all"
        ? ASSETS
        : selectedPortfolio
          ? ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id))
          : selectedAsset ? [selectedAsset] : ASSETS

      const handleSpacesPageClick = (s: SpacesPageSpace) => {
        setSelectedSpace({ suite: s.space, floor: s.floor, sf: s.sf, status: s.status, rent: s.askingRent ?? undefined, condition: s.condition, assetName: selectedAsset?.name })
        setSelectedSpaceStatus((s.status as SpaceStatus) ?? "Available")
      }

      if (selectedSpace) {
        const spaceHeader = {
          ...pagedHeaderProps,
          name: (
            <span>
              <span className="font-semibold">{headerProps.name}</span>{" "}
              <span className="text-muted-foreground font-light whitespace-nowrap">| {selectedSpace.suite}</span>
            </span>
          ),
          actions: (
            <SpaceStatusBadge status={selectedSpaceStatus} onChange={setSelectedSpaceStatus} />
          ),
        }
        return (
          <div className="flex flex-col gap-4" style={{ minHeight: "calc(100vh - 2rem)" }}>
            <BuildingHeader {...spaceHeader} />
            <PageBreadcrumb crumbs={[
              { label: "Spaces", onClick: () => setSelectedSpace(null) },
              { label: selectedSpace.suite },
            ]} />
            <SpaceDetailPage space={selectedSpace} onBack={() => setSelectedSpace(null)} />
          </div>
        )
      }

      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <SpacesPage key={selectedAssetId} assets={spacesAssets} onSpaceClick={handleSpacesPageClick} />
        </div>
      )
    }
    if (page === "deal-tasks") {
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <DealTasksPage key={selectedAssetId} onTaskClick={dealId => {
            const deal = DEALS.find(d => d.id === dealId) ?? null
            if (deal) {
              setSelectedDeal(deal)
              setSelectedDealInitialTab("tasks")
              setCurrentPage("deals")
            }
          }} assetContext={isMultiAsset ? undefined : selectedAsset?.name} />
        </div>
      )
    }
    if (page === "leases") {
      if (selectedLease) {
        const leaseHeader = {
          ...pagedHeaderProps,
          city: selectedLease.asset,
          name: (<span><span className="font-semibold">{selectedLease.tenant}</span>{" "}<span className="text-muted-foreground font-light">| Lease</span></span>),
          address: `Suite ${selectedLease.suite} · ${selectedLease.floor} · ${selectedLease.sf.toLocaleString()} sf`,
          image: <div className="relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border border-border/30 shadow-sm"><TenantLogoImage name={selectedLease.tenant} /></div>,
          actions: (
            <div className="flex items-center gap-2">
              <LeaseStatusBadge status={selectedLeaseStatus} onChange={setSelectedLeaseStatus} />
            </div>
          ),
        }
        return (
          <div className="flex flex-col gap-4 min-h-[calc(100vh-2rem)]">
            <BuildingHeader {...leaseHeader} />
            <PageBreadcrumb crumbs={[
              { label: "Leases", onClick: () => setSelectedLease(null) },
              { label: selectedLease.tenant },
            ]} />
            <LeaseDetailPage lease={selectedLease} />
          </div>
        )
      }
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <LeasesPage key={selectedAssetId} onLeaseClick={l => { setSelectedLease(l); setSelectedLeaseStatus(l.status as LeaseStatus) }} assetContext={isMultiAsset ? undefined : selectedAsset?.name} allowedAssets={isMultiAsset ? allowedAssets : undefined} />
        </div>
      )
    }
    if (page === "critical-dates") {
      const cdAssets = selectedAssetId === "all"
        ? ASSETS
        : selectedPortfolio
          ? ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id))
          : selectedAsset ? [selectedAsset] : ASSETS
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <CriticalDatesPage key={selectedAssetId} assets={cdAssets} onRowClick={tenant => { const l = findLease(tenant, selectedAsset?.name); if (l) { setSelectedLease(l); setSelectedLeaseStatus(l.status as LeaseStatus); setCurrentPage("leases") } }} />
        </div>
      )
    }
    if (page === "options-rights") {
      const optionsAssets = selectedAssetId === "all"
        ? ASSETS
        : selectedPortfolio
          ? ASSETS.filter(a => selectedPortfolio.assetIds.includes(a.id))
          : selectedAsset ? [selectedAsset] : ASSETS
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <OptionsRightsPage key={selectedAssetId} assets={optionsAssets} assetId={selectedAsset?.id} onRowClick={tenant => { const l = findLease(tenant, selectedAsset?.name); if (l) { setSelectedLease(l); setSelectedLeaseStatus(l.status as LeaseStatus); setCurrentPage("leases") } }} />
        </div>
      )
    }
    if (page === "stacking") {
      const handleStackingSpaceClick = (s: StackingPlanSpaceRef) => {
        setSelectedSpace({ suite: s.suite, floor: `Floor ${s.floor}`, sf: s.sf, status: s.status, tenant: s.tenant, rent: s.rent, expiry: s.expiry, assetName: selectedAsset?.name })
        setSelectedSpaceStatus((s.status as SpaceStatus) ?? "Available")
        setCurrentPage("spaces")
      }
      return (
        <div className="flex flex-col flex-1 min-h-0">
          <BuildingHeader {...pagedHeaderProps} onCommand={(cmd) => stackingPlanRef.current?.applyCommand(cmd as StackingPlanCommand)} commandSuggestions={STACKING_COMMANDS} />
          <StackingPlan ref={stackingPlanRef} onSpaceClick={handleStackingSpaceClick} />
        </div>
      )
    }

    if (page === "planning") {
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <PlanningPage
            onViewBudgets={() => setCurrentPage("budgets")}
            onViewAppraisals={() => setCurrentPage("appraisals")}
            onViewComps={() => setCurrentPage("comps")}
            assetFilter={assetFilter}
            cityFilter={cityFilter}
          />
        </div>
      )
    }
    if (page === "budgets") {
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <BudgetsPage assetFilter={assetFilter} />
        </div>
      )
    }
    if (page === "appraisals") {
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <AppraisalsPage assetFilter={assetFilter} />
        </div>
      )
    }
    if (page === "comps") {
      return (
        <div className="space-y-4">
          <BuildingHeader {...pagedHeaderProps} />
          <CompsPage cityFilter={cityFilter} />
        </div>
      )
    }

    if (PAGE_LABELS[page] && page !== "dashboard") {
      return (
        <div className="flex flex-col" style={{minHeight: 'calc(100vh - 2rem)'}}>
          <BuildingHeader {...pagedHeaderProps} />
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 rounded-2xl bg-white/70 dark:bg-white/8 backdrop-blur-md border border-border/70 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-60"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-2">{PAGE_LABELS[page]}</h1>
            <p className="text-sm text-muted-foreground max-w-xs">This page is a placeholder. Content coming soon.</p>
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <BuildingHeader {...pagedHeaderProps} />
        {/* View controls */}
        <div className="flex flex-wrap items-center gap-2">
          <ViewSwitcher
            views={overviewViews.views}
            activeView={overviewViews.activeView}
            onSelect={overviewViews.selectView}
            onSave={overviewViews.saveView}
            onRename={overviewViews.renameView}
            onDelete={overviewViews.deleteView}
            onSetDefault={overviewViews.setDefault}
          />
          <CardManager
            defs={OVERVIEW_CARD_DEFS}
            visible={new Set(overviewViews.liveCards)}
            order={[...overviewViews.liveCards, ...OVERVIEW_CARD_DEFS.map(c => c.id).filter(id => !overviewViews.liveCards.includes(id as OverviewCardId))]}
            onToggle={id => overviewViews.toggleCard(id as OverviewCardId)}
            onReorder={next => overviewViews.reorderCards(next.filter(id => overviewViews.liveCards.includes(id as OverviewCardId)) as OverviewCardId[])}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8"><Download className="size-4" />Export</Button>
            <Button variant="outline" size="sm" className="h-8"><Share2 className="size-4" />Share</Button>
          </div>
        </div>
        {(() => {
          const overviewDeals = selectedAsset ? DEALS.filter(d => d.asset === selectedAsset.name) : DEALS
          const overviewDates = selectedAsset ? CRITICAL_DATES.filter(d => d.asset === selectedAsset.name) : CRITICAL_DATES
          // Pack cards into 3-column rows greedily
          const rows: OverviewCardId[][] = []
          let rowCols = 0
          let currentRow: OverviewCardId[] = []
          for (const id of overviewViews.liveCards) {
            const def = OVERVIEW_CARD_DEFS.find(c => c.id === id)
            if (!def) continue
            if (currentRow.length && (rowCols + def.span > 3 || def.span === 3)) { rows.push(currentRow); currentRow = []; rowCols = 0 }
            currentRow.push(id); rowCols += def.span
          }
          if (currentRow.length) rows.push(currentRow)

          function renderCard(id: OverviewCardId, stretched: number) {
            const cls = stretched === 3 ? "md:col-span-3" : stretched === 2 ? "md:col-span-2" : ""
            switch (id) {
              case "kpis":            return <KpiBar key={id} kpis={KPIS} className={cls} />
              case "availability":    return <AvailabilityOverview key={id} className={cls} occupiedSf={957638} vacantSf={410416} vacantSpaces={VACANT_SPACES} deals={overviewDeals} onViewStackingPlan={() => setCurrentPage("stacking")} onSpaceClick={v => { setSelectedSpace({ suite: v.space, floor: "–", sf: v.sf, status: "Available", assetName: selectedAsset?.name }); setSelectedSpaceStatus("Available"); setCurrentPage("spaces") }} />
              case "financial":       return <FinancialPerformance key={id} className={cls} criticalDates={overviewDates} deals={overviewDeals} onViewReport={() => setCurrentPage("leases")} onNavigate={setCurrentPage} />
              case "leasing":         return <LeasingActivity key={id} className={cls} deals={overviewDeals} onViewAll={() => setCurrentPage("deals")} onDealClick={(d, tab) => { setSelectedDeal(d); setSelectedDealStatus(d.status as DealStatus); setSelectedDealInitialTab(tab); setCurrentPage("deals") }} />
              case "deal-actions":    return <DealActions key={id} deals={overviewDeals} className={cls} />
              case "critical-dates":  return <CriticalDates key={id} dates={overviewDates} className={cls} onViewAll={() => setCurrentPage("critical-dates")} onRowClick={tenant => { const l = findLease(tenant); if (l) { setSelectedLease(l); setSelectedLeaseStatus(l.status as LeaseStatus); setCurrentPage("leases") } }} />
              case "action-levers":   return <ActionLevers key={id} deals={overviewDeals} criticalDates={overviewDates} onNavigate={setCurrentPage} className={cls} />
              case "asset-valuation":  return <AssetValuationCard key={id} className={cls} deals={overviewDeals} dates={overviewDates} assetId={selectedAssetId} />
              case "leasing-strategy": return <LeasingStrategyCard key={id} className={cls} deals={overviewDeals} dates={overviewDates} />
            }
          }

          const gridRows = rows.map((row, i) => {
            // Compute used columns and stretch last card to fill any gap
            const defs = row.map(id => OVERVIEW_CARD_DEFS.find(c => c.id === id)!)
            const usedCols = defs.reduce((sum, d) => sum + d.span, 0)
            const gap = 3 - usedCols
            const stretchedSpans = defs.map((d, j) => j === defs.length - 1 ? d.span + gap : d.span)
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {row.map((id, j) => renderCard(id, stretchedSpans[j]))}
              </div>
            )
          })

          // Insight cards triggered by Ask VTS — inserted after the first row (KPIs)
          const insightRow = overviewInsightCards.length > 0 ? (
            <div key="insight-cards" className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {overviewInsightCards.map((id, i) => {
                  const ringCls = insightCardsNew ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background transition-shadow duration-700" : ""
                  const delayCls = i === 1 ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-100" : "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500"
                  return id === "asset-valuation"
                    ? <AssetValuationCard key={id} className={cn("md:col-span-1 rounded-2xl", delayCls, ringCls)} deals={overviewDeals} dates={overviewDates} assetId={selectedAssetId} onNavigate={setCurrentPage} />
                    : <LeasingStrategyCard key={id} className={cn("md:col-span-2 rounded-2xl", delayCls, ringCls)} deals={overviewDeals} dates={overviewDates} onNavigate={setCurrentPage} />
                })}
              </div>
            </div>
          ) : null

          return [gridRows[0], insightRow, ...gridRows.slice(1)]
        })()}
      </div>
    )
  }

  if (currentPage === "document-agent") {
    return (
      <ChatPatternProvider onOpenChat={goAskVts}>
        <DocumentAgentPage isDark={isDark} onToggleDark={toggleDark} />
      </ChatPatternProvider>
    )
  }

  if (currentPage === "proposal-builder") {
    return <ProposalBuilderPage isDark={isDark} onToggleDark={toggleDark} />
  }

  if (currentPage === "deal-monitor") {
    return (
      <ChatPatternProvider onOpenChat={goAskVts}>
        <DealStewardPage isDark={isDark} onToggleDark={toggleDark} />
      </ChatPatternProvider>
    )
  }

  if (currentPage === "deal-monitor-email-am")     return <AmPipelineEmailPage />
  if (currentPage === "deal-monitor-email-broker")  return <BrokerActionEmailPage />
  if (currentPage === "deal-monitor-email-tenant")  return <TenantFollowupEmailPage />
  if (currentPage === "deal-monitor-email-lawyer")  return <LawyerLeaseEmailPage />
  if (currentPage === "deal-monitor-email-owner")   return <OwnerUpdateEmailPage />

  const handleInsightTrigger = React.useCallback(() => {
    setOverviewInsightCards(["asset-valuation"])
    setInsightCardsNew(true)
    setTimeout(() => setOverviewInsightCards(["asset-valuation", "leasing-strategy"]), 350)
    setTimeout(() => setInsightCardsNew(false), 2200)
  }, [])

  const standalonePages = ["theme", "principles", "inquiry-email", "inquiry-email-forward", "inquiry-email-confirm"]
  if (standalonePages.includes(currentPage)) {
    return (
      <ChatPatternProvider onOpenChat={goAskVts}>
        <div className="min-h-screen">{renderPage(currentPage)}</div>
        <ChatSideOver />
      </ChatPatternProvider>
    )
  }

  return (
    <ChatPatternProvider onOpenChat={goAskVts} onInsightTrigger={currentPage === "dashboard" ? handleInsightTrigger : undefined}>
      <AppShell
        navCollapsed={navCollapsed}
        setNavCollapsed={setNavCollapsed}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelectedDeal={setSelectedDeal}
        onSpacesNav={() => setSelectedSpace(null)}
        onLeasesNav={() => setSelectedLease(null)}
        setAskVtsKey={setAskVtsKey}
        isDark={isDark}
        toggleDark={toggleDark}
        renderPage={renderPage}
      />
    </ChatPatternProvider>
  )
}

interface AppShellProps {
  navCollapsed: boolean
  setNavCollapsed: (v: boolean) => void
  selectedAssetId: string
  setSelectedAssetId: (id: string) => void
  currentPage: string
  setCurrentPage: (p: string) => void
  setSelectedDeal: (d: null) => void
  onSpacesNav: () => void
  onLeasesNav: () => void
  setAskVtsKey: (fn: (k: number) => number) => void
  isDark: boolean
  toggleDark: () => void
  renderPage: (page: string) => React.ReactNode
}

function AppShell({ navCollapsed, setNavCollapsed, selectedAssetId, setSelectedAssetId, currentPage, setCurrentPage, setSelectedDeal, onSpacesNav, onLeasesNav, setAskVtsKey, isDark, toggleDark, renderPage }: AppShellProps) {
  const { closeSideOver, closeSidePush, sidePushOpen } = useChatPattern()
  React.useEffect(() => {
    closeSideOver()
    closeSidePush()
  }, [currentPage])
  const prevSidePushRef = React.useRef(false)
  React.useEffect(() => {
    if (sidePushOpen && !prevSidePushRef.current) {
      setNavCollapsed(true)
    } else if (!sidePushOpen && prevSidePushRef.current) {
      setNavCollapsed(false)
    }
    prevSidePushRef.current = sidePushOpen
  }, [sidePushOpen])
  const handleNavItemClick = (id: string) => {
    setCurrentPage(id)
    setSelectedDeal(null)
    if (id === "spaces") onSpacesNav()
    if (id === "leases") onLeasesNav()
    if (id === "ask-vts") setAskVtsKey(k => k + 1)
  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AgentsViewAwareNav
        collapsed={navCollapsed}
        onCollapsedChange={setNavCollapsed}
        assets={ASSETS}
        portfolios={PORTFOLIOS}
        selectedAssetId={selectedAssetId}
        onAssetChange={id => {
          const newIsPortfolioOrAll = id === "all" || PORTFOLIOS.some(p => p.id === id)
          if (newIsPortfolioOrAll && currentPage === "stacking") {
            setCurrentPage("dashboard")
          }
          setSelectedAssetId(id)
        }}
        isDark={isDark}
        onLogoClick={toggleDark}
        onNavItemClick={handleNavItemClick}
        activePage={currentPage}
      />
      <SidePushMain navCollapsed={navCollapsed}>
        {renderPage(currentPage)}
      </SidePushMain>
      <ChatSideOver />
      <ChatSidePush />
    </div>
  )
}
