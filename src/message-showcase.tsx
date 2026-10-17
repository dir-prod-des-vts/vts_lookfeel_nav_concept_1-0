import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageGroup,
  MessageAvatar,
  MessageContent,
  MessageHeader,
  MessageFooter,
} from "@/components/ui/message"
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-col gap-3 flex-1 max-w-lg">{children}</div>
    </div>
  )
}

function Avatar({ initials, color = "bg-muted" }: { initials: string; color?: string }) {
  return (
    <div className={`flex size-8 items-center justify-center rounded-full ${color} text-xs font-semibold text-foreground`}>
      {initials}
    </div>
  )
}

function Bubble({ children, align = "start" }: { children: React.ReactNode; align?: "start" | "end" }) {
  return (
    <div className={`max-w-xs rounded-2xl px-3.5 py-2.5 text-sm ${align === "end" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
      {children}
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
          <h1 className="text-3xl font-semibold text-foreground">Message</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Chat message component with avatar, content, header, and footer slots. Supports start and end alignment for two-sided conversations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Align start */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Align start (received)</p>
          <Row label="basic">
            <Message>
              <MessageContent>
                <Bubble>We can offer free rent for the first three months of the lease term.</Bubble>
              </MessageContent>
            </Message>
          </Row>
          <div className="mt-5">
            <Row label="with avatar">
              <Message>
                <MessageAvatar><Avatar initials="JK" color="bg-blue-100 dark:bg-blue-950" /></MessageAvatar>
                <MessageContent>
                  <Bubble>
                    The landlord is willing to provide a TI allowance of $85 per square foot for the floor 14 suite.
                  </Bubble>
                </MessageContent>
              </Message>
            </Row>
          </div>
          <div className="mt-5">
            <Row label="with header">
              <Message>
                <MessageAvatar><Avatar initials="JK" color="bg-blue-100 dark:bg-blue-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>James Kim · 10:24 AM</MessageHeader>
                  <Bubble>The base rent is $82/sf with 3% annual escalations starting in year 2.</Bubble>
                </MessageContent>
              </Message>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Align end */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Align end (sent)</p>
          <Row label="basic">
            <Message align="end">
              <MessageContent>
                <Bubble align="end">Our client requires a contiguous block of at least 18,000 sf on a single floor.</Bubble>
              </MessageContent>
            </Message>
          </Row>
          <div className="mt-5">
            <Row label="with avatar">
              <Message align="end">
                <MessageAvatar><Avatar initials="ES" color="bg-green-100 dark:bg-green-950" /></MessageAvatar>
                <MessageContent>
                  <Bubble align="end">
                    We would also like to negotiate a right of first refusal on the adjacent suite.
                  </Bubble>
                </MessageContent>
              </Message>
            </Row>
          </div>
          <div className="mt-5">
            <Row label="with header">
              <Message align="end">
                <MessageAvatar><Avatar initials="ES" color="bg-green-100 dark:bg-green-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>You · 10:31 AM</MessageHeader>
                  <Bubble align="end">Can you confirm the lease commencement date is 1 January 2026?</Bubble>
                </MessageContent>
              </Message>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* With footer / actions */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With footer and actions</p>
          <Row label="actions">
            <Message>
              <MessageAvatar><Avatar initials="JK" color="bg-blue-100 dark:bg-blue-950" /></MessageAvatar>
              <MessageContent>
                <Bubble>Attached is the revised LOI with the updated rent schedule and TI allowance terms.</Bubble>
                <MessageFooter>
                  <span>10:45 AM</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Button size="icon-xs" variant="ghost"><ThumbsUp /></Button>
                    <Button size="icon-xs" variant="ghost"><Reply /></Button>
                    <Button size="icon-xs" variant="ghost"><MoreHorizontal /></Button>
                  </div>
                </MessageFooter>
              </MessageContent>
            </Message>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Conversation thread */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Real-world — lease negotiation thread</p>
          <Row label="thread">
            <MessageGroup>
              <Message>
                <MessageAvatar><Avatar initials="JK" color="bg-blue-100 dark:bg-blue-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>James Kim (landlord) · 9:02 AM</MessageHeader>
                  <Bubble>
                    Good morning. We have reviewed the LOI and are prepared to offer a 7-year term at $78/sf with 2.5% escalations.
                  </Bubble>
                </MessageContent>
              </Message>

              <Message align="end">
                <MessageAvatar><Avatar initials="ES" color="bg-green-100 dark:bg-green-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>You · 9:15 AM</MessageHeader>
                  <Bubble align="end">
                    Thank you. Our client is targeting $74/sf. We can agree to a 7-year term but need a stronger TI package — $95/sf minimum.
                  </Bubble>
                </MessageContent>
              </Message>

              <Message>
                <MessageAvatar><Avatar initials="JK" color="bg-blue-100 dark:bg-blue-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>James Kim (landlord) · 9:28 AM</MessageHeader>
                  <Bubble>
                    We can meet at $76/sf and $90/sf TI with 3 months free rent at commencement. Does that work for your client?
                  </Bubble>
                  <MessageFooter>
                    <span>Delivered</span>
                  </MessageFooter>
                </MessageContent>
              </Message>

              <Message align="end">
                <MessageAvatar><Avatar initials="ES" color="bg-green-100 dark:bg-green-950" /></MessageAvatar>
                <MessageContent>
                  <MessageHeader>You · 9:41 AM</MessageHeader>
                  <Bubble align="end">
                    That is close. Let me take it back to the client and revert by end of day.
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageGroup>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
