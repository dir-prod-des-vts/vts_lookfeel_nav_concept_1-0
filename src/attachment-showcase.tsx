import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment"
import { FileText, ImageIcon, File, X, RotateCcw, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-3 items-start">{children}</div>
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
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">VTS design system</p>
          <h1 className="text-3xl font-semibold text-foreground">Attachment</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            File attachment component with multiple states (idle, uploading, done, error), sizes, orientations, and action buttons.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* States */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · States</p>
          <Row label="idle">
            <Attachment state="idle">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_agreement_2024.pdf</AttachmentTitle>
                <AttachmentDescription>Drop to upload</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="uploading">
            <Attachment state="uploading">
              <AttachmentMedia><Loader2 className="animate-spin" /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>floor_plan_tower_sf.png</AttachmentTitle>
                <AttachmentDescription>Uploading... 42%</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="processing">
            <Attachment state="processing">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>executed_lease_acme.pdf</AttachmentTitle>
                <AttachmentDescription>Processing document</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="done">
            <Attachment state="done">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_agreement_2024.pdf</AttachmentTitle>
                <AttachmentDescription>2.4 MB · PDF</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="error">
            <Attachment state="error">
              <AttachmentMedia><AlertCircle /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>site_plan_confidential.pdf</AttachmentTitle>
                <AttachmentDescription>Upload failed — file too large</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><RotateCcw /></AttachmentAction>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Sizes */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Sizes</p>
          <Row label="default">
            <Attachment size="default" state="done">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_abstract.pdf</AttachmentTitle>
                <AttachmentDescription>1.1 MB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="sm">
            <Attachment size="sm" state="done">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_abstract.pdf</AttachmentTitle>
                <AttachmentDescription>1.1 MB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="xs">
            <Attachment size="xs" state="done">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_abstract.pdf</AttachmentTitle>
                <AttachmentDescription>1.1 MB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Orientations */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Orientations</p>
          <Row label="horizontal">
            <Attachment orientation="horizontal" state="done">
              <AttachmentMedia><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>tenancy_schedule_q4.xlsx</AttachmentTitle>
                <AttachmentDescription>Excel · 340 KB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="vertical">
            <Attachment orientation="vertical" state="done">
              <AttachmentMedia variant="image">
                <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200" alt="Building" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>tower_sf_exterior.jpg</AttachmentTitle>
                <AttachmentDescription>1.8 MB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction><X /></AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Media variants */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Media variants</p>
          <Row label="icon">
            <Attachment state="done">
              <AttachmentMedia variant="icon"><FileText /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>lease_agreement.pdf</AttachmentTitle>
                <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment state="done">
              <AttachmentMedia variant="icon"><ImageIcon /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>floor_plan.png</AttachmentTitle>
                <AttachmentDescription>PNG · 780 KB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment state="done">
              <AttachmentMedia variant="icon"><File /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>rent_roll.csv</AttachmentTitle>
                <AttachmentDescription>CSV · 45 KB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
          <div className="mt-5" />
          <Row label="image">
            <Attachment state="done">
              <AttachmentMedia variant="image">
                <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200" alt="Building" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>101_park_exterior.jpg</AttachmentTitle>
                <AttachmentDescription>JPEG · 1.2 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Group */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Attachment group</p>
          <Row label="scrollable">
            <div className="max-w-xl w-full">
              <AttachmentGroup>
                <Attachment state="done">
                  <AttachmentMedia><FileText /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>executed_lease.pdf</AttachmentTitle>
                    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions><AttachmentAction><X /></AttachmentAction></AttachmentActions>
                </Attachment>
                <Attachment state="done">
                  <AttachmentMedia><ImageIcon /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>floor_plan_tower_sf.png</AttachmentTitle>
                    <AttachmentDescription>PNG · 780 KB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions><AttachmentAction><X /></AttachmentAction></AttachmentActions>
                </Attachment>
                <Attachment state="uploading">
                  <AttachmentMedia><Loader2 className="animate-spin" /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>rent_roll_2024.xlsx</AttachmentTitle>
                    <AttachmentDescription>Uploading...</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
                <Attachment state="error">
                  <AttachmentMedia><AlertCircle /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>site_survey.pdf</AttachmentTitle>
                    <AttachmentDescription>Upload failed</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions><AttachmentAction><RotateCcw /></AttachmentAction></AttachmentActions>
                </Attachment>
              </AttachmentGroup>
            </div>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Real-world: deal documents */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">06 · Real-world: deal documents panel</p>
          <Row label="deal docs">
            <div className="flex flex-col gap-2 max-w-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Documents (4)</p>
              <Attachment state="done">
                <AttachmentMedia><FileText /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>executed_lease_acme_2024.pdf</AttachmentTitle>
                  <AttachmentDescription>Executed · Jan 2, 2025</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction><CheckCircle2 className="text-green-600" /></AttachmentAction>
                </AttachmentActions>
              </Attachment>
              <Attachment state="done">
                <AttachmentMedia><FileText /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>letter_of_intent.pdf</AttachmentTitle>
                  <AttachmentDescription>LOI · Nov 15, 2024</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction><X /></AttachmentAction>
                </AttachmentActions>
              </Attachment>
              <Attachment state="uploading">
                <AttachmentMedia><Loader2 className="animate-spin" /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>personal_guaranty.pdf</AttachmentTitle>
                  <AttachmentDescription>Uploading... 67%</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
              <Attachment state="error">
                <AttachmentMedia><AlertCircle /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>insurance_certificate.pdf</AttachmentTitle>
                  <AttachmentDescription>File exceeds 25 MB limit</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction><RotateCcw /></AttachmentAction>
                  <AttachmentAction><X /></AttachmentAction>
                </AttachmentActions>
              </Attachment>
            </div>
          </Row>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
