import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"
import { Trash2, LogOut, Archive, AlertTriangle, FileX } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Alert dialog</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI. Modal confirmation dialogs with destructive and non-destructive patterns, media icons, and custom action labels.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Destructive confirm */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Destructive confirm</p>
          <Row label="delete lease">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive"><Trash2 data-icon="inline-start" />Delete lease</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lease?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the lease at 101 Park Ave, Floor 18. All associated documents, critical dates, and deal history will be removed. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete lease</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive"><FileX data-icon="inline-start" />Remove tenant</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Acme Corp from this deal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Removing this tenant will disassociate all contacts, credit history, and LOI documents. The deal will return to "Available" status.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Remove tenant</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Non-destructive confirm */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Non-destructive confirm</p>
          <Row label="archive deal">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline"><Archive data-icon="inline-start" />Archive deal</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive this deal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Archiving will hide this deal from active views. You can restore it at any time from the archived deals list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Archive deal</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline"><LogOut data-icon="inline-start" />Leave portfolio</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this portfolio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will lose access to all deals, buildings, and reports in the Tower SF portfolio. You can be re-invited by a portfolio admin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Stay</AlertDialogCancel>
                  <AlertDialogAction>Leave portfolio</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With media icon */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With media icon</p>
          <Row label="icon header">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline">Publish lease</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <AlertTriangle />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Publish this lease?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Publishing will make this lease visible to all members of the Tower SF portfolio. Confirm that all terms are final before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review first</AlertDialogCancel>
                  <AlertDialogAction>Publish</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline">Mark as executed</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2 />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Mark deal as executed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will lock key financial terms and set all critical date counters. Changes will require admin approval after execution.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Not yet</AlertDialogCancel>
                  <AlertDialogAction>Confirm execution</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Custom action labels */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Custom action labels</p>
          <Row label="send notice">
            <AlertDialog>
              <AlertDialogTrigger render={<Button>Send renewal notice</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Send renewal notice to Acme Corp?</AlertDialogTitle>
                  <AlertDialogDescription>
                    A renewal notice email will be sent to the primary contact at Acme Corp. This will be logged in the deal activity feed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Don't send</AlertDialogCancel>
                  <AlertDialogAction>Send notice</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline">Reset deal stage</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset deal to prospect?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will move the deal back to the "Prospect" stage and clear all proposal and negotiation data. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep current stage</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Reset to prospect</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Size sm */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Small size</p>
          <Row label="size sm">
            <AlertDialog>
              <AlertDialogTrigger render={<Button size="sm" variant="destructive">Delete</Button>} />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete document?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This document will be permanently removed from the lease record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" size="sm">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
