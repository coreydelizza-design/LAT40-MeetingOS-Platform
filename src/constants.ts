import type { ViewId } from './types'

/** Product constants. The visual + language lock lives here so it stays consistent. */
export const PRODUCT = {
  name: 'LAT40 MeetingOS',
  workspace: 'Executive Alignment Room',
  primaryAction: 'Build Smart Meeting',
  secondaryAction: 'Open Org Cards',
  visualLock: 'black-and-white executive decision room, not a dashboard',
} as const

export interface NavItem {
  id: ViewId
  label: string
  /** Short executive descriptor shown under the label in the rail. */
  note: string
}

/** Left navigation rail. Order is deliberate: attention → design → govern → intelligence. */
export const NAV: NavItem[] = [
  { id: 'today', label: 'Today', note: 'Live time in front of you' },
  { id: 'calendar', label: 'Smart Calendar', note: 'Where attention is spent' },
  { id: 'build', label: 'Build Meeting', note: 'Design the decision object' },
  { id: 'attendee', label: 'Review Invite', note: 'Validate live attendance' },
  { id: 'org-cards', label: 'Org Cards', note: 'What each org owns' },
  { id: 'decision-room', label: 'Decision Room', note: 'Govern the decision' },
  { id: 'closeout', label: 'Closeout', note: 'Validate the outcome' },
  { id: 'agents', label: 'Agents', note: 'Represented coverage' },
  { id: 'capture', label: 'Structured Capture', note: 'The evidence ledger' },
  { id: 'work-map', label: 'Work Map', note: 'How work actually moves' },
  { id: 'review', label: 'Review', note: 'Executive operating review' },
]

/** Fixed reference date for the mock build (frontend-only, no live clock dependency). */
export const TODAY_LABEL = 'Monday, July 6, 2026'
