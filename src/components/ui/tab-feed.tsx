import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, ItemSeparator } from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Activity, CheckSquare, FileText, Bell } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TabFeedEntry {
  id: string
  author: string
  avatarSrc?: string
  /** Short text e.g. "moved this deal to" */
  action: string
  /** Bold label after action e.g. "LOI" */
  target?: string
  /** Optional freeform note body */
  body?: string
  timestamp: string
}

export interface TabFeedTab {
  value: string
  label: string
  entries: TabFeedEntry[]
}

export interface TabFeedProps {
  tabs: TabFeedTab[]
  defaultTab?: string
  loading?: boolean
  className?: string
  onAddEntry?: (tab: string, text: string) => void
  onEntryAction?: (tab: string, entryId: string, action: "edit" | "delete") => void
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TAB_CONFIG: Record<string, { placeholder: string; emptyTitle: string; emptyDescription: string; icon: React.ElementType }> = {
  updates: {
    placeholder: "Share an update…",
    emptyTitle: "No updates yet",
    emptyDescription: "Be the first to post an update on this deal.",
    icon: Activity,
  },
  tasks: {
    placeholder: "Add a task…",
    emptyTitle: "No tasks yet",
    emptyDescription: "Add tasks to track action items for this deal.",
    icon: CheckSquare,
  },
  docs: {
    placeholder: "Add a note about a document…",
    emptyTitle: "No documents yet",
    emptyDescription: "Upload or link documents related to this deal.",
    icon: FileText,
  },
  reminders: {
    placeholder: "Add a reminder…",
    emptyTitle: "No reminders set",
    emptyDescription: "Set reminders to stay on top of key dates and follow-ups.",
    icon: Bell,
  },
}

const DEFAULT_TAB_CONFIG = {
  placeholder: "Add an entry…",
  emptyTitle: "Nothing here yet",
  emptyDescription: "No entries have been added.",
  icon: Activity,
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TabFeedSkeleton() {
  return (
    <ItemGroup>
      {[1, 2, 3].map(i => (
        <React.Fragment key={i}>
          <Item>
            <ItemMedia>
              <Skeleton className="size-8 rounded-full" />
            </ItemMedia>
            <ItemContent>
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </ItemContent>
            <ItemActions>
              <Skeleton className="size-7 rounded-md" />
            </ItemActions>
          </Item>
          {i < 3 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}

// ── Entry row ─────────────────────────────────────────────────────────────────

function TabFeedRow({
  entry,
  tab,
  onEntryAction,
}: {
  entry: TabFeedEntry
  tab: string
  onEntryAction?: TabFeedProps["onEntryAction"]
}) {
  const initials = entry.author
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Item size="xs">
      <ItemMedia>
        <Avatar>
          {entry.avatarSrc && <AvatarImage src={entry.avatarSrc} alt={entry.author} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{entry.author}</ItemTitle>
        <ItemDescription>
          {entry.action}{entry.target && <> <strong>{entry.target}</strong></>}
          {entry.body && <><br />{entry.body}</>}
        </ItemDescription>
        <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
      </ItemContent>
      {onEntryAction && (
        <ItemActions>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEntryAction(tab, entry.id, "edit")}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onEntryAction(tab, entry.id, "delete")}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      )}
    </Item>
  )
}

// ── Compose box ───────────────────────────────────────────────────────────────

function TabFeedCompose({
  tabValue,
  onSubmit,
}: {
  tabValue: string
  onSubmit: (text: string) => void
}) {
  const config = TAB_CONFIG[tabValue] ?? DEFAULT_TAB_CONFIG
  const [text, setText] = React.useState("")
  const [focused, setFocused] = React.useState(false)
  const showActions = focused || text.trim().length > 0

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault()
      onSubmit(text.trim())
      setText("")
      setFocused(false)
    }
    if (e.key === "Escape") {
      setText("")
      setFocused(false)
      ;(e.target as HTMLTextAreaElement).blur()
    }
  }

  function handlePost() {
    if (text.trim()) {
      onSubmit(text.trim())
      setText("")
      setFocused(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        placeholder={config.placeholder}
        value={text}
        className={cn(
          "transition-[min-height] duration-200",
          showActions ? "min-h-20" : "min-h-9"
        )}
        onChange={e => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!text.trim()) setFocused(false) }}
        onKeyDown={handleKeyDown}
      />
      <div className={cn(
        "flex items-center justify-between transition-[opacity,transform] duration-150",
        showActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden"
      )}>
        <p className="text-xs text-muted-foreground">Press Enter to post, Shift+Enter for new line</p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setText(""); setFocused(false) }}
          >
            Cancel
          </Button>
          <Button size="sm" disabled={!text.trim()} onClick={handlePost}>
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

function TabFeed({
  tabs,
  defaultTab,
  loading = false,
  className,
  onAddEntry,
  onEntryAction,
}: TabFeedProps) {
  const firstTab = tabs[0]?.value ?? ""
  const [activeTab, setActiveTab] = React.useState(defaultTab ?? firstTab)

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => {
          const config = TAB_CONFIG[tab.value] ?? DEFAULT_TAB_CONFIG
          const Icon = config.icon
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="pt-4 flex flex-col gap-4">
                {onAddEntry && (
                  <TabFeedCompose
                    tabValue={tab.value}
                    onSubmit={text => onAddEntry(tab.value, text)}
                  />
                )}

                {loading ? (
                  <TabFeedSkeleton />
                ) : tab.entries.length === 0 ? (
                  <Empty className="animate-in fade-in-0 duration-200">
                    <EmptyHeader>
                      <Icon className="size-5 text-muted-foreground" />
                      <EmptyTitle>{config.emptyTitle}</EmptyTitle>
                      <EmptyDescription>{config.emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ItemGroup>
                    {tab.entries.map((entry, i) => (
                      <React.Fragment key={entry.id}>
                        <div className="animate-in fade-in-0 slide-in-from-top-1 duration-200">
                          <TabFeedRow entry={entry} tab={tab.value} onEntryAction={onEntryAction} />
                        </div>
                        {i < tab.entries.length - 1 && <ItemSeparator />}
                      </React.Fragment>
                    ))}
                  </ItemGroup>
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}

export { TabFeed, TabFeedSkeleton, TabFeedRow }
