import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { format, addDays, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// ── Shared layout helpers ────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-36 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  )
}

// ── Date picker variants ─────────────────────────────────────────────────────

function SingleDatePicker({ placeholder = "Pick a date", disabled = false }: { placeholder?: string; disabled?: boolean }) {
  const [date, setDate] = React.useState<Date>()
  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className="w-56 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date ? format(date, "PPP") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}

function PreselectedDatePicker() {
  const [date, setDate] = React.useState<Date>(new Date())
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-56 justify-start text-left font-normal"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {format(date, "PPP")}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
      </PopoverContent>
    </Popover>
  )
}

function DateRangePicker() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!range?.from}
            className="w-72 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {range?.from ? (
          range.to ? (
            <>
              {format(range.from, "LLL dd, y")} – {format(range.to, "LLL dd, y")}
            </>
          ) : (
            format(range.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={(r) => r && setRange(r)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

function DateOfBirthPicker() {
  const [date, setDate] = React.useState<Date>()
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className="w-56 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date ? format(date, "PPP") : <span>Date of birth</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={date}
          onSelect={setDate}
          fromYear={1920}
          toYear={new Date().getFullYear()}
        />
      </PopoverContent>
    </Popover>
  )
}

function WithPresets() {
  const [date, setDate] = React.useState<Date>()
  const presets = [
    { label: "Today", date: new Date() },
    { label: "Tomorrow", date: addDays(new Date(), 1) },
    { label: "In 3 days", date: addDays(new Date(), 3) },
    { label: "In a week", date: addDays(new Date(), 7) },
    { label: "In 2 weeks", date: addDays(new Date(), 14) },
  ]
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className="w-56 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex">
          <div className="flex flex-col gap-1 border-r p-2 min-w-[120px]">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant={date && format(date, "PPP") === format(p.date, "PPP") ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs font-normal"
                onClick={() => setDate(p.date)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

function DisabledDates() {
  const [date, setDate] = React.useState<Date>()
  const bookedDates = [
    addDays(new Date(), 2),
    addDays(new Date(), 3),
    addDays(new Date(), 8),
    addDays(new Date(), 9),
    addDays(new Date(), 10),
  ]
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!date}
            className="w-56 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date ? format(date, "PPP") : <span>Pick available date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={[{ before: new Date() }, ...bookedDates]}
        />
      </PopoverContent>
    </Popover>
  )
}

function WeekPicker() {
  const [range, setRange] = React.useState<DateRange>()
  const handleSelect = (d: Date | undefined) => {
    if (!d) return
    const day = d.getDay()
    const from = subDays(d, day)
    const to = addDays(from, 6)
    setRange({ from, to })
  }
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!range}
            className="w-56 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {range?.from ? (
          <>
            {format(range.from, "LLL dd")} – {format(range.to!, "LLL dd, y")}
          </>
        ) : (
          <span>Pick a week</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={range?.from}
          onSelect={handleSelect}
          modifiers={{ range_start: range?.from ?? false, range_end: range?.to ?? false, range_middle: range ? { after: range.from!, before: range.to! } : false }}
        />
      </PopoverContent>
    </Popover>
  )
}

// ── Standalone calendar (inline, no popover) ─────────────────────────────────

function InlineCalendar() {
  const [date, setDate] = React.useState<Date>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(d) => d && setDate(d)}
      className="rounded-lg border"
    />
  )
}

function InlineRangeCalendar() {
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={(r) => r && setRange(r)}
      numberOfMonths={2}
      className="rounded-lg border"
    />
  )
}

// ── App ──────────────────────────────────────────────────────────────────────

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
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">
            VTS design system
          </p>
          <h1 className="text-3xl font-semibold text-foreground">Date picker</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on react-day-picker with Popover and Calendar. Single date, date range, presets, and inline modes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark((d) => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Date picker (popover) */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            01 · Date picker
          </p>
          <div className="flex flex-col gap-5">
            <Row label="empty">
              <SingleDatePicker />
            </Row>
            <Row label="preselected">
              <PreselectedDatePicker />
            </Row>
            <Row label="disabled">
              <SingleDatePicker placeholder="Not available" disabled />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Date range */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            02 · Date range
          </p>
          <div className="flex flex-col gap-5">
            <Row label="range">
              <DateRangePicker />
            </Row>
            <Row label="week">
              <WeekPicker />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Presets */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            03 · Presets
          </p>
          <div className="flex flex-col gap-5">
            <Row label="with presets">
              <WithPresets />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Dropdown caption */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            04 · Month and year dropdowns
          </p>
          <div className="flex flex-col gap-5">
            <Row label="date of birth">
              <DateOfBirthPicker />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Disabled dates */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            05 · Disabled dates
          </p>
          <div className="flex flex-col gap-5">
            <Row label="booked">
              <DisabledDates />
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Inline calendar */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">
            06 · Inline calendar
          </p>
          <div className="flex flex-col gap-5">
            <Row label="single">
              <InlineCalendar />
            </Row>
            <Row label="range">
              <InlineRangeCalendar />
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
