import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Building2, FileText, BarChart2, Users, Map, TrendingUp, Bell } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function GridLink({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string }) {
  return (
    <NavigationMenuLink href={href} className="flex flex-col gap-1 rounded-lg p-3 hover:bg-muted w-44">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="text-xs text-muted-foreground leading-snug">{description}</span>
    </NavigationMenuLink>
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
          <h1 className="text-3xl font-semibold text-foreground">Navigation menu</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Horizontal navigation with animated dropdown panels. Built on Base UI NavigationMenu with shared viewport and smooth transitions.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Horizontal nav */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · Horizontal nav with dropdowns</p>
          <Row label="top nav">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-0.5 p-1 w-44">
                      <NavigationMenuLink href="#">All properties</NavigationMenuLink>
                      <NavigationMenuLink href="#">Buildings</NavigationMenuLink>
                      <NavigationMenuLink href="#">Floors</NavigationMenuLink>
                      <NavigationMenuLink href="#">Suites</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Deals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-0.5 p-1 w-44">
                      <NavigationMenuLink href="#">Active deals</NavigationMenuLink>
                      <NavigationMenuLink href="#">Prospects</NavigationMenuLink>
                      <NavigationMenuLink href="#">Closed</NavigationMenuLink>
                      <NavigationMenuLink href="#">Deal pipeline</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-0.5 p-1 w-48">
                      <NavigationMenuLink href="#">Occupancy report</NavigationMenuLink>
                      <NavigationMenuLink href="#">Lease expiration</NavigationMenuLink>
                      <NavigationMenuLink href="#">Market comparables</NavigationMenuLink>
                      <NavigationMenuLink href="#">Revenue forecast</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink href="#">Contacts</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Rich content panels */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · With content panels</p>
          <Row label="grid panels">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-1 p-2 w-96">
                      <GridLink href="#" icon={Building2} title="Properties" description="Browse all buildings in your portfolio" />
                      <GridLink href="#" icon={Map} title="Map view" description="Visualise locations and availability" />
                      <GridLink href="#" icon={Users} title="Tenants" description="Manage tenant contacts and leases" />
                      <GridLink href="#" icon={FileText} title="Leases" description="Review and track all lease documents" />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-1 p-2 w-96">
                      <GridLink href="#" icon={BarChart2} title="Occupancy" description="Track occupancy rates across buildings" />
                      <GridLink href="#" icon={TrendingUp} title="Revenue" description="Revenue trends and lease roll forecasts" />
                      <GridLink href="#" icon={Bell} title="Alerts" description="Lease expiry and renewal reminders" />
                      <GridLink href="#" icon={FileText} title="Reports" description="Download custom portfolio reports" />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Active / current state */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Active and current state</p>
          <Row label="active links">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-0.5 p-1 w-44">
                      <NavigationMenuLink href="#" active>All properties</NavigationMenuLink>
                      <NavigationMenuLink href="#">Buildings</NavigationMenuLink>
                      <NavigationMenuLink href="#">Floors</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Deals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-0.5 p-1 w-44">
                      <NavigationMenuLink href="#">Active deals</NavigationMenuLink>
                      <NavigationMenuLink href="#" active>Prospects</NavigationMenuLink>
                      <NavigationMenuLink href="#">Closed</NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink href="#">Contacts</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
