/**
 * MeetingOS type spine.
 *
 * These model the domain as *governed work objects*, not calendar events.
 * Everything here is frontend-only. No persistence, no backend contracts.
 */

export type MeetingState =
  | 'ASYNC RECOMMENDED'
  | 'DECISION READY'
  | 'AUTHORIZATION AVAILABLE'
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
  | 'Authorized to observe'
  | 'Authorized summary-only'
  | 'Human required, agent may observe'
  | 'Human required'
  | 'Delegation blocked'
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

/**
 * Governed delegation: agents do not cover by default. An AgentAuthorization
 * records the consented, bounded, auditable authority for an agent to cover a
 * specific meeting — supported by receipts and relationship scorecards.
 */
export type AuthorizationStatus =
  | 'authorized'
  | 'blocked'
  | 'human_required'
  | 'observe_only'
  | 'summary_only'

export type DelegationScope =
  | 'observe'
  | 'summarize'
  | 'represent_context'
  | 'answer_from_approved_knowledge'
  | 'escalate_only'
  | 'none'

export type AgentRiskLevel = 'low' | 'medium' | 'high' | 'restricted'

export interface AgentAuthorization {
  id: string
  meetingId: string
  agentId: string
  representedPerson: string
  representedOrg: string
  requestedBy: string
  authorizationStatus: AuthorizationStatus
  delegationScope: DelegationScope
  authorityBoundary: string
  riskLevel: AgentRiskLevel
  consentCaptured: boolean
  supportingScorecardId: string
  escalationRule: string
  receiptId: string
  /** Display helpers (frontend-only). */
  meetingTitle?: string
  reason?: string
  receiptDescription?: string
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

// ---------------------------------------------------------------------------
// True Operational Graph — the three-layer measured model
//   Receipts → Relationship Scorecards → True Operational Graph
// ---------------------------------------------------------------------------

export type ReceiptSource =
  | 'meeting_builder'
  | 'attendee_view'
  | 'decision_room'
  | 'agent_layer'
  | 'closeout'

/** Layer 1 — a single factual, auditable operating event. */
export interface EventReceipt {
  id: string
  timestamp: string
  source: ReceiptSource
  eventType: string
  actor: string
  actorOrg: string
  targetOrg: string
  meetingId: string
  decisionType: string
  workflowType: string
  description: string
  elapsedTime: string
  evidenceLabel: string
}

export type HealthState = 'healthy' | 'slow' | 'escalated' | 'missing' | 'improving'

/** Layer 2 — the aggregated bank-statement view of one cross-org relationship. */
export interface RelationshipScorecard {
  id: string
  sourceOrg: string
  targetOrg: string
  relationshipLabel: string
  decisionType: string
  workflowType: string
  period: string
  eventCount: number
  meetingCount: number
  jointHours: number
  averageResolutionTime: string
  medianResolutionTime: string
  asyncResolutionRate: string
  liveEscalationRate: string
  decisionDeferralRate: string
  reopenRate: string
  unresolvedDependencyCount: number
  averageDependencyAge: string
  agentCoverableHours: number
  topRepeatTopics: string[]
  recommendedIntervention: string
  healthState: HealthState
  evidenceReceiptIds: string[]
}

/** The claimed model — what Org Cards and leadership say the relationship is. */
export interface ClaimedRelationship {
  id: string
  sourceOrg: string
  targetOrg: string
  relationshipLabel: string
  claimedDependency: string
  claimedDecisionRight: string
  expectedWorkflow: string
  expectedEscalationPath: string
  expectedAgentUse: string
  confidence: 'High' | 'Medium' | 'Low'
}

/**
 * Attendee View — attendee-validated facts (the counterpart to the organizer's
 * declared facts from the Meeting Builder). Lightweight preview of the receipt
 * an attendee response would create.
 */
export interface AttendeeReceiptPreview {
  id: string
  meetingId: string
  attendee: string
  attendeeOrg: string
  assignedRole: string
  selectedAction: string
  reason?: string
  agentSelection?: string
  receiptEventType: string
  receiptDescription: string
  timestamp: string
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
  // Reached via "Review invite" links, not shown in the left rail.
  | 'attendee'
