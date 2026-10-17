import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

const AVATAR_URL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face"
const AVATAR_URL_2 = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=96&h=96&fit=crop&crop=face"
const AVATAR_URL_3 = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop&crop=face"
const AVATAR_URL_4 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"

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
          <h1 className="text-3xl font-semibold text-foreground">Avatar</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Built on Base UI. Three sizes, image with fallback, status badge, stacked groups.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Sizes</p>
          <Row label="with image">
            <Avatar size="sm">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size="default">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Row>
          <div className="mt-5" />
          <Row label="initials only">
            <Avatar size="sm">
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size="default">
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With image */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With image</p>
          <Row label="real photos">
            <Avatar>
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src={AVATAR_URL_2} alt="Michael Torres" />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src={AVATAR_URL_3} alt="Priya Nair" />
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src={AVATAR_URL_4} alt="James Liu" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Initials fallback */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Initials fallback</p>
          <Row label="no image">
            <Avatar>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
          </Row>
          <div className="mt-5" />
          <Row label="icon fallback">
            <Avatar>
              <AvatarFallback><UserIcon className="size-4" /></AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback><UserIcon className="size-5" /></AvatarFallback>
            </Avatar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* With badge */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With status badge</p>
          <Row label="sizes">
            <Avatar size="sm">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar size="default">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar size="lg">
              <AvatarImage src={AVATAR_URL} alt="Sarah Chen" />
              <AvatarFallback>SC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </Row>
          <div className="mt-5" />
          <Row label="initials + badge">
            <Avatar>
              <AvatarFallback>SC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar>
              <AvatarFallback>MT</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Avatar group</p>
          <Row label="stacked sm">
            <AvatarGroup>
              <Avatar size="sm"><AvatarImage src={AVATAR_URL} alt="Sarah Chen" /><AvatarFallback>SC</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarImage src={AVATAR_URL_2} alt="Michael Torres" /><AvatarFallback>MT</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarImage src={AVATAR_URL_3} alt="Priya Nair" /><AvatarFallback>PN</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>JL</AvatarFallback></Avatar>
            </AvatarGroup>
          </Row>
          <div className="mt-5" />
          <Row label="stacked default">
            <AvatarGroup>
              <Avatar><AvatarImage src={AVATAR_URL} alt="Sarah Chen" /><AvatarFallback>SC</AvatarFallback></Avatar>
              <Avatar><AvatarImage src={AVATAR_URL_2} alt="Michael Torres" /><AvatarFallback>MT</AvatarFallback></Avatar>
              <Avatar><AvatarImage src={AVATAR_URL_3} alt="Priya Nair" /><AvatarFallback>PN</AvatarFallback></Avatar>
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
          </Row>
          <div className="mt-5" />
          <Row label="stacked lg">
            <AvatarGroup>
              <Avatar size="lg"><AvatarImage src={AVATAR_URL} alt="Sarah Chen" /><AvatarFallback>SC</AvatarFallback></Avatar>
              <Avatar size="lg"><AvatarImage src={AVATAR_URL_2} alt="Michael Torres" /><AvatarFallback>MT</AvatarFallback></Avatar>
              <Avatar size="lg"><AvatarFallback>PN</AvatarFallback></Avatar>
              <AvatarGroupCount>+12</AvatarGroupCount>
            </AvatarGroup>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world: deal team */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world: deal team members</p>
          <Row label="team list">
            <div className="flex flex-col gap-3">
              {[
                { name: "Sarah Chen", role: "Tenant rep broker, CBRE", src: AVATAR_URL },
                { name: "Michael Torres", role: "Portfolio manager, VTS", src: AVATAR_URL_2 },
                { name: "Priya Nair", role: "Asset manager", src: AVATAR_URL_3 },
                { name: "James Liu", role: "Legal counsel", src: AVATAR_URL_4 },
              ].map(person => (
                <div key={person.name} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={person.src} alt={person.name} />
                    <AvatarFallback>{person.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    <AvatarBadge />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
