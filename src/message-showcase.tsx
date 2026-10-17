import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Message, MessageAvatar, MessageContent, MessageGroup } from "@/components/ui/message"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
          <h1 className="text-3xl font-semibold text-foreground">Message</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">Chat message components for threaded conversations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Thread</p>
          <div className="flex flex-col gap-5">
            <Row label="thread">
              <div className="flex flex-col gap-4 w-80">
                <MessageGroup>
                  <Message align="start">
                    <MessageAvatar>
                      <Avatar size="sm"><AvatarFallback>JL</AvatarFallback></Avatar>
                    </MessageAvatar>
                    <MessageContent className="rounded-lg bg-muted px-3 py-2 text-sm">
                      Can we extend the commencement date by 30 days?
                    </MessageContent>
                  </Message>
                </MessageGroup>
                <MessageGroup>
                  <Message align="end">
                    <MessageContent className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                      Sure — I'll update the proposal and send it over.
                    </MessageContent>
                    <MessageAvatar>
                      <Avatar size="sm"><AvatarFallback>ME</AvatarFallback></Avatar>
                    </MessageAvatar>
                  </Message>
                </MessageGroup>
              </div>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
