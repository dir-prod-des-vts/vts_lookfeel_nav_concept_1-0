import * as React from "react"
import { Bot, Building2, Calendar, MapPin, Paperclip, Send, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AGENT_ICON_MAP } from "@/components/agents-page"

export type FeedSentiment = "positive" | "neutral" | "negative"

export interface FeedMeta {
  type: string
  date: string
  sentiment?: FeedSentiment
  asset?: string
}

export interface FeedEntry {
  initials: string
  name: string
  timestamp: string
  message: string
  kind: "update" | "comment" | "agent"
  meta?: FeedMeta
}

const REACTIONS = ["👍", "👏", "🎉", "❤️"]

const SENTIMENT_DOT: Record<FeedSentiment, string> = {
  positive: "bg-success",
  neutral: "bg-warning",
  negative: "bg-destructive",
}

const SENTIMENT_LABEL: Record<FeedSentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
}

function FeedMetaLine({ meta }: { meta: FeedMeta }) {
  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{meta.type} · {meta.date}</span>
      {(meta.sentiment || meta.asset) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {meta.sentiment && (
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", SENTIMENT_DOT[meta.sentiment])} />
              {SENTIMENT_LABEL[meta.sentiment]}
            </span>
          )}
          {meta.asset && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {meta.asset}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function UpdateCard({ entry }: { entry: FeedEntry }) {
  const [reactions, setReactions] = React.useState<Record<string, number>>({})
  const toggle = (r: string) => setReactions(prev => ({ ...prev, [r]: (prev[r] ?? 0) === 1 ? 0 : 1 }))

  if (entry.kind === "agent") {
    const AgentIcon = AGENT_ICON_MAP[entry.name] ?? Bot
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <AgentIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-none">{entry.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="h-2.5 w-2.5 text-primary" />
            <span className="text-xs font-medium text-primary">Agent</span>
          </div>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-[42px]">{entry.message}</p>
      </div>
    )
  }

  const isSystem = entry.kind === "update"
  const meta = entry.meta ?? (isSystem ? { type: "System update", date: entry.timestamp } : undefined)

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center font-semibold shrink-0",
            isSystem ? "bg-muted text-muted-foreground text-[10px]" : "bg-primary/10 text-primary text-xs",
          )}>
            {entry.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">{entry.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{entry.message}</p>
      {meta && <FeedMetaLine meta={meta} />}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Button variant="ghost" size="sm" className="text-xs">Share</Button>
          <span className="opacity-40">·</span>
          {!isSystem && (
            <>
              <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
              <span className="opacity-40">·</span>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">Delete</Button>
              <span className="opacity-40">·</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {REACTIONS.map(r => (
            <button key={r} onClick={() => toggle(r)}
              className={cn("h-7 px-2 rounded-md text-sm transition-colors flex items-center gap-1",
                reactions[r] ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"
              )}>
              {r}{reactions[r] ? <span className="text-xs font-medium">{reactions[r]}</span> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[9px] font-semibold shrink-0">ES</div>
        <input className="flex-1 text-xs bg-muted/50 rounded-lg px-3 py-1.5 text-muted-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-border" placeholder="Add a comment…" />
      </div>
    </div>
  )
}

export function ActivityFeed({ entries, draftPrompt, showLogTour = true }: {
  entries: FeedEntry[]
  draftPrompt: string
  showLogTour?: boolean
}) {
  const [draft, setDraft] = React.useState("")
  const [posted, setPosted] = React.useState<FeedEntry[]>([])
  const [logAsTour, setLogAsTour] = React.useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [updateDate, setUpdateDate] = React.useState(today)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const dateRef = React.useRef<HTMLInputElement>(null)
  const feed = [...posted, ...entries]

  function post() {
    const message = draft.trim()
    if (!message) return
    setPosted(prev => [{ initials: "ES", name: "You", timestamp: "Just now", message, kind: "comment" }, ...prev])
    setDraft("")
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-primary/30 bg-card p-3 flex flex-col gap-2">
          <Textarea value={draft} onChange={e => setDraft(e.target.value)}
            placeholder={logAsTour ? "Describe the tour…" : "Post an update…"}
            className="resize-none text-sm min-h-[90px] border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none"
            rows={3}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Button size="sm" variant="outline" className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
              onClick={() => setDraft(draftPrompt)}>
              <Zap className="h-3.5 w-3.5" />
              Draft with VTS
            </Button>
            <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/5 h-8 w-8 p-0 rounded-full"
              onClick={() => fileRef.current?.click()}>
              <Paperclip className="h-3.5 w-3.5" />
              <input ref={fileRef} type="file" className="sr-only" />
            </Button>
            <Button size="sm" variant="outline" className="text-primary border-primary/30 hover:bg-primary/5 h-8 w-8 p-0 rounded-full"
              onClick={() => (dateRef.current as HTMLInputElement & { showPicker?: () => void } | null)?.showPicker?.()}>
              <Calendar className="h-3.5 w-3.5" />
              <input ref={dateRef} type="date" value={updateDate} onChange={e => setUpdateDate(e.target.value)} className="sr-only" />
            </Button>
            {showLogTour && (
              <Button size="sm" variant="outline"
                onClick={() => setLogAsTour(v => !v)}
                className={cn("gap-1.5 text-primary border-primary/30 hover:bg-primary/5", logAsTour && "bg-primary/10")}>
                <MapPin className="h-3.5 w-3.5" />
                Log tour
              </Button>
            )}
            <Button size="sm" disabled={!draft.trim()} className="gap-1.5 ml-auto" onClick={post}>
              <Send className="h-3.5 w-3.5" />
              Post
            </Button>
          </div>
        </div>

        {feed.length === 0
          ? <p className="text-sm text-muted-foreground py-4 text-center">No updates yet.</p>
          : feed.map((e, i) => <UpdateCard key={i} entry={e} />)
        }
      </div>
    </div>
  )
}
