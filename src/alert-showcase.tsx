import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
import { AlertTriangle, Info, CheckCircle2, XCircle, Bell, CalendarClock, Building2, FileWarning } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 flex flex-col gap-3">{children}</div>
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
          <h1 className="text-3xl font-semibold text-foreground">Alert</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Inline status messages with optional icons, descriptions, and actions. Two variants: default and destructive.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <Row label="default">
            <Alert>
              <AlertTitle>Lease synced</AlertTitle>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="destructive">
            <Alert variant="destructive">
              <AlertTitle>Lease could not be saved</AlertTitle>
            </Alert>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With icons */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With icons</p>
          <Row label="info">
            <Alert>
              <Info />
              <AlertTitle>Lease commencement approaching</AlertTitle>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="warning">
            <Alert>
              <AlertTriangle />
              <AlertTitle>Critical date in 30 days</AlertTitle>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="success">
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Lease executed successfully</AlertTitle>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="destructive">
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>Tenant default detected</AlertTitle>
            </Alert>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With descriptions */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With descriptions</p>
          <Row label="info">
            <Alert>
              <Info />
              <AlertTitle>Lease expiring in 90 days</AlertTitle>
              <AlertDescription>
                The lease at 101 Park Ave, Floor 18 expires on December 31, 2025. Start renewal negotiations or notify the tenant of non-renewal.
              </AlertDescription>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="warning">
            <Alert>
              <CalendarClock />
              <AlertTitle>Critical date approaching</AlertTitle>
              <AlertDescription>
                Renewal notice for Tower SF must be delivered by June 30, 2025. Failure to act by this date will forfeit the renewal option.
              </AlertDescription>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="destructive">
            <Alert variant="destructive">
              <FileWarning />
              <AlertTitle>Missing rent commencement date</AlertTitle>
              <AlertDescription>
                This lease is missing a rent commencement date. Deal health score will be impacted until this field is populated.
              </AlertDescription>
            </Alert>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With action */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With action</p>
          <Row label="default">
            <Alert>
              <Bell />
              <AlertTitle>3 critical dates this month</AlertTitle>
              <AlertDescription>
                Review your portfolio for upcoming renewal deadlines, rent escalations, and landlord notice requirements.
              </AlertDescription>
              <AlertAction>
                <Button size="sm" variant="outline">View dates</Button>
              </AlertAction>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="destructive">
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>Lease data out of sync</AlertTitle>
              <AlertDescription>
                One or more lease fields have conflicting data. Review and resolve before publishing this deal.
              </AlertDescription>
              <AlertAction>
                <Button size="sm" variant="outline">Resolve</Button>
              </AlertAction>
            </Alert>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Title only */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Title only (no description)</p>
          <Row label="default">
            <Alert>
              <AlertTitle>Saved</AlertTitle>
            </Alert>
            <Alert>
              <Building2 />
              <AlertTitle>Building added to portfolio</AlertTitle>
            </Alert>
          </Row>
          <div className="mt-5" />
          <Row label="destructive">
            <Alert variant="destructive">
              <AlertTitle>Permission denied</AlertTitle>
            </Alert>
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>Could not delete tenant record</AlertTitle>
            </Alert>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world patterns */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world patterns</p>
          <Row label="deal page">
            <div className="flex flex-col gap-3 max-w-xl">
              <Alert>
                <CheckCircle2 />
                <AlertTitle>Deal health: 92%</AlertTitle>
                <AlertDescription>All critical fields are populated. Two optional fields are missing: broker commission and LOI date.</AlertDescription>
              </Alert>
              <Alert>
                <AlertTriangle />
                <AlertTitle>Lease commencement date may conflict with fit-out schedule</AlertTitle>
                <AlertDescription>The proposed commencement is January 1, 2025, but construction is estimated to complete February 15, 2025.</AlertDescription>
                <AlertAction>
                  <Button size="sm" variant="outline">Adjust dates</Button>
                </AlertAction>
              </Alert>
              <Alert variant="destructive">
                <XCircle />
                <AlertTitle>Missing guarantor signature</AlertTitle>
                <AlertDescription>The personal guaranty has not been executed. This deal cannot move to "Executed" status until all signatures are collected.</AlertDescription>
              </Alert>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
