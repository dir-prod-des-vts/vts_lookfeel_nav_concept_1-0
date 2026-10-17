import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

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
          <h1 className="text-3xl font-semibold text-foreground">Resizable</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Accessible resizable panel groups and layouts with keyboard support.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Panels</p>
          <div className="flex flex-col gap-5">
            <Row label="horizontal">
              <ResizablePanelGroup orientation="horizontal" className="w-96 h-32 rounded-lg border">
                <ResizablePanel defaultSize={40}>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Nav</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Content</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Row>
            <Row label="vertical">
              <ResizablePanelGroup orientation="vertical" className="w-64 h-48 rounded-lg border">
                <ResizablePanel defaultSize={40}>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Top</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className="h-full p-3 flex items-center justify-center text-sm text-muted-foreground">Bottom</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
