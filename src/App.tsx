import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { ErrorBoundary } from './components/ErrorBoundary'
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
import { AttendeeView } from './screens/AttendeeView'
import { MeetingCloseout } from './screens/MeetingCloseout'

/**
 * Internal view router. Deliberately dependency-free — a single view-state
 * switch keeps the "no unnecessary dependencies" lock and the deploy path simple.
 */
export default function App() {
  const [view, setView] = useState<ViewId>('today')

  return (
    <AppShell view={view} onNavigate={setView}>
      {/* Keyed by view so navigating to any screen remounts the boundary and
          clears a prior crash. The shell + nav live outside it and stay up. */}
      <ErrorBoundary key={view} onReset={() => setView('today')}>
        {renderView(view, setView)}
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
    default:
      return <TodayView navigate={navigate} />
  }
}
