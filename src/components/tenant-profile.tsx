import * as React from "react"
import { PanelErrorBoundary } from "@/components/panel-error-boundary"
import { toast } from "sonner"
import {
  Angry, ArrowRight, Frown, HeartPulse, Laugh, Meh, Smile, Building2, ChevronDown, ChevronRight, Eye, FileText, Layers, ListTodo, Mail, Map as MapIcon,
  ArrowUpDown, CalendarClock, Wrench, CalendarDays, Handshake, History, LayoutGrid, Users, Table2, User, Phone, Plus, ShieldAlert, Sparkle, TrendingDown, TrendingUp, Minus, X, Zap, Bot,
} from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { cn, cardBase, sidebarBtn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { FILTER_TAB_GROUP_CLS, FILTER_TAB_ITEM_CLS } from "@/components/filter-chip"
import { TenantAvatar } from "@/components/tenant-avatar"
import { ActivityFeed, type FeedEntry } from "@/components/activity-feed"
import { PortfolioMap, type MapAsset } from "@/components/portfolio-map"
import { AssetCard } from "@/components/portfolio-grid"
import { PM_AGENTS } from "@/components/agents-page"

const PM_AGENT_ICON: Record<string, React.ElementType> = Object.fromEntries(PM_AGENTS.map(a => [a.name, a.icon]))
import { TenantEmailDialog, type EmailDraft } from "@/components/tenant-email-dialog"
import { TenantTaskDialog, type TaskDraft } from "@/components/tenant-task-dialog"
import { useChatPattern } from "@/contexts/chat-pattern"
import { LEASES, type Lease } from "@/components/leases-page"
import { type Deal } from "@/components/deals-page"
import { ASSET_MANAGER, tenantMeta, toIso } from "@/lib/tenants-data"
import {
  AGGREGATE_PREFIX, entityDeals, entityTenants, fmtShort, leaseDocuments,
  tenantContacts, tenantFamily, tenantFeed, type Contact, type DocStatus, type TenantFamily,
} from "@/lib/tenant-profile-data"
import {
  assetFinancials, companyProfile, dealTypeLabel, deadDeals, emailHistory, leaseUnit, seedTasks, tenantOperations, tenantRequirements, tenantSignals,
  type LeaseInsight, type OpsTrend, type RecommendedAction, type Sentiment, type TenantSatisfaction, type Signal, type TenantOperations, type TenantRequirement, type TenantTask,
} from "@/lib/tenant-intelligence"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const subCard = "rounded-xl border border-border bg-card p-4"

const DEAL_STAGES = ["Inquiry", "Touring", "Proposal", "LOI", "Legal", "Lease Out", "Executed"]

function fmtCompact(v: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v)
}

function lxdIso(l: Lease) {
  return toIso(l.lxd)
}

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

interface Place {
  where: string
  share: string
  narrowed: boolean
}

function describePlace(scopeAssets: string[] | null, scopeLabel: string): Place {
  if (!scopeAssets) return { where: "in your portfolio", share: "portfolio", narrowed: false }
  if (scopeAssets.length === 1 && scopeAssets[0] === scopeLabel) return { where: `at ${scopeLabel}`, share: "building", narrowed: true }
  return { where: `in ${scopeLabel}`, share: "portfolio", narrowed: true }
}

export function entityLabel(selection: string) {
  return selection.startsWith(AGGREGATE_PREFIX) ? `All of ${selection.slice(AGGREGATE_PREFIX.length)}` : selection
}

export interface TenantProfileHandle {
  openEmail: () => void
  openTask: () => void
  openDeals: () => void
}

interface TenantProfileProps {
  selection: string
  scopeAssets: string[] | null
  scopeLabel: string
  assets: MapAsset[]
  onSelect: (selection: string) => void
  onDealClick: (deal: Deal) => void
  onOpenLease: (lease: Lease) => void
  onShowAllAssets: () => void
}

type ActivityFilter = "all" | "emails" | "meetings" | "deals" | "agents"

export const TenantProfile = React.forwardRef<TenantProfileHandle, TenantProfileProps>(function TenantProfile(
  { selection, scopeAssets: scopeAssetsProp, scopeLabel, assets, onSelect, onDealClick, onOpenLease, onShowAllAssets },
  ref,
) {
  // Parents may pass a new array each render; key it by content so derived data stays stable.
  const scopeKey = scopeAssetsProp ? scopeAssetsProp.join("|") : null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scopeAssets = React.useMemo(() => scopeAssetsProp, [scopeKey])
  const { openChat, setPageContext } = useChatPattern()
  const [tab, setTab] = React.useState("insights")
  const [rightTab, setRightTab] = React.useState("updates")
  const [rightCollapsed, setRightCollapsed] = React.useState(false)
  const middleRef = React.useRef<HTMLDivElement>(null)
  const rightRef = React.useRef<HTMLDivElement>(null)
  const [leaseView, setLeaseView] = React.useState<ProfileView>("cards")
  const [dealView, setDealView] = React.useState<ProfileView>("cards")
  const [reqView, setReqView] = React.useState<ProfileView>("cards")
  const [activityFilter, setActivityFilter] = React.useState<ActivityFilter>("all")
  const [emailOpen, setEmailOpen] = React.useState(false)
  const [emailDraft, setEmailDraft] = React.useState<EmailDraft>({ to: "", subject: "", body: "" })
  const [emailActionId, setEmailActionId] = React.useState<string | null>(null)
  const [taskOpen, setTaskOpen] = React.useState(false)
  const [taskDraft, setTaskDraft] = React.useState<TaskDraft>({ title: "" })
  const [taskActionId, setTaskActionId] = React.useState<string | null>(null)
  const [loggedEntries, setLoggedEntries] = React.useState<FeedEntry[]>([])
  const [done, setDone] = React.useState<Set<string>>(new Set())

  const today = todayIso()
  const tenants = React.useMemo(() => entityTenants(selection), [selection])
  const family = React.useMemo(() => tenantFamily(tenants[0] ?? selection), [tenants, selection])
  const inScope = React.useCallback((l: Lease) => !scopeAssets || scopeAssets.includes(l.asset), [scopeAssets])
  const scopeLeases = React.useMemo(() => LEASES.filter(inScope), [inScope])
  const allEntityLeases = React.useMemo(() => LEASES.filter(l => tenants.includes(l.tenant)), [tenants])
  const leases = React.useMemo(() => allEntityLeases.filter(inScope), [allEntityLeases, inScope])
  const deals = React.useMemo(() => entityDeals(tenants, scopeAssets), [tenants, scopeAssets])
  const displayName = tenantMeta(tenants[0] ?? family.parent).parent
  const label = entityLabel(selection)
  const contacts = React.useMemo(
    () => tenantContacts(tenants[0] ?? family.parent, family.parent, leases.length ? leases : allEntityLeases, deals),
    [tenants, family.parent, leases, allEntityLeases, deals],
  )
  const signals = React.useMemo(
    () => tenantSignals({ displayName: label, leases, allEntityLeases, scopeLeases, deals, family, contacts }),
    [label, leases, allEntityLeases, scopeLeases, deals, family, contacts],
  )
  const company = React.useMemo(() => companyProfile(tenants[0] ?? family.parent), [tenants, family.parent])
  const dataAnchor = React.useMemo(
    () => [...leases.map(l => toIso(l.lastUpdate)), ...deals.map(d => d.lastUpdated)].sort().at(-1) ?? "2026-08-30",
    [leases, deals],
  )
  const dead = React.useMemo(() => deadDeals(tenants, scopeAssets, dataAnchor), [tenants, scopeAssets, dataAnchor])
  const requirements = React.useMemo(() => tenantRequirements(deals), [deals])
  const baseFeed = React.useMemo(() => tenantFeed(displayName, leases, deals, contacts), [displayName, leases, deals, contacts])
  const emails = React.useMemo(() => emailHistory(displayName, contacts, leases, dataAnchor), [displayName, contacts, leases, dataAnchor])
  const ops = React.useMemo(() => tenantOperations(displayName, leases, dataAnchor), [displayName, leases, dataAnchor])
  const [tasks, setTasks] = React.useState<TenantTask[]>(() => seedTasks(contacts, signals.insights, today))
  const place = describePlace(scopeAssets, scopeLabel)
  const owners = React.useMemo(() => {
    const team = contacts.filter(c => c.group === "internal").map(c => c.name)
    if (team.length) return team
    const managers = [...new Set((scopeAssets ?? []).map(a => ASSET_MANAGER[a]).filter(Boolean))]
    return managers.length ? managers : ["You"]
  }, [contacts, scopeAssets])
  const links = React.useMemo(
    () => [...leases.map(l => `${l.asset}, ${l.suite ? `Unit ${l.suite}` : l.floor}`), ...deals.map(d => `${dealTypeLabel(d.dealType)} at ${d.asset}`)],
    [leases, deals],
  )
  const head = contacts.find(c => c.title === "Head of leasing")
  const headName = head?.name
  React.useEffect(() => {
    const first = headName?.split(" ")[0]
    setPageContext({
      label,
      suggestions: [
        { label: "What needs attention?", prompt: `What needs my attention with ${label} right now?` },
        { label: "Summarize the relationship", prompt: `Summarize our relationship with ${label}.` },
        { label: "Upcoming lease dates", prompt: `What are ${label}'s upcoming lease dates and options?` },
        { label: first ? `Draft an email to ${first}` : "Draft a check-in email", prompt: `Draft a short check-in email to ${headName ?? "the tenant"} at ${label}.` },
      ],
    })
    return () => setPageContext(null)
  }, [label, headName, setPageContext])

  const openEmail = React.useCallback((draft?: Partial<EmailDraft>, actionId?: string) => {
    setEmailDraft({ to: draft?.to ?? head?.name ?? "", subject: draft?.subject ?? "", body: draft?.body ?? "" })
    setEmailActionId(actionId ?? null)
    setEmailOpen(true)
  }, [head])

  const openTask = React.useCallback((draft?: Partial<TaskDraft>, actionId?: string) => {
    setTaskDraft({ title: draft?.title ?? "", owner: draft?.owner, link: draft?.link, contactName: draft?.contactName })
    setTaskActionId(actionId ?? null)
    setTaskOpen(true)
  }, [])

  const openDeals = React.useCallback(() => {
    setTab("deals")
    requestAnimationFrame(() => middleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }, [])

  const dealTask = (d: Deal) => openTask({ title: `Follow up on the ${dealTypeLabel(d.dealType).toLowerCase()} at ${d.asset}`, link: `${dealTypeLabel(d.dealType)} at ${d.asset}` })

  function openRight(next: "updates" | "tasks" | "operations", filter?: ActivityFilter) {
    setRightCollapsed(false)
    setRightTab(next)
    if (filter) setActivityFilter(filter)
    requestAnimationFrame(() => {
      const el = rightRef.current
      const top = el?.getBoundingClientRect().top ?? 0
      if (el && (top < 0 || top > window.innerHeight * 0.5)) el.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  React.useImperativeHandle(ref, () => ({ openEmail: () => openEmail(), openTask: () => openTask(), openDeals }), [openEmail, openTask, openDeals])

  function sendEmail(email: EmailDraft) {
    setLoggedEntries(prev => [{
      initials: "ES", name: "You", kind: "email", timestamp: "Just now", date: today, message: email.body.split("\n").filter(Boolean).slice(0, 2).join(" "),
      email: { direction: "sent", subject: email.subject, counterpart: email.to },
    }, ...prev])
    if (email.followUpDays) {
      setTasks(prev => [{
        id: `t-${Date.now()}`, title: `Follow up with ${email.to} on ${email.subject}`, owner: owners[0] ?? "You",
        due: addDays(today, email.followUpDays!), reminder: "1d", contactName: email.to, done: false,
      }, ...prev])
    }
    if (emailActionId) setDone(prev => new Set(prev).add(emailActionId))
    setEmailOpen(false)
    toast.success("Email sent", { description: email.followUpDays ? `Logged for ${email.to}. Follow-up set for ${fmtShort(addDays(today, email.followUpDays))}.` : `Logged to the activity for ${email.to}.` })
  }

  function createTask(task: TenantTask) {
    setTasks(prev => [task, ...prev])
    if (taskActionId) setDone(prev => new Set(prev).add(taskActionId))
    setTaskOpen(false)
    toast.success("Task created", { description: `${task.owner} is assigned, due ${fmtShort(task.due)}.` })
  }

  function toggleTask(id: string) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    if (task.done) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: false } : t)); return }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t))
    setLoggedEntries(prev => [{
      initials: "VTS", name: "Task completed", kind: "update", timestamp: "Just now", date: today, message: task.title,
      meta: { type: "Task", date: "Just now" },
    }, ...prev])
  }

  function runAction(a: RecommendedAction) {
    if (a.kind === "email") openEmail({ to: a.contactName, subject: a.subject, body: a.body }, a.id)
    else if (a.kind === "task") {
      const l = leases.find(x => x.id === a.leaseId)
      openTask({ title: a.taskTitle, owner: a.taskOwner, link: l ? `${l.asset}, ${l.suite ? `Unit ${l.suite}` : l.floor}` : undefined }, a.id)
    }
    else {
      openChat({ message: a.prompt })
      setDone(prev => new Set(prev).add(a.id))
    }
  }

  function openChange(c: ChangeItem) {
    if (c.leaseId) return jumpToLease(c.leaseId)
    if (c.dealId) {
      setTab("deals")
      setDealView("cards")
      requestAnimationFrame(() => document.getElementById(`deal-${c.dealId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }))
      return
    }
    if (c.source === "deal") return openDeals()
    if (c.source === "email") return openRight("updates", "emails")
    if (c.source === "task") return openRight("tasks")
    if (c.source === "ops") return openRight("operations")
  }

  function jumpToLease(leaseId: string) {
    setTab("leases")
    setLeaseView("cards")
    requestAnimationFrame(() => document.getElementById(`lease-${leaseId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }))
  }

  function jumpTo(signal: Signal) {
    if (signal.target === "operations") { openRight("operations"); return }
    if (signal.leaseId) {
      setTab("leases")
      setLeaseView("cards")
      requestAnimationFrame(() => document.getElementById(`lease-${signal.leaseId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }))
    } else if (signal.dealId) {
      setTab("deals")
      setDealView("cards")
      requestAnimationFrame(() => document.getElementById(`deal-${signal.dealId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }))
    }
  }

  const activity = React.useMemo(() => {
    const agents = baseFeed.filter(e => e.kind === "agent")
    const rest = baseFeed.filter(e => e.kind !== "agent")
    const all = [...loggedEntries, ...agents, ...emails, ...rest]
    const match: Record<ActivityFilter, (e: FeedEntry) => boolean> = {
      all: () => true,
      emails: e => e.kind === "email",
      meetings: e => e.kind === "comment",
      deals: e => e.kind === "agent" && e.name === "Deal Monitor",
      agents: e => e.kind === "agent",
    }
    return all.filter(match[activityFilter])
  }, [baseFeed, emails, loggedEntries, activityFilter])

  const lastEmailFor = (name: string) => [...loggedEntries, ...emails].find(e => e.kind === "email" && (e.email?.counterpart === name || e.name === name))
  const openTasks = tasks.filter(t => !t.done)
  const opsRisks: Signal[] = []
  const rising = ops.types.find(t => t.trend === "up" && t.total90d >= 5)
  if (rising) opsRisks.push({ id: `ops-${rising.category}`, severity: rising.slaPct < 80 ? "critical" : "warning", title: `Recurring ${rising.category} issues`, detail: `${rising.total90d} tickets in 90 days, ${rising.slaPct}% within SLA`, due: "Operations", target: "operations" })
  if (ops.satisfaction.trend === "down") opsRisks.push({ id: "ops-sat", severity: ops.health.score === "at-risk" ? "critical" : "warning", title: "Tenant satisfaction slipping", detail: `Rated ${ops.satisfaction.score.toFixed(1)} of 5, ${ops.satisfaction.split.detractor}% detractors`, due: "Operations", target: "operations" })
  const finance = assetFinancials(displayName, leases)
  if (finance.arrears > 0 && finance.daysPastDue > 30) opsRisks.push({ id: "fin-arrears", severity: "critical", title: "Rent in arrears", detail: `$${fmtCompact(finance.arrears)} is ${finance.daysPastDue} days past due`, due: "Finance" })
  const allRisks = [...signals.risks, ...opsRisks].sort((x, y) => (x.severity === "critical" ? 0 : x.severity === "warning" ? 1 : 2) - (y.severity === "critical" ? 0 : y.severity === "warning" ? 1 : 2))
  const opsActions: RecommendedAction[] = ops.health.recs.slice(0, 1).map((r, i) => ({ id: `ops-act-${i}`, kind: "ask", title: r.action, reason: `${r.agent} can take this on from the operations data.`, cta: `Ask ${r.agent}`, prompt: r.action }))
  const billing = contacts.find(c => c.title === "Head of leasing") ?? contacts.find(c => c.group === "tenant")
  const financeActions: RecommendedAction[] = finance.arrears > 0 && finance.daysPastDue > 30 && billing ? [{
    id: "fin-act", kind: "email", title: `Send a balance reminder to ${billing.name.split(" ")[0]}`,
    reason: `$${fmtCompact(finance.arrears)} is ${finance.daysPastDue} days past due.`, cta: "Email", contactName: billing.name,
    subject: "Outstanding balance on your account",
    body: `Hi ${billing.name.split(" ")[0]},\n\nOur records show an outstanding balance of $${finance.arrears.toLocaleString()} that is ${finance.daysPastDue} days past due. Could you confirm when we can expect payment, or let me know if there's a question on the invoice?\n\nThanks,`,
  }] : []
  const allActions = [...financeActions, ...signals.actions, ...opsActions]
  const changeFeed: ChangeItem[] = [
    ...signals.changes.map(c => ({ ...c, source: (c.text.startsWith("Renewal") ? "lease" : "deal") as ChangeItem["source"] })),
    ...[...loggedEntries, ...emails].filter(e => e.kind === "email" && e.email).map(e => ({
      date: e.date ?? today,
      text: e.email!.direction === "sent" ? `Email sent to ${e.email!.counterpart}: ${e.email!.subject}` : `Email from ${e.name}: ${e.email!.subject}`,
      source: "email" as const,
    })),
    ...loggedEntries.filter(e => e.name === "Task completed").map(e => ({ date: e.date ?? today, text: `Task completed: ${e.message}`, source: "task" as const })),
    ...tasks.filter(t => !t.id.startsWith("t-seed") && !t.done).map(t => ({ date: today, text: `Task created: ${t.title}`, source: "task" as const })),
    ...(rising ? [{ date: dataAnchor, text: `${rising.category} tickets rising, ${rising.total90d} in 90 days`, source: "ops" as const }] : []),
    ...(ops.satisfaction.trend === "down" ? [{ date: dataAnchor, text: `Tenant satisfaction slipped to ${ops.satisfaction.score.toFixed(1)} of 5`, source: "ops" as const }] : []),
  ].sort((a, b) => b.date.localeCompare(a.date))
  const actions = allActions.filter(a => !done.has(a.id))
  const mostUrgent = allRisks.find(r => r.severity === "critical") ?? allRisks[0]
  const lastTouch = [...loggedEntries, ...emails].find(e => e.kind === "email")
  const primaryContact = contacts.find(c => c.title === "Head of leasing") ?? contacts.find(c => c.group === "tenant")
  const brokerContact = contacts.find(c => c.group === "broker")
  const touchpoints = contacts.filter(c => c.group !== "internal").reduce((a, c) => a + c.touchpoints, 0)
  const staleBefore = addDays(dataAnchor, -90)
  const attention = {
    risks: allRisks.filter(r => r.severity === "critical").length,
    deals: deals.filter(d => d.status === "at-risk" || d.status === "stalled").length,
    requirements: requirements.filter(r => r.deal.stage === "Inquiry").length,
    leases: leases.filter(l => l.remaining <= 12 || l.renewalStatus === "Not renewing").length,
    contacts: contacts.filter(c => c.group !== "internal" && c.lastContact < staleBefore).length,
    tasks: openTasks.filter(t => t.due < today).length,
  }


  return (
    <div className="flex flex-1 flex-col gap-4">
      <FamilyStrip family={family} selection={selection} scopeLeases={scopeLeases} place={place} onSelect={onSelect} onShowAllAssets={onShowAllAssets} />

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:flex-1">
      <div ref={middleRef} className={cn(cardBase, "@container lg:grow-5 lg:basis-0 min-w-0 w-full scroll-mt-4")}>
        <Tabs value={tab} onValueChange={v => setTab(v as string)} className="w-full">
          <TabsList variant="line" className="mb-4 max-w-full overflow-x-auto justify-start">
            <TabsTrigger value="insights">Insights <AlertBadge n={attention.risks} label={n => `${n} critical ${n === 1 ? "risk needs" : "risks need"} attention`} /></TabsTrigger>
            <TabsTrigger value="deals">Deals <AlertBadge n={attention.deals} label={n => `${n} ${n === 1 ? "deal is" : "deals are"} at risk or stalled`} /></TabsTrigger>
            <TabsTrigger value="requirements">Requirements <AlertBadge n={attention.requirements} label={n => `${n} ${n === 1 ? "requirement has" : "requirements have"} no tour yet`} /></TabsTrigger>
            <TabsTrigger value="leases">Leases <AlertBadge n={attention.leases} label={n => `${n} ${n === 1 ? "lease expires" : "leases expire"} within 12 months or ${n === 1 ? "is" : "are"} not renewing`} /></TabsTrigger>
            <TabsTrigger value="contacts">Contacts <AlertBadge n={attention.contacts} label={n => `${n} ${n === 1 ? "contact hasn't" : "contacts haven't"} been reached in 90 days`} /></TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="insights"><PanelErrorBoundary label="Insights" resetKey={selection}>
            <div className="flex flex-col gap-4">
              <BriefCard
                signals={signals} place={place} leases={leases}
                headline={mostUrgent?.summary ?? (mostUrgent ? `${mostUrgent.title}: ${mostUrgent.detail}.` : undefined)}
                actions={<ActionsSection actions={actions} completed={allActions.length - actions.length} onRun={runAction} onDismiss={id => setDone(prev => new Set(prev).add(id))} />}
              />
              <div className="flex flex-col gap-4">
                <PipelineCard deals={deals} onOpen={openDeals} />
                <RelationshipCard lastTouch={lastTouch} nextTask={openTasks.slice().sort((x, y) => x.due.localeCompare(y.due))[0]} primary={primaryContact} broker={brokerContact} touchpoints={touchpoints} onOpen={() => setTab("contacts")} />
              </div>
              <CriticalDatesCard insights={signals.insights} onJump={jumpToLease} />
              <ChangesCard changes={changeFeed} onOpen={openChange} />
              <SignalsCard risks={allRisks} opportunities={signals.opportunities} onJump={jumpTo} />
            </div>
          </PanelErrorBoundary></TabsContent>

          <TabsContent value="info"><PanelErrorBoundary label="Info" resetKey={selection}>
            <CompanyCard name={label} logo={tenants.find(t => t === family.parent) ?? tenants[0] ?? family.parent} parent={family.parent} company={company} />
          </PanelErrorBoundary></TabsContent>

          <TabsContent value="deals"><PanelErrorBoundary label="Deals" resetKey={selection}><DealsTab deals={deals} dead={dead} where={place.where} view={dealView} onViewChange={setDealView} assets={assets} onDealClick={onDealClick} onTask={dealTask} /></PanelErrorBoundary></TabsContent>

          <TabsContent value="requirements"><PanelErrorBoundary label="Requirements" resetKey={selection}><RequirementsTab requirements={requirements} view={reqView} onViewChange={setReqView} assets={assets} where={place.where} onDealClick={onDealClick} onTask={dealTask} /></PanelErrorBoundary></TabsContent>

          <TabsContent value="leases"><PanelErrorBoundary label="Leases" resetKey={selection}>
            <LeasesTab
              insights={signals.insights} view={leaseView} onViewChange={setLeaseView} assets={assets} where={place.where}
              narrowed={place.narrowed} hasLeasesElsewhere={allEntityLeases.length > leases.length}
              onOpenLease={onOpenLease} onShowAllAssets={onShowAllAssets} onDealClick={onDealClick}
              onTask={l => openTask({ link: `${l.asset}, ${l.suite ? `Unit ${l.suite}` : l.floor}` })}
            />
          </PanelErrorBoundary></TabsContent>

          <TabsContent value="contacts"><PanelErrorBoundary label="Contacts" resetKey={selection}>
            <ContactsTab
              contacts={contacts} tasks={tasks} lastEmailFor={lastEmailFor}
              onEmail={c => openEmail({ to: c.name })}
              onTask={c => openTask({ title: `Follow up with ${c.name}`, contactName: c.name })}
              onOpenEmails={() => openRight("updates", "emails")}
              onOpenTasks={() => openRight("tasks")}
            />
          </PanelErrorBoundary></TabsContent>
        </Tabs>
      </div>

      <div ref={rightRef} className={cn(cardBase, "@container min-w-0 w-full scroll-mt-4 transition-all duration-300", rightCollapsed ? "lg:w-14 lg:shrink-0 lg:!px-3 lg:!py-3" : "lg:grow-3 lg:basis-0")}>
        <Tabs value={rightTab} onValueChange={v => setRightTab(v as string)} className="w-full">
          <div className="flex items-center gap-1 mb-4 min-w-0">
            <Tooltip>
              <TooltipTrigger render={<div className="hidden lg:block shrink-0" />}>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => setRightCollapsed(c => !c)}
                  aria-label={rightCollapsed ? "Expand side panel" : "Collapse side panel"}
                  className="hidden lg:flex h-6 w-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", rightCollapsed && "rotate-180")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs font-medium">{rightCollapsed ? "Expand" : "Collapse"}</TooltipContent>
            </Tooltip>
            <TabsList variant="line" className={cn("max-w-full overflow-x-auto justify-start", rightCollapsed && "lg:hidden")}>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="tasks">Tasks <AlertBadge n={attention.tasks} label={n => `${n} overdue ${n === 1 ? "task" : "tasks"}`} /></TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
          </div>

          <div className={cn(rightCollapsed && "lg:hidden")}>
          <TabsContent value="updates"><PanelErrorBoundary label="Updates" resetKey={selection}>
            <div className="flex flex-col gap-4">
              <div className="flex">
                <ToggleGroup type="single" value={activityFilter} onValueChange={v => { if (typeof v === "string" && v) setActivityFilter(v as ActivityFilter) }} className={cn(FILTER_TAB_GROUP_CLS, "w-full")}>
                  <ToggleGroupItem value="all" size="sm" className={cn(FILTER_TAB_ITEM_CLS, "flex-1")}>All</ToggleGroupItem>
                  <ToggleGroupItem value="emails" size="sm" className={cn(FILTER_TAB_ITEM_CLS, "flex-1")}>Emails</ToggleGroupItem>
                  <ToggleGroupItem value="meetings" size="sm" className={cn(FILTER_TAB_ITEM_CLS, "flex-1")}>Meetings</ToggleGroupItem>
                  <ToggleGroupItem value="deals" size="sm" className={cn(FILTER_TAB_ITEM_CLS, "flex-1")}>Deals</ToggleGroupItem>
                  <ToggleGroupItem value="agents" size="sm" className={cn(FILTER_TAB_ITEM_CLS, "flex-1")}>Agents</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <ActivityFeed
                key={`${selection}-${activityFilter}`}
                entries={activity}
                showLogTour={false}
                draftPrompt={`Draft a relationship update for ${label} covering their footprint ${place.where}, upcoming expirations, and recent conversations.`}
              />
            </div>
          </PanelErrorBoundary></TabsContent>

          <TabsContent value="tasks"><PanelErrorBoundary label="Tasks" resetKey={selection}>
            <TasksTab tasks={tasks} today={today} onToggle={toggleTask} onNew={() => openTask()} />
          </PanelErrorBoundary></TabsContent>

          <TabsContent value="documents"><PanelErrorBoundary label="Documents" resetKey={selection}><DocumentsTab leases={leases} where={place.where} onOpenLease={onOpenLease} /></PanelErrorBoundary></TabsContent>

          <TabsContent value="operations"><PanelErrorBoundary label="Operations" resetKey={selection}><OperationsTab ops={ops} onAsk={message => openChat({ message })} /></PanelErrorBoundary></TabsContent>
          </div>
        </Tabs>
      </div>
      </div>

      <TenantEmailDialog open={emailOpen} onOpenChange={setEmailOpen} contacts={contacts} draft={emailDraft} tenantName={displayName} onSend={sendEmail} />
      <TenantTaskDialog open={taskOpen} onOpenChange={setTaskOpen} draft={taskDraft} owners={owners} links={links} defaultDue={addDays(today, 7)} onCreate={createTask} />
    </div>
  )
})

function IconAvatar({ icon: Icon, size, className }: { icon: React.ElementType; size?: "sm" | "default"; className?: string }) {
  return (
    <Avatar size={size}>
      <AvatarFallback className={className}><Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} /></AvatarFallback>
    </Avatar>
  )
}

function AlertBadge({ n, label: describe }: { n: number; label: (n: number) => string }) {
  if (!n) return null
  const label = describe(n)
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Badge className="ml-1 h-4 min-w-4 px-1 tabular-nums" aria-label={label}>{n}</Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  )
}

function FamilyStrip({ family, selection, scopeLeases, place, onSelect, onShowAllAssets }: {
  family: TenantFamily
  selection: string
  scopeLeases: Lease[]
  place: Place
  onSelect: (s: string) => void
  onShowAllAssets: () => void
}) {
  const [pending, setPending] = React.useState<{ key: string; name: string; inScope: number; elsewhere: number } | null>(null)
  const sfFor = (names: string[]) => scopeLeases.filter(l => names.includes(l.tenant)).reduce((a, l) => a + l.sf, 0)
  const countsFor = (key: string) => {
    const names = entityTenants(key)
    const inScope = scopeLeases.filter(l => names.includes(l.tenant)).length
    const total = LEASES.filter(l => names.includes(l.tenant)).length
    return { inScope, elsewhere: total - inScope }
  }
  function choose(key: string, name: string) {
    if (key === selection) return
    const { inScope, elsewhere } = countsFor(key)
    if (place.narrowed && elsewhere > 0) { setPending({ key, name, inScope, elsewhere }); return }
    onSelect(key)
  }
  const where = place.where.replace(/^(at|in) /, "")
  const leaseMembers = family.members.filter(m => m.hasLeases).map(m => m.name)
  const aggregateKey = `${AGGREGATE_PREFIX}${family.parent}`
  const items = [
    ...(leaseMembers.length > 1 ? [{ key: aggregateKey, name: `All of ${family.parent}`, role: "Combined", sf: sfFor(leaseMembers), hasLeases: true, aggregate: true }] : []),
    ...family.members.map(m => ({ key: m.name, name: m.name, role: m.role, sf: sfFor([m.name]), hasLeases: m.hasLeases, aggregate: false })),
  ]

  return (
    <div className={cn(cardBase, "!p-3")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-1 mb-2">
        <p className="text-sm font-semibold text-foreground">Corporate family</p>
        <p className="text-xs text-muted-foreground">Square footage {place.where}</p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {items.map(item => {
          const selected = item.key === selection
          const status = !item.hasLeases ? "No leases" : item.sf ? `${fmtCompact(item.sf)} sf` : "In portfolio"
          return (
            <Button
              key={item.key}
              variant="outline"
              disabled={!item.hasLeases}
              onClick={() => choose(item.key, item.name)}
              aria-pressed={selected}
              className={cn(
                "h-auto gap-2.5 rounded-xl px-3 py-2 justify-start text-left font-normal",
                selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/60",
                item.hasLeases && !item.sf && !selected && "opacity-70",
              )}
            >
              {item.aggregate
                ? <IconAvatar icon={Layers} size="sm" className="bg-primary/15 text-primary" />
                : <TenantAvatar name={item.name} />}
              <span className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate max-w-44">{item.name}</span>
                <span className="flex gap-2 text-xs text-muted-foreground whitespace-nowrap"><span>{item.role}</span><span className="font-medium text-foreground/70 tabular-nums">{status}</span></span>
              </span>
            </Button>
          )
        })}
        {family.otherCount > 0 && (
          <span className="shrink-0 px-2 text-xs text-muted-foreground whitespace-nowrap">
            +{family.otherCount} other {family.otherCount === 1 ? "subsidiary" : "subsidiaries"} without leases
          </span>
        )}
      </div>
      <AlertDialog open={pending !== null} onOpenChange={open => { if (!open) setPending(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to all assets?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending && (pending.inScope === 0
                ? `${pending.name} has no leases at ${where}. Switch to all assets to see their ${pending.elsewhere} ${pending.elsewhere === 1 ? "lease" : "leases"} across your portfolio.`
                : `${pending.name} has ${pending.inScope} ${pending.inScope === 1 ? "lease" : "leases"} at ${where} and ${pending.elsewhere} more across your portfolio. Switch to all assets to see everything.`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(pending && pending.inScope > 0 && "sm:flex-col-reverse sm:justify-start")}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {pending && pending.inScope > 0 && (
              <AlertDialogAction variant="outline" onClick={() => { onSelect(pending.key); setPending(null) }}>
                Stay at {where}
              </AlertDialogAction>
            )}
            <AlertDialogAction onClick={() => { if (pending) { onSelect(pending.key); onShowAllAssets() } setPending(null) }}>
              Switch to all assets
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


function AgentKpi({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "alert" }) {
  return (
    <div className="rounded-lg border border-primary/25 bg-primary/15 p-3 flex flex-col gap-1 min-w-0">
      <p className="text-xs text-sidebar-foreground/60 truncate">{label}</p>
      <p className={cn("text-xl font-semibold tabular-nums leading-tight", tone === "alert" ? "text-destructive" : "text-sidebar-foreground")}>{value}</p>
      <p className="text-xs text-sidebar-foreground/50 truncate">{sub}</p>
    </div>
  )
}

function BriefCard({ signals, place, leases, actions, headline, className }: { signals: ReturnType<typeof tenantSignals>; place: Place; leases: Lease[]; actions?: React.ReactNode; headline?: string; className?: string }) {
  const e = signals.exposure
  const sf = leases.reduce((a, l) => a + l.sf, 0)
  const rent = leases.reduce((a, l) => a + l.annualRent, 0)
  const assetCount = new Set(leases.map(l => l.asset)).size
  const kpis: { label: string; value: string; sub: string; tone?: "alert" }[] = leases.length ? [
    { label: "Leased", value: `${fmtCompact(sf)} sf`, sub: `${assetCount} ${assetCount === 1 ? "asset" : "assets"}` },
    { label: "Annual rent", value: `$${fmtCompact(rent)}`, sub: `${leases.length} ${leases.length === 1 ? "lease" : "leases"}` },
  ] : []
  if (e) {
    kpis.push({ label: e.rank > 0 && e.rank <= 10 ? `Top ${e.rank} by rent` : "Material exposure", value: `${(e.rentShare * 100).toFixed(1)}%`, sub: `of ${place.share} rent` })
    if (e.rolling24Sf > 0) kpis.push({ label: "Rolling in 24 months", value: `${fmtCompact(e.rolling24Sf)} sf`, sub: `${Math.round(e.rolling24Share * 100)}% of their space`, tone: e.rolling24Share >= 0.25 ? "alert" : undefined })
  }
  return (
    <section className={cn("rounded-xl p-4 flex flex-col gap-4 bg-sidebar-accent", className)}>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-1 text-sidebar-foreground/70">VTS agents</p>
        <h2 className="text-xl font-semibold text-sidebar-foreground">Tenant intelligence</h2>
      </div>

      {headline && (
        <div className="rounded-lg px-3 py-2 flex items-center gap-2 bg-sidebar-foreground/10">
          <Sparkle className="h-4 w-4 shrink-0 text-sidebar-primary" />
          <p className="text-sm leading-snug text-sidebar-foreground/80"><span className="font-medium text-sidebar-primary">Most urgent:</span> {headline}</p>
        </div>
      )}

      {kpis.length > 0 && (
        <div className={cn("grid grid-cols-2 gap-2", kpis.length >= 3 && "sm:grid-cols-4", kpis.length === 3 && "sm:grid-cols-3")}>
          {kpis.map(k => <AgentKpi key={k.label} {...k} />)}
        </div>
      )}

      {actions}
    </section>
  )
}

function CompanyCard({ name, logo, parent, company }: { name: string; logo: string; parent: string; company: ReturnType<typeof companyProfile> }) {
  const rows = [
    { label: "Industry", value: company.industry },
    { label: "Headquarters", value: company.headquarters },
    { label: "Employees", value: company.employees },
    { label: "Founded", value: company.founded },
    { label: "Ownership", value: company.ownership },
    { label: "Parent", value: parent },
  ]
  return (
    <section className={cn(subCard, "flex flex-col gap-4")}>
      <div className="flex items-center gap-3">
        <TenantAvatar name={logo} />
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground truncate">{name}</h2>
          <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "link", size: "xs" }), "h-auto p-0")}>{company.website}</a>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{company.description}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rows.map(r => (
          <div key={r.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="text-sm font-medium text-foreground truncate">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const PIPELINE_STAGES = ["Inquiry", "Touring", "Proposal", "LOI", "Legal", "Lease Out"]

function InsightCardHeader({ icon, title, sub, badge, action }: {
  icon: React.ElementType
  title: string
  sub: string
  badge?: React.ReactNode
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5">
      <IconAvatar icon={icon} className="bg-primary/15 text-primary" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-base font-semibold text-foreground leading-none">{title}</h3>
          {badge}
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

function PipelineCard({ deals, onOpen }: { deals: Deal[]; onOpen: () => void }) {
  const sf = deals.reduce((a, d) => a + d.sf, 0)
  const flagged = deals.filter(d => d.status === "at-risk" || d.status === "stalled").length
  return (
    <section className={cn(subCard, "@container flex flex-col gap-4")}>
      <InsightCardHeader
        icon={Handshake}
        title="Deal pipeline"
        sub={deals.length ? `${deals.length} active, ${fmtCompact(sf)} sf` : "No active deals"}
        badge={flagged > 0 && <Badge variant="secondary">{flagged} need attention</Badge>}
        action={
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={onOpen} disabled={!deals.length}>
            <span className="hidden @sm:inline">View deals</span><ArrowRight className="h-3.5 w-3.5" />
          </Button>
        }
      />
      {deals.length > 0 && (
        <div className="grid grid-cols-3 gap-x-2 gap-y-3 @md:grid-cols-6">
          {PIPELINE_STAGES.map(st => {
            const n = deals.filter(d => d.stage === st).length
            return (
              <div key={st} className="flex flex-col items-center gap-1 min-w-0">
                <span className={cn("text-sm font-semibold tabular-nums", n ? "text-foreground" : "text-muted-foreground")}>{n}</span>
                <span className={cn("h-1.5 w-full rounded-full", n ? "bg-primary" : "bg-muted")} />
                <span className="text-xs text-muted-foreground text-center">{st}</span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function RelationshipCard({ lastTouch, nextTask, primary, broker, touchpoints, onOpen }: {
  lastTouch?: FeedEntry
  nextTask?: TenantTask
  primary?: Contact
  broker?: Contact
  touchpoints: number
  onOpen: () => void
}) {
  const rows = [
    { label: "Last touch", value: lastTouch?.email ? lastTouch.email.subject : "No recent emails", hint: lastTouch ? `${lastTouch.email?.direction === "sent" ? "Sent to" : "From"} ${lastTouch.email?.direction === "sent" ? lastTouch.email.counterpart : lastTouch.name}, ${lastTouch.timestamp}` : undefined },
    { label: "Next follow-up", value: nextTask ? nextTask.title : "Nothing scheduled", hint: nextTask ? `${nextTask.owner}, due ${fmtShort(nextTask.due)}` : undefined },
    { label: "Key contacts", value: primary ? primary.name : "No tenant contact", hint: broker ? `Rep: ${broker.name}, ${broker.company}` : undefined },
  ]
  return (
    <section className={cn(subCard, "@container flex flex-col gap-4")}>
      <InsightCardHeader
        icon={Users}
        title="Relationship"
        sub={`${touchpoints} touchpoints with this tenant`}
        action={
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={onOpen}>
            <span className="hidden @sm:inline">View contacts</span><ArrowRight className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <dl className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
        {rows.map(r => (
          <div key={r.label} className="min-w-0 rounded-lg bg-muted/40 p-3">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="text-sm font-medium text-foreground line-clamp-2">{r.value}</dd>
            {r.hint && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{r.hint}</p>}
          </div>
        ))}
      </dl>
    </section>
  )
}

interface CriticalDate {
  id: string
  date: string
  months: number
  kind: "Expiration" | "Notice deadline" | "Termination window" | "ROFO deadline" | "LOC renewal"
  lease: Lease
  deal?: Deal
}

function criticalDates(insights: LeaseInsight[]): CriticalDate[] {
  const out: CriticalDate[] = []
  for (const i of insights) {
    const l = i.lease
    if (l.remaining >= 0) out.push({ id: `${l.id}-exp`, date: lxdIso(l), months: l.remaining, kind: "Expiration", lease: l, deal: i.linkedDeal })
    if (i.rofoDeadline && i.rofoMonths !== undefined && i.rofoMonths >= 0) out.push({ id: `${l.id}-rofo`, date: i.rofoDeadline, months: i.rofoMonths, kind: "ROFO deadline", lease: l })
    if (i.deposit?.renewal && i.deposit.renewalMonths !== undefined && i.deposit.renewalMonths >= 0) out.push({ id: `${l.id}-loc`, date: i.deposit.renewal, months: i.deposit.renewalMonths, kind: "LOC renewal", lease: l })
    if (i.noticeDeadline && i.noticeMonths !== undefined && i.noticeMonths >= 0) out.push({ id: `${l.id}-notice`, date: i.noticeDeadline, months: i.noticeMonths, kind: "Notice deadline", lease: l })
    if (i.terminationDate && i.terminationMonths !== undefined && i.terminationMonths >= 0 && i.options.some(o => o.startsWith("Termination"))) {
      out.push({ id: `${l.id}-term`, date: i.terminationDate, months: i.terminationMonths, kind: "Termination window", lease: l })
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

function urgency(months: number) {
  if (months <= 6) return { badge: "bg-destructive/10 text-destructive", text: "text-destructive" }
  if (months <= 12) return { badge: "bg-warning/15 text-warning", text: "text-warning" }
  return { badge: "bg-muted text-muted-foreground", text: "text-foreground" }
}

function CriticalDatesCard({ insights, onJump }: { insights: LeaseInsight[]; onJump: (leaseId: string) => void }) {
  const [all, setAll] = React.useState(false)
  const dates = React.useMemo(() => criticalDates(insights), [insights])
  const soon = dates.filter(d => d.months <= 12).length
  const shown = all ? dates : dates.slice(0, 4)
  return (
    <section className={cn(subCard, "flex flex-col gap-3")}>
      <div className="flex items-center gap-2.5">
        <IconAvatar icon={CalendarClock} className="bg-warning/15 text-warning" />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-none">Critical dates</h3>
          <p className="text-xs text-muted-foreground mt-1">{soon ? `${soon} in the next 12 months` : "Nothing in the next 12 months"}</p>
        </div>
        <Badge variant="secondary" className="min-w-6 h-6 tabular-nums">{dates.length}</Badge>
      </div>
      {dates.length === 0 && <p className="text-sm text-muted-foreground">No upcoming lease dates.</p>}
      <ul className="flex flex-col gap-2">
        {shown.map(d => {
          const u = urgency(d.months)
          const dt = new Date(`${d.date}T00:00:00`)
          return (
            <li key={d.id}>
              <Button
                variant="outline" onClick={() => onJump(d.lease.id)}
                className="w-full h-auto justify-start gap-3 rounded-lg border-border bg-card px-3 py-2.5 text-left font-normal whitespace-normal group hover:bg-muted/40"
              >
                <span className="flex w-11 shrink-0 flex-col items-center rounded-md bg-muted/60 py-1">
                  <span className="text-xs uppercase text-muted-foreground">{dt.toLocaleDateString("en-US", { month: "short" })}</span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{dt.getFullYear()}</span>
                </span>
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary">{d.kind}</span>
                    <Badge className={cn("h-4 px-1.5", u.badge)}>{d.months === 0 ? "This month" : `In ${d.months} ${d.months === 1 ? "month" : "months"}`}</Badge>
                    {d.deal && <Badge variant="secondary" className="h-4 px-1.5">{dealTypeLabel(d.deal.dealType)} in {d.deal.stage}</Badge>}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.lease.tenant}, {d.lease.asset}, {leaseUnit(d.lease)}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              </Button>
            </li>
          )
        })}
      </ul>
      {dates.length > 4 && (
        <Button variant="link" size="sm" className="h-auto p-0 self-start text-xs" onClick={() => setAll(a => !a)}>
          {all ? "Show less" : `Show all ${dates.length}`}
        </Button>
      )}
    </section>
  )
}

type ChangeItem = { date: string; text: string; source: "deal" | "lease" | "email" | "task" | "ops"; dealId?: string; leaseId?: string }

const CHANGE_CTA: Record<ChangeItem["source"], string> = { deal: "Deals", lease: "Leases", email: "Updates", task: "Tasks", ops: "Operations" }

const CHANGE_ICON: Record<ChangeItem["source"], React.ElementType> = { deal: Handshake, lease: Building2, email: Mail, task: ListTodo, ops: Wrench }

function ChangesCard({ changes, onOpen }: { changes: ChangeItem[]; onOpen: (c: ChangeItem) => void }) {
  const [all, setAll] = React.useState(false)
  const shown = all ? changes : changes.slice(0, 4)
  return (
    <section className={cn(subCard, "flex flex-col gap-3")}>
      <div className="flex items-center gap-2.5">
        <IconAvatar icon={History} className="bg-primary/15 text-primary" />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-none">What changed</h3>
          <p className="text-xs text-muted-foreground mt-1">Deals, leases, emails, tasks and operations</p>
        </div>
        <Badge variant="secondary" className="min-w-6 h-6 tabular-nums">{changes.length}</Badge>
      </div>
      {changes.length === 0
        ? <p className="text-sm text-muted-foreground">Nothing has changed recently.</p>
        : (
          <ol className="flex flex-col gap-2">
            {shown.map(c => (
              <li key={c.source + c.date + c.text}>
                <Button
                  variant="outline" onClick={() => onOpen(c)} aria-label={`${c.text}. Open in ${CHANGE_CTA[c.source]}`}
                  className="w-full h-auto justify-start gap-3 rounded-lg border-border bg-card px-3 py-2.5 text-left font-normal whitespace-normal group hover:bg-muted/40"
                >
                  <IconAvatar icon={CHANGE_ICON[c.source]} size="sm" className="bg-muted text-muted-foreground" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-foreground group-hover:text-primary">{c.text}</span>
                    <span className="block text-xs text-muted-foreground">{fmtShort(c.date)}</span>
                  </span>
                  <Badge variant="secondary" className="shrink-0 bg-muted font-normal text-muted-foreground">{CHANGE_CTA[c.source]}</Badge>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                </Button>
              </li>
            ))}
          </ol>
        )}
      {changes.length > 4 && (
        <Button variant="link" size="sm" className="h-auto p-0 self-start text-xs" onClick={() => setAll(a => !a)}>
          {all ? "Show less" : `Show all ${changes.length}`}
        </Button>
      )}
    </section>
  )
}

const SIGNAL_KIND = {
  risk: {
    Icon: ShieldAlert, iconCls: "bg-destructive/10 text-destructive", subtitle: "Most urgent first",
    tag: (s: Signal) => s.severity === "critical" ? { label: "Critical", cls: "bg-destructive/10 text-destructive" } : s.severity === "warning" ? { label: "Watch", cls: "bg-warning/15 text-warning" } : { label: "Info", cls: "bg-primary/10 text-primary" },
  },
  opportunity: {
    Icon: TrendingUp, iconCls: "bg-success/10 text-success", subtitle: "Biggest upside first",
    tag: (_s: Signal): { label: string; cls: string } | null => null,
  },
}

function SignalCard({ kind, title, empty, signals, onJump, embedded }: {
  kind: keyof typeof SIGNAL_KIND
  title: string
  empty: string
  signals: Signal[]
  onJump: (s: Signal) => void
  embedded?: boolean
}) {
  const [all, setAll] = React.useState(false)
  const cfg = SIGNAL_KIND[kind]
  const shown = all ? signals : signals.slice(0, 5)
  return (
    <section className={cn(!embedded && subCard, "flex flex-col gap-3")}>
      {!embedded && (
        <div className="flex items-center gap-2.5">
          <IconAvatar icon={cfg.Icon} className={cfg.iconCls} />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground leading-none">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{cfg.subtitle}</p>
          </div>
          <Badge variant="secondary" className="min-w-6 h-6 tabular-nums">{signals.length}</Badge>
        </div>
      )}
      {signals.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      <ul className="flex flex-col gap-2">
        {shown.map(s => {
          const tag = cfg.tag(s)
          const linked = Boolean(s.leaseId || s.dealId || s.target)
          return (
            <li key={s.id}>
              <Button
                variant="outline" onClick={() => onJump(s)} disabled={!linked}
                className={cn(
                  "w-full h-auto justify-start gap-3 rounded-lg border-border bg-card px-3 py-2.5 text-left font-normal whitespace-normal group disabled:opacity-100",
                  linked ? "hover:bg-muted/40" : "cursor-default",
                )}
              >
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-foreground group-enabled:group-hover:text-primary">{s.title}</span>
                    {tag && <Badge className={cn("h-4 px-1.5", tag.cls)}>{tag.label}</Badge>}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.detail}</span>
                </span>
                {s.due && <Badge variant="secondary" className="shrink-0 bg-muted font-normal text-muted-foreground">{s.due}</Badge>}
                {linked && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />}
              </Button>
            </li>
          )
        })}
      </ul>
      {signals.length > 5 && (
        <Button variant="link" size="sm" className="h-auto p-0 self-start text-xs" onClick={() => setAll(a => !a)}>
          {all ? "Show less" : `Show all ${signals.length}`}
        </Button>
      )}
    </section>
  )
}

function SignalsCard({ risks, opportunities, onJump }: { risks: Signal[]; opportunities: Signal[]; onJump: (s: Signal) => void }) {
  const [view, setView] = React.useState("risks")
  return (
    <section className={cn(subCard, "flex flex-col gap-3")}>
      <Tabs value={view} onValueChange={v => setView(v as string)} className="w-full">
        <div className="flex items-center gap-2.5 mb-3 min-w-0">
          <IconAvatar icon={view === "risks" ? ShieldAlert : TrendingUp} className={view === "risks" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"} />
          <TabsList variant="line" className="min-w-0 max-w-full overflow-x-auto justify-start">
            <TabsTrigger value="risks">Risks <Badge variant="secondary" className="ml-1 h-4 px-1.5 tabular-nums">{risks.length}</Badge></TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities <Badge variant="secondary" className="ml-1 h-4 px-1.5 tabular-nums">{opportunities.length}</Badge></TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="risks"><SignalCard embedded kind="risk" title="Risks" empty="No risks found." signals={risks} onJump={onJump} /></TabsContent>
        <TabsContent value="opportunities"><SignalCard embedded kind="opportunity" title="Opportunities" empty="No opportunities found yet." signals={opportunities} onJump={onJump} /></TabsContent>
      </Tabs>
    </section>
  )
}

function ActionsSection({ actions, completed, onRun, onDismiss }: {
  actions: RecommendedAction[]
  completed: number
  onRun: (a: RecommendedAction) => void
  onDismiss: (id: string) => void
}) {
  const KindIcon = (kind: RecommendedAction["kind"]) => kind === "email" ? Mail : kind === "task" ? ListTodo : Zap
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-sidebar-foreground/90">Recommended actions</h3>
      <div className="rounded-lg px-3 py-2 flex items-center gap-2 bg-sidebar-foreground/10">
        <Sparkle className="h-4 w-4 shrink-0 text-sidebar-primary" />
        <p className="text-sm leading-snug text-sidebar-foreground/70">
          {actions.length > 0
            ? <><span className="text-sidebar-primary font-medium">{actions.length} {actions.length === 1 ? "action" : "actions"}</span> to protect and grow this relationship{completed > 0 ? `, ${completed} done` : ""}</>
            : <>You are caught up{completed > 0 ? `, ${completed} done` : ""}</>}
        </p>
      </div>

      {actions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {actions.map(a => {
            const Icon = KindIcon(a.kind)
            return (
              <li key={a.id} className="rounded-lg border border-primary/25 bg-primary/15 p-3">
                <div className="flex items-start sm:items-center gap-2.5">
                  <Icon className="h-4 w-4 mt-0.5 sm:mt-0 shrink-0 text-sidebar-primary" />
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <p className="text-sm font-medium leading-snug text-sidebar-foreground/90">{a.title}</p>
                      <p className="text-sm text-sidebar-foreground/60 leading-snug">{a.reason}</p>
                    </div>
                    <Button variant="outline" size="sm" className={cn("shrink-0 self-start sm:self-auto gap-1", sidebarBtn)} onClick={() => onRun(a)}>
                      {a.kind === "ask" ? <Sparkle className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                      {a.cta}
                    </Button>
                  </div>
                  <Button
                    variant="ghost" size="icon-sm" aria-label={`Dismiss ${a.title}`}
                    className="h-6 w-6 -mr-1 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
                    onClick={() => onDismiss(a.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function StageTracker({ stage }: { stage: string }) {
  const idx = DEAL_STAGES.indexOf(stage)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1" aria-label={`Stage ${idx + 1} of ${DEAL_STAGES.length}: ${stage}`}>
        {DEAL_STAGES.map((s, i) => (
          <span key={s} className={cn("h-1.5 flex-1 rounded-full", i <= idx ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{stage}</span>, stage {idx + 1} of {DEAL_STAGES.length}
      </p>
    </div>
  )
}

function DealStatusBadge({ deal }: { deal: Deal }) {
  if (deal.status === "at-risk") return <Badge variant="destructive">At risk</Badge>
  if (deal.status === "stalled") return <Badge className="bg-warning/15 text-warning border-transparent">Stalled</Badge>
  return null
}

function OpenDealIcon({ deal, onDealClick }: { deal: Deal; onDealClick: (d: Deal) => void }) {
  return (
    <Button variant="ghost" size="icon-sm" aria-label={`Open ${deal.tenant} deal at ${deal.asset}`} className="text-muted-foreground hover:text-foreground" onClick={() => onDealClick(deal)}>
      <ArrowRight className="h-3.5 w-3.5" />
    </Button>
  )
}

type DealRow = { deal: Deal; dead?: undefined } | { deal?: undefined; dead: ReturnType<typeof deadDeals>[number] }

function DealsTable({ deals, dead, onDealClick }: { deals: Deal[]; dead: ReturnType<typeof deadDeals>; onDealClick: (d: Deal) => void }) {
  const rows = React.useMemo<DealRow[]>(() => [...deals.map(deal => ({ deal })), ...dead.map(d => ({ dead: d }))], [deals, dead])
  const columns = React.useMemo<ColumnDef<DealRow>[]>(() => [
    {
      id: "deal", accessorFn: r => r.deal ? `${r.deal.tenant} ${r.deal.asset}` : `${r.dead!.tenant} ${r.dead!.asset}`, header: colHeader<DealRow>("Deal"),
      cell: ({ row }) => {
        const r = row.original
        const tenant = r.deal ? r.deal.tenant : r.dead!.tenant
        const sub = r.deal ? `${dealTypeLabel(r.deal.dealType)} at ${r.deal.asset}` : `${dealTypeLabel(r.dead!.dealType)} at ${r.dead!.asset}`
        return <StackCell avatar={tenant} title={tenant} sub={sub} />
      },
    },
    {
      id: "stage", accessorFn: r => r.deal ? DEAL_STAGES.indexOf(r.deal.stage) : -1, header: colHeader<DealRow>("Stage"),
      cell: ({ row }) => {
        const r = row.original
        if (r.dead) {
          return (
            <div className="whitespace-normal">
              <div className="flex flex-wrap items-center gap-1.5"><span className="text-muted-foreground">{r.dead.stageReached}</span><Badge variant="secondary" className="bg-muted text-muted-foreground">Dead</Badge></div>
              <p className="text-xs tabular-nums text-muted-foreground">Lost {fmtShort(r.dead.lostOn).replace(/, \d{4}$/, "")}</p>
            </div>
          )
        }
        const d = r.deal
        return (
          <div className="whitespace-normal">
            <div className="flex flex-wrap items-center gap-1.5"><span>{d.stage}</span><DealStatusBadge deal={d} /></div>
            <p className={cn("text-xs tabular-nums", d.stalledDays ? "text-warning" : "text-muted-foreground")}>
              {d.stalledDays ? `Stalled ${d.stalledDays} days` : `Updated ${fmtShort(d.lastUpdated).replace(/, \d{4}$/, "")}`}
            </p>
          </div>
        )
      },
    },
    {
      id: "sf", accessorFn: r => r.deal ? r.deal.sf : r.dead!.sf, header: colHeader<DealRow>("Size", true),
      cell: ({ row }) => {
        const r = row.original
        if (r.dead) {
          return (
            <div className="text-right">
              <p className="tabular-nums whitespace-nowrap">{fmtCompact(r.dead.sf)} sf</p>
              <p className="text-xs text-muted-foreground">{r.dead.reason}</p>
            </div>
          )
        }
        const d = r.deal
        const diff = d.ner - d.budgetNer
        return (
          <div className="text-right whitespace-normal">
            <p className="tabular-nums whitespace-nowrap">{fmtCompact(d.sf)} sf</p>
            <p className={cn("text-xs tabular-nums", !d.ner ? "text-muted-foreground" : diff >= 0 ? "text-success" : "text-destructive")}>
              {d.ner ? `$${d.ner.toFixed(0)} NER (${diff >= 0 ? "+" : ""}${diff.toFixed(0)})` : "NER pending"}
            </p>
          </div>
        )
      },
    },
    {
      id: "open", header: () => <span className="sr-only">Open</span>, enableSorting: false,
      cell: ({ row }) => row.original.deal ? <OpenDealIcon deal={row.original.deal} onDealClick={onDealClick} /> : null,
    },
  ], [onDealClick])
  return <DataTable columns={columns} data={rows} initialSorting={[{ id: "stage", desc: true }]} enablePagination={rows.length > 10} {...TABLE_PROPS} />
}

function DealsTab({ deals, dead, where, view, onViewChange, assets, onDealClick, onTask }: {
  deals: Deal[]
  dead: ReturnType<typeof deadDeals>
  where: string
  view: ProfileView
  onViewChange: (v: ProfileView) => void
  assets: MapAsset[]
  onDealClick: (d: Deal) => void
  onTask: (d: Deal) => void
}) {
  const [sortBy, setSortBy] = React.useState("stage")
  const sorted = React.useMemo(() => [...deals].sort((a, b) =>
    sortBy === "updated" ? b.lastUpdated.localeCompare(a.lastUpdated)
      : sortBy === "size" ? b.sf - a.sf
      : sortBy === "tenant" ? a.tenant.localeCompare(b.tenant)
      : DEAL_STAGES.indexOf(b.stage) - DEAL_STAGES.indexOf(a.stage)), [deals, sortBy])
  return (
    <section className="flex flex-col gap-4">
      {deals.length === 0
        ? <p className="text-sm text-muted-foreground">No active deals {where}.</p>
        : <TabToolbar view={view} onChange={onViewChange} sort={<SortSelect options={DEAL_SORTS} value={sortBy} onChange={setSortBy} />} />}
      {(deals.length > 0 || dead.length > 0) && view === "table" && <div className="hidden @xl:block"><DealsTable deals={deals} dead={dead} onDealClick={onDealClick} /></div>}
      {deals.length > 0 && view === "map" && <DealsMap deals={deals} assets={assets} where={where} />}
      <div className={cn("grid grid-cols-1 @2xl:grid-cols-2 gap-3", view === "map" && "hidden", view === "table" && "@xl:hidden")}>
        {sorted.map(d => {
          const diff = d.ner - d.budgetNer
          const stalled = d.status === "stalled" || d.status === "at-risk"
          return (
            <EntityCard key={d.id} id={`deal-${d.id}`} tone={stalled ? "warning" : undefined}>
              <EntityHeader avatar={d.tenant} title={d.tenant} sub={`${dealTypeLabel(d.dealType)} at ${d.asset}${d.space ? `, ${d.space}` : ""}`} badges={<DealStatusBadge deal={d} />} />
              <StageTracker stage={d.stage} />
              <StatStrip stats={[
                { label: "Size", value: `${fmtCompact(d.sf)} sf`, hint: d.term ? `${Math.round(d.term / 12)} yr term` : "Term pending" },
                {
                  label: "NER", value: d.ner > 0 ? `$${d.ner.toFixed(2)}` : "Pending",
                  tone: d.ner > 0 ? (diff >= 0 ? "text-success" : "text-destructive") : "text-muted-foreground",
                  hint: `$${d.budgetNer.toFixed(0)} budget`,
                },
                stalled && d.stalledDays
                  ? { label: "Stalled", value: `${d.stalledDays} days`, tone: "text-warning", hint: "Follow up" }
                  : { label: "Updated", value: fmtShort(d.lastUpdated).replace(/, \d{4}$/, ""), hint: `By ${d.contact?.split(" ")[0] ?? "team"}` },
              ]} />
              <CardActions>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onTask(d)}><ListTodo className="h-3.5 w-3.5" />New task</Button>
                <Button size="sm" className="gap-1.5" onClick={() => onDealClick(d)}>Open deal<ArrowRight className="h-3.5 w-3.5" /></Button>
              </CardActions>
            </EntityCard>
          )
        })}
        {dead.map(d => (
          <EntityCard key={d.id}>
            <EntityHeader
              avatar={d.tenant}
              title={d.tenant}
              sub={`${dealTypeLabel(d.dealType)} at ${d.asset}`}
              badges={<Badge variant="secondary" className="bg-muted text-muted-foreground">Dead</Badge>}
            />
            <p className="text-sm text-muted-foreground">{d.reason}</p>
            <StatStrip stats={[
              { label: "Size", value: `${fmtCompact(d.sf)} sf`, hint: dealTypeLabel(d.dealType) },
              { label: "Reached", value: d.stageReached, hint: "Furthest stage" },
              { label: "Lost", value: fmtShort(d.lostOn).replace(/, \d{4}$/, ""), hint: d.lostOn.slice(0, 4) },
            ]} />
          </EntityCard>
        ))}
      </div>
    </section>
  )
}

function RequirementsTable({ requirements, onDealClick }: { requirements: TenantRequirement[]; onDealClick: (d: Deal) => void }) {
  const columns = React.useMemo<ColumnDef<TenantRequirement>[]>(() => [
    {
      id: "tenant", accessorFn: r => r.deal.tenant, header: colHeader<TenantRequirement>("Requirement"),
      cell: ({ row }) => <StackCell avatar={row.original.deal.tenant} title={row.original.deal.tenant} sub={`Matched to ${row.original.deal.asset}`} />,
    },
    {
      id: "size", accessorFn: r => r.sizeMax, header: colHeader<TenantRequirement>("Size", true),
      cell: ({ row }) => (
        <div className="text-right whitespace-normal">
          <p className="tabular-nums">{fmtCompact(row.original.sizeMin)} to {fmtCompact(row.original.sizeMax)} sf</p>
          <p className="text-xs text-muted-foreground tabular-nums">Up to ${row.original.targetRent.toFixed(0)}/sf</p>
        </div>
      ),
    },
    {
      id: "occupancy", accessorFn: r => r.occupancy, header: colHeader<TenantRequirement>("Occupancy"),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <p className="whitespace-nowrap">{row.original.occupancy}</p>
          <p className="text-xs text-muted-foreground">{row.original.floors}</p>
        </div>
      ),
    },
    { id: "stage", accessorFn: r => DEAL_STAGES.indexOf(r.deal.stage), header: colHeader<TenantRequirement>("Stage"), cell: ({ row }) => <Badge variant="secondary">{row.original.deal.stage}</Badge> },
    { id: "open", header: () => <span className="sr-only">Open</span>, enableSorting: false, cell: ({ row }) => <OpenDealIcon deal={row.original.deal} onDealClick={onDealClick} /> },
  ], [onDealClick])
  return <DataTable columns={columns} data={requirements} initialSorting={[{ id: "size", desc: true }]} enablePagination={requirements.length > 10} {...TABLE_PROPS} />
}

function RequirementsTab({ requirements, view, onViewChange, assets, where, onDealClick, onTask }: {
  requirements: TenantRequirement[]
  view: ProfileView
  onViewChange: (v: ProfileView) => void
  assets: MapAsset[]
  where: string
  onDealClick: (d: Deal) => void
  onTask: (d: Deal) => void
}) {
  const [sortBy, setSortBy] = React.useState("size")
  const sorted = React.useMemo(() => [...requirements].sort((a, b) =>
    sortBy === "occupancy" ? occupancyKey(a.occupancy).localeCompare(occupancyKey(b.occupancy))
      : sortBy === "stage" ? DEAL_STAGES.indexOf(b.deal.stage) - DEAL_STAGES.indexOf(a.deal.stage)
      : sortBy === "tenant" ? a.deal.tenant.localeCompare(b.deal.tenant)
      : b.sizeMax - a.sizeMax), [requirements, sortBy])
  if (!requirements.length) return <p className="text-sm text-muted-foreground">No open requirements.</p>
  return (
    <div className="flex flex-col gap-3">
      <TabToolbar view={view} onChange={onViewChange} sort={<SortSelect options={REQ_SORTS} value={sortBy} onChange={setSortBy} />} />
      {view === "table" && <div className="hidden @xl:block"><RequirementsTable requirements={requirements} onDealClick={onDealClick} /></div>}
      {view === "map" && <DealsMap deals={requirements.map(r => r.deal)} assets={assets} where={where} />}
      {view !== "map" && <div className={cn(view === "table" && "@xl:hidden")}><RequirementCards requirements={sorted} onDealClick={onDealClick} onTask={onTask} /></div>}
    </div>
  )
}

function RequirementCards({ requirements, onDealClick, onTask }: { requirements: TenantRequirement[]; onDealClick: (d: Deal) => void; onTask: (d: Deal) => void }) {
  return (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
      {requirements.map(r => (
        <EntityCard key={r.id}>
          <EntityHeader
            avatar={r.deal.tenant}
            title={r.deal.tenant}
            sub={`${dealTypeLabel(r.deal.dealType)} matched to ${r.deal.asset}`}
            badges={<Badge variant="secondary">{r.deal.stage}</Badge>}
          />
          <StatStrip stats={[
            { label: "Size", value: `${fmtCompact(r.sizeMax)} sf`, hint: `Min ${fmtCompact(r.sizeMin)} sf` },
            { label: "Target rent", value: `$${r.targetRent.toFixed(2)}`, hint: "Max per sf" },
            { label: "Occupancy", value: r.occupancy, hint: "Move-in" },
          ]} />
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{r.floors}</Badge>
            {r.mustHaves.map(m => <Badge key={m} variant="secondary" className="bg-muted font-normal text-muted-foreground">{m}</Badge>)}
          </div>
          <CardActions>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onTask(r.deal)}><ListTodo className="h-3.5 w-3.5" />New task</Button>
            <Button size="sm" className="gap-1.5" onClick={() => onDealClick(r.deal)}>Open deal<ArrowRight className="h-3.5 w-3.5" /></Button>
          </CardActions>
        </EntityCard>
      ))}
    </div>
  )
}

function EntityCard({ id, tone, children }: { id?: string; tone?: "warning"; children: React.ReactNode }) {
  return (
    <article id={id} className={cn("h-full scroll-mt-4 rounded-xl border bg-card p-4 flex flex-col gap-4", tone === "warning" ? "border-warning/50" : "border-border")}>
      {children}
    </article>
  )
}

function EntityHeader({ avatar, title, sub, badges }: { avatar: string; title: string; sub: string; badges?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <TenantAvatar name={avatar} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{sub}</p>
      </div>
      {badges && <div className="flex shrink-0 flex-wrap justify-end gap-1">{badges}</div>}
    </div>
  )
}

interface EntityStat { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: string; hintTone?: string }

function StatStrip({ stats }: { stats: EntityStat[] }) {
  return (
    <dl className="grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-3">
      {stats.map(st => (
        <div key={st.label} className="min-w-0">
          <dt className="text-xs text-muted-foreground truncate">{st.label}</dt>
          <dd className={cn("text-sm font-semibold tabular-nums text-foreground truncate", st.tone)}>{st.value}</dd>
          {st.hint && <p className={cn("text-xs leading-tight text-muted-foreground", st.hintTone)}>{st.hint}</p>}
        </div>
      ))}
    </dl>
  )
}

function AgentNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 rounded-lg bg-sidebar-accent px-3 py-2.5", className)}>
      <Sparkle className="h-4 w-4 shrink-0 text-sidebar-primary" />
      <p className="text-sm leading-snug text-sidebar-foreground/80">{children}</p>
    </div>
  )
}

function CardActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto flex flex-wrap gap-2 pt-1">{children}</div>
}

function OptionChips({ options }: { options: string[] }) {
  if (!options.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(o => (
        <Badge
          key={o}
          variant={o.startsWith("Termination") || o.startsWith("Contraction") ? "destructive" : "secondary"}
          className={cn("font-normal", !(o.startsWith("Termination") || o.startsWith("Contraction")) && "bg-muted text-muted-foreground")}
        >
          {o.endsWith(" Option") ? `${o.replace(" Option", "")} option` : o}
        </Badge>
      ))}
    </div>
  )
}

function LeaseCard({ insight, onOpenLease, onTask, onDealClick }: {
  insight: LeaseInsight
  onOpenLease: (l: Lease) => void
  onDealClick: (d: Deal) => void
  onTask: (l: Lease) => void
}) {
  const l = insight.lease
  const gapPct = l.marketRentPsf ? Math.round((insight.marketGapPsf / l.marketRentPsf) * 100) : 0
  const soon = l.remaining <= 12
  return (
    <EntityCard id={`lease-${l.id}`}>
      <EntityHeader
        avatar={l.tenant}
        title={l.asset}
        sub={`${l.tenant}, ${leaseUnit(l)}`}
        badges={l.renewalStatus && <Badge variant={l.renewalStatus === "Not renewing" ? "destructive" : "secondary"}>{l.renewalStatus}</Badge>}
      />
      <StatStrip stats={[
        { label: "Size", value: `${fmtCompact(l.sf)} sf`, hint: `${l.term ? Math.round(l.term / 12) : 0} yr term` },
        {
          label: "Base rent", value: `$${l.baseRent.toFixed(2)}`,
          hint: Math.abs(gapPct) >= 1 ? `${Math.abs(gapPct)}% ${gapPct > 0 ? "below" : "above"} mkt` : "At market",
          hintTone: gapPct > 0 ? "text-success" : gapPct < 0 ? "text-warning" : undefined,
        },
        { label: "Expires", value: new Date(`${lxdIso(l)}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" }), hint: `${l.remaining} months left`, tone: soon ? "text-destructive" : undefined, hintTone: soon ? "text-destructive" : undefined },
      ]} />
      {(insight.options.length > 0 || insight.linkedDeal) && (
        <div className="flex flex-wrap items-center gap-1">
          {insight.linkedDeal && (
            <Button variant="outline" size="xs" className="gap-1 rounded-full" onClick={() => onDealClick(insight.linkedDeal!)}>
              <Handshake className="h-3 w-3" />{dealTypeLabel(insight.linkedDeal.dealType)} in {insight.linkedDeal.stage}
            </Button>
          )}
          <OptionChips options={insight.options} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4">
        <AgentNote className="flex-1">{insight.insight}</AgentNote>
        <CardActions>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onTask(l)}><ListTodo className="h-3.5 w-3.5" />New task</Button>
          <Button size="sm" className="gap-1.5" onClick={() => onOpenLease(l)}><Eye className="h-3.5 w-3.5" />View abstract</Button>
        </CardActions>
      </div>
    </EntityCard>
  )
}

type ProfileView = "cards" | "table" | "map"

const VIEW_OPTIONS: { value: ProfileView; label: string; Icon: React.ElementType }[] = [
  { value: "cards", label: "Card view", Icon: LayoutGrid },
  { value: "table", label: "Table view", Icon: Table2 },
  { value: "map", label: "Map view", Icon: MapIcon },
]

function ViewToggle({ view, onChange }: { view: ProfileView; onChange: (v: ProfileView) => void }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="View">
      {VIEW_OPTIONS.map(o => (
        <Button
          key={o.value} variant="outline" size="icon" aria-label={o.label} aria-pressed={view === o.value}
          onClick={() => onChange(o.value)}
          className={cn("h-7 w-7", view === o.value && "bg-muted", o.value === "table" && "hidden @xl:inline-flex")}
        >
          <o.Icon className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  )
}

interface SortOption { value: string; label: string }

function SortSelect({ options, value, onChange }: { options: SortOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select items={options} value={value} onValueChange={v => { if (typeof v === "string") onChange(v) }}>
      <SelectTrigger size="sm" className="w-auto gap-1.5" aria-label="Sort cards">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function TabToolbar({ view, onChange, sort }: { view: ProfileView; onChange: (v: ProfileView) => void; sort?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className={cn(view === "map" && "invisible", view === "table" && "@xl:invisible")}>{sort}</div>
      <ViewToggle view={view} onChange={onChange} />
    </div>
  )
}

const LEASE_SORTS: SortOption[] = [
  { value: "expiration", label: "Soonest expiration" },
  { value: "size", label: "Largest size" },
  { value: "rent", label: "Highest rent" },
  { value: "asset", label: "Asset, A to Z" },
]
const DEAL_SORTS: SortOption[] = [
  { value: "stage", label: "Furthest stage" },
  { value: "updated", label: "Recently updated" },
  { value: "size", label: "Largest size" },
  { value: "tenant", label: "Tenant, A to Z" },
]
const REQ_SORTS: SortOption[] = [
  { value: "size", label: "Largest size" },
  { value: "occupancy", label: "Soonest move-in" },
  { value: "stage", label: "Furthest stage" },
  { value: "tenant", label: "Tenant, A to Z" },
]

function occupancyKey(q: string) {
  const [qq, y] = q.split(" ")
  return `${y}-${qq}`
}

const TABLE_PROPS = { enableColumnFilters: false, enableGlobalFilter: false, enableColumnVisibility: false } as const

function StackCell({ avatar, title, sub, note }: { avatar?: string; title: string; sub: string; note?: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {avatar && <TenantAvatar name={avatar} />}
      <div className="min-w-0">
        <p className="font-medium truncate max-w-28 @2xl:max-w-36">{title}</p>
        <p className="text-xs text-muted-foreground truncate max-w-28 @2xl:max-w-36">{sub}</p>
        {note && <p className="text-xs text-primary truncate max-w-28 @2xl:max-w-36">{note}</p>}
      </div>
    </div>
  )
}

function LeasesTable({ leases, insights, showTenant, onOpenLease }: { leases: Lease[]; insights: LeaseInsight[]; showTenant: boolean; onOpenLease: (l: Lease) => void }) {
  const insightFor = React.useMemo(() => new Map(insights.map(i => [i.lease.id, i.insight])), [insights])
  const dealFor = React.useMemo(() => new Map(insights.filter(i => i.linkedDeal).map(i => [i.lease.id, `${dealTypeLabel(i.linkedDeal!.dealType)} in ${i.linkedDeal!.stage}`])), [insights])
  const columns = React.useMemo<ColumnDef<Lease>[]>(() => [
    {
      id: "lease", accessorFn: l => `${l.tenant} ${l.asset}`, header: colHeader<Lease>(showTenant ? "Tenant" : "Asset"),
      cell: ({ row }) => {
        const l = row.original
        return (
          <StackCell
            avatar={showTenant ? l.tenant : undefined}
            title={showTenant ? l.tenant : l.asset}
            sub={showTenant ? `${l.asset}, ${leaseUnit(l)}` : leaseUnit(l)}
            note={dealFor.get(l.id)}
          />
        )
      },
    },
    {
      id: "sf", accessorKey: "sf", header: colHeader<Lease>("Size", true),
      cell: ({ row }) => {
        const gap = row.original.marketRentPsf - row.original.baseRent
        return (
          <div className="text-right whitespace-normal">
            <p className="tabular-nums whitespace-nowrap">{fmtCompact(row.original.sf)} sf</p>
            <p className={cn("text-xs tabular-nums", gap > 0 ? "text-success" : gap < 0 ? "text-destructive" : "text-muted-foreground")}>
              ${row.original.baseRent.toFixed(0)}/sf, {gap > 0 ? "below" : gap < 0 ? "above" : "at"} mkt
            </p>
          </div>
        )
      },
    },
    {
      id: "expiration", accessorFn: lxdIso, header: colHeader<Lease>("Expires"),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <p className={cn("tabular-nums whitespace-nowrap", row.original.remaining <= 12 && "text-destructive font-medium")}>{fmtShort(lxdIso(row.original))}</p>
          <p className="text-xs text-muted-foreground tabular-nums">{row.original.remaining} months</p>
        </div>
      ),
    },
    {
      id: "renewal", accessorKey: "renewalStatus", header: colHeader<Lease>("Renewal"),
      cell: ({ row }) => row.original.renewalStatus
        ? <Badge variant={row.original.renewalStatus === "Not renewing" ? "destructive" : "secondary"} className="h-auto whitespace-normal">{row.original.renewalStatus}</Badge>
        : <span className="text-muted-foreground">None</span>,
    },
    {
      id: "open", header: () => <span className="sr-only">Actions</span>, enableSorting: false,
      cell: ({ row }) => {
        const text = insightFor.get(row.original.id)
        return (
          <div className="flex items-center justify-end gap-0.5">
            {text && (
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Insight: ${text}`} className="text-primary" />}>
                  <Sparkle className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">{text}</TooltipContent>
              </Tooltip>
            )}
            <Button variant="ghost" size="icon-sm" aria-label={`Open abstract for ${row.original.asset} ${leaseUnit(row.original)}`} className="text-muted-foreground hover:text-foreground" onClick={() => onOpenLease(row.original)}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        )
      },
    },
  ], [showTenant, onOpenLease, insightFor, dealFor])
  return <DataTable columns={columns} data={leases} initialSorting={[{ id: "expiration", desc: false }]} enablePagination={leases.length > 10} {...TABLE_PROPS} />
}

function AssetMap({ assets, names, where, markerFor, statsFor, rowsFor }: {
  assets: MapAsset[]
  names: string[]
  where: string
  markerFor: (name: string) => string
  statsFor: (name: string) => { label: string; value: string; sub: string; tone?: string }[]
  rowsFor: (name: string) => { key: string; left: string; right: string }[]
}) {
  const mapAssets = React.useMemo(() => assets.filter(a => names.includes(a.name)), [assets, names])
  const markerLabel = React.useCallback((id: string) => markerFor(assets.find(a => a.id === id)?.name ?? ""), [assets, markerFor])
  const renderPopup = React.useCallback((asset: MapAsset) => {
    const stats = statsFor(asset.name)
    const body = (
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 divide-x divide-border/60">
          {stats.map((s, i) => (
            <div key={s.label} className={cn(i === 0 ? "pr-3" : i === 1 ? "px-3" : "pl-3")}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
              <p className={cn("text-xs font-medium text-muted-foreground", s.tone)}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-border/60 border-t border-border/60">
          {rowsFor(asset.name).map(r => (
            <div key={r.key} className="flex items-baseline justify-between gap-2 py-1.5 text-xs">
              <span className="truncate text-foreground">{r.left}</span>
              <span className="tabular-nums text-muted-foreground shrink-0">{r.right}</span>
            </div>
          ))}
        </div>
      </div>
    )
    return (
      <div className="w-72 sm:w-100">
        <AssetCard asset={asset} deals={[]} onClick={() => {}} body={body} />
      </div>
    )
  }, [statsFor, rowsFor])

  if (!mapAssets.length) return <p className="py-8 text-center text-sm text-muted-foreground">No assets to map {where}.</p>
  return <PortfolioMap assets={mapAssets} onAssetClick={() => {}} fixedHeight={480} hideLegend markerLabel={markerLabel} renderPopup={renderPopup} />
}

function LeasesTab({ insights, view, onViewChange, assets, where, narrowed, hasLeasesElsewhere, onOpenLease, onShowAllAssets, onTask, onDealClick }: {
  insights: LeaseInsight[]
  view: ProfileView
  onViewChange: (v: ProfileView) => void
  assets: MapAsset[]
  where: string
  narrowed: boolean
  hasLeasesElsewhere: boolean
  onOpenLease: (l: Lease) => void
  onShowAllAssets: () => void
  onTask: (l: Lease) => void
  onDealClick: (d: Deal) => void
}) {
  const [sortBy, setSortBy] = React.useState("expiration")
  const sortedInsights = React.useMemo(() => [...insights].sort((a, b) =>
    sortBy === "size" ? b.lease.sf - a.lease.sf
      : sortBy === "rent" ? b.lease.baseRent - a.lease.baseRent
      : sortBy === "asset" ? a.lease.asset.localeCompare(b.lease.asset)
      : lxdIso(a.lease).localeCompare(lxdIso(b.lease))), [insights, sortBy])
  if (!insights.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">No leases {where}.</p>
        {narrowed && hasLeasesElsewhere && <Button variant="outline" size="sm" onClick={onShowAllAssets}>Show all assets</Button>}
      </div>
    )
  }
  const leases = insights.map(i => i.lease)
  const tenantCount = new Set(leases.map(l => l.tenant)).size
  return (
    <div className="flex flex-col gap-3">
      <TabToolbar view={view} onChange={onViewChange} sort={<SortSelect options={LEASE_SORTS} value={sortBy} onChange={setSortBy} />} />
      {view === "map" && <LeasesMap leases={leases} assets={assets} where={where} />}
      {view === "table" && <div className="hidden @xl:block"><LeasesTable leases={leases} insights={insights} showTenant={tenantCount > 1} onOpenLease={onOpenLease} /></div>}
      {view !== "map" && (
        <div className={cn("grid grid-cols-1 @2xl:grid-cols-2 gap-3", view === "table" && "@xl:hidden")}>
          {sortedInsights.map(i => <LeaseCard key={i.lease.id} insight={i} onOpenLease={onOpenLease} onTask={onTask} onDealClick={onDealClick} />)}
        </div>
      )}
    </div>
  )
}

function groupByAsset<T extends { asset: string }>(items: T[]) {
  const m = new Map<string, T[]>()
  for (const it of items) m.set(it.asset, [...(m.get(it.asset) ?? []), it])
  return m
}

function LeasesMap({ leases, assets, where }: { leases: Lease[]; assets: MapAsset[]; where: string }) {
  const byAsset = React.useMemo(() => groupByAsset(leases), [leases])
  const names = React.useMemo(() => [...byAsset.keys()], [byAsset])
  const markerFor = React.useCallback((name: string) => `${fmtCompact((byAsset.get(name) ?? []).reduce((a, l) => a + l.sf, 0))} sf`, [byAsset])
  const statsFor = React.useCallback((name: string) => {
    const ls = byAsset.get(name) ?? []
    const sf = ls.reduce((a, l) => a + l.sf, 0)
    const rent = ls.reduce((a, l) => a + l.annualRent, 0)
    const next = [...ls].filter(l => l.remaining > 0).sort((a, b) => a.remaining - b.remaining)[0]
    return [
      { label: "Leased sf", value: `${fmtCompact(sf)} sf`, sub: `${ls.length} ${ls.length === 1 ? "lease" : "leases"}` },
      { label: "Annual rent", value: `$${fmtCompact(rent)}`, sub: `$${sf ? (rent / sf).toFixed(2) : "0.00"}/sf avg` },
      { label: "Next expiration", value: next ? next.lxd.split("/")[2] : "None", sub: next ? `${next.remaining} months` : "No upcoming", tone: next && next.remaining <= 12 ? "text-destructive" : "" },
    ]
  }, [byAsset])
  const rowsFor = React.useCallback((name: string) => [...(byAsset.get(name) ?? [])].sort((a, b) => lxdIso(a).localeCompare(lxdIso(b))).map(l => ({
    key: l.id, left: `${l.tenant}, ${leaseUnit(l)}`, right: `${l.sf.toLocaleString()} sf, ends ${fmtShort(lxdIso(l))}`,
  })), [byAsset])
  return <AssetMap assets={assets} names={names} where={where} markerFor={markerFor} statsFor={statsFor} rowsFor={rowsFor} />
}

function DealsMap({ deals, assets, where }: { deals: Deal[]; assets: MapAsset[]; where: string }) {
  const byAsset = React.useMemo(() => groupByAsset(deals), [deals])
  const names = React.useMemo(() => [...byAsset.keys()], [byAsset])
  const markerFor = React.useCallback((name: string) => {
    const n = (byAsset.get(name) ?? []).length
    return `${n} ${n === 1 ? "deal" : "deals"}`
  }, [byAsset])
  const statsFor = React.useCallback((name: string) => {
    const ds = byAsset.get(name) ?? []
    const sf = ds.reduce((a, d) => a + d.sf, 0)
    const furthest = [...ds].sort((a, b) => DEAL_STAGES.indexOf(b.stage) - DEAL_STAGES.indexOf(a.stage))[0]
    const risky = ds.filter(d => d.status === "at-risk" || d.status === "stalled").length
    return [
      { label: "In pipeline", value: `${fmtCompact(sf)} sf`, sub: `${ds.length} ${ds.length === 1 ? "deal" : "deals"}` },
      { label: "Furthest stage", value: furthest?.stage ?? "None", sub: furthest ? dealTypeLabel(furthest.dealType) : "" },
      { label: "Needs attention", value: String(risky), sub: risky ? "At risk or stalled" : "All on track", tone: risky ? "text-destructive" : "" },
    ]
  }, [byAsset])
  const rowsFor = React.useCallback((name: string) => (byAsset.get(name) ?? []).map(d => ({
    key: d.id, left: `${d.tenant}, ${dealTypeLabel(d.dealType).toLowerCase()}`, right: `${fmtCompact(d.sf)} sf in ${d.stage}`,
  })), [byAsset])
  return <AssetMap assets={assets} names={names} where={where} markerFor={markerFor} statsFor={statsFor} rowsFor={rowsFor} />
}

const GROUP_LABEL: Record<Contact["group"], string> = { tenant: "Tenant", broker: "Tenant rep brokers", internal: "Our team" }

function ContactsTab({ contacts, tasks, lastEmailFor, onEmail, onTask, onOpenEmails, onOpenTasks }: {
  contacts: Contact[]
  tasks: TenantTask[]
  lastEmailFor: (name: string) => FeedEntry | undefined
  onEmail: (c: Contact) => void
  onTask: (c: Contact) => void
  onOpenEmails: () => void
  onOpenTasks: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {(["tenant", "broker", "internal"] as const).map(group => {
        const list = contacts.filter(c => c.group === group)
        if (!list.length) return null
        return (
          <section key={group} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{GROUP_LABEL[group]}</h3>
              <span className="text-xs text-muted-foreground">{group === "broker" ? `${list.length} brokers` : list[0].company}</span>
            </div>
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3">
              {list.map(c => {
                const last = lastEmailFor(c.name)
                const nextTask = tasks.find(t => !t.done && t.contactName === c.name)
                return (
                  <article key={c.name} className="h-full rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
                    <ContactRow contact={c} />
                    {(last || nextTask) && (
                      <div className="flex flex-col gap-1.5 border-t border-border/60 pt-3 text-xs">
                        {last && last.email && (
                          <Button variant="link" size="xs" className="group h-auto max-w-full justify-start p-0 font-normal text-muted-foreground hover:text-foreground hover:no-underline" onClick={onOpenEmails}>
                            <span className="truncate"><span className="font-medium text-primary group-hover:underline">{last.email.direction === "sent" ? "Last email sent" : "Last email received"}:</span> {last.email.subject} ({last.timestamp})</span>
                          </Button>
                        )}
                        {nextTask && (
                          <Button variant="link" size="xs" className="group h-auto max-w-full justify-start p-0 font-normal text-muted-foreground hover:text-foreground hover:no-underline" onClick={onOpenTasks}>
                            <span className="truncate"><span className="font-medium text-primary group-hover:underline">Next task:</span> {nextTask.title}, due {fmtShort(nextTask.due)}</span>
                          </Button>
                        )}
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onTask(c)}><ListTodo className="h-3.5 w-3.5" />New task</Button>
                      {group !== "internal" && <Button size="sm" className="gap-1.5" onClick={() => onEmail(c)}><Mail className="h-3.5 w-3.5" />Email</Button>}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  const isInternal = contact.group === "internal"
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start gap-3">
        <Avatar className="size-9">
          <AvatarFallback className={cn("text-xs font-semibold", isInternal ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>{contact.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">{contact.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {contact.title}{contact.group === "broker" && `, ${contact.company}`}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 pl-12 text-xs">
        <a href={`mailto:${contact.email}`} className={cn(buttonVariants({ variant: "link", size: "xs" }), "h-auto p-0 gap-2 min-w-0 justify-start font-normal text-foreground hover:text-primary hover:no-underline")}>
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{contact.email}</span>
        </a>
        <a href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`} className={cn(buttonVariants({ variant: "link", size: "xs" }), "h-auto p-0 gap-2 self-start justify-start font-normal text-foreground hover:text-primary hover:no-underline")}>
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap tabular-nums">{contact.phone}</span>
        </a>
        <div className="flex items-start gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {contact.assets.map(a => (
              <Badge key={a} variant="secondary" className="rounded-md bg-muted font-normal text-muted-foreground">{a}</Badge>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground pt-1">
          <span className="font-medium text-foreground tabular-nums">{contact.touchpoints}</span> touchpoints, last contact {fmtShort(contact.lastContact)}
        </p>
      </div>
    </div>
  )
}

const REMINDER_LABEL: Record<TenantTask["reminder"], string> = { none: "", "1d": "1 day reminder", "1w": "1 week reminder" }

function TasksTab({ tasks, today, onToggle, onNew }: { tasks: TenantTask[]; today: string; onToggle: (id: string) => void; onNew: () => void }) {
  const [showCompleted, setShowCompleted] = React.useState(false)
  const weekOut = addDays(today, 7)
  const open = tasks.filter(t => !t.done).sort((a, b) => a.due.localeCompare(b.due))
  const sections = [
    { key: "overdue", title: "Overdue", items: open.filter(t => t.due < today), current: false },
    { key: "week", title: "Due this week", items: open.filter(t => t.due >= today && t.due <= weekOut), current: true },
    { key: "later", title: "Upcoming", items: open.filter(t => t.due > weekOut), current: false },
    { key: "done", title: "Completed", items: showCompleted ? tasks.filter(t => t.done) : [], current: false },
  ].filter(s => s.items.length > 0)

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Button
          variant="outline" size="sm"
          onClick={() => setShowCompleted(v => !v)}
          aria-pressed={showCompleted}
          className={cn("h-7 px-2.5 text-xs gap-1 font-normal text-primary border-primary/30 hover:bg-primary/5", showCompleted && "bg-primary/10 font-medium")}
        >
          Show completed
        </Button>
        <Button
          variant="outline" size="sm" onClick={onNew}
          className="h-7 px-2.5 text-xs gap-1 font-normal text-primary border-primary/30 hover:bg-primary/5 ml-auto"
        >
          <Plus className="h-3 w-3" />New task
        </Button>
      </div>

      <div className="flex flex-col gap-3 pt-3">
        {sections.length === 0 && <p className="text-sm text-muted-foreground">No open tasks.</p>}
        {sections.map(s => (
          <div key={s.key} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-0.5 pb-1">
              <span className={cn("text-sm font-semibold", s.key === "overdue" ? "text-destructive" : s.current ? "text-foreground" : "text-muted-foreground")}>{s.title}</span>
              {s.current && <Badge variant="secondary" className="h-4 px-1.5">Current</Badge>}
            </div>
            {s.items.map(t => {
              const overdue = !t.done && t.due < today
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2.5 rounded-xl border bg-card transition-colors hover:bg-muted/40",
                    t.done ? "border-border/50" : "border-border",
                  )}
                >
                  <Checkbox id={`task-${t.id}`} checked={t.done} onCheckedChange={() => onToggle(t.id)} className="mt-0.5 rounded-full" />
                  <Label htmlFor={`task-${t.id}`} className="flex-1 min-w-0 flex-col items-start gap-0 font-normal cursor-pointer">
                    <span className={cn("block text-sm font-medium leading-snug", t.done ? "line-through text-muted-foreground" : "text-foreground")}>{t.title}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{t.owner}</span>
                      <span className={cn("inline-flex items-center gap-1", overdue && "text-destructive font-medium")}><CalendarDays className="h-3 w-3" />{overdue ? "Overdue, " : ""}{fmtShort(t.due)}</span>
                      {t.link && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{t.link}</span>}
                    </span>
                  </Label>
                  {!t.done && t.reminder !== "none" && (
                    <span className="shrink-0 mt-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">{REMINDER_LABEL[t.reminder]}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const OPS_VOLUME_CONFIG = { count: { label: "Work orders", color: "var(--chart-1)" } } satisfies ChartConfig
const OPS_SAT_CONFIG = { nps: { label: "NPS", color: "var(--chart-2)" } } satisfies ChartConfig

function TrendChip({ trend, goodWhen, label }: { trend: OpsTrend; goodWhen: "up" | "down"; label: string }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const tone = trend === "flat" ? "text-muted-foreground bg-muted" : trend === goodWhen ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
  return (
    <Badge className={tone}><Icon />{label}</Badge>
  )
}

function OpsStat({ label, value, unit, sub, trend }: { label: string; value: string; unit?: string; sub: string; trend?: React.ReactNode }) {
  return (
    <div className={cn(subCard, "flex flex-col gap-1")}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground tabular-nums">
        {value}{unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        {trend}
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </div>
  )
}

// Chart props live at module scope so their identity never changes between renders.
const NPS_CHART_MARGIN = { top: 8, right: 16, bottom: 0, left: 0 }
const NPS_DOT = { r: 4, fill: "var(--color-nps)" }
const NPS_ACTIVE_DOT = { r: 5 }
const NPS_DOMAIN: [number, number] = [-60, 80]
const NPS_TICKS = [-50, 0, 50]
const BAR_CHART_MARGIN = { top: 8, right: 0, bottom: 0, left: 0 }
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

const FACES = [Angry, Frown, Meh, Smile, Laugh]
const FACE_LABELS = ["Very unhappy", "Unhappy", "Neutral", "Happy", "Very happy"]
const FACE_TONE = [
  { text: "text-destructive", bg: "bg-destructive/10", bar: "bg-destructive" },
  { text: "text-destructive", bg: "bg-destructive/10", bar: "bg-destructive/60" },
  { text: "text-warning", bg: "bg-warning/15", bar: "bg-warning" },
  { text: "text-success", bg: "bg-success/10", bar: "bg-success/70" },
  { text: "text-success", bg: "bg-success/10", bar: "bg-success" },
]

const SENTIMENT: Record<Sentiment, { label: string; hint: string; Icon: React.ElementType; text: string; bg: string; bar: string }> = {
  promoter: { label: "Promoters", hint: "Scored 9 to 10", Icon: Smile, text: "text-success", bg: "bg-success/15", bar: "[&_[data-slot=progress-indicator]]:bg-success" },
  passive: { label: "Passives", hint: "Scored 7 to 8", Icon: Meh, text: "text-warning", bg: "bg-warning/15", bar: "[&_[data-slot=progress-indicator]]:bg-warning" },
  detractor: { label: "Detractors", hint: "Scored 0 to 6", Icon: Frown, text: "text-destructive", bg: "bg-destructive/15", bar: "[&_[data-slot=progress-indicator]]:bg-destructive" },
}

function SatisfactionCard({ sat }: { sat: TenantSatisfaction }) {
  const faceIdx = Math.max(0, Math.min(4, Math.round(sat.score) - 1))
  return (
    <section className={cn(subCard, "flex flex-col gap-4")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <h3 className="text-sm font-semibold text-foreground">Tenant satisfaction</h3>
        <span className="text-xs text-muted-foreground">{sat.responses} responses to the {sat.surveyed} survey</span>
      </div>

      <div className="rounded-xl bg-muted/40 p-3 flex flex-col items-stretch gap-3 @sm:flex-row @sm:items-center @sm:gap-4">
        <div className="flex flex-col shrink-0">
          <p className="text-3xl font-semibold text-foreground tabular-nums leading-none">
            {sat.score.toFixed(1)}<span className="ml-1 text-sm font-normal text-muted-foreground">/ 5</span>
          </p>
          <p className={cn("text-sm font-medium mt-1", FACE_TONE[faceIdx].text)}>{FACE_LABELS[faceIdx]}</p>
          <p className="text-xs text-muted-foreground">Average rating</p>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2" role="img" aria-label={`Average rating ${sat.score.toFixed(1)} out of 5, ${FACE_LABELS[faceIdx].toLowerCase()}`}>
          <div className="grid grid-cols-5 gap-1">
            {FACES.map((Face, i) => (
              <span
                key={FACE_LABELS[i]}
                className={cn(
                  "flex items-center justify-center rounded-full aspect-square max-h-11 mx-auto w-full max-w-11 transition-colors",
                  i === faceIdx ? cn(FACE_TONE[i].bg, FACE_TONE[i].text, "ring-2 ring-current/30") : cn(FACE_TONE[i].text, "opacity-40"),
                )}
              >
                <Face className={i === faceIdx ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.75} />
              </span>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {FACES.map((_, i) => (
              <span key={FACE_LABELS[i]} className={cn("h-1.5 rounded-full", i <= faceIdx ? FACE_TONE[i].bar : "bg-muted")} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {(["promoter", "passive", "detractor"] as Sentiment[]).map(s => {
          const cfg = SENTIMENT[s]
          return (
            <div key={s} className="flex items-center gap-3">
              <IconAvatar icon={cfg.Icon} size="sm" className={cn(cfg.bg, cfg.text)} />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{cfg.label} <span className="text-xs font-normal text-muted-foreground">{cfg.hint}</span></span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{sat.split[s]}%</span>
                </div>
                <Progress value={sat.split[s]} className={cfg.bar} aria-label={`${cfg.label} ${sat.split[s]}%`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-border/60 pt-3">
        <p className="text-xs text-muted-foreground">NPS by quarter</p>
        <ChartContainer config={OPS_SAT_CONFIG} className="aspect-auto h-28 w-full">
          <LineChart data={sat.history} margin={NPS_CHART_MARGIN}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={6} />
            <YAxis width={28} domain={NPS_DOMAIN} ticks={NPS_TICKS} tickLine={false} axisLine={false} />
            <ReferenceLine y={0} stroke="var(--color-border)" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
            <Line dataKey="nps" type="monotone" stroke="var(--color-nps)" strokeWidth={2} dot={NPS_DOT} activeDot={NPS_ACTIVE_DOT} />
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">What tenants are saying</p>
        {sat.comments.map(c => {
          const cfg = SENTIMENT[c.sentiment]
          return (
            <figure key={c.text} className="rounded-lg bg-muted/40 p-3 flex items-start gap-2.5">
              <cfg.Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.text)} aria-label={cfg.label.replace(/s$/, "")} />
              <div className="flex flex-col gap-1 min-w-0">
                <blockquote className="text-sm text-foreground leading-snug">{c.text}</blockquote>
                <figcaption className="text-xs text-muted-foreground">{c.who}</figcaption>
              </div>
            </figure>
          )
        })}
      </div>
    </section>
  )
}

const OPS_HEALTH_LABEL: Record<TenantOperations["health"]["score"], string> = { "at-risk": "At risk", caution: "Needs attention", "on-track": "On track" }

function OperationsTab({ ops, onAsk }: { ops: TenantOperations; onAsk: (message: string) => void }) {
  const sat = ops.satisfaction
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <IconAvatar icon={HeartPulse} className="bg-primary/15 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-none">Operations health</p>
            <p className="text-xs text-muted-foreground mt-0.5">{OPS_HEALTH_LABEL[ops.health.score]}</p>
          </div>
          <Badge className="bg-primary/10 border-primary/20 text-primary"><Zap />Agent</Badge>
        </div>
        <div className="flex flex-col gap-2.5 @sm:gap-1.5 @sm:pl-10.5">
          {ops.health.recs.length === 0 && (
            <p className="text-sm text-foreground/80 leading-snug">Operations are on track. No action required at this time.</p>
          )}
          {ops.health.recs.map(r => {
            const AgentIcon = PM_AGENT_ICON[r.agent] ?? Bot
            return (
              <div key={r.action} className="flex flex-col items-start gap-1.5 @sm:flex-row @sm:items-center @sm:gap-2">
                <p className="text-sm text-foreground/80 flex-1 min-w-0 leading-snug">{r.action}</p>
                <Button
                  variant="outline" size="sm"
                  className="gap-1.5 shrink-0 h-7 text-xs text-primary border-primary/30 hover:bg-primary/5"
                  onClick={() => onAsk(r.action)}
                >
                  <AgentIcon className="h-3 w-3" />
                  {r.agent}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      <SatisfactionCard sat={sat} />

      <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
        <OpsStat label="Open work orders" value={String(ops.openWorkOrders)} sub={`${ops.total90d} in 90 days`} />
        <OpsStat
          label="Avg resolution" value={String(ops.avgHours)} unit="hrs" sub="vs last quarter"
          trend={<TrendChip trend={ops.avgHoursChangePct > 0 ? "up" : ops.avgHoursChangePct < 0 ? "down" : "flat"} goodWhen="down" label={ops.avgHoursChangePct ? `${ops.avgHoursChangePct > 0 ? "+" : "-"}${Math.abs(ops.avgHoursChangePct)}%` : "No change"} />}
        />
        <OpsStat label="Within SLA" value={`${ops.slaPct}%`} sub="closed on time" />
      </div>

      <section className={cn(subCard, "flex flex-col gap-3")}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Work orders by month</h3>
          <span className="text-xs text-muted-foreground">Last 6 months</span>
        </div>
        <ChartContainer config={OPS_VOLUME_CONFIG} className="aspect-auto h-40 w-full">
          <BarChart data={ops.monthly} margin={BAR_CHART_MARGIN}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={6} />
            <YAxis width={24} tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={BAR_RADIUS} maxBarSize={28} />
          </BarChart>
        </ChartContainer>
      </section>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Work order types</h3>
        <div className="flex flex-col gap-3">
          {ops.types.map(t => (
            <article key={t.category} className={cn(subCard, "flex flex-col gap-3")}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{t.category}</p>
                <TrendChip trend={t.trend} goodWhen="down" label={t.trend === "up" ? "Rising" : t.trend === "down" ? "Falling" : "Steady"} />
              </div>
              <dl className="grid grid-cols-3 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Tickets, 90 days</dt>
                  <dd className="text-lg font-semibold text-foreground tabular-nums">{t.total90d}<span className="ml-1 text-xs font-normal text-muted-foreground">{t.open} open</span></dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Avg resolution</dt>
                  <dd className="text-lg font-semibold text-foreground tabular-nums">{t.avgHours}<span className="ml-1 text-xs font-normal text-muted-foreground">hrs</span></dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Within SLA</dt>
                  <dd className={cn("text-lg font-semibold tabular-nums", t.slaPct < 80 ? "text-destructive" : "text-foreground")}>{t.slaPct}%</dd>
                </div>
              </dl>
              <Progress value={t.slaPct} aria-label={`${t.category} tickets within SLA`} />
              <p className="text-xs text-muted-foreground">Latest: <span className="text-foreground">{t.lastIssue}</span></p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function colHeader<T>(title: string, right = false): ColumnDef<T>["header"] {
  return ({ column, table }) => <DataTableColumnHeader column={column} table={table} title={title} className={right ? "justify-end" : undefined} />
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


function LeaseDocumentsCard({ lease, onOpenLease }: { lease: Lease; onOpenLease: (l: Lease) => void }) {
  const [open, setOpen] = React.useState(true)
  const docs = React.useMemo(() => leaseDocuments(lease), [lease])
  const status = DOC_STATUS_RANK.find(s => docs.some(d => d.status === s)) ?? "Expert verified"

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
          <p className="text-xs text-muted-foreground">{docs.length} documents at {lease.asset}, {leaseUnit(lease)}</p>
          <Button variant="link" size="sm" className="h-auto p-0 gap-1 text-xs self-start" onClick={() => onOpenLease(lease)}>
            <Eye className="h-3.5 w-3.5" />
            View abstract
          </Button>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-2">
          <ul className="flex flex-col divide-y divide-border/60 border-t border-border/60">
            {docs.map(d => (
              <li key={d.name} className="flex items-start gap-2.5 py-2.5">
                <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground break-all">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type}, modified {fmtShort(d.modified)}</p>
                </div>
                <DocStatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function DocumentsTab({ leases, where, onOpenLease }: { leases: Lease[]; where: string; onOpenLease: (l: Lease) => void }) {
  if (!leases.length) return <p className="py-8 text-center text-sm text-muted-foreground">No lease documents {where}.</p>
  return (
    <div className="flex flex-col gap-3">
      {leases.map(l => <LeaseDocumentsCard key={l.id} lease={l} onOpenLease={onOpenLease} />)}
    </div>
  )
}
