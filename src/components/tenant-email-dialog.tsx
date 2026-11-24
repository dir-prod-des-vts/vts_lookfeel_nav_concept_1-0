import * as React from "react"
import { Send, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Contact } from "@/lib/tenant-profile-data"

export interface EmailDraft {
  to: string
  subject: string
  body: string
  followUpDays?: number
}

const FOLLOW_UPS = [
  { value: "0", label: "No follow-up" },
  { value: "3", label: "In 3 days" },
  { value: "7", label: "In 1 week" },
  { value: "14", label: "In 2 weeks" },
]

export function TenantEmailDialog({ open, onOpenChange, contacts, draft, tenantName, onSend }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: Contact[]
  draft: EmailDraft
  tenantName: string
  onSend: (email: EmailDraft) => void
}) {
  const [to, setTo] = React.useState(draft.to)
  const [subject, setSubject] = React.useState(draft.subject)
  const [body, setBody] = React.useState(draft.body)
  const [followUp, setFollowUp] = React.useState("3")

  React.useEffect(() => {
    if (!open) return
    setTo(draft.to)
    setSubject(draft.subject)
    setBody(draft.body)
    setFollowUp("3")
  }, [open, draft])

  const recipient = contacts.find(c => c.name === to)
  const items = contacts.filter(c => c.group !== "internal").map(c => ({ value: c.name, label: `${c.name}, ${c.title}` }))

  function draftWithVts() {
    const first = recipient?.name.split(" ")[0] ?? "there"
    setBody(`Hi ${first},\n\nI wanted to check in on how things are going with your space and whether anything has changed in ${tenantName}'s plans for the next 12 to 18 months. Happy to walk through options for renewal, expansion or a consolidation.\n\nWould a short call next week work?\n\nBest,`)
    if (!subject) setSubject(`Checking in on ${tenantName}'s space plans`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New email</DialogTitle>
          <DialogDescription>Sent emails are logged to this tenant's activity automatically.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>To</Label>
            <Select items={items} value={to} onValueChange={v => v && setTo(v as string)}>
              <SelectTrigger className="w-full" aria-label="Recipient">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {recipient && <p className="text-xs text-muted-foreground">{recipient.email}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email-subject">Subject</Label>
            <Input id="email-subject" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-body">Message</Label>
              <Button variant="ghost" size="sm" className="h-auto gap-1 px-1.5 py-0.5 text-xs text-primary" onClick={draftWithVts}>
                <Zap className="h-3 w-3" />
                Draft with VTS
              </Button>
            </div>
            <Textarea id="email-body" rows={8} value={body} onChange={e => setBody(e.target.value)} className="resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Follow up if no reply</Label>
            <Select items={FOLLOW_UPS} value={followUp} onValueChange={v => v && setFollowUp(v as string)}>
              <SelectTrigger className="w-full" aria-label="Follow up if no reply">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOLLOW_UPS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {followUp !== "0" && <p className="text-xs text-muted-foreground">A follow-up task is created for you if there's no reply.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="gap-1.5" disabled={!to || !subject.trim() || !body.trim()} onClick={() => onSend({ to, subject: subject.trim(), body: body.trim(), followUpDays: Number(followUp) || undefined })}>
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
