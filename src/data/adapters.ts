/**
 * Data-source seam for the admin Signal & Noise module.
 *
 * The whole point of the module is to check the app's numbers against the app's
 * data — so it must read the SAME source every other screen reads. Today that is
 * the in-memory mock constants below, which makes reconciliation honest for free.
 *
 * This file is the single boundary to change when a real backend arrives: swap
 * these bodies to fetch from the API (returning the same shapes) and every admin
 * screen keeps working unchanged. Keep it the ONLY place the module reaches into
 * `mock.ts`, so the migration stays a one-file edit.
 */
import { LIVE_TIME_GOVERNANCE, SIGNAL_NOISE, WEEK_CALLS } from './mock'
import type { SignalNoiseModel, Call } from './mock'

/** Executive Review's published live-time figures — the reconciliation anchor. */
export function getLiveTimeGovernance(): { label: string; value: string }[] {
  return LIVE_TIME_GOVERNANCE
}

/** The derived signal/noise model rendered by the instrument. */
export function getSignalNoise(): SignalNoiseModel {
  return SIGNAL_NOISE
}

/** Every scored call plotted in the matrix. */
export function getWeekCalls(): Call[] {
  return WEEK_CALLS
}

// ---------------------------------------------------------------------------
// Extended read surface — every dataset the data-integrity module inspects.
// Still the single seam: swap these bodies for API calls behind one edit.
// ---------------------------------------------------------------------------
import {
  MEETINGS,
  MEETING_CLOSEOUT,
  ATTENDEE_OUTCOME_SIGNALS,
  SCORECARDS,
  CLAIMED_RELATIONSHIPS,
  DECISIONS,
  ACTIONS,
  DEPENDENCIES,
  RISKS,
  AGENTS,
  AGENT_AUTHORIZATIONS,
  ORG_CARDS,
  EVENT_RECEIPTS,
  DECISION_VELOCITY,
  ORG_FRICTION,
  AGENT_LEVERAGE,
  ORG_LOAD,
  MEETING_DEBT,
  PRE_MEETING_SCORES,
  CLOSURE_SCORES,
} from './mock'
import type {
  Meeting,
  MeetingCloseout,
  AttendeeOutcomeSignal,
  RelationshipScorecard,
  ClaimedRelationship,
  Decision,
  ActionItem,
  Dependency,
  Risk,
  Agent,
  AgentAuthorization,
  OrgCard,
  EventReceipt,
} from '../types'

export type LabelValue = { label: string; value: string }
export type ScoreRow = { label: string; value: string; note: string }

export const getMeetings = (): Meeting[] => MEETINGS
export const getMeetingCloseout = (): MeetingCloseout => MEETING_CLOSEOUT
export const getAttendeeSignals = (): AttendeeOutcomeSignal[] => ATTENDEE_OUTCOME_SIGNALS
export const getScorecards = (): RelationshipScorecard[] => SCORECARDS
export const getClaimedRelationships = (): ClaimedRelationship[] => CLAIMED_RELATIONSHIPS
export const getDecisions = (): Decision[] => DECISIONS
export const getActions = (): ActionItem[] => ACTIONS
export const getDependencies = (): Dependency[] => DEPENDENCIES
export const getRisks = (): Risk[] => RISKS
export const getAgents = (): Agent[] => AGENTS
export const getAgentAuthorizations = (): AgentAuthorization[] => AGENT_AUTHORIZATIONS
export const getOrgCards = (): OrgCard[] => ORG_CARDS
export const getEventReceipts = (): EventReceipt[] => EVENT_RECEIPTS

export const getDecisionVelocity = (): LabelValue[] => DECISION_VELOCITY
export const getOrgFriction = (): LabelValue[] => ORG_FRICTION
export const getAgentLeverage = (): LabelValue[] => AGENT_LEVERAGE
export const getOrgLoad = () => ORG_LOAD
export const getMeetingDebt = (): string[] => MEETING_DEBT
export const getPreMeetingScores = (): ScoreRow[] => PRE_MEETING_SCORES
export const getClosureScores = (): ScoreRow[] => CLOSURE_SCORES
