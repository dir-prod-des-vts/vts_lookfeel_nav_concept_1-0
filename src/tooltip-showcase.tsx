import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Info, Settings } from "lucide-react"

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
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
            <h1 className="text-3xl font-semibold text-foreground">Tooltip</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-prose">
              A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        </div>

        <div className="flex flex-col gap-10">
          <section>
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Default</p>
            <div className="flex flex-col gap-5">
              <Row label="default">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Lease commencement date</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="icon" />}>
                    <Settings className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                    <p className="text-muted-foreground text-xs">Configure notifications</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
                    <Kbd>⌘K</Kbd>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open command palette
                    <KbdGroup className="ml-2"><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
                  </TooltipContent>
                </Tooltip>
              </Row>
              <Row label="sides">
                {(["top", "right", "bottom", "left"] as const).map(side => (
                  <Tooltip key={side}>
                    <TooltipTrigger render={<Button variant="outline" size="sm" />}>
                      {side}
                    </TooltipTrigger>
                    <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
                  </Tooltip>
                ))}
              </Row>
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
