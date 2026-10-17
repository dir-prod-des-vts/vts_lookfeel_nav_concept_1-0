import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className="w-32 shrink-0 pt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function ControlledPagination() {
  const [page, setPage] = React.useState(1)
  const total = 10

  function handlePage(p: number, e: React.MouseEvent) {
    e.preventDefault()
    if (p >= 1 && p <= total) setPage(p)
  }

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, "ellipsis-end", total)
  } else if (page >= total - 3) {
    pages.push(1, "ellipsis-start", total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", total)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={(e) => handlePage(page - 1, e)} />
          </PaginationItem>
          {pages.map((p, i) =>
            p === "ellipsis-start" || p === "ellipsis-end" ? (
              <PaginationItem key={`${p}-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={p === page} onClick={(e) => handlePage(p, e)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => handlePage(page + 1, e)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-xs text-muted-foreground">Page {page} of {total} · Showing deals 1–10 of 94</p>
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
          <h1 className="text-3xl font-semibold text-foreground">Pagination</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Page navigation with previous/next, numbered links, and ellipsis for long ranges.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDark(d => !d)}>
          {isDark ? "Light mode" : "Dark mode"}
        </Button>
      </div>

      <div className="flex flex-col gap-10">

        {/* Page 1 */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">01 · First page</p>
          <Row label="page 1 of 10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                {[1,2,3,4,5].map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === 1}>{p}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Middle page */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">02 · Middle page with ellipsis</p>
          <Row label="page 5 of 10">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                {[4,5,6].map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === 5}>{p}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Last page */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">03 · Last page</p>
          <Row label="page 10 of 10">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                {[6,7,8,9,10].map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === 10}>{p}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Controlled */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">04 · Controlled — interactive</p>
          <Row label="click pages">
            <ControlledPagination />
          </Row>
        </section>

        <div className="border-t border-border" />

        {/* Small range */}
        <section>
          <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.07em] text-primary mb-6">05 · Small ranges</p>
          <div className="flex flex-col gap-5">
            <Row label="3 pages">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                  {[1,2,3].map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink href="#" isActive={p === 2}>{p}</PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext href="#" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </Row>
            <Row label="prev/next only">
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious href="#" text="Previous page" /></PaginationItem>
                  <PaginationItem><PaginationNext href="#" text="Next page" /></PaginationItem>
                </PaginationContent>
              </Pagination>
            </Row>
          </div>
        </section>

      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
