# VTS design principles

*Inspired by Dieter Rams. Written for the people building this product.*

---

## 1\. Show what matters, hide what doesn't

Every screen has one job. Before adding a component, name the one thing it helps the user do. If you can't name it, don't add it. Remove anything that doesn't serve that job — even if it's technically accurate.

**In practice:** the deal health popover shows score, summary, signals, and one action. Nothing else. If you're tempted to add a sixth field, you're probably solving a different problem.

---

## 2\. Let the data speak first

The interface is not the story — the data is. Surface numbers, status, and signals at the top. Explanation and context live one level down (a popover, a tab, a detail pane), not in the default view.

**In practice:** health score is a colored label in the list. The signals that explain it are in the popover. The tasks that respond to it are in the tasks tab. Each level earns its place.

---

## 3\. One action per surface

Every card, popover, and modal should have at most one primary action. If you find yourself writing two buttons of equal weight, you have two screens, not one.

**In practice:** the deal health popover has one button — "View agent tasks." It does one thing. It goes one place.

---

## 4\. Tokens, not taste

Color, spacing, and type are not design decisions you make per component. They are system decisions made once in the token file and applied everywhere. When something looks off, fix the token — not the component.

**In practice:** never write `text-white`, `bg-gray-100`, or `style={{ color: '#6B6BD4' }}`. Write `text-sidebar-foreground` and move on.

---

## 5\. Dark surfaces have their own rules

The sidebar and its popovers are a different visual environment. They have their own token family (`sidebar-*`) for a reason. Mixing light-surface tokens onto dark backgrounds breaks the system even if it looks close enough on your screen.

**In practice:** buttons on the dark popover use `border-sidebar-foreground/40` and `hover:bg-sidebar-foreground/10`. Not `border-border` and `hover:bg-muted`.

---

## 6\. Hierarchy before decoration

Establish a clear reading order before reaching for color, weight, or size. Eyebrow → headline → body → metadata. Every screen should have one thing that reads first, one that reads second. Decoration applied without hierarchy produces noise.

**In practice:** eyebrow text (`text-[10px] uppercase tracking-widest`) only appears above a headline. Never alone. Never above a list.

---

## 7\. Copy is part of the design

Sentence case, no em dashes, no jargon, no passive voice. A label that requires explanation is a design failure. If you can't say it in five words, you probably don't understand it well enough yet.

**In practice:** "View agent tasks" not "Navigate to the Agent Tasks Tab." "Deal health" not "AI-powered deal health assessment score."

---

## 8\. Every deal has a next action

The system is not a dashboard — it is a work surface. Every deal shown to a user should have a visible next action associated with it. A deal with no recommended action is a deal the system has abandoned.

**In practice:** every entry in `HEALTH_OVERRIDES` has at least one rec. Every deal health popover has a "View agent tasks" button. The tasks tab always has at least one item.

---

## 9\. Agents are collaborators, not features

Agent functionality is not a badge or a label applied to existing UI. It appears only when it has something useful to say. If an agent card, button, or suggestion appears without a specific, actionable recommendation, remove it.

**In practice:** the agent card in the tasks tab shows a specific action with a specific urgency and a named agent. Not "AI is monitoring this deal."

---

## 10\. Build it, look at it, then ship it

A clean TypeScript build is not proof that the design works. Open the browser. Click the thing. Look at it on a narrow viewport. Read the copy out loud. If something feels wrong, it is wrong — fix it before committing.

**In practice:** `npm run build` passes → open the deal → click the health badge → read the popover → click "View agent tasks" → confirm the tasks tab opens. Then commit.