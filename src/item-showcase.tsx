import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter,
} from "@/components/ui/item"
import {
  Building2,
  FileText,
  Users,
  MapPin,
  ChevronRight,
  MoreHorizontal,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3 flex-1">{children}</div>
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
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Flexible list item primitive with media, content, actions, and header/footer slots. Three variants, three sizes.
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
            <Row label="default">
              <div className="w-72">
                <Item>
                  <ItemContent>
                    <ItemTitle>One Embarcadero Center</ItemTitle>
                    <ItemDescription>San Francisco, CA · 855,000 sf</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
            <Row label="outline">
              <div className="w-72">
                <Item variant="outline">
                  <ItemContent>
                    <ItemTitle>One Embarcadero Center</ItemTitle>
                    <ItemDescription>San Francisco, CA · 855,000 sf</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
            <Row label="muted">
              <div className="w-72">
                <Item variant="muted">
                  <ItemContent>
                    <ItemTitle>One Embarcadero Center</ItemTitle>
                    <ItemDescription>San Francisco, CA · 855,000 sf</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Sizes</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <div className="w-72">
                <Item variant="outline">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>One Market Plaza</ItemTitle>
                    <ItemDescription>San Francisco, CA</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
            <Row label="sm">
              <div className="w-72">
                <Item variant="outline" size="sm">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>One Market Plaza</ItemTitle>
                    <ItemDescription>San Francisco, CA</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
            <Row label="xs">
              <div className="w-72">
                <Item variant="outline" size="xs">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>One Market Plaza</ItemTitle>
                    <ItemDescription>San Francisco, CA</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Media variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Media variants</p>
          <div className="flex flex-col gap-5">
            <Row label="icon">
              <div className="w-80">
                <ItemGroup>
                  <Item variant="outline">
                    <ItemMedia variant="icon"><FileText /></ItemMedia>
                    <ItemContent>
                      <ItemTitle>Lease amendment — floor 12</ItemTitle>
                      <ItemDescription>Updated 2 days ago</ItemDescription>
                    </ItemContent>
                  </Item>
                  <Item variant="outline">
                    <ItemMedia variant="icon"><Users /></ItemMedia>
                    <ItemContent>
                      <ItemTitle>Tenant: Acme Corp</ItemTitle>
                      <ItemDescription>4,500 sf · expires Jun 2027</ItemDescription>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>
            </Row>
            <Row label="image">
              <div className="w-80">
                <Item variant="outline">
                  <ItemMedia variant="image">
                    <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&q=80" alt="Building" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>555 California Street</ItemTitle>
                    <ItemDescription>San Francisco, CA · Class A</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* With actions */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · With actions</p>
          <div className="flex flex-col gap-5">
            <Row label="trailing">
              <div className="w-80">
                <Item variant="outline">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>345 California Center</ItemTitle>
                    <ItemDescription>San Francisco, CA · 540,000 sf</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="icon-sm" variant="ghost"><MoreHorizontal /></Button>
                  </ItemActions>
                </Item>
              </div>
            </Row>
            <Row label="chevron">
              <div className="w-80">
                <Item variant="outline" render={<a href="#" />}>
                  <ItemMedia variant="icon"><MapPin /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>View on map</ItemTitle>
                    <ItemDescription>Open property in map view</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                </Item>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Header and footer */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Header and footer slots</p>
          <div className="flex flex-col gap-5">
            <Row label="with header">
              <div className="w-96">
                <Item variant="outline">
                  <ItemHeader>
                    <span className="text-xs text-muted-foreground">Deal · Active</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> 3 days ago</span>
                  </ItemHeader>
                  <ItemMedia variant="icon"><TrendingUp /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>Acme Corp expansion — floor 15–16</ItemTitle>
                    <ItemDescription>12,000 sf · $82/sf · lease starts Jan 2026</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </Row>
            <Row label="with footer">
              <div className="w-96">
                <Item variant="outline">
                  <ItemMedia variant="icon"><Star /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>Riverview Tower — suite 800</ItemTitle>
                    <ItemDescription>Chicago, IL · 8,200 sf · available now</ItemDescription>
                  </ItemContent>
                  <ItemFooter>
                    <span className="text-xs text-muted-foreground">Listed 5 days ago</span>
                    <Button size="xs" variant="outline">View listing</Button>
                  </ItemFooter>
                </Item>
              </div>
            </Row>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Group with separator */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Group with separator</p>
          <Row label="property list">
            <div className="w-80">
              <ItemGroup>
                <Item variant="outline">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent><ItemTitle>One Bush Street</ItemTitle><ItemDescription>San Francisco, CA · 390,000 sf</ItemDescription></ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemMedia variant="icon"><Building2 /></ItemMedia>
                  <ItemContent><ItemTitle>101 Mission Street</ItemTitle><ItemDescription>San Francisco, CA · 310,000 sf</ItemDescription></ItemContent>
                </Item>
                <ItemSeparator />
                <Item variant="muted">
                  <ItemContent><ItemTitle>+ 3 more properties</ItemTitle></ItemContent>
                </Item>
              </ItemGroup>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
