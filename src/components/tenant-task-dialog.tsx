import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type TenantTask } from "@/lib/tenant-intelligence"

export interface TaskDraft {
  title: string
  owner?: string
  link?: string
  contactName?: string
}

const REMINDERS = [
  { value: "none", label: "No reminder" },
  { value: "1d", label: "1 day before" },
  { value: "1w", label: "1 week before" },
]

function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function TenantTaskDialog({ open, onOpenChange, draft, owners, links, defaultDue, onCreate }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: TaskDraft
  owners: string[]
  links: string[]
  defaultDue: string
  onCreate: (task: TenantTask) => void
}) {
  const [title, setTitle] = React.useState(draft.title)
  const [owner, setOwner] = React.useState(draft.owner ?? owners[0] ?? "")
  const [link, setLink] = React.useState(draft.link ?? "none")
  const [due, setDue] = React.useState<Date>(() => new Date(`${defaultDue}T00:00:00`))
  const [reminder, setReminder] = React.useState<TenantTask["reminder"]>("1d")
  const [dateOpen, setDateOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setTitle(draft.title)
    setOwner(draft.owner && owners.includes(draft.owner) ? draft.owner : owners[0] ?? "")
    setLink(draft.link ?? "none")
    setDue(new Date(`${defaultDue}T00:00:00`))
    setReminder("1d")
  }, [open, draft, owners, defaultDue])

  const ownerItems = owners.map(o => ({ value: o, label: o }))
  const linkItems = [{ value: "none", label: "Not linked" }, ...links.map(l => ({ value: l, label: l }))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>Assign an owner and a due date. Reminders go to the owner.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Task</Label>
            <Input id="task-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to happen?" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Owner</Label>
              <Select items={ownerItems} value={owner} onValueChange={v => v && setOwner(v as string)}>
                <SelectTrigger className="w-full" aria-label="Owner"><SelectValue /></SelectTrigger>
                <SelectContent>{ownerItems.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Due date</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger render={<Button variant="outline" className="w-full justify-start gap-2 font-normal" />}>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  {due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar mode="single" selected={due} defaultMonth={due} onSelect={d => { if (d) { setDue(d); setDateOpen(false) } }} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Reminder</Label>
              <Select items={REMINDERS} value={reminder} onValueChange={v => v && setReminder(v as TenantTask["reminder"])}>
                <SelectTrigger className="w-full" aria-label="Reminder"><SelectValue /></SelectTrigger>
                <SelectContent>{REMINDERS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Linked to</Label>
              <Select items={linkItems} value={link} onValueChange={v => v && setLink(v as string)}>
                <SelectTrigger className="w-full" aria-label="Linked to"><SelectValue /></SelectTrigger>
                <SelectContent>{linkItems.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!title.trim() || !owner}
            onClick={() => onCreate({
              id: `t-${Date.now()}`, title: title.trim(), owner, due: toIsoDate(due), reminder,
              link: link === "none" ? undefined : link, contactName: draft.contactName, done: false,
            })}
          >
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
