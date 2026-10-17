import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Building2, FileText, Plus, Search, ArrowRight, Clock, Layers, BarChart2 } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3 flex-1">{children}</div>
    </div>
  )
}

function InlineCommand() {
  return (
    <Command className="w-full max-w-md rounded-xl border border-border shadow-sm">
      <CommandInput placeholder="Search actions, leases, deals..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem><Plus className="size-4" />New deal<CommandShortcut>⌘D</CommandShortcut></CommandItem>
          <CommandItem><FileText className="size-4" />New lease<CommandShortcut>⌘L</CommandShortcut></CommandItem>
          <CommandItem><Building2 className="size-4" />Add property<CommandShortcut>⌘P</CommandShortcut></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem><Layers className="size-4" />View portfolio<CommandShortcut>⌘1</CommandShortcut></CommandItem>
          <CommandItem><BarChart2 className="size-4" />Deal pipeline<CommandShortcut>⌘2</CommandShortcut></CommandItem>
          <CommandItem><ArrowRight className="size-4" />Export portfolio<CommandShortcut>⌘E</CommandShortcut></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          <CommandItem><Clock className="size-4" />View lease — 100 Mission St</CommandItem>
          <CommandItem><Clock className="size-4" />Acme Corp — renewal proposal</CommandItem>
          <CommandItem><Clock className="size-4" />SF portfolio — Q3 report</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function EmptyStateCommand() {
  return (
    <Command className="w-full max-w-md rounded-xl border border-border shadow-sm">
      <CommandInput placeholder="Type something obscure..." defaultValue="xkzqwj" />
      <CommandList>
        <CommandEmpty>No results found for your search</CommandEmpty>
      </CommandList>
    </Command>
  )
}

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Search className="size-4" data-icon="inline-start" />
        Open palette
        <kbd className="ml-2 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="VTS command palette" description="Search for actions, leases, deals, and more">
        <CommandInput placeholder="Search actions, leases, deals..." />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}><Plus className="size-4" />New deal<CommandShortcut>⌘D</CommandShortcut></CommandItem>
            <CommandItem onSelect={() => setOpen(false)}><FileText className="size-4" />New lease<CommandShortcut>⌘L</CommandShortcut></CommandItem>
            <CommandItem onSelect={() => setOpen(false)}><Building2 className="size-4" />Add property</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => setOpen(false)}><Layers className="size-4" />View portfolio</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}><BarChart2 className="size-4" />Deal pipeline</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}><ArrowRight className="size-4" />Export portfolio<CommandShortcut>⌘E</CommandShortcut></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent">
            <CommandItem onSelect={() => setOpen(false)}><Clock className="size-4" />View lease — 100 Mission St</CommandItem>
            <CommandItem onSelect={() => setOpen(false)}><Clock className="size-4" />Acme Corp — renewal</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Command</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Command palette with grouped actions, keyboard shortcuts, and empty state. Built on cmdk.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Full palette</p>
          <Row label="inline">
            <InlineCommand />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Empty state</p>
          <Row label="no results">
            <EmptyStateCommand />
          </Row>
        </section>

        <div className="border-t border-border" />

        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Dialog (⌘K)</p>
          <Row label="modal palette">
            <CommandPaletteDemo />
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
