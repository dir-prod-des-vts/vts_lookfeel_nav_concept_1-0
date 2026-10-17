import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 flex flex-col gap-3">{children}</div>
    </div>
  )
}

const VARIANTS = ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const

const AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face"
const AVATAR_URL_2 = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=96&h=96&fit=crop&crop=face"

function App() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-white text-foreground px-10 py-12 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Bubble</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Chat message bubbles with seven color variants, start/end alignment, reactions, and grouped conversations.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Variants</p>
          <div className="flex flex-col gap-5">
            {VARIANTS.map(v => (
              <Row key={v} label={v}>
                <Bubble variant={v}>
                  <BubbleContent>Lease commencement confirmed for Jan 1, 2025.</BubbleContent>
                </Bubble>
              </Row>
            ))}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Alignment */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Alignment</p>
          <Row label="start vs end">
            <div className="flex flex-col gap-2 w-full max-w-md">
              <Bubble variant="muted" align="start">
                <BubbleContent>Can you confirm the rent commencement date?</BubbleContent>
              </Bubble>
              <Bubble variant="default" align="end">
                <BubbleContent>Rent commencement is April 1, 2025, three months after lease start.</BubbleContent>
              </Bubble>
              <Bubble variant="muted" align="start">
                <BubbleContent>Got it. And the TI allowance?</BubbleContent>
              </Bubble>
              <Bubble variant="default" align="end">
                <BubbleContent>$120 per RSF, paid in two installments.</BubbleContent>
              </Bubble>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Reactions */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · With reactions</p>
          <Row label="reactions">
            <div className="flex flex-col gap-6 w-full max-w-md">
              <Bubble variant="muted" align="start" className="mb-2">
                <BubbleContent>Lease executed. All signatures collected.</BubbleContent>
                <BubbleReactions side="bottom" align="end">
                  🎉 2
                </BubbleReactions>
              </Bubble>
              <Bubble variant="default" align="end" className="mb-2">
                <BubbleContent>TI funds released to tenant account.</BubbleContent>
                <BubbleReactions side="bottom" align="start">
                  👍 3
                </BubbleReactions>
              </Bubble>
              <Bubble variant="secondary" align="start" className="mb-2">
                <BubbleContent>Critical date flagged: renewal notice due June 30.</BubbleContent>
                <BubbleReactions side="top" align="end">
                  ⚠️ 1
                </BubbleReactions>
              </Bubble>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Bubble group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Bubble group</p>
          <Row label="grouped">
            <div className="flex flex-col gap-2 w-full max-w-md">
              <BubbleGroup>
                <Bubble variant="muted">
                  <BubbleContent>Hi, just checking in on the 101 Park Ave lease.</BubbleContent>
                </Bubble>
                <Bubble variant="muted">
                  <BubbleContent>Did the landlord sign the final amendment?</BubbleContent>
                </Bubble>
                <Bubble variant="muted">
                  <BubbleContent>Need to update the deal tracker before end of day.</BubbleContent>
                </Bubble>
              </BubbleGroup>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Ghost variant */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Ghost variant (full-width)</p>
          <Row label="ghost">
            <div className="flex flex-col gap-2 w-full max-w-lg border rounded-xl p-4">
              <Bubble variant="ghost">
                <BubbleContent>Lease term: 5 years. Commencement: January 1, 2025. Base rent: $52/RSF escalating 3% annually. Free rent: 3 months.</BubbleContent>
              </Bubble>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world conversation */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world: deal activity thread</p>
          <Row label="thread">
            <div className="flex flex-col gap-4 w-full max-w-md border rounded-xl p-4 bg-card">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Activity — 101 Park Ave</p>

              <div className="flex items-start gap-2.5">
                <Avatar size="sm">
                  <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Sarah Chen · 9:14 AM</p>
                  <BubbleGroup>
                    <Bubble variant="muted">
                      <BubbleContent>LOI signed by tenant. Moving to lease negotiation stage.</BubbleContent>
                    </Bubble>
                    <Bubble variant="muted">
                      <BubbleContent>CBRE team will send first draft by Friday.</BubbleContent>
                    </Bubble>
                  </BubbleGroup>
                </div>
              </div>

              <div className="flex items-start gap-2.5 flex-row-reverse">
                <Avatar size="sm">
                  <AvatarImage src={AVATAR_URL_2} alt="James Liu" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 items-end min-w-0">
                  <p className="text-xs text-muted-foreground">James Liu · 9:32 AM</p>
                  <Bubble variant="tinted" align="end">
                    <BubbleContent>Noted. I'll flag the TI allowance and free rent period for legal review.</BubbleContent>
                  </Bubble>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Avatar size="sm">
                  <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Sarah Chen · 9:45 AM</p>
                  <Bubble variant="muted">
                    <BubbleContent>Perfect. Deal health should update to 85% once draft is uploaded.</BubbleContent>
                    <BubbleReactions side="bottom" align="end">👍 1</BubbleReactions>
                  </Bubble>
                </div>
              </div>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
