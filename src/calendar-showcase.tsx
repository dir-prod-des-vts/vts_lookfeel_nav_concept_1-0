import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-6 items-start">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(new Date(2025, 0, 1))
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 3, 1),
  })
  const [multiDate, setMultiDate] = React.useState<Date[] | undefined>([
    new Date(2025, 5, 30),
    new Date(2025, 11, 31),
  ])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - 1)

  // Disabled dates: weekends in next month
  const disabledWeekends = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Calendar</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on react-day-picker. Single date, date range, multi-select, disabled dates, and min/max constraints.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Single date */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Single date selection</p>
          <Row label="interactive">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">Selected date</p>
              <p className="font-medium">
                {singleDate ? singleDate.toLocaleDateString("en-US", { dateStyle: "long" }) : "None"}
              </p>
              <p className="text-muted-foreground text-xs mt-2">Use case: lease commencement date</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-1 w-fit"
                onClick={() => setSingleDate(new Date(2025, 0, 1))}
              >
                Set to Jan 1, 2025
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-fit"
                onClick={() => setSingleDate(undefined)}
              >
                Clear
              </Button>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Date range */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Date range</p>
          <Row label="range">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">Lease term</p>
              <p className="font-medium">
                From: {dateRange?.from ? dateRange.from.toLocaleDateString("en-US", { dateStyle: "medium" }) : "—"}
              </p>
              <p className="font-medium">
                To: {dateRange?.to ? dateRange.to.toLocaleDateString("en-US", { dateStyle: "medium" }) : "—"}
              </p>
              <p className="text-muted-foreground text-xs mt-2">Use case: lease term, deal date range</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Disabled past dates */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Disabled past dates</p>
          <Row label="from today">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
                disabled={{ before: today }}
              />
            </div>
            <div className="text-sm flex flex-col gap-1">
              <p className="text-muted-foreground">Past dates are disabled.</p>
              <p className="text-muted-foreground text-xs">Use case: future rent commencement, renewal notice deadline</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Disabled weekends */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Disabled specific dates</p>
          <Row label="no weekends">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
                disabled={disabledWeekends}
              />
            </div>
            <div className="text-sm flex flex-col gap-1">
              <p className="text-muted-foreground">Weekends are disabled.</p>
              <p className="text-muted-foreground text-xs">Use case: business day-only critical dates</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Multiple selected */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Multiple dates selected</p>
          <Row label="multi-select">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="multiple"
                selected={multiDate}
                onSelect={setMultiDate}
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-muted-foreground">Critical dates</p>
              {multiDate?.map(d => (
                <p key={d.toISOString()} className="font-medium">
                  {d.toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
              ))}
              <p className="text-muted-foreground text-xs mt-2">Use case: rent escalation dates, option deadlines</p>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With dropdown navigation */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Dropdown navigation</p>
          <Row label="dropdown">
            <div className="border rounded-xl overflow-hidden">
              <Calendar
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
                captionLayout="dropdown"
                startMonth={new Date(2020, 0)}
                endMonth={new Date(2035, 11)}
              />
            </div>
            <div className="text-sm flex flex-col gap-1">
              <p className="text-muted-foreground">Month and year dropdowns for fast navigation.</p>
              <p className="text-muted-foreground text-xs">Use case: far-future lease dates (2030+)</p>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
