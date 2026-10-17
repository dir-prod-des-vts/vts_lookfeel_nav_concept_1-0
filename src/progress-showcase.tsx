import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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
  const [progress, setProgress] = React.useState(40)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background text-foreground px-10 py-12 font-sans">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Progress</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Displays an indicator showing the completion progress of a task.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Values</p>
          <div className="flex flex-col gap-5">
            <Row label="values">
              <div className="flex flex-col gap-3 w-64">
                <Progress value={progress} />
                <Progress value={100} />
                <Progress value={0} />
              </div>
            </Row>
            <Row label="control">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={() => setProgress(p => Math.max(0, p - 10))}>−10</Button>
                <span className="text-sm text-muted-foreground w-8 text-center">{progress}%</span>
                <Button size="sm" variant="outline" onClick={() => setProgress(p => Math.min(100, p + 10))}>+10</Button>
              </div>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
