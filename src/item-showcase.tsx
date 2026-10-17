import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Item</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">List item component with media, content, and actions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · List</p>
          <div className="flex flex-col gap-5">
            <Row label="list">
              <ItemGroup className="w-72 rounded-lg border divide-y divide-border">
                {[
                  { name: "Acme Corp", space: "Suite 400 · 12,000 sf" },
                  { name: "Globex", space: "Suite 1200 · 8,400 sf" },
                  { name: "Initech", space: "Suite 200 · 5,600 sf" },
                ].map(({ name, space }) => (
                  <Item key={name} size="sm" className="px-3 py-2">
                    <ItemMedia>
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{name[0]}</div>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{name}</ItemTitle>
                      <ItemDescription>{space}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="icon-xs"><ChevronRight className="size-3.5" /></Button>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
