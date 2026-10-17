# VTS design rules

Use this file as context when building UI for VTS. It describes the token system, component conventions, and rules that keep the prototype consistent. Follow these exactly — do not invent styles outside this system.

---

## Stack

- **React 19** + TypeScript + Vite
- **Tailwind v4** — config lives in `src/index.css` (`@theme` block), not `tailwind.config.js`
- **shadcn/ui** — component library; always use shadcn components first before writing custom ones
- **Geist Variable** — the only font; used for both body and headings

---

## Token hierarchy

```
Tokens → Components → Blocks → Templates
```

- **Tokens** — raw design values (colors, spacing, radius) as CSS variables in `src/index.css`
- **Components** — single-purpose primitives built from tokens (`Button`, `Popover`, `Badge` in `src/components/ui/`)
- **Blocks** — feature sections combining multiple components (`DealHealthPopover`, `FinancialBar`, `ActionQueue`)
- **Templates** — full page layouts arranging blocks into a view (`DealsPage`, `DealProfile`, overview in `App.tsx`)

---

## Color tokens

Never use hardcoded colors. Always use semantic tokens. The full token set:

### Surface and text
| Token | Use |
|---|---|
| `bg-background` | Page background |
| `bg-card` | Card surface |
| `bg-muted` | Subtle fills, row hovers |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary / supporting text |
| `border-border` | Default borders |

### Brand
| Token | Use |
|---|---|
| `bg-primary` / `text-primary` | Primary actions, highlights, active states |
| `text-primary-foreground` | Text on primary backgrounds |
| `bg-secondary` | Chip backgrounds, tags |
| `bg-accent` | Hover states, subtle fills |

### Sidebar (dark surface)
The sidebar uses its own token family — use these whenever building UI that sits on the dark sidebar background.
| Token | Use |
|---|---|
| `bg-sidebar` | Sidebar background |
| `bg-sidebar-accent` | Popovers and overlays on dark background |
| `text-sidebar-foreground` | Primary text on dark |
| `text-sidebar-foreground/70` | Secondary text on dark |
| `text-sidebar-foreground/50` | Tertiary / labels on dark |
| `text-sidebar-primary` | Accent color on dark (icon highlights) |
| `border-sidebar-border` | Borders on dark |
| `border-sidebar-foreground/40` | Outline button borders on dark |
| `hover:bg-sidebar-foreground/10` | Hover fill on dark |

### Status
| Token | Use |
|---|---|
| `text-success` / `bg-success` | Positive state |
| `text-warning` / `bg-warning` | Caution state |
| `text-destructive` / `bg-destructive` | At-risk / error state |
| `text-declined` / `bg-declined` | Declined / inactive state |

### Opacity modifiers on tokens
Opacity modifiers are allowed on semantic tokens: `bg-primary/10`, `border-primary/20`, `text-sidebar-foreground/70`. This is the correct way to create tints — never mix with hardcoded hex values.

### Forbidden
Never use: `text-white`, `text-black`, `bg-white`, `bg-black`, `bg-gray-*`, `text-gray-*`, `border-gray-*`, `text-zinc-*`, or any hex/rgb/hsl value in component files.

---

## Typography

All copy must be **sentence case** — capitalize only the first word and proper nouns (VTS, CBRE, SF, etc.).

### Scale patterns
```tsx
// Eyebrow label — always above a headline, never alone
<p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
  Label
</p>

// Section headline
<p className="text-xl font-semibold text-foreground">Headline</p>

// Body
<p className="text-sm text-foreground">Body text</p>

// Supporting / metadata
<p className="text-xs text-muted-foreground">Supporting</p>
```

**Eyebrow rule:** tracking-widest uppercase text must always sit above a headline. Never use it alone above lists, cards, or body text.

---

## Spacing and radius

Base radius is `0.5rem`. The scale:
| Class | Value |
|---|---|
| `rounded-sm` | `0.3rem` |
| `rounded-md` | `0.4rem` |
| `rounded-lg` | `0.5rem` (base) |
| `rounded-xl` | `0.7rem` |
| `rounded-2xl` | `0.9rem` |
| `rounded-3xl` | `1.1rem` |

Cards use `rounded-2xl` or `rounded-3xl`. Chips and badges use `rounded-full` or `rounded-lg`.

---

## Components

### Buttons
Always use shadcn `<Button>` with a `variant` prop. Never write raw `<button>` elements with custom Tailwind color classes.

| Variant | When to use |
|---|---|
| `default` | Primary action |
| `outline` | Secondary action; on dark backgrounds use sidebar tokens (see below) |
| `ghost` | Icon buttons, inline actions |
| `secondary` | Neutral actions |

**Outline button on dark background** (e.g. inside a sidebar popover):
```tsx
<Button
  variant="outline"
  className="border-sidebar-foreground/40 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
>
  Label
  <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
</Button>
```

### Icons
Use **lucide-react** exclusively. Icon sizes: `h-4 w-4` (default), `h-3.5 w-3.5` (inline/small), `h-5 w-5` (heading-level).

### Popover (deal health pattern)
Popovers that sit on the dark sidebar surface use:
```tsx
<PopoverContent className="w-96 p-0 overflow-hidden bg-sidebar-accent border-0 shadow-xl">
```
Content padding: `p-5` inside the content div.

### Cards
```tsx
// Use the cardBase utility from @/lib/utils
import { cardBase } from "@/lib/utils"
<div className={cn(cardBase, "...")}>
```

---

## Layout

### Page shell
The sidebar is a fixed overlay. Main content is offset with:
- Collapsed: `md:pl-[104px]`
- Expanded: `md:pl-[264px]`

### Grid
Overview page uses a 3-column grid at `md` and above:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <WidgetA className="md:col-span-2" />
  <WidgetB />
</div>
```

---

## Patterns

### KPI / stat tiles
```tsx
// Label above value
<p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">Label</p>
<p className="text-xl font-medium text-foreground">Value</p>
<p className="text-xs text-muted-foreground">Subtitle</p>
```

### Health / status badges
```tsx
<span className={cn(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
  healthCfg.cls  // derived from getDealHealth()
)}>
  {healthCfg.label}
</span>
```

### Agent task items
```tsx
<div className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-primary/20 bg-primary/5">
  <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full border-2 border-primary/40 flex items-center justify-center">
    <HeartPulse className="h-2.5 w-2.5 text-primary" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm text-foreground leading-snug">{action}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{urgency}</p>
  </div>
</div>
```

### Callout / summary card (on dark surface)
```tsx
<div className="rounded-lg px-3 py-2.5 bg-sidebar-foreground/10 flex items-start gap-2.5">
  <HeartPulse className="h-4 w-4 shrink-0 text-sidebar-primary mt-0.5" />
  <p className="text-sm leading-snug text-sidebar-foreground/80">{summary}</p>
</div>
```

---

## Rules summary

1. **No hardcoded colors** — ever. Only semantic tokens and opacity modifiers.
2. **No inline styles** — `style={{ color: ... }}` is forbidden. Use Tailwind classes with tokens.
3. **No ad-hoc button styles** — always use `<Button variant="...">` from shadcn.
4. **Sentence case everywhere** — UI copy, labels, button text, headings.
5. **No em dashes** (—) in any copy. Rewrite sentences to avoid them.
6. **Eyebrow text always above a headline** — never alone above lists or body.
7. **shadcn components first** — before writing a custom component, check if shadcn has one.
8. **Lucide icons only** — no other icon libraries.
9. **Sidebar tokens for dark surfaces** — any UI on the dark sidebar background uses `sidebar-*` tokens, not generic tokens.
10. **Build before committing** — always run `npm run build` and confirm a clean build before committing.
