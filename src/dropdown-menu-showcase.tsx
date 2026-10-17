import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { User, Settings, Bell, LogOut, Building2, FileText, Download, Archive, Trash2, ChevronDown, MoreHorizontal, Eye, SortAsc } from "lucide-react"

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
  const [showArchived, setShowArchived] = React.useState(false)
  const [showDrafts, setShowDrafts] = React.useState(true)
  const [showExpiring, setShowExpiring] = React.useState(false)
  const [sortOrder, setSortOrder] = React.useState("expiry-asc")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Dropdown menu</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Dropdown menus with icons, checkboxes, radio groups, and submenus. Built on Base UI Menu.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Account menu</p>
          <Row label="profile">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline"><User className="size-4" data-icon="inline-start" />Enrique Sacasa<ChevronDown className="size-3.5 ml-1 text-muted-foreground" /></Button>} />
              <DropdownMenuContent>
                <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
                  <span className="font-medium text-sm">Enrique Sacasa</span>
                  <span className="text-xs font-normal text-muted-foreground">enrique.sacasa@vts.com</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="size-4" />Profile<DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><Settings className="size-4" />Settings<DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><Bell className="size-4" />Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive"><LogOut className="size-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With icons</p>
          <Row label="property actions">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon"><MoreHorizontal className="size-4" /></Button>} />
              <DropdownMenuContent>
                <DropdownMenuItem><Building2 className="size-4" />View property</DropdownMenuItem>
                <DropdownMenuItem><FileText className="size-4" />View leases</DropdownMenuItem>
                <DropdownMenuItem><Eye className="size-4" />Preview</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Archive className="size-4" />Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With checkboxes</p>
          <Row label="view options">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline"><Eye className="size-4" data-icon="inline-start" />View options</Button>} />
              <DropdownMenuContent>
                <DropdownMenuLabel>Display</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>Show archived</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showDrafts} onCheckedChange={setShowDrafts}>Show drafts</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showExpiring} onCheckedChange={setShowExpiring}>Show expiring within 90 days</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With radio group</p>
          <Row label="sort order">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline"><SortAsc className="size-4" data-icon="inline-start" />Sort</Button>} />
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="expiry-asc">Expiry — earliest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="expiry-desc">Expiry — latest first</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rent-asc">Rent — low to high</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rent-desc">Rent — high to low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tenant-az">Tenant — A to Z</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-xs text-muted-foreground">Selected: {sortOrder}</span>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · With submenu</p>
          <Row label="export">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline"><Download className="size-4" data-icon="inline-start" />Export</Button>} />
              <DropdownMenuContent>
                <DropdownMenuItem><FileText className="size-4" />Print view</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger><Download className="size-4" />Export as</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>PDF</DropdownMenuItem>
                    <DropdownMenuItem>CSV</DropdownMenuItem>
                    <DropdownMenuItem>Excel (.xlsx)</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>JSON</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Disabled items</p>
          <Row label="mixed states">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
              <DropdownMenuContent>
                <DropdownMenuItem><Eye className="size-4" />View details</DropdownMenuItem>
                <DropdownMenuItem disabled><Settings className="size-4" />Configure (no permission)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled><Archive className="size-4" />Archive (already archived)</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="size-4" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
