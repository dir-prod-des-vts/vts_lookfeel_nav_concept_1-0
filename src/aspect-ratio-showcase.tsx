import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Image } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Aspect ratio</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Maintains a consistent width-to-height ratio for media elements.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Ratios</p>
          <div className="flex flex-col gap-5">
            <Row label="16:9">
              <div className="w-64"><AspectRatio ratio={16 / 9}><div className="size-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Image className="size-6" /></div></AspectRatio></div>
              <div className="w-32"><AspectRatio ratio={1}><div className="size-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">1:1</div></AspectRatio></div>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
