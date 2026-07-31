import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Navigate back to the Today view when the user resets the boundary. */
  onReset: () => void
}

interface State {
  hasError: boolean
}

/**
 * App-level error boundary. A render error in any single screen is caught here
 * so it never white-screens the app. The boundary wraps ONLY the routed view
 * (not AppShell), so the command bar and left-rail nav stay live and usable.
 *
 * Recovery: navigating to any other view remounts the boundary (App keys it by
 * view id) and clears the error; the reset button both clears the error and
 * routes back to Today. The fallback reuses existing design-system classes —
 * no new styles.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Frontend-only build: surface the crash in the console for diagnostics.
    console.error('[MeetingOS] view render error:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
    this.props.onReset()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="canvas">
        <div className="work-card" style={{ maxWidth: 620, padding: '32px 34px' }}>
          <div className="eyebrow kicker" style={{ marginBottom: 14 }}>
            System
          </div>
          <h1 className="display" style={{ fontSize: 30, lineHeight: 1.1 }}>
            This view failed to render.
          </h1>
          <p className="note-box" style={{ marginTop: 18 }}>
            The rest of MeetingOS is unaffected — use the navigation to open another view.
          </p>
          <button
            className="btn btn-solid"
            style={{ marginTop: 24 }}
            onClick={this.handleReset}
          >
            Return to Today
          </button>
        </div>
      </div>
    )
  }
}
