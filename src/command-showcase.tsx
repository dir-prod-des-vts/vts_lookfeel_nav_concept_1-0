import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { File, Search, Home, Layers } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Command</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Command palette for keyboard-driven navigation and actions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Inline</p>
          <div className="flex flex-col gap-5">
            <Row label="inline">
              <Command className="rounded-lg border w-72">
                <CommandInput placeholder="Search…" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Deals">
                    <CommandItem><File className="mr-2 size-4" />New deal</CommandItem>
                    <CommandItem><Search className="mr-2 size-4" />Search deals<CommandShortcut>⌘K</CommandShortcut></CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Portfolio">
                    <CommandItem><Home className="mr-2 size-4" />Portfolio overview<CommandShortcut>⌘P</CommandShortcut></CommandItem>
                    <CommandItem><Layers className="mr-2 size-4" />All spaces</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
