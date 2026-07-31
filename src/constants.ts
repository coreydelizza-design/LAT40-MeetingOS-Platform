import type { NavId, ScreenId } from './types'

/** Product constants. The visual + language lock lives here so it stays consistent. */
export const PRODUCT = {
  name: 'LAT40 MeetingOS',
  workspace: 'Executive Alignment Room',
  primaryAction: 'Build Smart Meeting',
  secondaryAction: 'Open Org Cards',
  visualLock: 'black-and-white executive decision room, not a dashboard',
} as const

export interface NavItem {
  id: NavId
  label: string
  /** Short executive descriptor shown under the label in the rail. */
  note: string
  /** Ordered stages. stages[0] is the screen shown when the rail item is clicked. */
  stages: { id: ScreenId; label: string }[]
  /**
   * True when the stages are a sequence and should be numbered. Build → Closeout
   * is a lifecycle; Receipts/Relationships are zoom levels, and numbering those
   * would imply an order that does not exist.
   */
  flow?: boolean
}

/**
 * Left navigation rail. Six destinations. Order is deliberate:
 * attention → act → reference → measure.
 *
 * Eleven screens still exist; four of them are stages of one meeting lifecycle
 * and two are zoom levels on the same evidence. The rail names the destination,
 * the stage bar names the position within it.
 */
export const NAV: NavItem[] = [
  {
    id: 'today',
    label: 'Today',
    note: 'Live time in front of you',
    stages: [
      { id: 'today', label: 'Today' },
      { id: 'calendar', label: 'The Week' },
    ],
  },
  {
    id: 'meeting',
    label: 'Meeting',
    note: 'Design → validate → govern → close',
    flow: true,
    stages: [
      { id: 'build', label: 'Build' },
      { id: 'attendee', label: 'Review Invite' },
      { id: 'decision-room', label: 'Decision Room' },
      { id: 'closeout', label: 'Closeout' },
    ],
  },
  {
    id: 'org-cards',
    label: 'Org Cards',
    note: 'What each org owns',
    stages: [{ id: 'org-cards', label: 'Org Cards' }],
  },
  {
    id: 'agents',
    label: 'Agents',
    note: 'Represented coverage',
    stages: [{ id: 'agents', label: 'Agents' }],
  },
  {
    id: 'evidence',
    label: 'Evidence',
    note: 'What actually happened',
    stages: [
      { id: 'capture', label: 'Receipts' },
      { id: 'work-map', label: 'Relationships' },
    ],
  },
  {
    id: 'review',
    label: 'Review',
    note: 'Executive operating review',
    stages: [{ id: 'review', label: 'Review' }],
  },
]

/** Which rail item owns a screen. Derived from NAV — never hand-maintained. */
export const SCREEN_TO_NAV = Object.fromEntries(
  NAV.flatMap((n) => n.stages.map((s) => [s.id, n.id])),
) as Record<ScreenId, NavId>

/**
 * Current date, computed once at module load. Locale is pinned to en-US so the
 * format is deterministic and matches the previous static label exactly
 * (e.g. "Monday, July 6, 2026"). Export name kept so no consumer changes.
 */
export const TODAY_LABEL = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())
