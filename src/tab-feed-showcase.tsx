import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { TabFeed } from "@/components/ui/tab-feed"
import type { TabFeedTab } from "@/components/ui/tab-feed"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-40 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

const DEAL_TABS: TabFeedTab[] = [
  {
    value: "updates",
    label: "Updates",
    entries: [
      {
        id: "1",
        author: "Jill Segal",
        action: "moved this deal to",
        target: "LOI",
        timestamp: "27 days ago",
      },
      {
        id: "2",
        author: "Jill Segal",
        action: "moved this deal to",
        target: "Proposal",
        timestamp: "1371 days ago",
      },
      {
        id: "3",
        author: "Kasey Van Hise",
        action: "moved this deal to",
        target: "Touring",
        timestamp: "1557 days ago",
      },
      {
        id: "4",
        author: "Clark Cushman",
        action: "moved this deal to",
        target: "Inquiry",
        timestamp: "1565 days ago",
      },
    ],
  },
  {
    value: "tasks",
    label: "Tasks",
    entries: [
      {
        id: "t1",
        author: "Jill Segal",
        action: "created task",
        target: "Send lease abstract to tenant",
        timestamp: "3 days ago",
      },
      {
        id: "t2",
        author: "Clark Cushman",
        action: "completed task",
        target: "Follow up with tenant counsel",
        timestamp: "12 days ago",
      },
    ],
  },
  {
    value: "docs",
    label: "Docs",
    entries: [
      {
        id: "d1",
        author: "Kasey Van Hise",
        action: "uploaded",
        target: "Draft LOI v2.pdf",
        timestamp: "5 days ago",
      },
    ],
  },
  {
    value: "reminders",
    label: "Reminders",
    entries: [],
  },
]

const EDITABLE_TABS: TabFeedTab[] = [
  {
    value: "updates",
    label: "Updates",
    entries: [
      {
        id: "n1",
        author: "Sarah Chen",
        action: "Tenant confirmed they need",
        body: "at least 20,000 SF with a private terrace. Budget is firm at $68/SF NNN.",
        timestamp: "2 hours ago",
      },
      {
        id: "n2",
        author: "Enrique Sacasa",
        action: "Landlord is open to a TI package",
        body: "up to $120/SF if the tenant signs a 7-year term.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    value: "tasks",
    label: "Tasks",
    entries: [
      {
        id: "a1",
        author: "Sarah Chen",
        action: "scheduled a tour for",
        target: "Nov 14, 2:00 PM",
        timestamp: "1 day ago",
      },
    ],
  },
  { value: "docs", label: "Docs", entries: [] },
  { value: "reminders", label: "Reminders", entries: [] },
]

function useTabs(initial: TabFeedTab[]) {
  const [tabs, setTabs] = React.useState(initial)

  function addEntry(tab: string, text: string) {
    setTabs(prev =>
      prev.map(t =>
        t.value === tab
          ? {
              ...t,
              entries: [
                { id: String(Date.now()), author: "Enrique Sacasa", action: text, timestamp: "Just now" },
                ...t.entries,
              ],
            }
          : t
      )
    )
  }

  function removeEntry(tab: string, id: string) {
    setTabs(prev =>
      prev.map(t => t.value === tab ? { ...t, entries: t.entries.filter(e => e.id !== id) } : t)
    )
  }

  function handleEntryAction(tab: string, id: string, action: "edit" | "delete") {
    if (action === "delete") removeEntry(tab, id)
  }

  return { tabs, addEntry, handleEntryAction }
}

const EMPTY_TABS: TabFeedTab[] = [
  { value: "updates", label: "Updates", entries: [] },
  { value: "tasks", label: "Tasks", entries: [] },
  { value: "docs", label: "Docs", entries: [] },
  { value: "reminders", label: "Reminders", entries: [] },
]

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const readonly = useTabs(DEAL_TABS)
  const editable = useTabs(EDITABLE_TABS)
  const empty = useTabs(EMPTY_TABS)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Tab feed</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Tabbed activity feed for deal panels. Composed from Tabs, Item, Avatar, Skeleton, Textarea, and DropdownMenu.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
          <Row label="with entries">
            <div className="max-w-sm border border-border rounded-xl p-4 bg-card">
              <TabFeed tabs={readonly.tabs} onAddEntry={readonly.addEntry} onEntryAction={readonly.handleEntryAction} />
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With actions</p>
          <Row label="editable">
            <div className="max-w-sm border border-border rounded-xl p-4 bg-card">
              <TabFeed tabs={editable.tabs} onAddEntry={editable.addEntry} onEntryAction={editable.handleEntryAction} />
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Loading skeleton</p>
          <Row label="skeleton">
            <div className="max-w-sm border border-border rounded-xl p-4 bg-card">
              <TabFeed tabs={DEAL_TABS} loading />
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Empty state</p>
          <Row label="empty tab">
            <div className="max-w-sm border border-border rounded-xl p-4 bg-card">
              <TabFeed tabs={empty.tabs} onAddEntry={empty.addEntry} />
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
