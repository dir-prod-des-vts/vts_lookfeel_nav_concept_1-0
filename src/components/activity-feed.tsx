import * as React from "react"
import { Bot, Building2, Calendar, Frown, Mail, MapPin, Meh, Paperclip, Send, Smile, SmilePlus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  kind: "update" | "comment" | "agent" | "email"
  meta?: FeedMeta
  date?: string
  email?: { direction: "sent" | "received"; subject: string; counterpart: string }
}

const REACTIONS = ["👍", "👏", "🎉", "❤️"]

const SENTIMENT_TAG: Record<FeedSentiment, string> = {
  positive: "bg-success/10 text-success",
  neutral: "bg-warning/15 text-warning",
  negative: "bg-destructive/10 text-destructive",
}

const SENTIMENT_TEXT: Record<FeedSentiment, string> = {
  positive: "text-success",
  neutral: "text-warning",
  negative: "text-destructive",
}

const SENTIMENT_ICON: Record<FeedSentiment, React.ElementType> = {
  positive: Smile,
  neutral: Meh,
  negative: Frown,
}

const SENTIMENT_LABEL: Record<FeedSentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
}

function FeedSubline({ timestamp, meta }: { timestamp: string; meta?: FeedMeta }) {
  return (
    <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {meta && <span className="font-medium text-foreground/70">{meta.type}</span>}
      <span>{timestamp}</span>
    </p>
  )
}

function FeedFooterMeta({ meta }: { meta: FeedMeta }) {
  if (!meta.asset && !meta.sentiment) return null
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {meta.sentiment && (
        <Badge className={cn("h-4 px-1.5 font-normal", SENTIMENT_TAG[meta.sentiment])}>{SENTIMENT_LABEL[meta.sentiment]}</Badge>
      )}
      {meta.asset && (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="h-3 w-3" />{meta.asset}</span>
      )}
    </div>
  )
}

export function UpdateCard({ entry }: { entry: FeedEntry }) {
  const [reactions, setReactions] = React.useState<Record<string, number>>({})
  const toggle = (r: string) => setReactions(prev => ({ ...prev, [r]: (prev[r] ?? 0) === 1 ? 0 : 1 }))

  if (entry.kind === "email" && entry.email) {
    const sent = entry.email.direction === "sent"
    return (
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar>
            <AvatarFallback className="bg-muted text-muted-foreground">{sent ? <Send className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground leading-tight truncate">
              <span className="font-semibold">{entry.name}</span>
              <span className="text-muted-foreground"> {sent ? "emailed" : "emailed you"}{sent ? ` ${entry.email.counterpart}` : ""}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground shrink-0">{sent ? "Sent" : "Received"}</span>
        </div>
        <div className="pl-10.5 flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-foreground">{entry.email.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{entry.message}</p>
        </div>
      </div>
    )
  }

  if (entry.kind === "agent") {
    const AgentIcon = AGENT_ICON_MAP[entry.name] ?? Bot
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar>
            <AvatarFallback className="bg-primary/15 text-primary"><AgentIcon className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-none">{entry.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{entry.timestamp}</p>
          </div>
          <Badge className="bg-primary/10 border-primary/20 text-primary"><Zap />Agent</Badge>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed pl-10.5">{entry.message}</p>
      </div>
    )
  }

  const isSystem = entry.kind === "update"
  const meta = entry.meta ?? (isSystem ? { type: "System update", date: entry.timestamp } : undefined)

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar>
            <AvatarFallback className={cn("text-xs font-semibold", isSystem ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")}>{entry.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-none">{entry.name}</p>
            <FeedSubline timestamp={entry.timestamp} meta={meta} />
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{entry.message}</p>
      {meta && <FeedFooterMeta meta={meta} />}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Button variant="ghost" size="sm" className="text-xs">Share</Button>
          {!isSystem && (
            <>
              <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive">Delete</Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {REACTIONS.map(r => (
            <Button key={r} variant="ghost" size="xs" onClick={() => toggle(r)} aria-pressed={Boolean(reactions[r])} aria-label={`React ${r}`}
              className={cn("h-7 rounded-md text-sm", reactions[r] ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
              {r}{reactions[r] ? <span className="text-xs font-medium">{reactions[r]}</span> : null}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">ES</AvatarFallback>
        </Avatar>
        <Input aria-label="Add a comment" placeholder="Add a comment…" className="h-8 flex-1 text-xs bg-muted/50" />
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
  const [sentiment, setSentiment] = React.useState<FeedSentiment | undefined>()
  const SentimentIcon = sentiment ? SENTIMENT_ICON[sentiment] : SmilePlus
  const feed = [...posted, ...entries]

  function post() {
    const message = draft.trim()
    if (!message) return
    const meta: FeedMeta | undefined = sentiment || logAsTour
      ? { type: logAsTour ? "Tour" : "Update", date: "Just now", sentiment }
      : undefined
    setPosted(prev => [{ initials: "ES", name: "You", timestamp: "Just now", message, kind: "comment", meta }, ...prev])
    setDraft("")
    setSentiment(undefined)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-primary/30 bg-card p-3 flex flex-col gap-2">
          <Textarea value={draft} onChange={e => setDraft(e.target.value)}
            placeholder={logAsTour ? "Describe the tour…" : "Post an update…"}
            className="resize-none text-sm min-h-24 border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none"
            rows={3}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Button size="sm" variant="outline" className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
              onClick={() => setDraft(draftPrompt)}>
              <Zap className="h-3.5 w-3.5" />
              Draft with VTS
            </Button>
            <Button size="sm" variant="outline" aria-label="Attach a file" className="text-primary border-primary/30 hover:bg-primary/5 h-8 w-8 p-0 rounded-full"
              onClick={() => fileRef.current?.click()}>
              <Paperclip className="h-3.5 w-3.5" />
            </Button>
            <Input ref={fileRef} type="file" tabIndex={-1} aria-hidden className="sr-only" />
            <Button size="sm" variant="outline" aria-label="Set update date" className="text-primary border-primary/30 hover:bg-primary/5 h-8 w-8 p-0 rounded-full"
              onClick={() => (dateRef.current as HTMLInputElement & { showPicker?: () => void } | null)?.showPicker?.()}>
              <Calendar className="h-3.5 w-3.5" />
            </Button>
            <Input ref={dateRef} type="date" tabIndex={-1} aria-hidden value={updateDate} onChange={e => setUpdateDate(e.target.value)} className="sr-only" />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="sm" variant="outline"
                    aria-label={sentiment ? `Sentiment: ${SENTIMENT_LABEL[sentiment]}` : "Add sentiment"}
                    className={cn(
                      "h-8 w-8 p-0 rounded-full border-primary/30 hover:bg-primary/5",
                      sentiment ? SENTIMENT_TAG[sentiment] : "text-primary",
                    )}
                  />
                }
              >
                <SentimentIcon className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuRadioGroup value={sentiment ?? "none"} onValueChange={v => setSentiment(v === "none" ? undefined : v as FeedSentiment)}>
                  {(["positive", "neutral", "negative"] as FeedSentiment[]).map(s => {
                    const Icon = SENTIMENT_ICON[s]
                    return (
                      <DropdownMenuRadioItem key={s} value={s}>
                        <Icon className={cn("h-4 w-4", SENTIMENT_TEXT[s])} />{SENTIMENT_LABEL[s]}
                      </DropdownMenuRadioItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="none">
                    <SmilePlus className="h-4 w-4 text-muted-foreground" />No sentiment
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
          : feed.map(e => <UpdateCard key={`${e.kind}-${e.name}-${e.timestamp}-${e.message.slice(0, 40)}`} entry={e} />)
        }
      </div>
    </div>
  )
}
