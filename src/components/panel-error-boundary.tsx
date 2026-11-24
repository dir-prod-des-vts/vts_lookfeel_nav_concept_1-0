import * as React from "react"
import { CircleAlert, RotateCcw } from "lucide-react"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface PanelErrorBoundaryProps {
  /** Name shown in the fallback, e.g. "Operations". */
  label: string
  /** Changing this value clears the error, e.g. the selected tenant. */
  resetKey?: string
  children: React.ReactNode
}

interface PanelErrorBoundaryState {
  error: Error | null
}

/** Contains a render error to one panel so the rest of the page keeps working. */
export class PanelErrorBoundary extends React.Component<PanelErrorBoundaryProps, PanelErrorBoundaryState> {
  state: PanelErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): PanelErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`${this.props.label} panel failed to render`, error, info.componentStack)
  }

  componentDidUpdate(prev: PanelErrorBoundaryProps) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <Alert>
        <CircleAlert />
        <AlertTitle>{this.props.label} couldn't load</AlertTitle>
        <AlertDescription>Something went wrong showing this section. The rest of the page still works.</AlertDescription>
        <AlertAction>
          <Button variant="outline" size="sm" onClick={() => this.setState({ error: null })}>
            <RotateCcw />
            Try again
          </Button>
        </AlertAction>
      </Alert>
    )
  }
}
