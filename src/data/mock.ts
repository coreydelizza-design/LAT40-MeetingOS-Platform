import type {
  Meeting,
  MeetingContract,
  OrgCard,
  Agent,
  Decision,
  ActionItem,
  Dependency,
  Risk,
} from '../types'

/**
 * Frontend-only mock data for MeetingOS.
 * Realistic executive scenarios — no backend, no persistence.
 */

export const ORGS = [
  'Revenue Operations',
  'Product',
  'Finance',
  'Legal',
  'Security',
  'Customer Success',
] as const

// ---------------------------------------------------------------------------
// Meetings — the day's live time as governed work objects
// ---------------------------------------------------------------------------

export const MEETINGS: Meeting[] = [
  {
    id: 'mtg-status-sync',
    title: 'Weekly Status Sync',
    time: '9:00',
    duration: '30 min',
    meetingType: 'Status update',
    state: 'ASYNC RECOMMENDED',
    purpose: 'Circulate weekly execution status across functions.',
    requiredOutput: 'Written update',
    attendeeRole: 'Optional Reviewer',
    agentEligibility: 'Agent recommended',
    meetingValue: 'Low',
    readinessScore: 41,
    necessityScore: 28,
    estimatedCost: '9 attendee-hours / week',
    impactedOrgs: ['Revenue Operations', 'Product', 'Customer Success'],
  },
  {
    id: 'mtg-pricing-exception',
    title: 'Pricing Exception Review',
    time: '10:00',
    duration: '25 min',
    meetingType: 'Decision',
    state: 'DECISION READY',
    purpose: 'Rule on a non-standard customer pricing exception.',
    requiredOutput: 'Approve, reject, or revise exception',
    attendeeRole: 'Required Contributor',
    agentEligibility: 'Human required, agent observes',
    meetingValue: 'High',
    readinessScore: 88,
    necessityScore: 92,
    estimatedCost: '4 attendee-hours',
    impactedOrgs: ['Revenue Operations', 'Finance', 'Legal', 'Product'],
  },
  {
    id: 'mtg-launch-checkpoint',
    title: 'Product Launch Checkpoint',
    time: '11:30',
    duration: '30 min',
    meetingType: 'Cross-functional update',
    state: 'AGENT CAN COVER',
    purpose: 'Confirm launch readiness across dependent functions.',
    requiredOutput: 'Risk and dependency summary',
    attendeeRole: 'Informed Only',
    agentEligibility: 'Agent can attend',
    meetingValue: 'Medium',
    readinessScore: 64,
    necessityScore: 55,
    estimatedCost: '6 attendee-hours',
    impactedOrgs: ['Product', 'Security', 'Customer Success'],
  },
  {
    id: 'mtg-focus-block',
    title: 'Protected Focus Block',
    time: '1:00',
    duration: '2 hr',
    meetingType: 'Focus time',
    state: 'FOCUS PROTECTED',
    purpose: 'Protected deep work — no meeting encroachment.',
    requiredOutput: 'Deep work',
    attendeeRole: 'N/A',
    agentEligibility: 'N/A',
    meetingValue: 'Protected',
    readinessScore: 100,
    necessityScore: 100,
    estimatedCost: 'Protected',
    impactedOrgs: [],
  },
  {
    id: 'mtg-escalation-room',
    title: 'Customer Escalation Room',
    time: '3:00',
    duration: '45 min',
    meetingType: 'Escalation',
    state: 'LIVE REQUIRED',
    purpose: 'Resolve an active customer escalation with mitigation.',
    requiredOutput: 'Mitigation decision',
    attendeeRole: 'Required Contributor',
    agentEligibility: 'Human required',
    meetingValue: 'Critical',
    readinessScore: 79,
    necessityScore: 96,
    estimatedCost: '5 attendee-hours',
    impactedOrgs: ['Customer Success', 'Product', 'Legal'],
  },
]

// ---------------------------------------------------------------------------
// Meeting Contract — the boardroom-quality decision object
// ---------------------------------------------------------------------------

export const PRICING_CONTRACT: MeetingContract = {
  purpose: 'Rule on the requested customer pricing exception before quarter close.',
  requiredOutput: 'A recorded decision: approve, reject, or revise the exception.',
  decisionOwner: 'VP, Revenue Operations',
  requiredAttendees: [
    'VP Revenue Operations (Decision Owner)',
    'Finance Controller (Approver)',
    'Legal Counsel (Approver)',
    'Product Delivery Lead (Required Contributor)',
  ],
  summaryRecipients: [
    'CRO',
    'CFO',
    'Deal Desk',
    'Customer Success Lead',
    'Account Executive',
    'Revenue Operations Agent',
  ],
  preRead: [
    'Margin model (current vs. proposed)',
    'Contract redline',
    'Customer timeline',
  ],
  timeLimit: '25 minutes',
  successCriteria:
    'A recorded decision with owner, rationale, and follow-up destination. No open Legal condition at close.',
  followUpDestination: 'Structured Capture → Deal Desk workflow',
  agentCoverage: 'Revenue Operations Agent observes and captures; cannot approve.',
  sensitivityLevel: 'Confidential',
}

// ---------------------------------------------------------------------------
// Org Cards — operating profiles, not directory entries
// ---------------------------------------------------------------------------

export const ORG_CARDS: OrgCard[] = [
  {
    id: 'org-revops',
    orgName: 'Revenue Operations',
    mission:
      'Improve revenue execution, forecast confidence, pipeline hygiene, and sales operating discipline.',
    strategicPriorities: [
      'Improve forecast accuracy',
      'Increase pipeline quality',
      'Reduce approval friction',
      'Standardize operating reviews',
    ],
    ownedMetrics: [
      'Forecast accuracy',
      'Pipeline coverage ratio',
      'Approval cycle time',
      'CRM data completeness',
    ],
    decisionRights: [
      'Sales process recommendations',
      'Pipeline reporting standards',
      'CRM hygiene policy',
      'Forecast governance rules',
    ],
    criticalInputs: [
      'Finance margin thresholds',
      'Product roadmap commitments',
      'Deal Desk exception queue',
    ],
    criticalOutputs: [
      'Weekly forecast call',
      'Pipeline hygiene standard',
      'Approved exception log',
    ],
    dependencies: [
      'Finance for margin approval',
      'Legal for contract context',
      'Product for delivery commitments',
    ],
    commonBlockers: [
      'Late margin approvals',
      'Unowned forecast risk',
      'Inconsistent CRM entry',
    ],
    activeInitiatives: [
      'Forecast confidence program',
      'Approval friction reduction',
      'Operating review standardization',
    ],
    escalationRules: [
      'Escalate unresolved forecast risk to CRO',
      'Escalate approval delays over 48 hours',
    ],
    agentInstructions: [
      'Capture forecast risk',
      'Capture pipeline blockers',
      'Capture CRM process gaps',
      'Capture sales leadership decisions',
      'Escalate unresolved forecast risk',
      'Ignore general commentary not tied to revenue execution',
    ],
    meetingsToAttend: {
      requiredLive: ['Pricing Exception Review', 'Customer Escalation Room'],
      agentCanCover: ['Product Launch Checkpoint'],
      summaryOnly: ['Weekly Status Sync'],
      notRelevant: ['Security incident standups'],
    },
  },
  {
    id: 'org-product',
    orgName: 'Product',
    mission:
      'Deliver roadmap commitments that move adoption, retention, and launch readiness.',
    strategicPriorities: [
      'Protect launch quality',
      'Reduce delivery risk',
      'Sequence roadmap against revenue need',
    ],
    ownedMetrics: ['Launch readiness', 'Delivery predictability', 'Adoption'],
    decisionRights: [
      'Roadmap sequencing',
      'Launch go / no-go recommendation',
      'Feature scope',
    ],
    criticalInputs: ['Security clearance', 'Customer escalations', 'Revenue need'],
    criticalOutputs: ['Launch readiness summary', 'Delivery commitments'],
    dependencies: ['Security for release clearance', 'Customer Success for demand signal'],
    commonBlockers: ['Late security clearance', 'Scope churn', 'Unclear revenue priority'],
    activeInitiatives: ['Launch readiness program', 'Delivery predictability initiative'],
    escalationRules: ['Escalate blocked release clearance', 'Escalate at-risk launch dates'],
    agentInstructions: [
      'Capture delivery risk',
      'Capture launch dependencies',
      'Escalate release-blocking issues',
      'Ignore commentary unrelated to delivery',
    ],
    meetingsToAttend: {
      requiredLive: ['Product Launch Checkpoint', 'Customer Escalation Room'],
      agentCanCover: ['Weekly Status Sync'],
      summaryOnly: ['Pricing Exception Review'],
      notRelevant: [],
    },
  },
  {
    id: 'org-finance',
    orgName: 'Finance',
    mission: 'Protect margin, ensure forecast integrity, and govern financial exceptions.',
    strategicPriorities: ['Protect margin', 'Forecast integrity', 'Exception discipline'],
    ownedMetrics: ['Gross margin', 'Forecast variance', 'Exception volume'],
    decisionRights: ['Margin thresholds', 'Financial exception approval', 'Revenue recognition'],
    criticalInputs: ['Deal terms', 'Pricing exceptions', 'Delivery timelines'],
    criticalOutputs: ['Margin ruling', 'Approved exception threshold'],
    dependencies: ['Revenue Operations for deal context', 'Legal for contract terms'],
    commonBlockers: ['Incomplete deal data', 'Late exception requests'],
    activeInitiatives: ['Margin governance program', 'Exception standardization'],
    escalationRules: ['Escalate margin below floor to CFO', 'Escalate repeated exceptions'],
    agentInstructions: [
      'Capture margin risk',
      'Capture exception decisions',
      'Escalate sub-floor margin',
      'Ignore non-financial commentary',
    ],
    meetingsToAttend: {
      requiredLive: ['Pricing Exception Review'],
      agentCanCover: [],
      summaryOnly: ['Product Launch Checkpoint', 'Weekly Status Sync'],
      notRelevant: [],
    },
  },
  {
    id: 'org-legal',
    orgName: 'Legal',
    mission: 'Govern contractual risk and precedent across revenue and delivery.',
    strategicPriorities: ['Limit precedent risk', 'Protect contract terms', 'Speed safe approvals'],
    ownedMetrics: ['Contract risk exposure', 'Precedent incidents', 'Review turnaround'],
    decisionRights: ['Contract language', 'Precedent risk ruling', 'Exception conditions'],
    criticalInputs: ['Deal context', 'Pricing exceptions', 'Customer escalations'],
    criticalOutputs: ['Approved contract language', 'Precedent ruling'],
    dependencies: ['Sales for contract context', 'Revenue Operations for deal intent'],
    commonBlockers: ['Missing deal context', 'Last-minute redlines'],
    activeInitiatives: ['Precedent risk register', 'Standard exception language'],
    escalationRules: ['Escalate novel precedent', 'Escalate unresolved condition at close'],
    agentInstructions: [
      'Capture contract conditions',
      'Capture precedent risk',
      'Escalate unresolved conditions',
      'Ignore non-contractual commentary',
    ],
    meetingsToAttend: {
      requiredLive: ['Pricing Exception Review', 'Customer Escalation Room'],
      agentCanCover: [],
      summaryOnly: ['Weekly Status Sync'],
      notRelevant: ['Product Launch Checkpoint'],
    },
  },
  {
    id: 'org-security',
    orgName: 'Security',
    mission: 'Clear releases and protect the organization from operational and data risk.',
    strategicPriorities: ['Release safety', 'Incident readiness', 'Risk transparency'],
    ownedMetrics: ['Release clearance time', 'Open vulnerabilities', 'Incident response time'],
    decisionRights: ['Release clearance', 'Security exception approval', 'Incident severity'],
    criticalInputs: ['Release scope', 'Threat signal', 'Vendor posture'],
    criticalOutputs: ['Release clearance ruling', 'Risk advisory'],
    dependencies: ['Product for release scope'],
    commonBlockers: ['Late scope changes', 'Unowned vulnerabilities'],
    activeInitiatives: ['Release clearance SLA', 'Vulnerability ownership program'],
    escalationRules: ['Escalate release-blocking risk', 'Escalate critical incident'],
    agentInstructions: [
      'Capture clearance blockers',
      'Capture critical risk',
      'Escalate release-blocking issues',
      'Ignore non-security commentary',
    ],
    meetingsToAttend: {
      requiredLive: ['Product Launch Checkpoint'],
      agentCanCover: [],
      summaryOnly: ['Weekly Status Sync'],
      notRelevant: ['Pricing Exception Review'],
    },
  },
  {
    id: 'org-cs',
    orgName: 'Customer Success',
    mission: 'Protect retention and translate customer reality into internal action.',
    strategicPriorities: ['Protect retention', 'Speed escalation resolution', 'Signal demand'],
    ownedMetrics: ['Net retention', 'Escalation resolution time', 'Health score coverage'],
    decisionRights: ['Escalation severity', 'Save-plan recommendation', 'Renewal risk flag'],
    criticalInputs: ['Product roadmap commitments', 'Delivery timelines', 'Pricing outcomes'],
    criticalOutputs: ['Escalation summary', 'Retention risk signal'],
    dependencies: ['Product for roadmap commitments', 'Revenue Operations for pricing outcomes'],
    commonBlockers: ['Unclear roadmap commitments', 'Slow cross-functional response'],
    activeInitiatives: ['Escalation response program', 'Retention early-warning system'],
    escalationRules: ['Escalate at-risk strategic accounts', 'Escalate unresolved escalations over 48h'],
    agentInstructions: [
      'Capture retention risk',
      'Capture escalation status',
      'Escalate strategic-account risk',
      'Ignore non-customer commentary',
    ],
    meetingsToAttend: {
      requiredLive: ['Customer Escalation Room'],
      agentCanCover: ['Product Launch Checkpoint'],
      summaryOnly: ['Weekly Status Sync', 'Pricing Exception Review'],
      notRelevant: [],
    },
  },
]

// ---------------------------------------------------------------------------
// Agents — a governed representation layer
// ---------------------------------------------------------------------------

export const AGENTS: Agent[] = [
  {
    id: 'agent-revops',
    name: 'Revenue Operations Agent',
    agentType: 'Team Agent',
    representing: 'Revenue Operations',
    mode: 'Listen Mode',
    authorityBoundary:
      'Cannot approve, commit, negotiate, or represent opinion as policy.',
    captures: [
      'Forecast risk',
      'Pipeline blockers',
      'CRM gaps',
      'Sales leadership decisions',
    ],
    escalatesWhen: [
      'Forecast risk is unresolved',
      'Dependency blocks reporting',
      'Decision is delayed',
    ],
    summaryFormat: 'Decisions, risks, actions, dependencies',
    allowedMeetings: [
      { meeting: 'Product Launch Checkpoint', coverage: 'Agent can cover' },
      { meeting: 'Weekly Status Sync', coverage: 'Agent recommended' },
      { meeting: 'Pricing Exception Review', coverage: 'Human required, agent observes' },
      { meeting: 'Customer Escalation Room', coverage: 'Human required' },
    ],
  },
  {
    id: 'agent-product',
    name: 'Product Program Agent',
    agentType: 'Program Agent',
    representing: 'Product',
    mode: 'Represent Mode',
    authorityBoundary: 'Captures approved delivery status; cannot commit dates.',
    captures: ['Delivery risk', 'Launch dependencies', 'Scope changes'],
    escalatesWhen: ['Release clearance blocked', 'Launch date at risk'],
    summaryFormat: 'Decisions, risks, dependencies',
    allowedMeetings: [
      { meeting: 'Product Launch Checkpoint', coverage: 'Agent can cover' },
      { meeting: 'Weekly Status Sync', coverage: 'Agent recommended' },
    ],
  },
  {
    id: 'agent-exec',
    name: 'Executive Coverage Agent',
    agentType: 'Executive Agent',
    representing: 'Office of the CRO',
    mode: 'Escalation Mode',
    authorityBoundary: 'Observes on behalf of leadership; escalates, never decides.',
    captures: ['Cross-org decisions', 'Unowned risk', 'Approval bottlenecks'],
    escalatesWhen: ['Decision lacks an owner', 'Bottleneck exceeds threshold'],
    summaryFormat: 'Executive brief: decisions, risk, escalations',
    allowedMeetings: [
      { meeting: 'Pricing Exception Review', coverage: 'Human required, agent observes' },
      { meeting: 'Customer Escalation Room', coverage: 'Human required' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Structured Capture — the evidence ledger
// ---------------------------------------------------------------------------

export const DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    statement: 'Pricing exception revised with Finance margin condition.',
    owner: 'VP, Revenue Operations',
    status: 'Revised',
    age: 'Today',
    rationale:
      'Approved at revised margin floor; Legal condition on contract language to follow.',
    impactedOrgs: ['Revenue Operations', 'Finance', 'Legal'],
  },
  {
    id: 'dec-2',
    statement: 'Product launch proceeds pending Security release clearance.',
    owner: 'Product Delivery Lead',
    status: 'Deferred',
    age: '2 days',
    rationale: 'Go decision deferred until Security clears the release scope.',
    impactedOrgs: ['Product', 'Security'],
  },
  {
    id: 'dec-3',
    statement: 'Weekly Status Sync converted to async written update.',
    owner: 'Chief of Staff',
    status: 'Approved',
    age: '5 days',
    rationale: 'No decisions produced in 6 weeks; live time not justified.',
    impactedOrgs: ['Revenue Operations', 'Product', 'Customer Success'],
  },
]

export const ACTIONS: ActionItem[] = [
  {
    id: 'act-1',
    action: 'Legal to update exception language.',
    owner: 'Legal Counsel',
    relatedOrg: 'Legal',
    dueDate: 'Fri, Jul 10',
    status: 'In progress',
  },
  {
    id: 'act-2',
    action: 'Finance to confirm revised margin floor in Deal Desk.',
    owner: 'Finance Controller',
    relatedOrg: 'Finance',
    dueDate: 'Wed, Jul 8',
    status: 'Not started',
  },
  {
    id: 'act-3',
    action: 'Security to return release clearance decision.',
    owner: 'Security Lead',
    relatedOrg: 'Security',
    dueDate: 'Thu, Jul 9',
    status: 'Blocked',
  },
]

export const DEPENDENCIES: Dependency[] = [
  {
    id: 'dep-1',
    requestingOrg: 'Revenue Operations',
    providingOrg: 'Finance',
    dependencyType: 'Approval',
    description: 'Sales depends on Finance for margin approval.',
    status: 'At risk',
    timeOpen: '3 days',
    businessImpact: 'Blocks quarter-close exception ruling.',
  },
  {
    id: 'dep-2',
    requestingOrg: 'Product',
    providingOrg: 'Security',
    dependencyType: 'Clearance',
    description: 'Product depends on Security for release clearance.',
    status: 'Blocked',
    timeOpen: '6 days',
    businessImpact: 'Launch date at risk.',
  },
  {
    id: 'dep-3',
    requestingOrg: 'Customer Success',
    providingOrg: 'Product',
    dependencyType: 'Commitment',
    description: 'Customer Success depends on Product for roadmap commitments.',
    status: 'Open',
    timeOpen: '9 days',
    businessImpact: 'Retention conversations stalled on two strategic accounts.',
  },
  {
    id: 'dep-4',
    requestingOrg: 'Legal',
    providingOrg: 'Revenue Operations',
    dependencyType: 'Context',
    description: 'Legal depends on Sales for contract context.',
    status: 'Open',
    timeOpen: '1 day',
    businessImpact: 'Slows exception language finalization.',
  },
]

export const RISKS: Risk[] = [
  {
    id: 'risk-1',
    risk: 'Customer escalation risk if approval exceeds 48 hours.',
    severity: 'High',
    owner: 'Customer Success Lead',
    impactedOrgs: ['Customer Success', 'Revenue Operations'],
    mitigation: 'Expedited exception ruling; interim customer commitment.',
  },
  {
    id: 'risk-2',
    risk: 'Margin exposure below floor on precedent exceptions.',
    severity: 'Moderate',
    owner: 'Finance Controller',
    impactedOrgs: ['Finance'],
    mitigation: 'Revised margin condition attached to approval.',
  },
  {
    id: 'risk-3',
    risk: 'Contract precedent risk from non-standard language.',
    severity: 'High',
    owner: 'Legal Counsel',
    impactedOrgs: ['Legal', 'Revenue Operations'],
    mitigation: 'Standardized exception clause; precedent register entry.',
  },
]

/** Org-specific summaries generated from the same meeting — different by context. */
export const ORG_SUMMARIES: { org: string; lines: string[] }[] = [
  {
    org: 'Revenue Operations',
    lines: [
      'Decision: exception revised with margin condition — owner assigned.',
      'Risk: forecast exposure if approval slips past 48 hours.',
      'Dependency: Finance margin approval still at risk.',
      'Follow-up: log approved exception in Deal Desk.',
    ],
  },
  {
    org: 'Finance',
    lines: [
      'Decision: revised margin floor accepted as condition of approval.',
      'Risk: margin exposure on precedent exceptions.',
      'Action: confirm revised floor in Deal Desk by Wed.',
    ],
  },
  {
    org: 'Legal',
    lines: [
      'Decision: approval conditional on contract language change.',
      'Risk: precedent risk from non-standard terms.',
      'Action: update exception language by Fri.',
    ],
  },
  {
    org: 'Product',
    lines: [
      'Note: no delivery impact if approved this week.',
      'Dependency: awaiting Security release clearance (separate track).',
    ],
  },
  {
    org: 'Customer Success',
    lines: [
      'Risk: escalation risk if approval exceeds 48 hours.',
      'Action: hold interim commitment with customer.',
    ],
  },
]

// ---------------------------------------------------------------------------
// Executive Review / Work Map aggregates (mock, pre-computed)
// ---------------------------------------------------------------------------

export const LIVE_TIME_GOVERNANCE = [
  { label: 'Total live meeting hours', value: '186 hrs / wk' },
  { label: 'Recoverable time', value: '52 hrs / wk' },
  { label: 'Meetings converted to async', value: '11' },
  { label: 'Agent-covered meetings', value: '8' },
  { label: 'Protected focus time', value: '24 hrs / wk' },
]

export const DECISION_VELOCITY = [
  { label: 'Decisions made', value: '34' },
  { label: 'Decisions deferred', value: '9' },
  { label: 'Oldest unresolved decision', value: '19 days' },
  { label: 'Decisions without owner', value: '4' },
  { label: 'Reopened decisions', value: '3' },
]

export const ORG_FRICTION = [
  { label: 'Top repeated blocker', value: 'Late margin approvals' },
  { label: 'Approval bottleneck', value: 'Finance exception queue' },
  { label: 'Highest dependency load', value: 'Product (5 open)' },
  { label: 'Recurring topic, unresolved', value: 'Release clearance SLA' },
]

export const AGENT_LEVERAGE = [
  { label: 'Meetings safely covered by agents', value: '8' },
  { label: 'Human-required meetings', value: '17' },
  { label: 'Summaries generated', value: '41' },
  { label: 'Escalations triggered', value: '6' },
  { label: 'Avoided attendance hours', value: '63 hrs / wk' },
]

export const ORG_LOAD = [
  { org: 'Revenue Operations', meetingHours: '22', decisionsOwned: '8', openDeps: '3', risks: '2', observerBurden: 'Medium' },
  { org: 'Product', meetingHours: '19', decisionsOwned: '6', openDeps: '5', risks: '3', observerBurden: 'High' },
  { org: 'Finance', meetingHours: '11', decisionsOwned: '5', openDeps: '1', risks: '1', observerBurden: 'Low' },
  { org: 'Legal', meetingHours: '9', decisionsOwned: '3', openDeps: '2', risks: '2', observerBurden: 'Low' },
  { org: 'Security', meetingHours: '7', decisionsOwned: '2', openDeps: '1', risks: '1', observerBurden: 'Low' },
  { org: 'Customer Success', meetingHours: '14', decisionsOwned: '4', openDeps: '2', risks: '1', observerBurden: 'Medium' },
]

export const MEETING_DEBT = [
  'Recurring meetings with no recent decisions — 7',
  'Meetings with too many observers — 12',
  'Meetings missing an agenda — 9',
  'Meetings that should be async — 6',
  'High-cost meetings with low output — 4',
]

export const INTERVENTIONS = [
  'Convert Weekly Status Sync to an async workflow.',
  'Require a decision owner for all pricing reviews.',
  'Move Legal observers to summary-only unless contract risk is present.',
  'Create an approval workflow for pricing exceptions.',
  'Audit all recurring meetings older than 90 days.',
]

export const EXEC_INTERVENTIONS = [
  'Cancel or convert low-value recurring meetings.',
  'Require meeting contracts for decision meetings.',
  'Require decision owner before scheduling pricing reviews.',
  'Move observer-heavy meetings to summary-first.',
  'Assign dependency owners for Finance, Legal, and Product bottlenecks.',
]
