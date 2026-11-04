import * as React from "react"
import { Sun, Moon, Check, ArrowRight, ChevronRight, Sparkle, LayoutGrid, FileText, Handshake, Calculator, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { LogoMenuContent } from "@/components/logo-menu-content"

// ── Data ─────────────────────────────────────────────────────────────────────

const COLOR_SECTIONS = [
  {
    title: "Primary",
    tokens: [
      { name: "Primary",            role: "Action / Active",   var: "--primary",            description: "The single chromatic anchor. Every primary button, active nav state, and focus ring resolves here. One filled action per view." },
      { name: "Primary Foreground", role: "Text on Primary",   var: "--primary-foreground",  description: "Foreground text and icons placed directly on a primary-filled surface." },
    ],
  },
  {
    title: "Surfaces",
    tokens: [
      { name: "Background", role: "Page canvas",    var: "--background", description: "The base page surface. In light mode it carries a subtle indigo ambient gradient. In dark mode, a faint lavender radial bloom over near-black." },
      { name: "Card",        role: "Raised surface", var: "--card",       description: "Cards and panels one step above the page. Rendered as bg-card/70 with backdrop-blur-md in both light and dark modes." },
      { name: "Muted",       role: "Subtle fill",    var: "--muted",      description: "Table headers, input backgrounds, and any region that needs a quieter fill than card." },
      { name: "Secondary",   role: "Control surface",var: "--secondary",  description: "Secondary button backgrounds and non-primary interactive surfaces." },
    ],
  },
  {
    title: "Text",
    tokens: [
      { name: "Foreground",         role: "Primary text",  var: "--foreground",          description: "All primary body copy and headings." },
      { name: "Muted Foreground",   role: "Supporting",    var: "--muted-foreground",    description: "Labels, captions, placeholders, and de-emphasised metadata." },
      { name: "Card Foreground",    role: "Text on card",  var: "--card-foreground",     description: "Text color on raised card surfaces." },
    ],
  },
  {
    title: "Border & Structure",
    tokens: [
      { name: "Border",  role: "Divider",     var: "--border",  description: "Structural hairlines between regions: table rows, panel edges, and input outlines." },
      { name: "Ring",    role: "Focus",       var: "--ring",    description: "Focus rings on interactive elements, keyboard-navigable without distraction." },
      { name: "Accent",  role: "Hover fill",  var: "--accent",  description: "Hover fills and subtle interactive backgrounds that don't compete with primary." },
    ],
  },
  {
    title: "Sidebar",
    tokens: [
      { name: "Sidebar",               role: "Nav surface",       var: "--sidebar",               description: "Always dark regardless of page mode. Wired to dark-mode values even in light. A fixed orientation anchor." },
      { name: "Sidebar Foreground",    role: "Nav text",          var: "--sidebar-foreground",    description: "Default text and icons inside the sidebar." },
      { name: "Sidebar Primary",       role: "Active accent",     var: "--sidebar-primary",       description: "Active nav item labels and the VTS Agents accent. Brighter than --primary to read on the dark nav surface." },
      { name: "Sidebar Accent",        role: "Hover / selected",  var: "--sidebar-accent",        description: "Hover and selected state fills inside the navigation shell." },
    ],
  },
  {
    title: "System",
    tokens: [
      { name: "Destructive", role: "Error / Danger",   var: "--destructive", description: "Errors, deletion confirmations, and irreversible actions." },
      { name: "Success",     role: "Positive",          var: "--success",     description: "Completion states, positive deltas, and executed deals." },
      { name: "Warning",     role: "Caution",           var: "--warning",     description: "Near-expiry dates, budget risk, and items needing attention." },
      { name: "Declined",    role: "Declined / Lapsed", var: "--declined",    description: "Declined deals, lapsed options, and other negative-but-not-destructive states. A violet rather than red to stay within the indigo family." },
    ],
  },
  {
    title: "Charts",
    tokens: [
      { name: "Chart 1", role: "Primary series",   var: "--chart-1", description: "Matches --primary. The highlighted bar, the active line, the first series." },
      { name: "Chart 2", role: "Second series",    var: "--chart-2", description: "A cooler blue-violet for the second data series, within the indigo family." },
      { name: "Chart 3", role: "Third series",     var: "--chart-3", description: "A mauve-adjacent step, still in the 278–298 hue range." },
      { name: "Chart 4", role: "Fourth series",    var: "--chart-4", description: "Shifts slightly blue for the fourth series." },
      { name: "Chart 5", role: "Fifth series",     var: "--chart-5", description: "A soft blue-grey for the least-emphasized series." },
    ],
  },
]

const TYPE_SCALE = [
  { role: "Display",  meta: "60px · 600 · −0.02em",        className: "text-[60px] font-semibold tracking-[-0.02em] leading-[1.08]",                               sample: "Built for how modern teams work" },
  { role: "H1",       meta: "38px · 600 · −0.018em",       className: "text-[38px] font-semibold tracking-[-0.018em] leading-[1.2]",                               sample: "One workspace, every team" },
  { role: "H2",       meta: "33px · 600 · −0.015em",       className: "text-[33px] font-semibold tracking-[-0.015em] leading-snug",                                sample: "Automate the busywork" },
  { role: "H3",       meta: "20px · 600",                   className: "text-xl font-semibold",                                                                     sample: "Recent agent runs" },
  { role: "Body",     meta: "16px · 400 · 1.6 lh",         className: "text-base text-muted-foreground leading-relaxed max-w-lg",                                  sample: "Standard paragraph and component copy. Geist's open counters and even spacing keep long-form reading comfortable at any surface color, light or dark." },
  { role: "Small",    meta: "14px · 400",                   className: "text-sm text-muted-foreground",                                                             sample: "Helper text, timestamps, and metadata labels." },
  { role: "Eyebrow",  meta: "10px · 500 · uppercase",       className: "text-[10px] font-medium uppercase tracking-widest text-muted-foreground",                   sample: "VTS Agents · Lease risk · 2 min ago" },
  { role: "Mono",     meta: "11.5px · 600 · mono",          className: "font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary",            sample: "03 · Typography" },
]

// --radius = 0.5rem (8px). Steps are computed multipliers of that base.
const RADIUS_STEPS = [
  { label: "sm",   cls: "rounded-sm",   px: "~5px",  desc: "Chips, badges, tight labels" },
  { label: "md",   cls: "rounded-md",   px: "~6px",  desc: "Input fields, small rows" },
  { label: "lg",   cls: "rounded-lg",   px: "8px",   desc: "Buttons and tags. The base radius." },
  { label: "xl",   cls: "rounded-xl",   px: "~11px", desc: "Building image thumbnails" },
  { label: "2xl",  cls: "rounded-2xl",  px: "~14px", desc: "Cards, panels, stat tiles" },
  { label: "3xl",  cls: "rounded-3xl",  px: "~18px", desc: "Modals, large overlays" },
  { label: "4xl",  cls: "rounded-4xl",  px: "~21px", desc: "Hero banners, full-page sheets" },
  { label: "full", cls: "rounded-full", px: "∞",     desc: "Pills, avatars, toggle tracks" },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ kicker, title, description }: { kicker: string; title: string; description?: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-3.5">{kicker}</p>
      <h2 className="text-[33px] font-semibold tracking-[-0.015em] text-foreground mb-3 leading-snug">{title}</h2>
      {description && <p className="text-base text-muted-foreground leading-relaxed max-w-[680px]">{description}</p>}
    </div>
  )
}

function Swatch({ name, role, cssVar, description }: { name: string; role: string; cssVar: string; description: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="h-16 bg-[var(--sw)]" style={{ "--sw": `var(${cssVar})` } as React.CSSProperties} />
      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-foreground leading-none">{name}</p>
        <p className="text-[10px] font-medium uppercase tracking-wide text-primary">{role}</p>
        <p className="font-mono text-[11px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 inline-block">{cssVar}</p>
        <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{description}</p>
      </div>
    </div>
  )
}


function TokenRow({ label, cssVar }: { label: string; cssVar: string }) {
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim())
  }, [cssVar])
  const isColor = value.startsWith("oklch") || value.startsWith("#") || value.startsWith("rgb")
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 bg-card">
      {isColor ? (
        <div className="size-6 rounded-md shrink-0 border border-border/50" style={{ background: `var(${cssVar})` }} />
      ) : (
        <div className="size-6 shrink-0 flex items-center justify-center font-mono text-[10px] text-muted-foreground border border-border rounded-md">{value || "—"}</div>
      )}
      <span className="font-mono text-xs text-foreground w-52 shrink-0">{label}</span>
      <span className="font-mono text-[10px] text-muted-foreground/70 bg-muted rounded px-1.5 py-0.5 shrink-0">{cssVar}</span>
      {isColor && <span className="font-mono text-[10px] text-muted-foreground ml-auto truncate max-w-56">{value}</span>}
    </div>
  )
}

// Mini wireframe — uses only theme token classes, no hardcoded colors
function MiniPanel({ mode }: { mode: "light" | "dark" }) {
  const dark = mode === "dark"
  return (
    <div className={cn(
      "rounded-2xl overflow-hidden border border-border text-[11px]",
      dark ? "dark bg-background text-foreground" : "force-light bg-background text-foreground"
    )}>
      <div className="flex min-h-[260px]">
        {/* Sidebar — always dark, matching the real nav */}
        <div className="w-32 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-foreground/80">
          {/* Logo */}
          <div className="flex items-center gap-1.5 px-3 py-3 border-b border-sidebar-foreground/80">
            <span className="w-4 h-4 rounded bg-sidebar-primary/20 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-sm bg-sidebar-primary block" />
            </span>
            <span className="text-[11px] font-bold text-sidebar-foreground">VTS</span>
          </div>
          {/* Building switcher */}
          <div className="px-2 py-2 border-b border-sidebar-foreground/80">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-sidebar-accent">
              <span className="w-4 h-4 rounded bg-muted-foreground/20 shrink-0" />
              <span className="text-[9px] font-medium text-sidebar-foreground leading-tight truncate">VTS Tower HQ</span>
            </div>
          </div>
          {/* Nav items */}
          <div className="flex flex-col gap-0.5 px-2 py-2 flex-1">
            {[["Overview", true],["Stacking Plan",false],["Leases",false],["Deals",false],["VTS Agents",false]].map(([label, active]) => (
              <div key={String(label)} className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px]",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground/60"
              )}>
                <span className={cn("w-1 h-1 rounded-full shrink-0", active ? "bg-sidebar-primary" : "bg-sidebar-foreground/25")} />
                {label}
              </div>
            ))}
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Building header */}
          <div className="px-4 py-2.5 border-b border-border bg-card/70 backdrop-blur-md flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">Built 2017 · Office</p>
              <p className="font-bold text-[13px] text-foreground leading-tight">VTS Tower Headquarters</p>
            </div>
            <span className="text-[9px] px-2 py-1 rounded-full font-semibold bg-primary text-primary-foreground">Ask VTS</span>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
            {[["Avg NER","$74/sf","+9.4%","text-primary"],["Revenue at Risk","$234K/mo","−$18K","text-destructive"],["Pipeline","$89K/mo","+$12K","text-primary"]].map(([label,val,delta,color]) => (
              <div key={String(label)} className="px-3 py-2 bg-background">
                <p className="text-[8px] uppercase text-muted-foreground mb-0.5">{label}</p>
                <p className="font-bold text-[12px] text-foreground">{val}</p>
                <p className={cn("text-[9px] font-medium", color)}>{delta}</p>
              </div>
            ))}
          </div>
          {/* Content area */}
          <div className="flex-1 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-[11px] text-foreground">Critical Dates</p>
              <span className="text-[9px] px-2 py-1 rounded border border-border bg-card text-muted-foreground">View all</span>
            </div>
            <table className="w-full text-[9.5px]">
              <thead>
                <tr className="border-b border-border">
                  {["Tenant","Type","Date"].map(h => (
                    <th key={h} className="text-left pb-1 font-semibold uppercase text-[8px] text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["Pfizer","Lease Expiration","Sep 15, 2026"],["Morgan Stanley","Lease Expiration","Nov 1, 2026"],["Deloitte LLP","Rent Commencement","Dec 1, 2026"]].map(([tenant,type,date]) => (
                  <tr key={String(tenant)} className="border-b last:border-0 border-border">
                    <td className="py-1 text-foreground font-medium">{tenant}</td>
                    <td className="text-muted-foreground">{type}</td>
                    <td className="text-foreground">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface ThemeShowcaseProps {
  isDark: boolean
  onToggleDark: () => void
}

export function ThemeShowcase({ isDark, onToggleDark }: ThemeShowcaseProps) {
  const [panelDark, setPanelDark] = React.useState(false)
  const [themeLogoOpen, setThemeLogoOpen] = React.useState(false)
  return (
    <>
      <div className={cn(
        "fixed inset-0 -z-10",
        isDark ? "bg-[oklch(0.08_0.002_258)]" : "bg-[oklch(0.99_0.01_275)]"
      )} />
    <div className="max-w-6xl mx-auto pt-10 pb-[72px] px-1 space-y-[72px]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="pb-[72px] border-b border-border">
        <div className="flex items-start justify-between mb-6">
          <Popover open={themeLogoOpen} onOpenChange={setThemeLogoOpen}>
            <PopoverTrigger render={<div />} className="cursor-pointer focus:outline-none" aria-label="Open appearance settings">
              <svg width="555" height="160" viewBox="0 0 555 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto text-foreground hover:opacity-80 transition-opacity">
                <path d="M262.948 37.923L282.271 99.5913L301.591 37.923H321.723L293.26 121.804H270.12L241.889 37.923H262.948Z" fill="currentColor"/>
                <path d="M378.745 55.2793H351.903V37.923H425.601V55.2793H398.645V121.804H378.745V55.2793Z" fill="currentColor"/>
                <path d="M491.06 52.3862C483.422 52.3862 477.756 55.2794 477.756 60.4835C477.756 64.6518 481.688 67.6581 487.475 68.9305L498.928 71.2439C512.464 74.021 529.588 78.1862 529.588 95.7721C529.588 113.358 511.885 123.31 494.416 123.31C472.895 123.31 458.78 112.549 455.771 94.4997H475.441C477.639 103.293 484.581 107.342 494.879 107.342C501.588 107.342 509.224 105.144 509.224 98.2023C509.224 92.7658 502.747 90.1023 493.604 88.1371L483.422 86.0533C469.77 83.1633 457.392 76.6841 457.392 61.6418C457.392 44.519 475.788 36.5351 492.217 36.5351C508.646 36.5351 524.265 43.7095 527.158 62.2215H507.604C505.636 55.9721 499.506 52.3862 491.06 52.3862Z" fill="currentColor"/>
                <path d="M108.553 46.9088L136.165 65.2593L156.596 51.7396L108.553 19.812L108.485 19.8573L60.427 51.7926L80.8551 65.3125L108.485 46.953L108.553 46.9088Z" fill="currentColor"/>
                <path d="M108.47 105.303L25.0786 53.0043V87.8887L108.47 140.187L108.485 140.179L191.889 87.8741V52.9871L108.485 105.293L108.47 105.303Z" fill="currentColor"/>
              </svg>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 overflow-hidden" align="start">
              <LogoMenuContent isDark={isDark} onToggleDark={onToggleDark} onClose={() => setThemeLogoOpen(false)} />
            </PopoverContent>
          </Popover>
          <div />
        </div>
        <h1 className="text-[60px] font-semibold tracking-[-0.02em] leading-[1.08] text-foreground mb-5 max-w-[780px]">
          Designed for clarity.<br /><span className="text-primary">Built for speed.</span><br />Powered by agents.
        </h1>
        <p className="text-[19px] text-muted-foreground leading-relaxed max-w-[640px]">
          A foundation for VTS Reimagined, combining a refined indigo palette, Geist throughout, and consistent UI patterns. Built to make information clearer, actions easier to find, and AI and agents feel native to how CRE work gets done.
        </p>
      </div>

      {/* ── 01 Color ─────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="01 · Color"
          title="One refined indigo, a working system around it."
          description="A single oklch indigo carries every primary action. Around it: a neutral secondary for lower-emphasis controls, four semantic status colors, five chart colors within the same hue family, and two neutral ramps sharing the same chroma and hue axis: one for light surfaces, one for dark."
        />
        <div className="space-y-8">
          {COLOR_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{section.title}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {section.tokens.map(t => (
                  <Swatch key={t.var} name={t.name} role={t.role} cssVar={t.var} description={t.description} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── 02 Gradients ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="02 · Gradients"
          title="The page surface, in both modes."
          description="Two gradients applied to the base surface, one per mode. Light mode layers soft radial washes in the same oklch hue family as the primary ramp, staying warm and barely-there. Dark mode fades from a muted violet bloom into near-black. Both are CSS utility classes in index.css, separate from the token ramps."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Light mode body — approximate representation */}
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-28 bg-gradient-body-light" />
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold text-foreground">Page Background: Light</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-primary">Ambient / Body</p>
              <p className="font-mono text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 inline-block mb-1">body (light mode)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Three layered radial gradients over a warm indigo base. Subtle warmth and a slight purple cast that never competes with content.</p>
            </div>
          </div>
          {/* Dark mode body */}
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-28 bg-gradient-body-dark" />
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold text-foreground">Page Background: Dark</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-primary">Ambient / Body</p>
              <p className="font-mono text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 inline-block mb-1">body (dark mode)</p>
              <p className="text-xs text-muted-foreground leading-relaxed">A lavender radial bloom (#CAC7FC at 30% opacity) over near-black. Connects dark surfaces back to the indigo palette without adding noise.</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 03 Typography ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="03 · Typography"
          title="Geist, top to bottom."
          description="One typeface across every role. Both --font-heading and --font-sans are set to Geist Variable. Headings (h1–h6) use the heading token via @layer base; body and UI copy use font-sans. The same family, the same renderer, no switching cost."
        />
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {TYPE_SCALE.map((row, i) => (
            <div key={row.role} className={cn("flex flex-col sm:flex-row sm:items-baseline gap-3 px-6 py-5", i > 0 && "border-t border-border")}>
              <div className="shrink-0 w-44">
                <p className="text-xs font-semibold text-foreground">{row.role}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{row.meta}</p>
              </div>
              <p className={cn("text-foreground", row.className)}>{row.sample}</p>
            </div>
          ))}
          <div className="border-t border-border px-6 py-4 flex flex-wrap gap-2">
            {[["400","body · paragraph",true],["500","labels · eyebrows",true],["600","headings · card titles",true]].map(([weight, label, active]) => (
              <span key={String(weight)} className={cn("font-mono text-xs px-3 py-1.5 rounded-full border",
                active ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"
              )}>{weight} · {label}</span>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 04 Applied ───────────────────────────────────────────────────── */}
      {/* ── 04 Applied ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="04 · Applied"
          title="One token set. Two neutral ramps."
          description="The same component, the same token classes, two modes. What changes is the neutral ramp: background, card, muted, border, and foreground surfaces all shift together. What stays locked: the indigo primary, the sidebar surface, and every semantic status color."
        />
        <div className="flex items-center justify-end mb-4">
          <Button
            variant={panelDark ? "outline" : "secondary"}
            onClick={() => setPanelDark(d => !d)}
            className={cn(
              "rounded-full gap-2",
              panelDark && "bg-sidebar text-sidebar-foreground border-sidebar-foreground/80 hover:bg-sidebar-accent"
            )}
          >
            {panelDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {panelDark ? "Dark Mode" : "Light Mode"}
          </Button>
        </div>
        <MiniPanel mode={panelDark ? "dark" : "light"} />
      </section>

      <Separator />

      {/* ── 05 Elevation ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="05 · Elevation"
          title="Flat by default. Floating on purpose."
          description="Three surface levels: base, raised glass, and floating. Base is the page canvas. Raised glass sits one ramp step above it using bg-card/70 with backdrop-blur-md, the pattern used across stat tiles, building headers, and content cards. Floating surfaces step further again with deeper blur and shadow, reserved for popovers and modals."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="h-16 rounded-xl mb-4 bg-background border border-border" />
            <p className="text-sm font-semibold text-foreground mb-1">Base</p>
            <p className="font-mono text-[10px] text-muted-foreground mb-2">bg-background</p>
            <p className="text-xs text-muted-foreground leading-relaxed">The page canvas. Separation from cards comes from a one-step value difference, never a shadow.</p>
          </div>
          <div>
            <div className="h-16 rounded-xl mb-4 bg-card/70 backdrop-blur-md border border-border shadow-sm" />
            <p className="text-sm font-semibold text-foreground mb-1">Raised Glass</p>
            <p className="font-mono text-[10px] text-muted-foreground mb-2">bg-card/70 backdrop-blur-md</p>
            <p className="text-xs text-muted-foreground leading-relaxed">The actual card pattern used across the app. Frosted glass, not a flat token. Consistent across stat tiles, building headers, and content cards.</p>
          </div>
          <div>
            <div className="h-16 rounded-xl mb-4 bg-popover/80 backdrop-blur-xl border border-border shadow-xl" />
            <p className="text-sm font-semibold text-foreground mb-1">Floating</p>
            <p className="font-mono text-[10px] text-muted-foreground mb-2">bg-popover/80 backdrop-blur-xl shadow-xl</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Dropdowns, modals, and tooltips. Deep blur, a pronounced shadow, and a slightly brighter border.</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 06 Curves & Shapes ───────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="06 · Curves & Shapes"
          title="Radius, softness, and geometry."
          description="Corner radius is computed from a single --radius base of 0.5rem (8px) with multipliers. The scale runs from tight chips to generous hero banners, all derived from one source of truth."
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {RADIUS_STEPS.map(({ label, cls, px, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className={cn("w-full aspect-square bg-primary/15 border-2 border-primary/30", cls)} />
              <div className="text-center">
                <p className="font-mono text-xs font-semibold text-foreground">{label}</p>
                <p className="font-mono text-[10px] text-primary">{px}</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── 07 Components ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="07 · Components"
          title="Tokens, applied to Components."
          description="VTS components with a single refined indigo for every primary action and focus state, slate for secondary emphasis, and Geist carrying every label."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Buttons */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Button</p>
              <p className="text-xs text-muted-foreground font-mono">primary · secondary · ghost</p>
            </div>
            <div className="p-5 flex flex-wrap gap-3 items-center">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost <ArrowRight className="h-3.5 w-3.5" /></Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
              Indigo fill is reserved for the single primary action per view. Secondary uses the slate surface token, never a lighter tint of the brand color.
            </div>
          </div>

          {/* Button group */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Button group</p>
              <p className="text-xs text-muted-foreground font-mono">horizontal · vertical · split</p>
            </div>
            <div className="p-5 flex flex-wrap gap-3 items-center">
              <ButtonGroup>
                <Button variant="outline">Archive</Button>
                <Button variant="outline">Report</Button>
                <Button variant="outline">Snooze</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant="secondary">Save</Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" size="icon"><ArrowRight className="h-4 w-4" /></Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button variant="outline" size="sm">Top</Button>
                <Button variant="outline" size="sm">Middle</Button>
                <Button variant="outline" size="sm">Bottom</Button>
              </ButtonGroup>
            </div>
            <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
              Groups related actions into a single connected control. Use <code className="font-mono">ButtonGroupSeparator</code> to create split buttons.
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Badge</p>
              <p className="text-xs text-muted-foreground font-mono">status · system · brand</p>
            </div>
            <div className="p-5 flex flex-wrap gap-2 items-center">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success px-2.5 py-1 text-xs font-medium">
                <Check className="h-3 w-3" /> Success
              </span>
              <span className="inline-flex items-center rounded-full bg-warning/15 text-warning px-2.5 py-1 text-xs font-medium">
                Warning
              </span>
              <span className="inline-flex items-center rounded-full bg-declined/15 text-declined px-2.5 py-1 text-xs font-medium">
                Declined
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-medium">
                AI Powered
              </span>
            </div>
            <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
              Status uses dedicated semantic tokens, including --declined for lapsed deals. Not a generic color system.
            </div>
          </div>

          {/* Inputs */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Input & Select</p>
              <p className="text-xs text-muted-foreground font-mono">text field · disabled</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Workspace name</p>
                <Input defaultValue="VTS Tower Headquarters" />
                <p className="text-xs text-muted-foreground">Visible to everyone on your team.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Plan</p>
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>
            <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
              Focus rings use the --ring token, a soft indigo halo at reduced opacity. Visible, not jarring. Field borders use --input, one step up from --background.
            </div>
          </div>

          {/* Surface hierarchy */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Surface Hierarchy</p>
              <p className="text-xs text-muted-foreground font-mono">background · card · muted</p>
            </div>
            <div className="p-5 grid grid-cols-3 gap-3">
              {[
                { label: "Background", cls: "bg-background border border-border" },
                { label: "Card",       cls: "bg-card/70 backdrop-blur-md border border-border shadow-sm" },
                { label: "Muted",      cls: "bg-muted border border-border" },
              ].map(s => (
                <div key={s.label} className={cn("rounded-xl p-3", s.cls)}>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">{s.label}</p>
                  <p className="text-xs text-foreground leading-snug">Text on {s.label.toLowerCase()}.</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Muted copy.</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
              The Card surface in this app uses bg-card/70 backdrop-blur-md in both light and dark modes.
            </div>
          </div>

        </div>
      </section>

      <Separator />

      {/* ── 08 Navigation ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="08 · Navigation"
          title="Always dark. Always oriented."
          description="The sidebar surface uses its own token ramp, wired to dark values in both modes. In light mode it sits as a dark island against the light base surface. In dark mode, the sidebar and card surfaces share the same oklch lightness (0.18), so separation comes from layout position alone, not value contrast."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden border border-border max-w-xs">
            <div className="bg-sidebar px-4 py-5 space-y-0.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">Navigation</p>
              {[
                { label: "Overview",   icon: LayoutGrid,  active: true,  accent: false },
                { label: "Leases",     icon: FileText,    active: false, accent: false },
                { label: "Deals",      icon: Handshake,   active: false, accent: false },
                { label: "Planning",   icon: Calculator,  active: false, accent: false },
                { label: "VTS Agents", icon: Sparkle,     active: false, accent: true  },
                { label: "Profile",    icon: UserCircle,  active: false, accent: false },
              ].map(({ label, icon: Icon, active, accent }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : accent
                        ? "text-sidebar-primary hover:bg-sidebar-accent/60"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {label}
                  {accent && <ChevronRight className="h-3 w-3 ml-auto opacity-60" />}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3 self-center">
            <p>The active item is marked by the sidebar-accent fill and sidebar-primary dot. A quiet signal, not a jarring highlight.</p>
            <p>VTS Agents gets the sidebar-primary text color at rest, distinguishing it from standard nav items without requiring a separate accent system.</p>
            <p className="text-xs font-mono text-muted-foreground/70">--sidebar-primary is brighter than --primary so it reads on the dark nav surface without a separate dark-mode override.</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 09 Component library ─────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="09 · Component library"
          title="VTS components"
          description="Built on Base UI primitives. Every component is owned by the project and styled with VTS design tokens."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: "Accordion", href: "/vts_lookfeel_nav_concept_1-0/accordion-showcase.html" },
            { label: "Alert", href: "/vts_lookfeel_nav_concept_1-0/alert-showcase.html" },
            { label: "Alert dialog", href: "/vts_lookfeel_nav_concept_1-0/alert-dialog-showcase.html" },
            { label: "Aspect ratio", href: "/vts_lookfeel_nav_concept_1-0/aspect-ratio-showcase.html" },
            { label: "Attachment", href: "/vts_lookfeel_nav_concept_1-0/attachment-showcase.html" },
            { label: "Avatar", href: "/vts_lookfeel_nav_concept_1-0/avatar-showcase.html" },
            { label: "Badge", href: "/vts_lookfeel_nav_concept_1-0/badge-showcase.html" },
            { label: "Breadcrumb", href: "/vts_lookfeel_nav_concept_1-0/breadcrumb-showcase.html" },
            { label: "Bubble", href: "/vts_lookfeel_nav_concept_1-0/bubble-showcase.html" },
            { label: "Button", href: "/vts_lookfeel_nav_concept_1-0/button-showcase.html" },
            { label: "Calendar", href: "/vts_lookfeel_nav_concept_1-0/calendar-showcase.html" },
            { label: "Card", href: "/vts_lookfeel_nav_concept_1-0/card-showcase.html" },
            { label: "Carousel", href: "/vts_lookfeel_nav_concept_1-0/carousel-showcase.html" },
            { label: "Checkbox", href: "/vts_lookfeel_nav_concept_1-0/checkbox-showcase.html" },
            { label: "Collapsible", href: "/vts_lookfeel_nav_concept_1-0/collapsible-showcase.html" },
            { label: "Combobox", href: "/vts_lookfeel_nav_concept_1-0/combobox-showcase.html" },
            { label: "Command", href: "/vts_lookfeel_nav_concept_1-0/command-showcase.html" },
            { label: "Context menu", href: "/vts_lookfeel_nav_concept_1-0/context-menu-showcase.html" },
            { label: "Dialog", href: "/vts_lookfeel_nav_concept_1-0/dialog-showcase.html" },
            { label: "Drawer", href: "/vts_lookfeel_nav_concept_1-0/drawer-showcase.html" },
            { label: "Dropdown menu", href: "/vts_lookfeel_nav_concept_1-0/dropdown-menu-showcase.html" },
            { label: "Empty", href: "/vts_lookfeel_nav_concept_1-0/empty-showcase.html" },
            { label: "Field", href: "/vts_lookfeel_nav_concept_1-0/field-showcase.html" },
            { label: "Hover card", href: "/vts_lookfeel_nav_concept_1-0/hover-card-showcase.html" },
            { label: "Input", href: "/vts_lookfeel_nav_concept_1-0/input-showcase.html" },
            { label: "Input group", href: "/vts_lookfeel_nav_concept_1-0/input-group-showcase.html" },
            { label: "Input OTP", href: "/vts_lookfeel_nav_concept_1-0/input-otp-showcase.html" },
            { label: "Item", href: "/vts_lookfeel_nav_concept_1-0/item-showcase.html" },
            { label: "Kbd", href: "/vts_lookfeel_nav_concept_1-0/kbd-showcase.html" },
            { label: "Label", href: "/vts_lookfeel_nav_concept_1-0/label-showcase.html" },
            { label: "Marker", href: "/vts_lookfeel_nav_concept_1-0/marker-showcase.html" },
            { label: "Menubar", href: "/vts_lookfeel_nav_concept_1-0/menubar-showcase.html" },
            { label: "Message", href: "/vts_lookfeel_nav_concept_1-0/message-showcase.html" },
            { label: "Navigation menu", href: "/vts_lookfeel_nav_concept_1-0/navigation-menu-showcase.html" },
            { label: "Native select", href: "/vts_lookfeel_nav_concept_1-0/native-select-showcase.html" },
            { label: "Pagination", href: "/vts_lookfeel_nav_concept_1-0/pagination-showcase.html" },
            { label: "Popover", href: "/vts_lookfeel_nav_concept_1-0/popover-showcase.html" },
            { label: "Progress", href: "/vts_lookfeel_nav_concept_1-0/progress-showcase.html" },
            { label: "Radio group", href: "/vts_lookfeel_nav_concept_1-0/radio-group-showcase.html" },
            { label: "Resizable", href: "/vts_lookfeel_nav_concept_1-0/resizable-showcase.html" },
            { label: "Scroll area", href: "/vts_lookfeel_nav_concept_1-0/scroll-area-showcase.html" },
            { label: "Select", href: "/vts_lookfeel_nav_concept_1-0/select-showcase.html" },
            { label: "Separator", href: "/vts_lookfeel_nav_concept_1-0/separator-showcase.html" },
            { label: "Sheet", href: "/vts_lookfeel_nav_concept_1-0/sheet-showcase.html" },
            { label: "Skeleton", href: "/vts_lookfeel_nav_concept_1-0/skeleton-showcase.html" },
            { label: "Slider", href: "/vts_lookfeel_nav_concept_1-0/slider-showcase.html" },
            { label: "Spinner", href: "/vts_lookfeel_nav_concept_1-0/spinner-showcase.html" },
            { label: "Switch", href: "/vts_lookfeel_nav_concept_1-0/switch-showcase.html" },
            { label: "Table", href: "/vts_lookfeel_nav_concept_1-0/table-showcase.html" },
            { label: "Tabs", href: "/vts_lookfeel_nav_concept_1-0/tabs-showcase.html" },
            { label: "Textarea", href: "/vts_lookfeel_nav_concept_1-0/textarea-showcase.html" },
            { label: "Toast", href: "/vts_lookfeel_nav_concept_1-0/toast-showcase.html" },
            { label: "Toggle", href: "/vts_lookfeel_nav_concept_1-0/toggle-showcase.html" },
            { label: "Toggle group", href: "/vts_lookfeel_nav_concept_1-0/toggle-group-showcase.html" },
            { label: "Tooltip", href: "/vts_lookfeel_nav_concept_1-0/tooltip-showcase.html" },
            { label: "Date picker", href: "/vts_lookfeel_nav_concept_1-0/datepicker-showcase.html" },
            { label: "Tab feed", href: "/vts_lookfeel_nav_concept_1-0/tab-feed-showcase.html" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-between gap-2"
            >
              {label}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* ── 10 Tokens ──────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="10 · Tokens"
          title="Theme tokens"
          description="All custom CSS variables defined in this theme. Values shown are computed at runtime for the current mode."
        />
        {[
          {
            group: "Brand",
            rows: [
              { label: "primary",            var: "--primary" },
              { label: "primary-foreground",  var: "--primary-foreground" },
            ],
          },
          {
            group: "Surfaces",
            rows: [
              { label: "background",   var: "--background" },
              { label: "foreground",   var: "--foreground" },
              { label: "card",         var: "--card" },
              { label: "card-foreground", var: "--card-foreground" },
              { label: "popover",      var: "--popover" },
              { label: "popover-foreground", var: "--popover-foreground" },
              { label: "muted",        var: "--muted" },
              { label: "muted-foreground", var: "--muted-foreground" },
              { label: "secondary",    var: "--secondary" },
              { label: "secondary-foreground", var: "--secondary-foreground" },
              { label: "accent",       var: "--accent" },
              { label: "accent-foreground", var: "--accent-foreground" },
            ],
          },
          {
            group: "Structure",
            rows: [
              { label: "border",  var: "--border" },
              { label: "input",   var: "--input" },
              { label: "ring",    var: "--ring" },
              { label: "radius",  var: "--radius" },
            ],
          },
          {
            group: "System status",
            rows: [
              { label: "destructive", var: "--destructive" },
              { label: "success",     var: "--success" },
              { label: "warning",     var: "--warning" },
              { label: "declined",    var: "--declined" },
            ],
          },
          {
            group: "Charts",
            rows: [
              { label: "chart-1", var: "--chart-1" },
              { label: "chart-2", var: "--chart-2" },
              { label: "chart-3", var: "--chart-3" },
              { label: "chart-4", var: "--chart-4" },
              { label: "chart-5", var: "--chart-5" },
            ],
          },
          {
            group: "Sidebar",
            rows: [
              { label: "sidebar",                    var: "--sidebar" },
              { label: "sidebar-foreground",         var: "--sidebar-foreground" },
              { label: "sidebar-primary",            var: "--sidebar-primary" },
              { label: "sidebar-primary-foreground", var: "--sidebar-primary-foreground" },
              { label: "sidebar-accent",             var: "--sidebar-accent" },
              { label: "sidebar-accent-foreground",  var: "--sidebar-accent-foreground" },
              { label: "sidebar-border",             var: "--sidebar-border" },
              { label: "sidebar-ring",               var: "--sidebar-ring" },
            ],
          },
        ].map(({ group, rows }) => (
          <div key={group} className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{group}</p>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {rows.map(({ label, var: cssVar }) => (
                <TokenRow key={cssVar} label={label} cssVar={cssVar} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="border-t border-border" />

      {/* ── 11 Tailwind ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          kicker="11 · Tailwind"
          title="Tailwind defaults"
          description="Tailwind's built-in design tokens — spacing scale, font sizes, font weights, line heights, and border radius defaults available alongside VTS tokens."
        />

        {/* Spacing */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Spacing scale</p>
          <div className="flex flex-wrap gap-2">
            {[0,0.5,1,1.5,2,2.5,3,3.5,4,5,6,7,8,9,10,11,12,14,16,20,24,28,32,36,40,44,48,52,56,60,64,72,80,96].map(step => (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <div className="bg-primary/20 rounded" style={{ width: `${Math.max(step * 4, 2)}px`, height: "20px" }} />
                <span className="font-mono text-[9px] text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Font sizes */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Font sizes</p>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {[
              { name: "xs",   cls: "text-xs",   size: "12px / 0.75rem" },
              { name: "sm",   cls: "text-sm",   size: "14px / 0.875rem" },
              { name: "base", cls: "text-base", size: "16px / 1rem" },
              { name: "lg",   cls: "text-lg",   size: "18px / 1.125rem" },
              { name: "xl",   cls: "text-xl",   size: "20px / 1.25rem" },
              { name: "2xl",  cls: "text-2xl",  size: "24px / 1.5rem" },
              { name: "3xl",  cls: "text-3xl",  size: "30px / 1.875rem" },
              { name: "4xl",  cls: "text-4xl",  size: "36px / 2.25rem" },
              { name: "5xl",  cls: "text-5xl",  size: "48px / 3rem" },
              { name: "6xl",  cls: "text-6xl",  size: "60px / 3.75rem" },
            ].map(({ name, cls, size }) => (
              <div key={name} className="flex items-baseline gap-6 px-4 py-3 bg-card">
                <span className="font-mono text-[11px] text-muted-foreground w-10 shrink-0">{name}</span>
                <span className={cn(cls, "text-foreground leading-none")}>{name}</span>
                <span className="font-mono text-[11px] text-muted-foreground ml-auto">{size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Font weights */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Font weights</p>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {[
              { name: "thin",       cls: "font-thin",       weight: "100" },
              { name: "extralight", cls: "font-extralight", weight: "200" },
              { name: "light",      cls: "font-light",      weight: "300" },
              { name: "normal",     cls: "font-normal",     weight: "400" },
              { name: "medium",     cls: "font-medium",     weight: "500" },
              { name: "semibold",   cls: "font-semibold",   weight: "600" },
              { name: "bold",       cls: "font-bold",       weight: "700" },
              { name: "extrabold",  cls: "font-extrabold",  weight: "800" },
              { name: "black",      cls: "font-black",      weight: "900" },
            ].map(({ name, cls, weight }) => (
              <div key={name} className="flex items-center gap-6 px-4 py-2.5 bg-card">
                <span className="font-mono text-[11px] text-muted-foreground w-24 shrink-0">{name}</span>
                <span className={cn("text-base text-foreground", cls)}>The quick brown fox</span>
                <span className="font-mono text-[11px] text-muted-foreground ml-auto">{weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Border radius */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Border radius</p>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "none",  cls: "rounded-none",  px: "0px" },
              { name: "sm",    cls: "rounded-sm",    px: "~2px" },
              { name: "md",    cls: "rounded-md",    px: "~4px" },
              { name: "lg",    cls: "rounded-lg",    px: "~6px" },
              { name: "xl",    cls: "rounded-xl",    px: "~8px" },
              { name: "2xl",   cls: "rounded-2xl",   px: "12px" },
              { name: "3xl",   cls: "rounded-3xl",   px: "16px" },
              { name: "full",  cls: "rounded-full",  px: "9999px" },
            ].map(({ name, cls, px }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className={cn("size-12 border-2 border-primary/40 bg-primary/10", cls)} />
                <span className="font-mono text-[10px] text-muted-foreground text-center">{name}<br />{px}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line heights */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Line heights</p>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {[
              { name: "none",    cls: "leading-none",    value: "1" },
              { name: "tight",   cls: "leading-tight",   value: "1.25" },
              { name: "snug",    cls: "leading-snug",    value: "1.375" },
              { name: "normal",  cls: "leading-normal",  value: "1.5" },
              { name: "relaxed", cls: "leading-relaxed", value: "1.625" },
              { name: "loose",   cls: "leading-loose",   value: "2" },
            ].map(({ name, cls, value }) => (
              <div key={name} className="flex items-start gap-6 px-4 py-3 bg-card">
                <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0 pt-0.5">{name}</span>
                <p className={cn("text-sm text-foreground max-w-xs", cls)}>The quick brown fox jumps over the lazy dog. A second sentence for context.</p>
                <span className="font-mono text-[11px] text-muted-foreground ml-auto shrink-0 pt-0.5">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pb-8 border-t border-border pt-8 mt-16 text-xs text-muted-foreground">
        VTS Design System foundations reference. Built to be retokenized and extended as the product surface grows.
      </div>

    </div>
    </>
  )
}

