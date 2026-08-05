/**
 * Derived-metrics engine for the data-integrity module.
 *
 * Every metric here is computed live from the app's own datasets (through the
 * adapters seam) — no new instrumentation. Grouped by domain so the Metrics
 * screen can render each as a section. Pure and dependency-free.
 */
import {
  getAgentAuthorizations,
  getAgentLeverage,
  getAgents,
  getAttendeeSignals,
  getClosureScores,
  getDecisionVelocity,
  getDecisions,
  getDependencies,
  getEventReceipts,
  getLiveTimeGovernance,
  getMeetingCloseout,
  getMeetingDebt,
  getMeetings,
  getRisks,
  getScorecards,
} from './adapters'

export interface MetricRow {
  label: string
  value: string
  source: string
}
export interface MetricGroup {
  domain: string
  note?: string
  rows: MetricRow[]
}

const intOf = (s: string): number => {
  const m = String(s).match(/-?\d+(?:\.\d+)?/)
  return m ? parseFloat(m[0]) : NaN
}
const countBy = <T>(arr: T[], key: (t: T) => string): Record<string, number> =>
  arr.reduce<Record<string, number>>((m, x) => {
    const k = key(x)
    m[k] = (m[k] ?? 0) + 1
    return m
  }, {})
const mix = (rec: Record<string, number>): string =>
  Object.entries(rec)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ')
const avg = (nums: number[]): number =>
  nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0

export function buildMetrics(): MetricGroup[] {
  const meetings = getMeetings()
  const gov = getLiveTimeGovernance()
  const dv = getDecisionVelocity()
  const lev = getAgentLeverage()
  const debt = getMeetingDebt()
  const scorecards = getScorecards()
  const auths = getAgentAuthorizations()
  const deps = getDependencies()
  const risks = getRisks()
  const receipts = getEventReceipts()
  const closeout = getMeetingCloseout()
  const signals = getAttendeeSignals()
  const decisions = getDecisions()
  const agents = getAgents()
  const closureScores = getClosureScores()

  const kv = (rows: { label: string; value: string }[], label: string): string =>
    rows.find((r) => r.label === label)?.value ?? '—'

  const bookedHours = meetings
    .map((m) => intOf(m.estimatedCost))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => a + b, 0)

  const madeN = intOf(kv(dv, 'Decisions made'))
  const deferN = intOf(kv(dv, 'Decisions deferred'))

  const coverable = scorecards.reduce((n, s) => n + s.agentCoverableHours, 0)
  const authorized = scorecards.reduce((n, s) => n + s.authorizedAgentCoverageHours, 0)

  const groups: MetricGroup[] = [
    {
      domain: 'Time & cost',
      note: 'Executive Review · Meetings',
      rows: [
        { label: 'Total live meeting hours', value: kv(gov, 'Total live meeting hours'), source: 'LIVE_TIME_GOVERNANCE' },
        { label: 'Recoverable time', value: kv(gov, 'Recoverable time'), source: 'LIVE_TIME_GOVERNANCE' },
        { label: 'Protected focus time', value: kv(gov, 'Protected focus time'), source: 'LIVE_TIME_GOVERNANCE' },
        { label: 'Meetings converted to async', value: kv(gov, 'Meetings converted to async'), source: 'LIVE_TIME_GOVERNANCE' },
        { label: 'Agent-covered meetings', value: kv(gov, 'Agent-covered meetings'), source: 'LIVE_TIME_GOVERNANCE' },
        { label: 'Booked attendee-hours (today)', value: `${bookedHours} hrs`, source: 'Meeting.estimatedCost' },
        { label: 'Avg readiness score', value: `${avg(meetings.map((m) => m.readinessScore))} / 100`, source: 'Meeting.readinessScore' },
        { label: 'Avg necessity score', value: `${avg(meetings.map((m) => m.necessityScore))} / 100`, source: 'Meeting.necessityScore' },
      ],
    },
    {
      domain: 'Meeting quality',
      note: 'Meetings · Meeting Debt',
      rows: [
        { label: 'Meetings on the calendar', value: String(meetings.length), source: 'MEETINGS' },
        { label: 'By intake state', value: mix(countBy(meetings, (m) => m.state)), source: 'Meeting.state' },
        { label: 'By declared value', value: mix(countBy(meetings, (m) => m.meetingValue)), source: 'Meeting.meetingValue' },
        ...debt.map((d) => {
          const [label, val] = d.split('—')
          return { label: (label ?? d).trim(), value: (val ?? '').trim(), source: 'MEETING_DEBT' }
        }),
      ],
    },
    {
      domain: 'Decision health',
      note: 'Decision Velocity · Decisions',
      rows: [
        { label: 'Decisions made', value: kv(dv, 'Decisions made'), source: 'DECISION_VELOCITY' },
        { label: 'Decisions deferred', value: kv(dv, 'Decisions deferred'), source: 'DECISION_VELOCITY' },
        { label: 'Deferral rate', value: Number.isFinite(madeN) && madeN > 0 ? `${Math.round((deferN / madeN) * 100)}%` : '—', source: 'derived' },
        { label: 'Decisions without owner', value: kv(dv, 'Decisions without owner'), source: 'DECISION_VELOCITY' },
        { label: 'Reopened decisions', value: kv(dv, 'Reopened decisions'), source: 'DECISION_VELOCITY' },
        { label: 'Oldest unresolved decision', value: kv(dv, 'Oldest unresolved decision'), source: 'DECISION_VELOCITY' },
        { label: 'Decision status mix (ledger)', value: mix(countBy(decisions, (d) => d.status)), source: 'Decision.status' },
      ],
    },
    {
      domain: 'Outcome validation',
      note: 'Meeting Closeout — single sample (CE-0412)',
      rows: [
        { label: 'Required output achieved', value: closeout.requiredOutputAchieved, source: 'MeetingCloseout' },
        { label: 'Live time justified', value: closeout.liveTimeJustified, source: 'MeetingCloseout' },
        { label: 'Decision status', value: `${closeout.decisionStatus} · ${closeout.deferralReason ?? 'no deferral'}`, source: 'MeetingCloseout' },
        { label: 'False closure risk', value: closeout.falseClosureRisk, source: 'MeetingCloseout' },
        { label: 'Follow-through readiness', value: closeout.followThroughReadinessScore, source: 'MeetingCloseout' },
        { label: 'Action owners assigned', value: closeout.actionOwnersAssigned, source: 'MeetingCloseout' },
        { label: 'Follow-up created', value: closeout.followUpCreated ? 'Yes' : 'No', source: 'MeetingCloseout' },
        { label: 'Recurrence recommendation', value: closeout.recurrenceRecommendation, source: 'MeetingCloseout' },
        ...closureScores.map((s) => ({ label: s.label, value: s.value, source: 'CLOSURE_SCORES' })),
      ],
    },
    {
      domain: 'Attendee truth',
      note: `Attendee Outcome Signals — ${signals.length} for ${signals[0]?.meetingId ?? '—'}`,
      rows: [
        { label: 'Signals captured', value: String(signals.length), source: 'ATTENDEE_OUTCOME_SIGNALS' },
        { label: 'Outcome clear?', value: signals.map((s) => `${s.attendeeOrg}: ${s.outcomeClear}`).join(' · '), source: 'AttendeeOutcomeSignal.outcomeClear' },
        { label: 'Live attendance required?', value: signals.map((s) => `${s.attendeeOrg}: ${s.liveAttendanceRequired}`).join(' · '), source: 'AttendeeOutcomeSignal.liveAttendanceRequired' },
        { label: 'Agent could cover next time?', value: signals.map((s) => `${s.attendeeOrg}: ${s.agentCouldCoverNextTime}`).join(' · '), source: 'AttendeeOutcomeSignal.agentCouldCoverNextTime' },
      ],
    },
    {
      domain: 'Relationship / cross-org',
      note: 'Relationship Scorecards',
      rows: [
        { label: 'Relationships measured', value: String(scorecards.length), source: 'SCORECARDS' },
        { label: 'Total joint hours', value: `${scorecards.reduce((n, s) => n + s.jointHours, 0)} hrs`, source: 'RelationshipScorecard.jointHours' },
        { label: 'Agent coverage gap', value: `${coverable - authorized} hrs (of ${coverable} coverable)`, source: 'coverable − authorized' },
        { label: 'Avg async resolution rate', value: `${avg(scorecards.map((s) => intOf(s.asyncResolutionRate)))}%`, source: 'RelationshipScorecard.asyncResolutionRate' },
        { label: 'Avg live escalation rate', value: `${avg(scorecards.map((s) => intOf(s.liveEscalationRate)))}%`, source: 'RelationshipScorecard.liveEscalationRate' },
        { label: 'Avg decision deferral rate', value: `${avg(scorecards.map((s) => intOf(s.decisionDeferralRate)))}%`, source: 'RelationshipScorecard.decisionDeferralRate' },
        { label: 'Avg reopen rate', value: `${avg(scorecards.map((s) => intOf(s.reopenRate)))}%`, source: 'RelationshipScorecard.reopenRate' },
        { label: 'Unresolved dependencies', value: String(scorecards.reduce((n, s) => n + s.unresolvedDependencyCount, 0)), source: 'RelationshipScorecard.unresolvedDependencyCount' },
        { label: 'Health-state mix', value: mix(countBy(scorecards, (s) => s.healthState)), source: 'RelationshipScorecard.healthState' },
      ],
    },
    {
      domain: 'Delegation & agents',
      note: 'Agent Authorizations · Agent Leverage',
      rows: [
        { label: 'Authorizations on file', value: String(auths.length), source: 'AGENT_AUTHORIZATIONS' },
        { label: 'Authorization status mix', value: mix(countBy(auths, (a) => a.authorizationStatus)), source: 'AgentAuthorization.authorizationStatus' },
        { label: 'Delegation scope mix', value: mix(countBy(auths, (a) => a.delegationScope)), source: 'AgentAuthorization.delegationScope' },
        { label: 'Risk-level mix', value: mix(countBy(auths, (a) => a.riskLevel)), source: 'AgentAuthorization.riskLevel' },
        { label: 'Consent captured', value: `${auths.filter((a) => a.consentCaptured).length} / ${auths.length}`, source: 'AgentAuthorization.consentCaptured' },
        { label: 'Agents registered', value: `${agents.length} — ${mix(countBy(agents, (a) => a.agentType))}`, source: 'AGENTS' },
        { label: 'Meetings agent-covered', value: kv(lev, 'Meetings safely covered by agents'), source: 'AGENT_LEVERAGE' },
        { label: 'Avoided attendance hours', value: kv(lev, 'Avoided attendance hours'), source: 'AGENT_LEVERAGE' },
      ],
    },
    {
      domain: 'Dependencies & risks',
      note: 'Dependencies · Risks',
      rows: [
        { label: 'Open dependencies', value: String(deps.length), source: 'DEPENDENCIES' },
        { label: 'Dependency status mix', value: mix(countBy(deps, (d) => d.status)), source: 'Dependency.status' },
        { label: 'Risks tracked', value: String(risks.length), source: 'RISKS' },
        { label: 'Risk severity mix', value: mix(countBy(risks, (r) => r.severity)), source: 'Risk.severity' },
      ],
    },
    {
      domain: 'Ledger / flow',
      note: 'Event Receipts (core layer)',
      rows: [
        { label: 'Core receipts', value: String(receipts.length), source: 'EVENT_RECEIPTS' },
        { label: 'By source', value: mix(countBy(receipts, (r) => r.source)), source: 'EventReceipt.source' },
        { label: 'Distinct event types', value: String(new Set(receipts.map((r) => r.eventType)).size), source: 'EventReceipt.eventType' },
        { label: 'Distinct org→org flows', value: String(new Set(receipts.map((r) => `${r.actorOrg}→${r.targetOrg}`)).size), source: 'actorOrg → targetOrg' },
      ],
    },
  ]

  return groups
}
