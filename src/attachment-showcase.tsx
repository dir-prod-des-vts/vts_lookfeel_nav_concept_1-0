import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload } from "lucide-react"

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
          <h1 className="text-3xl font-semibold text-foreground">Attachment</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">File attachment display with metadata and actions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <div className="flex flex-col gap-10">
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · States</p>
          <div className="flex flex-col gap-5">
            <Row label="default">
              <Attachment>
                <AttachmentMedia><FileText className="size-5 text-muted-foreground" /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Lease_Agreement_v3.pdf</AttachmentTitle>
                  <AttachmentDescription>2.4 MB · PDF</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <Button variant="ghost" size="icon-sm"><Download className="size-3.5" /></Button>
                </AttachmentActions>
              </Attachment>
              <Attachment state="idle">
                <AttachmentMedia><Upload className="size-5 text-muted-foreground" /></AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Uploading...</AttachmentTitle>
                  <AttachmentDescription>Floor_Plan.png · 45%</AttachmentDescription>
                </AttachmentContent>
              </Attachment>
            </Row>
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
