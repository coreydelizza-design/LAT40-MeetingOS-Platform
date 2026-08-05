/**
 * Reconciliation-gaps engine.
 *
 * The most valuable derived signals are disagreements between two data layers —
 * the same shape as the truth × application-data matrix. Each gap pairs one
 * layer against another and flags where they diverge. Computed live from the
 * app's datasets; pure and dependency-free.
 */
import {
  getAttendeeSignals,
  getClaimedRelationships,
  getMeetingCloseout,
  getMeetings,
  getScorecards,
} from './adapters'

export interface GapRow {
  item: string
  left: string
  right: string
  verdict: string
  /** true = divergence worth attention (rendered as a solid chip). */
  flag: boolean
}
export interface Gap {
  id: string
  title: string
  description: string
  leftLabel: string
  rightLabel: string
  sources: string
  rows: GapRow[]
  summary: string
}

const intOf = (s: string): number => {
  const m = String(s).match(/-?\d+(?:\.\d+)?/)
  return m ? parseFloat(m[0]) : NaN
}

export function buildGaps(): Gap[] {
  const meetings = getMeetings()
  const scorecards = getScorecards()
  const claimed = getClaimedRelationships()
  const closeout = getMeetingCloseout()
  const signals = getAttendeeSignals()

  // 1 — Claimed vs measured -------------------------------------------------
  const claimedRows: GapRow[] = claimed.map((c) => {
    const sc = scorecards.find((s) => s.sourceOrg === c.sourceOrg && s.targetOrg === c.targetOrg)
    const healthy = sc?.healthState === 'healthy' || sc?.healthState === 'improving'
    return {
      item: c.relationshipLabel,
      left: `Confidence ${c.confidence} · ${c.expectedWorkflow}`,
      right: sc ? `Measured ${sc.healthState} · median ${sc.medianResolutionTime}` : 'no measured scorecard',
      verdict: !sc ? 'unmeasured' : healthy ? 'aligned' : 'gap',
      flag: !sc || !healthy,
    }
  })

  // 2 — Host vs attendee (false closure) ------------------------------------
  const attendeeOutcome = signals.map((s) => `${s.attendeeOrg}: ${s.outcomeClear}`).join(' · ')
  const attendeeLive = signals.map((s) => `${s.attendeeOrg}: ${s.liveAttendanceRequired}`).join(' · ')
  const attendeeAction = signals.map((s) => `${s.attendeeOrg}: ${s.nextActionKnown}`).join(' · ')
  const hostRows: GapRow[] = [
    { item: 'Outcome achieved', left: `Host: ${closeout.requiredOutputAchieved}`, right: attendeeOutcome, verdict: 'gap', flag: true },
    { item: 'Live time necessary', left: `Host: justified (${closeout.liveTimeJustified})`, right: attendeeLive, verdict: 'gap', flag: true },
    { item: 'Next action known', left: `Host: owners assigned (${closeout.actionOwnersAssigned})`, right: attendeeAction, verdict: 'gap', flag: true },
    { item: 'Composite', left: `Host closeout: ${closeout.closureScore}`, right: `False-closure risk: ${closeout.falseClosureRisk}`, verdict: 'flag', flag: true },
  ]

  // 3 — Coverable vs authorized delegation ----------------------------------
  const covRows: GapRow[] = scorecards.map((s) => ({
    item: s.relationshipLabel,
    left: `${s.agentCoverableHours} hrs coverable`,
    right: `${s.authorizedAgentCoverageHours} hrs authorized`,
    verdict: s.agentCoverableHours > s.authorizedAgentCoverageHours ? 'gap' : 'aligned',
    flag: s.agentCoverableHours > s.authorizedAgentCoverageHours,
  }))
  const covTotal = scorecards.reduce((n, s) => n + s.agentCoverableHours, 0)
  const authTotal = scorecards.reduce((n, s) => n + s.authorizedAgentCoverageHours, 0)
  covRows.push({ item: 'Total', left: `${covTotal} hrs coverable`, right: `${authTotal} hrs authorized`, verdict: `${covTotal - authTotal} hr gap`, flag: covTotal > authTotal })

  // 4 — Declared value vs realized outcome ----------------------------------
  const scenario = meetings.find((m) => m.title.toLowerCase().includes('pricing exception'))
  const valueRows: GapRow[] = meetings
    .filter((m) => m.state !== 'FOCUS PROTECTED')
    .map((m) => {
      const isScenario = m.id === scenario?.id
      return {
        item: m.title,
        left: `Declared ${m.meetingValue} · necessity ${m.necessityScore}`,
        right: isScenario ? `Realized ${closeout.requiredOutputAchieved} · ${closeout.outcomeStatus}` : 'no closeout captured',
        verdict: isScenario ? 'gap' : 'unvalidated',
        flag: true,
      }
    })
  const validated = valueRows.filter((r) => r.right !== 'no closeout captured').length

  // 5 — Recommended state vs live calendar ----------------------------------
  const recRows: GapRow[] = meetings
    .filter((m) => m.state === 'ASYNC RECOMMENDED' || m.state === 'AUTHORIZATION AVAILABLE')
    .map((m) => ({
      item: m.title,
      left: `Recommended: ${m.state}`,
      right: `On the live calendar (${m.duration}, ${m.estimatedCost})`,
      verdict: 'recoverable',
      flag: true,
    }))
  const recoverableHrs = meetings
    .filter((m) => m.state === 'ASYNC RECOMMENDED' || m.state === 'AUTHORIZATION AVAILABLE')
    .map((m) => intOf(m.estimatedCost))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => a + b, 0)

  return [
    {
      id: 'claimed-measured',
      title: 'Claimed vs measured',
      description: 'What the org model says a relationship is, against what the receipts measured.',
      leftLabel: 'Claimed (Org Cards)',
      rightLabel: 'Measured (Scorecards)',
      sources: 'CLAIMED_RELATIONSHIPS × SCORECARDS',
      rows: claimedRows,
      summary: `${claimedRows.filter((r) => r.flag).length} of ${claimedRows.length} relationships diverge from their claimed model.`,
    },
    {
      id: 'host-attendee',
      title: 'Host vs attendee truth',
      description: 'What the host recorded at closeout, against what attendees reported. Divergence is false closure.',
      leftLabel: 'Host closeout',
      rightLabel: 'Attendee signals',
      sources: 'MEETING_CLOSEOUT × ATTENDEE_OUTCOME_SIGNALS',
      rows: hostRows,
      summary: `Host marked success partial; ${signals.length} attendee signals disagree — false-closure risk ${closeout.falseClosureRisk}.`,
    },
    {
      id: 'coverable-authorized',
      title: 'Coverable vs authorized delegation',
      description: 'Hours an agent could cover, against hours actually authorized. The gap is unclaimed leverage.',
      leftLabel: 'Coverable',
      rightLabel: 'Authorized',
      sources: 'RelationshipScorecard.agentCoverableHours × authorizedAgentCoverageHours',
      rows: covRows,
      summary: `${covTotal - authTotal} of ${covTotal} coverable hours are not yet authorized.`,
    },
    {
      id: 'value-outcome',
      title: 'Declared value vs realized outcome',
      description: 'What each meeting declared it was worth, against whether a closeout validated an outcome.',
      leftLabel: 'Declared',
      rightLabel: 'Realized',
      sources: 'Meeting.meetingValue × MEETING_CLOSEOUT',
      rows: valueRows,
      summary: `${validated} of ${valueRows.length} live meetings has a validated outcome; the rest are unvalidated.`,
    },
    {
      id: 'recommended-actual',
      title: 'Recommended state vs live calendar',
      description: 'Meetings the intake flagged as async-eligible or agent-coverable, yet still held live.',
      leftLabel: 'Intake recommendation',
      rightLabel: 'Actual',
      sources: 'Meeting.state',
      rows: recRows,
      summary: `${recRows.length} meetings recommended not-fully-live are on the calendar — ~${recoverableHrs} attendee-hrs recoverable.`,
    },
  ]
}
