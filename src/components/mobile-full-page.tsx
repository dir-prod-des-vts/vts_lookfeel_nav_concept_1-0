import * as React from "react"
import { cn } from "@/lib/utils"

interface MobileFullPageProps {
  trigger: React.ReactElement
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function MobileFullPage({ trigger, open, onOpenChange, children, className }: MobileFullPageProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const triggerEl = React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
    onClick: () => onOpenChange(true),
  })

  return (
    <>
      {triggerEl}
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background",
            className
          )}
        >
          {children}
        </div>
      )}
    </>
  )
}
