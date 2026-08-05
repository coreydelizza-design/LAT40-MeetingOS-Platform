import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SCREEN_TO_NAV } from './constants'
import type { ViewId } from './types'
import { TodayView } from './screens/TodayView'
import { SmartCalendar } from './screens/SmartCalendar'
import { BuildMeeting } from './screens/BuildMeeting'
import { OrgCards } from './screens/OrgCards'
import { DecisionRoom } from './screens/DecisionRoom'
import { Agents } from './screens/Agents'
import { StructuredCapture } from './screens/StructuredCapture'
import { WorkMap } from './screens/WorkMap'
import { ExecutiveReview } from './screens/ExecutiveReview'
import { SignalNoise } from './screens/SignalNoise'
import { SignalNoiseChecks } from './screens/admin/SignalNoiseChecks'
import { SignalNoiseMetrics } from './screens/admin/SignalNoiseMetrics'
import { SignalNoiseGaps } from './screens/admin/SignalNoiseGaps'
import { SignalNoiseData } from './screens/admin/SignalNoiseData'
import { AttendeeView } from './screens/AttendeeView'
import { MeetingCloseout } from './screens/MeetingCloseout'

/**
 * Reads the current screen out of `location.hash` (`#/work-map`). Anything
 * unrecognised falls back to Today.
 *
 * Validation is against SCREEN_TO_NAV, which is derived from NAV — so in the
 * public build, where NAV has no admin destination, `#/sn-metrics` is not a
 * known id and lands on Today. A hand-typed URL cannot reach a screen that was
 * compiled out of the bundle.
 */
function viewFromHash(): ViewId {
  const id = window.location.hash.replace(/^#\/?/, '')
  return id in SCREEN_TO_NAV ? (id as ViewId) : 'today'
}

/**
 * Internal view router. Deliberately dependency-free — a single view-state
 * switch plus the hash keeps the "no unnecessary dependencies" lock and the
 * deploy path simple. The hash is what makes a refresh keep your place; it also
 * makes browser back/forward work across screens.
 */
export default function App() {
  const [view, setView] = useState<ViewId>(viewFromHash)

  // Back/forward buttons and hand-edited URLs both surface as `hashchange`.
  // Runs once on mount too, so an unrecognised hash present at load is
  // normalised rather than left contradicting the screen on display.
  useEffect(() => {
    const syncFromHash = () => {
      const next = viewFromHash()
      setView(next)
      // A hash that resolved to something else (unknown id, or `#today` without
      // the slash) gets rewritten. replaceState rather than assignment, so the
      // correction does not add a history entry that back would step into.
      if (window.location.hash && window.location.hash !== `#/${next}`) {
        window.history.replaceState(null, '', `#/${next}`)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  // In-app navigation writes the hash (pushing a history entry) and sets state
  // directly, so the screen swaps even when the hash already matches.
  const navigate = (next: ViewId) => {
    setView(next)
    if (viewFromHash() !== next) window.location.hash = `#/${next}`
  }

  return (
    <AppShell view={view} onNavigate={navigate}>
      {/* Keyed by view so navigating to any screen remounts the boundary and
          clears a prior crash. The shell + nav live outside it and stay up. */}
      <ErrorBoundary key={view} onReset={() => navigate('today')}>
        {renderView(view, navigate)}
      </ErrorBoundary>
    </AppShell>
  )
}

function renderView(view: ViewId, navigate: (v: ViewId) => void) {
  switch (view) {
    case 'today':
      return <TodayView navigate={navigate} />
    case 'calendar':
      return <SmartCalendar navigate={navigate} />
    case 'attendee':
      return <AttendeeView navigate={navigate} />
    case 'build':
      return <BuildMeeting />
    case 'org-cards':
      return <OrgCards />
    case 'decision-room':
      return <DecisionRoom navigate={navigate} />
    case 'closeout':
      return <MeetingCloseout />
    case 'agents':
      return <Agents />
    case 'capture':
      return <StructuredCapture />
    case 'work-map':
      return <WorkMap />
    case 'review':
      return <ExecutiveReview />
    // Admin-only Signal & Noise module. The __ADMIN_TOOLS__ guard is a build-time
    // literal, so in the public build these three branches (and their imports)
    // are dead-code-eliminated — the code never ships to users.
    case 'signal-noise':
      return __ADMIN_TOOLS__ ? <SignalNoise navigate={navigate} /> : <TodayView navigate={navigate} />
    case 'sn-metrics':
      return __ADMIN_TOOLS__ ? <SignalNoiseMetrics /> : <TodayView navigate={navigate} />
    case 'sn-gaps':
      return __ADMIN_TOOLS__ ? <SignalNoiseGaps /> : <TodayView navigate={navigate} />
    case 'sn-checks':
      return __ADMIN_TOOLS__ ? <SignalNoiseChecks /> : <TodayView navigate={navigate} />
    case 'sn-data':
      return __ADMIN_TOOLS__ ? <SignalNoiseData /> : <TodayView navigate={navigate} />
    default:
      return <TodayView navigate={navigate} />
  }
}
