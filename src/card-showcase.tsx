import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Building2, TrendingUp, Users, FileText, MoreHorizontal, ArrowUpRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </div>
  )
}

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Card</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Container component with header, content, footer, and action slots. Two sizes: default and sm.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Anatomy */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Anatomy</p>
          <Row label="all parts">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Card description — supporting text below the title.</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card content area. Any content goes here: text, metrics, form fields, lists.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Property card */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Property card</p>
          <Row label="building">
            <Card className="w-72">
              <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600"
                alt="101 Park Avenue"
                className="w-full h-36 object-cover"
              />
              <CardHeader>
                <CardTitle>101 Park Avenue</CardTitle>
                <CardDescription>New York, NY 10178</CardDescription>
                <CardAction>
                  <Badge variant="outline">Class A+</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <KPI label="Size" value="850k SF" />
                  <KPI label="Occupancy" value="94.2%" />
                  <KPI label="NER" value="$52/SF" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">View building<ArrowUpRight data-icon="inline-end" /></Button>
              </CardFooter>
            </Card>

            <Card className="w-72">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"
                alt="Tower SF"
                className="w-full h-36 object-cover"
              />
              <CardHeader>
                <CardTitle>Tower SF</CardTitle>
                <CardDescription>San Francisco, CA 94105</CardDescription>
                <CardAction>
                  <Badge variant="secondary">Class A</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <KPI label="Size" value="420k SF" />
                  <KPI label="Occupancy" value="88.5%" />
                  <KPI label="NER" value="$68/SF" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">View building<ArrowUpRight data-icon="inline-end" /></Button>
              </CardFooter>
            </Card>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Deal card */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Deal card</p>
          <Row label="deal">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Acme Corp — Floor 18</CardTitle>
                <CardDescription>101 Park Ave · 24,500 SF</CardDescription>
                <CardAction>
                  <Badge variant="default">Executed</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <KPI label="Net rent" value="$52/SF" sub="Year 1" />
                  <KPI label="Term" value="5 years" sub="Jan 2025" />
                  <KPI label="TI allowance" value="$120/SF" />
                  <KPI label="Free rent" value="3 months" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>Tenant rep: CBRE · Sarah Chen</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="ghost" size="sm"><FileText data-icon="inline-start" />View lease</Button>
                <Button variant="outline" size="sm" className="ml-auto">Edit deal</Button>
              </CardFooter>
            </Card>

            <Card className="w-80">
              <CardHeader>
                <CardTitle>Globex LLC — Suite 900</CardTitle>
                <CardDescription>Tower SF · 12,200 SF</CardDescription>
                <CardAction>
                  <Badge variant="secondary"><Clock data-icon="inline-start" />Negotiating</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <KPI label="Asking rent" value="$68/SF" sub="Year 1" />
                  <KPI label="Proposed term" value="7 years" />
                  <KPI label="TI budget" value="$95/SF" />
                  <KPI label="Free rent" value="TBD" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="size-3.5" />
                  <span>Critical date: LOI expires Mar 15</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="ghost" size="sm"><FileText data-icon="inline-start" />View deal</Button>
                <Button size="sm" className="ml-auto">Update stage</Button>
              </CardFooter>
            </Card>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Simple card */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Simple card (content only)</p>
          <Row label="content only">
            <Card className="w-64">
              <CardContent>
                <p className="text-sm text-muted-foreground">No header or footer. Just content. Use for dense layouts or metric tiles.</p>
              </CardContent>
            </Card>
            <Card className="w-48">
              <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="size-4" />
                  <span className="text-xs uppercase tracking-widest">Occupancy</span>
                </div>
                <p className="text-3xl font-semibold">94.2%</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="size-3.5" />
                  +2.1% vs last quarter
                </div>
              </CardContent>
            </Card>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Size sm */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Size: sm</p>
          <Row label="sm">
            <Card size="sm" className="w-64">
              <CardHeader>
                <CardTitle>Compact card</CardTitle>
                <CardDescription>Smaller padding for dense UIs.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Use in sidebars, data tables, or list views where vertical space matters.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="ml-auto">Action</Button>
              </CardFooter>
            </Card>

            <Card size="sm" className="w-52">
              <CardHeader>
                <CardTitle>Critical dates</CardTitle>
                <CardAction><Badge variant="destructive">3</Badge></CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renewal notice</span>
                    <span className="text-destructive font-medium">Jun 30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rent escalation</span>
                    <span>Jan 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LOI expiry</span>
                    <span className="text-destructive font-medium">Mar 15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Interactive card */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Interactive card with actions</p>
          <Row label="actions">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>Deal health summary</CardTitle>
                <CardDescription>101 Park Ave — Acme Corp</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  {[
                    { label: "Lease commencement date", ok: true },
                    { label: "Rent commencement date", ok: true },
                    { label: "Base rent schedule", ok: true },
                    { label: "TI allowance", ok: true },
                    { label: "Broker commission", ok: false },
                    { label: "LOI date", ok: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      {item.ok
                        ? <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                        : <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                      }
                      <span className={item.ok ? "" : "text-muted-foreground"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <span className="text-xs text-muted-foreground">4 of 6 fields complete</span>
                <Button size="sm" className="ml-auto">Complete deal</Button>
              </CardFooter>
            </Card>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
