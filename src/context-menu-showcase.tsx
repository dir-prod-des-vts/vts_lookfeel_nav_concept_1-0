import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"
import { Building2, Copy, Archive, Trash2, ExternalLink, FileText, Edit, Star } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function PropertyCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-72 rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Building2 className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">100 Mission Street</p>
          <p className="text-xs text-muted-foreground">San Francisco, CA</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><p className="text-muted-foreground">RSF</p><p className="font-medium">248,000</p></div>
        <div><p className="text-muted-foreground">Occupancy</p><p className="font-medium">91%</p></div>
        <div><p className="text-muted-foreground">Leases</p><p className="font-medium">12 active</p></div>
        <div><p className="text-muted-foreground">NOI</p><p className="font-medium">$4.2M</p></div>
      </div>
      {children && <p className="text-[11px] text-muted-foreground pt-1 border-t border-border">{children}</p>}
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [starred, setStarred] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Context menu</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Right-click menus with icons, separators, disabled items, and submenus.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Property card (right-click)</p>
          <Row label="with icons">
            <ContextMenu>
              <ContextMenuTrigger>
                <PropertyCard>Right-click to open menu</PropertyCard>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem><Edit className="size-4" />Edit property<CommandShortcut>⌘E</CommandShortcut></ContextMenuItem>
                <ContextMenuItem><ExternalLink className="size-4" />Open in new tab</ContextMenuItem>
                <ContextMenuItem><Copy className="size-4" />Duplicate<ContextMenuShortcut>⌘D</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem><Star className="size-4" />Star property</ContextMenuItem>
                <ContextMenuItem><Archive className="size-4" />Archive</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4" />Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With checkboxes and submenu</p>
          <Row label="right-click area">
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-72 h-24 rounded-xl border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground cursor-default select-none">
                  Right-click me
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>
                  <Star className="size-4" />Starred
                </ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuSub>
                  <ContextMenuSubTrigger><FileText className="size-4" />Export as</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>PDF</ContextMenuItem>
                    <ContextMenuItem>CSV</ContextMenuItem>
                    <ContextMenuItem>Excel</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem disabled><Archive className="size-4" />Archive (unavailable)</ContextMenuItem>
                <ContextMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4" />Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Lease row context</p>
          <Row label="table row">
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-96 rounded-lg border border-border bg-card">
                  {[
                    { tenant: "Acme Corp", floor: "14F", sf: "12,400", expiry: "Dec 2027" },
                    { tenant: "Bridgepoint Capital", floor: "8F", sf: "8,200", expiry: "Mar 2026" },
                    { tenant: "Clearwater Holdings", floor: "3F", sf: "5,600", expiry: "Jun 2025" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-2.5 text-sm border-b last:border-0 border-border hover:bg-muted/50 cursor-default select-none">
                      <span className="flex-1 font-medium">{row.tenant}</span>
                      <span className="text-muted-foreground w-8">{row.floor}</span>
                      <span className="text-muted-foreground w-14 text-right">{row.sf}</span>
                      <span className="text-muted-foreground w-20 text-right">{row.expiry}</span>
                    </div>
                  ))}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem><Edit className="size-4" />Edit lease</ContextMenuItem>
                <ContextMenuItem><Copy className="size-4" />Duplicate</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem><Archive className="size-4" />Archive</ContextMenuItem>
                <ContextMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4" />Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Row>
        </section>

      </div>
    </div>
  )
}

// Inline shortcut component used above
function CommandShortcut({ children }: { children: React.ReactNode }) {
  return <span className="ml-auto text-xs tracking-widest text-muted-foreground">{children}</span>
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
