import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Trash2 } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Context menu</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Right-click contextual actions for elements.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Right-click</p>
          <div className="flex flex-col gap-5">
            <Row label="right-click">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  Right-click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem><Copy className="mr-2 size-4" />Copy</ContextMenuItem>
                  <ContextMenuItem><ExternalLink className="mr-2 size-4" />Open in new tab</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="text-destructive"><Trash2 className="mr-2 size-4" />Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
