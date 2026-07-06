/**
 * MeetingOS type spine.
 *
 * These model the domain as *governed work objects*, not calendar events.
 * Everything here is frontend-only. No persistence, no backend contracts.
 */

export type MeetingState =
  | 'ASYNC RECOMMENDED'
  | 'DECISION READY'
  | 'AGENT CAN COVER'
  | 'FOCUS PROTECTED'
  | 'LIVE REQUIRED'

export type MeetingValue = 'Low' | 'Medium' | 'High' | 'Critical' | 'Protected'

export type AttendeeRole =
  | 'Decision Owner'
  | 'Required Contributor'
  | 'Approver'
  | 'Facilitator'
  | 'Action Owner'
  | 'Optional Reviewer'
  | 'Informed Only'
  | 'Agent Representative'
  | 'N/A'

export type AgentEligibility =
  | 'Agent recommended'
  | 'Agent can attend'
  | 'Human required, agent observes'
  | 'Human required'
  | 'N/A'

export interface Meeting {
  id: string
  title: string
  time: string
  duration: string
  meetingType: string
  state: MeetingState
  purpose: string
  requiredOutput: string
  attendeeRole: AttendeeRole
  agentEligibility: AgentEligibility
  meetingValue: MeetingValue
  readinessScore: number
  necessityScore: number
  estimatedCost: string
  impactedOrgs: string[]
}

export interface MeetingContract {
  purpose: string
  requiredOutput: string
  decisionOwner: string
  requiredAttendees: string[]
  summaryRecipients: string[]
  preRead: string[]
  timeLimit: string
  successCriteria: string
  followUpDestination: string
  agentCoverage: string
  sensitivityLevel: 'Standard' | 'Confidential' | 'Restricted'
}

export interface OrgCard {
  id: string
  orgName: string
  mission: string
  strategicPriorities: string[]
  ownedMetrics: string[]
  decisionRights: string[]
  criticalInputs: string[]
  criticalOutputs: string[]
  dependencies: string[]
  commonBlockers: string[]
  activeInitiatives: string[]
  escalationRules: string[]
  agentInstructions: string[]
  meetingsToAttend: {
    requiredLive: string[]
    agentCanCover: string[]
    summaryOnly: string[]
    notRelevant: string[]
  }
}

export type AgentType =
  | 'Individual Agent'
  | 'Team Agent'
  | 'Program Agent'
  | 'Executive Agent'

export type AgentMode =
  | 'Listen Mode'
  | 'Represent Mode'
  | 'Proxy Mode'
  | 'Escalation Mode'

export interface Agent {
  id: string
  name: string
  agentType: AgentType
  representing: string
  mode: AgentMode
  authorityBoundary: string
  captures: string[]
  escalatesWhen: string[]
  summaryFormat: string
  allowedMeetings: { meeting: string; coverage: string }[]
}

export type DecisionStatus =
  | 'Approved'
  | 'Rejected'
  | 'Revised'
  | 'Deferred'
  | 'Open'

export interface Decision {
  id: string
  statement: string
  owner: string
  status: DecisionStatus
  age: string
  rationale: string
  impactedOrgs: string[]
}

export type ActionStatus = 'Not started' | 'In progress' | 'Blocked' | 'Complete'

export interface ActionItem {
  id: string
  action: string
  owner: string
  relatedOrg: string
  dueDate: string
  status: ActionStatus
}

export type DependencyStatus = 'Open' | 'At risk' | 'Resolved' | 'Blocked'

export interface Dependency {
  id: string
  requestingOrg: string
  providingOrg: string
  dependencyType: string
  description: string
  status: DependencyStatus
  timeOpen: string
  businessImpact: string
}

export type RiskSeverity = 'Low' | 'Moderate' | 'High' | 'Severe'

export interface Risk {
  id: string
  risk: string
  severity: RiskSeverity
  owner: string
  impactedOrgs: string[]
  mitigation: string
}

/** Left-rail navigation identity for the internal view router. */
export type ViewId =
  | 'today'
  | 'calendar'
  | 'build'
  | 'org-cards'
  | 'decision-room'
  | 'agents'
  | 'capture'
  | 'work-map'
  | 'review'
