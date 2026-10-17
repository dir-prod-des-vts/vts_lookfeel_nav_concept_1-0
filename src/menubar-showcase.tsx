import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [showGrid, setShowGrid] = React.useState(true)
  const [showSidebar, setShowSidebar] = React.useState(true)
  const [showTimestamps, setShowTimestamps] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("name")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Menubar</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Horizontal application menu bar built on Base UI. Supports items, checkboxes, radio groups, separators, and submenus.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Default */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default — app menubar</p>
          <Row label="full app">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New deal<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarItem>New property<MenubarShortcut>⌘⇧N</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Open<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
                  <MenubarItem>Import CSV</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Export<MenubarShortcut>⌘E</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem variant="destructive">Delete</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                  <MenubarItem>Redo<MenubarShortcut>⌘⇧Z</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Cut<MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
                  <MenubarItem>Copy<MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                  <MenubarItem>Paste<MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Select all<MenubarShortcut>⌘A</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Zoom in<MenubarShortcut>⌘+</MenubarShortcut></MenubarItem>
                  <MenubarItem>Zoom out<MenubarShortcut>⌘−</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Full screen<MenubarShortcut>⌘⌃F</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>VTS documentation</MenubarItem>
                  <MenubarItem>Keyboard shortcuts<MenubarShortcut>⌘/</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Contact support</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Checkboxes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With checkboxes</p>
          <Row label="view toggles">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarLabel>Show</MenubarLabel>
                  <MenubarCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
                    Grid overlay
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                    Property sidebar
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem checked={showTimestamps} onCheckedChange={setShowTimestamps}>
                    Timestamps
                  </MenubarCheckboxItem>
                  <MenubarSeparator />
                  <MenubarItem>Reset view</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <p className="self-center text-sm text-muted-foreground">
              Grid: {showGrid ? "on" : "off"} · Sidebar: {showSidebar ? "on" : "off"} · Timestamps: {showTimestamps ? "on" : "off"}
            </p>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Radio group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With radio group</p>
          <Row label="sort options">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Sort</MenubarTrigger>
                <MenubarContent>
                  <MenubarLabel>Sort deals by</MenubarLabel>
                  <MenubarRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <MenubarRadioItem value="name">Deal name</MenubarRadioItem>
                    <MenubarRadioItem value="stage">Stage</MenubarRadioItem>
                    <MenubarRadioItem value="size">Square footage</MenubarRadioItem>
                    <MenubarRadioItem value="rent">Rent per sf</MenubarRadioItem>
                    <MenubarRadioItem value="updated">Last updated</MenubarRadioItem>
                  </MenubarRadioGroup>
                  <MenubarSeparator />
                  <MenubarItem>Ascending</MenubarItem>
                  <MenubarItem>Descending</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <p className="self-center text-sm text-muted-foreground">Sorting by: {sortBy}</p>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Keyboard shortcuts */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With keyboard shortcuts</p>
          <Row label="shortcuts">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Deals</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New deal<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarItem>Duplicate deal<MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Save<MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                  <MenubarItem>Save and close<MenubarShortcut>⌘⇧S</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Export as</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>PDF<MenubarShortcut>⌘⇧E</MenubarShortcut></MenubarItem>
                      <MenubarItem>CSV</MenubarItem>
                      <MenubarItem>Excel</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Disabled items */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Disabled items</p>
          <Row label="disabled">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Actions</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>View deal</MenubarItem>
                  <MenubarItem disabled>Edit deal</MenubarItem>
                  <MenubarItem>Duplicate</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem disabled>Send to counterparty</MenubarItem>
                  <MenubarItem disabled>Generate report</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem variant="destructive">Archive deal</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
