# Overview view switcher — design spec

**Date:** 2026-10-14
**Status:** Approved

---

## What we're building

A view switcher for the asset overview page that lets users select named views, customize which cards appear and in what order, and save/rename/delete those views. State persists in localStorage. Controls sit above the KPI bar.

---

## Data model

```ts
type OverviewCardId =
  | "availability"
  | "financial"
  | "leasing"
  | "deal-actions"
  | "critical-dates"
  | "action-levers"

type OverviewView = {
  id: string          // uuid or slug
  name: string
  cards: OverviewCardId[]   // ordered; only listed cards are shown
  isDefault: boolean
  builtIn?: boolean   // built-in views cannot be deleted
}
```

Three built-in views ship as defaults:

| Name | Cards (in order) |
|---|---|
| Full overview | all 6, in current layout order |
| Leasing focus | availability, leasing, deal-actions |
| Financial focus | financial, critical-dates, action-levers |

---

## State

All state lives in App.tsx (or a `useOverviewViews` hook extracted from it):

| State | Type | Default | Persisted |
|---|---|---|---|
| `views` | `OverviewView[]` | 3 built-ins | localStorage `"overview:views"` |
| `activeViewId` | `string` | first built-in's id | localStorage `"overview:activeViewId"` |
| `liveCards` | `OverviewCardId[]` | active view's cards | not persisted (session only) |

**Selecting a view** sets `liveCards` to that view's `cards`. No drift — the Cards button modifies `liveCards` in place without touching the saved view. If the user wants to keep the customization they save it as a new view.

---

## UI

### Control row (above KPI bar)

```
[ Full overview ▾ ]   [ ⊞ Cards ]
```

Two buttons, left-aligned, `gap-2`, same row. Styled as the existing `CardManager` trigger: `rounded-full border border-primary text-primary text-xs font-medium bg-transparent hover:bg-primary/10`.

### ViewSwitcher popover

Opens on the left button. Width `w-64`.

**Structure:**
```
──────────────────────────────
  Full overview       ★  ✎  🗑
  Leasing focus       ★  ✎  🗑   ← active row has primary text + check
  Financial focus     ★  ✎  🗑
──────────────────────────────
  + Save current as view
──────────────────────────────
```

- **Selecting a row** closes the popover and applies the view.
- **Star** toggles `isDefault`. Only one view can be default at a time; toggling another star un-stars the current default.
- **Pencil** opens an inline rename input in place of the view name row (press Enter or blur to confirm).
- **Trash** deletes the view (disabled / hidden for `builtIn` views). No confirmation — the prototype doesn't need it.
- **Save current as view** opens an inline text input at the bottom of the list. Pressing Enter creates a new `OverviewView` from `liveCards` with the typed name, adds it to `views`, and activates it.

Built-in views show the star and pencil but not the trash icon.

### Cards popover (existing CardManager pattern)

Reuses the exact same drag-to-reorder + checkbox pattern as the deals page `CardManager`. Operates on `liveCards`. Does not auto-save to a view.

---

## Grid renderer

Replaces the three hardcoded `div.grid` rows in App.tsx with a loop over `liveCards`. Each card has a defined `colSpan`:

| Card id | colSpan |
|---|---|
| availability | 1 |
| financial | 2 |
| leasing | 2 |
| deal-actions | 1 |
| critical-dates | 2 |
| action-levers | 1 |

Cards are packed into rows of 3 columns greedily (first-fit). If a card's span would overflow the current row it starts a new row. This handles any ordering the user creates.

---

## Files touched

| File | Change |
|---|---|
| `src/App.tsx` | Extract overview section into `OverviewPage` component or inline block; add `useOverviewViews` hook; replace hardcoded grids with `OverviewGrid`; add `ViewSwitcher` and `CardManager` above KPI bar |
| `src/components/deals-page.tsx` | No changes — `CardManager` stays there for deals; we build a parallel one for overview |

New components/hooks can live inline in App.tsx or be extracted to `src/components/overview-views.tsx` if the file gets unwieldy.

---

## Out of scope

- Sharing views across users or assets
- View-level filters (views are card layout only, not data filters)
- Animations on card reorder
- Undo for delete
