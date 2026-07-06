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

// ---------------------------------------------------------------------------
// Executive Alignment Room (Today) — the employee-facing operating brief
// ---------------------------------------------------------------------------

export const TODAY_OPENING =
  'Your calendar contains 6 live events. 2 require your judgment, 2 can be agent-covered, and 1 meeting lacks a defined outcome.'

export const ALIGNMENT_SUMMARY: {
  label: string
  figure: string
  unit?: string
  foot: string
}[] = [
  { label: 'Live Required', figure: '2', foot: 'meetings require human judgment' },
  { label: 'Agent Coverage', figure: '2', foot: 'meetings can be covered by agent' },
  { label: 'Decisions Pending', figure: '3', foot: 'decisions need input or ownership' },
  { label: 'Structure Needed', figure: '1', foot: 'meeting lacks a defined outcome' },
  { label: 'Recoverable Time', figure: '90', unit: 'min', foot: 'may be reclaimed today' },
]

export const JUDGMENT_MEETINGS: {
  title: string
  judgment: string
  role: string
  action: string
  impact: string
}[] = [
  {
    title: 'Pricing Exception Review',
    judgment: 'Decision ready',
    role: 'Required Contributor',
    action: 'Attend live',
    impact: '25 min · high value',
  },
  {
    title: 'Product Launch Checkpoint',
    judgment: 'Agent can cover',
    role: 'Informed only',
    action: 'Send org agent',
    impact: 'Recover 30 min',
  },
  {
    title: 'Weekly Status Sync',
    judgment: 'Async recommended',
    role: 'Optional Reviewer',
    action: 'Convert or decline',
    impact: 'Recover 30 min',
  },
  {
    title: 'Customer Escalation Room',
    judgment: 'Live required',
    role: 'Required Contributor',
    action: 'Attend with prep',
    impact: '45 min · critical',
  },
  {
    title: 'Forecast Review',
    judgment: 'Structure needed',
    role: 'Decision Input',
    action: 'Add decision owner',
    impact: '30 min · unscheduled',
  },
]

export const MY_ROLE_TODAY: { role: string; where: string }[] = [
  { role: 'Required Contributor', where: 'Pricing Exception Review' },
  { role: 'Summary Recipient', where: 'Product Launch Checkpoint' },
  { role: 'Decision Input', where: 'Forecast Review' },
  { role: 'Action Owner', where: 'Legal follow-up' },
  { role: 'Agent Observer', where: 'Weekly Status Sync' },
]

export const ORG_IMPACT = {
  org: 'Revenue Operations',
  signals: [
    'Forecast risk mentioned in 2 meetings',
    'Finance dependency remains unresolved',
    'CRM hygiene issue repeated across 3 prior meetings',
    'Sales leadership decision pending by Friday',
  ],
  otherOrgs: ['Product', 'Legal', 'Finance', 'Security', 'Customer Success'],
}

export const AGENT_COVERAGE_TODAY: { meeting: string; coverage: string }[] = [
  { meeting: 'Product Launch Checkpoint', coverage: 'Team agent can attend' },
  { meeting: 'Weekly Status Sync', coverage: 'Agent recommended' },
  { meeting: 'Pricing Exception Review', coverage: 'Human required; agent observes' },
  { meeting: 'Customer Escalation Room', coverage: 'Human required' },
]

export const DECISION_QUEUE: {
  decision: string
  owner: string
  status: string
  need: string
}[] = [
  {
    decision: 'Pricing exception',
    owner: 'Finance owner',
    status: 'Open',
    need: 'Margin condition needed',
  },
  {
    decision: 'Launch readiness',
    owner: 'Product owner',
    status: 'Pending',
    need: 'Security clearance needed',
  },
  {
    decision: 'Customer escalation path',
    owner: 'Customer Success owner',
    status: 'Escalated',
    need: 'Mitigation owner needed',
  },
]

export const FRICTION_SIGNALS: string[] = [
  'Pricing approvals have appeared in 4 meetings without closure.',
  'Legal review is being introduced late in customer workflows.',
  'Product is carrying 3 unresolved roadmap dependencies.',
  'Two recurring meetings have produced no decisions this month.',
]

export const TODAY_MODERATOR: string[] = [
  'Start with the meetings requiring judgment.',
  'Send your agent where you are informed-only.',
  'Do not enter decision meetings without a pre-read.',
  'Protect focus time unless escalation is live-required.',
  'Resolve one open dependency before scheduling a follow-up.',
]

// ===========================================================================
// True Operational Graph — Receipts → Scorecards → Graph
// All frontend-only, hand-authored. No instrumentation, no backend.
// ===========================================================================

import type {
  EventReceipt,
  RelationshipScorecard,
  ClaimedRelationship,
} from '../types'

// --- Layer 1: Event Receipts (the factual log) -----------------------------

export const EVENT_RECEIPTS: EventReceipt[] = [
  // Sales ↔ Legal — Contract Exceptions (the 10-step trail)
  {
    id: 'r-sl-1',
    timestamp: '2026-06-12 09:02',
    source: 'meeting_builder',
    eventType: 'intent_selected',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Intent selected: Approve a request.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Intent',
  },
  {
    id: 'r-sl-2',
    timestamp: '2026-06-12 09:03',
    source: 'meeting_builder',
    eventType: 'required_output_selected',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Required output selected: Approval.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Output',
  },
  {
    id: 'r-sl-3',
    timestamp: '2026-06-12 09:05',
    source: 'meeting_builder',
    eventType: 'decision_owner_assigned',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Decision owner assigned: Legal Counsel.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Owner',
  },
  {
    id: 'r-sl-4',
    timestamp: '2026-06-12 09:06',
    source: 'meeting_builder',
    eventType: 'async_recommended',
    actor: 'System',
    actorOrg: 'MeetingOS',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Async review',
    description: 'Async recommendation shown: exception eligible for async review.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Judgment',
  },
  {
    id: 'r-sl-5',
    timestamp: '2026-06-12 09:08',
    source: 'meeting_builder',
    eventType: 'async_overridden',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Async recommendation overridden; live review requested.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Override',
  },
  {
    id: 'r-sl-6',
    timestamp: '2026-06-12 09:09',
    source: 'meeting_builder',
    eventType: 'override_reason_submitted',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Override reason submitted: customer signature deadline.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Override reason',
  },
  {
    id: 'r-sl-7',
    timestamp: '2026-06-12 14:20',
    source: 'attendee_view',
    eventType: 'role_challenged',
    actor: 'M. Okafor',
    actorOrg: 'Legal',
    targetOrg: 'Sales',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Attendee role challenged: two observers moved to summary.',
    elapsedTime: '—',
    evidenceLabel: 'Attendee · Role',
  },
  {
    id: 'r-sl-8',
    timestamp: '2026-06-12 14:22',
    source: 'attendee_view',
    eventType: 'preread_requested',
    actor: 'M. Okafor',
    actorOrg: 'Legal',
    targetOrg: 'Sales',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Pre-read requested before live review.',
    elapsedTime: '—',
    evidenceLabel: 'Attendee · Pre-read',
  },
  {
    id: 'r-sl-9',
    timestamp: '2026-06-15 10:40',
    source: 'decision_room',
    eventType: 'decision_deferred',
    actor: 'Legal Counsel',
    actorOrg: 'Legal',
    targetOrg: 'Sales',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Decision deferred pending indemnity language.',
    elapsedTime: '3.1 days',
    evidenceLabel: 'Decision Room · Deferral',
  },
  {
    id: 'r-sl-10',
    timestamp: '2026-06-16 16:05',
    source: 'closeout',
    eventType: 'followup_created',
    actor: 'A. Reyes',
    actorOrg: 'Sales',
    targetOrg: 'Legal',
    meetingId: 'CE-0412',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    description: 'Follow-up created: Legal to revise indemnity clause.',
    elapsedTime: '4.1 days',
    evidenceLabel: 'Close-out · Follow-up',
  },

  // Sales ↔ Engineering — Customer Feasibility (healthy async trail)
  {
    id: 'r-se-1',
    timestamp: '2026-06-05 11:00',
    source: 'meeting_builder',
    eventType: 'async_recommended',
    actor: 'System',
    actorOrg: 'MeetingOS',
    targetOrg: 'Engineering',
    meetingId: 'CF-0605',
    decisionType: 'Feasibility',
    workflowType: 'Async-first review',
    description: 'Async feasibility review recommended and accepted.',
    elapsedTime: '—',
    evidenceLabel: 'Builder · Judgment',
  },
  {
    id: 'r-se-2',
    timestamp: '2026-06-05 15:30',
    source: 'agent_layer',
    eventType: 'agent_summary',
    actor: 'Engineering Team Agent',
    actorOrg: 'Engineering',
    targetOrg: 'Sales',
    meetingId: 'CF-0605',
    decisionType: 'Feasibility',
    workflowType: 'Async-first review',
    description: 'Agent captured feasibility constraints async; no live time used.',
    elapsedTime: '0.6 days',
    evidenceLabel: 'Agent · Summary',
  },
  {
    id: 'r-se-3',
    timestamp: '2026-06-06 09:10',
    source: 'closeout',
    eventType: 'resolved_async',
    actor: 'D. Cho',
    actorOrg: 'Sales',
    targetOrg: 'Engineering',
    meetingId: 'CF-0605',
    decisionType: 'Feasibility',
    workflowType: 'Async-first review',
    description: 'Feasibility resolved async; no live meeting needed.',
    elapsedTime: '0.8 days',
    evidenceLabel: 'Close-out · Resolved',
  },

  // Legal ↔ Finance — Non-Standard Terms (low volume, high escalation)
  {
    id: 'r-lf-1',
    timestamp: '2026-06-09 13:00',
    source: 'decision_room',
    eventType: 'live_escalation',
    actor: 'Legal Counsel',
    actorOrg: 'Legal',
    targetOrg: 'Finance',
    meetingId: 'NST-0609',
    decisionType: 'Non-standard terms',
    workflowType: 'Live escalation',
    description: 'Non-standard term escalated live; no shared input definition.',
    elapsedTime: '—',
    evidenceLabel: 'Decision Room · Escalation',
  },
  {
    id: 'r-lf-2',
    timestamp: '2026-06-09 13:25',
    source: 'decision_room',
    eventType: 'decision_deferred',
    actor: 'Finance Controller',
    actorOrg: 'Finance',
    targetOrg: 'Legal',
    meetingId: 'NST-0609',
    decisionType: 'Non-standard terms',
    workflowType: 'Live escalation',
    description: 'Deferred: revenue-recognition ownership unclear.',
    elapsedTime: '3.6 days',
    evidenceLabel: 'Decision Room · Deferral',
  },
  {
    id: 'r-lf-3',
    timestamp: '2026-06-11 10:00',
    source: 'closeout',
    eventType: 'followup_created',
    actor: 'Legal Counsel',
    actorOrg: 'Legal',
    targetOrg: 'Finance',
    meetingId: 'NST-0609',
    decisionType: 'Non-standard terms',
    workflowType: 'Live escalation',
    description: 'Follow-up created: define non-standard term ownership.',
    elapsedTime: '3.6 days',
    evidenceLabel: 'Close-out · Follow-up',
  },
]

// --- Layer 2: Relationship Scorecards (the bank statement) -----------------

export const SCORECARDS: RelationshipScorecard[] = [
  {
    id: 'sc-sales-legal',
    sourceOrg: 'Sales',
    targetOrg: 'Legal',
    relationshipLabel: 'Sales ↔ Legal — Contract Exceptions',
    decisionType: 'Contract exception',
    workflowType: 'Live decision review',
    period: 'This quarter (60 days)',
    eventCount: 14,
    meetingCount: 12,
    jointHours: 38,
    averageResolutionTime: '4.1 days',
    medianResolutionTime: '3.5 days',
    asyncResolutionRate: '29%',
    liveEscalationRate: '21%',
    decisionDeferralRate: '50%',
    reopenRate: '14%',
    unresolvedDependencyCount: 4,
    averageDependencyAge: '5 days',
    agentCoverableHours: 11,
    topRepeatTopics: [
      'Non-standard indemnity',
      'Liability cap exceptions',
      '6 async recommendations overridden',
      '5 meetings missing required pre-read',
    ],
    recommendedIntervention:
      'Require contract exception pre-read and decision owner before live review. Deploy Legal intake agent for first-pass validation.',
    healthState: 'slow',
    evidenceReceiptIds: [
      'r-sl-1', 'r-sl-2', 'r-sl-3', 'r-sl-4', 'r-sl-5',
      'r-sl-6', 'r-sl-7', 'r-sl-8', 'r-sl-9', 'r-sl-10',
    ],
  },
  {
    id: 'sc-sales-eng',
    sourceOrg: 'Sales',
    targetOrg: 'Engineering',
    relationshipLabel: 'Sales ↔ Engineering — Customer Feasibility',
    decisionType: 'Feasibility',
    workflowType: 'Async-first review',
    period: 'This quarter (60 days)',
    eventCount: 6,
    meetingCount: 3,
    jointHours: 9,
    averageResolutionTime: '0.8 days',
    medianResolutionTime: '0.5 days',
    asyncResolutionRate: '83%',
    liveEscalationRate: '0%',
    decisionDeferralRate: '0%',
    reopenRate: '0%',
    unresolvedDependencyCount: 0,
    averageDependencyAge: '—',
    agentCoverableHours: 2,
    topRepeatTopics: ['Integration limits', 'Data-volume ceilings'],
    recommendedIntervention:
      'Leave current workflow unchanged. Continue async-first feasibility review.',
    healthState: 'healthy',
    evidenceReceiptIds: ['r-se-1', 'r-se-2', 'r-se-3'],
  },
  {
    id: 'sc-legal-finance',
    sourceOrg: 'Legal',
    targetOrg: 'Finance',
    relationshipLabel: 'Legal ↔ Finance — Non-Standard Terms',
    decisionType: 'Non-standard terms',
    workflowType: 'Live escalation',
    period: 'This quarter (60 days)',
    eventCount: 4,
    meetingCount: 4,
    jointHours: 7,
    averageResolutionTime: '3.6 days',
    medianResolutionTime: '3.2 days',
    asyncResolutionRate: '25%',
    liveEscalationRate: '75%',
    decisionDeferralRate: '50%',
    reopenRate: '25%',
    unresolvedDependencyCount: 2,
    averageDependencyAge: '8 days',
    agentCoverableHours: 4,
    topRepeatTopics: ['Undefined term ownership', 'Revenue-recognition edge cases'],
    recommendedIntervention:
      'Create shared input definition for non-standard terms. Best Phase 2 agent target.',
    healthState: 'escalated',
    evidenceReceiptIds: ['r-lf-1', 'r-lf-2', 'r-lf-3'],
  },
  {
    id: 'sc-sales-finance',
    sourceOrg: 'Sales',
    targetOrg: 'Finance',
    relationshipLabel: 'Sales ↔ Finance — Pricing Governance',
    decisionType: 'Pricing governance',
    workflowType: 'Expected — not observed',
    period: 'This quarter (60 days)',
    eventCount: 0,
    meetingCount: 0,
    jointHours: 0,
    averageResolutionTime: '—',
    medianResolutionTime: '—',
    asyncResolutionRate: '—',
    liveEscalationRate: '—',
    decisionDeferralRate: '—',
    reopenRate: '—',
    unresolvedDependencyCount: 0,
    averageDependencyAge: '—',
    agentCoverableHours: 0,
    topRepeatTopics: ['No direct measured pricing-governance events'],
    recommendedIntervention:
      'Validate whether Finance is intentionally separated or being bypassed in pricing decisions.',
    healthState: 'missing',
    evidenceReceiptIds: [],
  },
]

/** Line weight for each measured edge in the graph. Style, not color. */
export const GRAPH_EDGES: {
  scorecardId: string
  label: string
  lineStyle: 'thick' | 'thin' | 'dashed' | 'ghost'
  note: string
}[] = [
  { scorecardId: 'sc-sales-legal', label: 'Sales ↔ Legal', lineStyle: 'thick', note: 'High volume · slow' },
  { scorecardId: 'sc-sales-eng', label: 'Sales ↔ Engineering', lineStyle: 'thin', note: 'Low volume · fast' },
  { scorecardId: 'sc-legal-finance', label: 'Legal ↔ Finance', lineStyle: 'dashed', note: 'Low volume · escalated' },
  { scorecardId: 'sc-sales-finance', label: 'Sales ↔ Finance', lineStyle: 'ghost', note: 'Expected · not observed' },
]

// --- The claimed model (from Org Cards / leadership) ------------------------

export const CLAIMED_RELATIONSHIPS: ClaimedRelationship[] = [
  {
    id: 'cl-sales-legal',
    sourceOrg: 'Sales',
    targetOrg: 'Legal',
    relationshipLabel: 'Sales → Legal',
    claimedDependency: 'Sales claims Legal supports contract exception review.',
    claimedDecisionRight: 'Legal owns contract language.',
    expectedWorkflow: 'Live review on each exception.',
    expectedEscalationPath: 'Escalate unresolved terms to General Counsel.',
    expectedAgentUse: 'Legal intake agent (planned).',
    confidence: 'High',
  },
  {
    id: 'cl-sales-finance',
    sourceOrg: 'Sales',
    targetOrg: 'Finance',
    relationshipLabel: 'Sales → Finance',
    claimedDependency: 'Sales claims Finance owns pricing governance.',
    claimedDecisionRight: 'Finance sets the margin floor.',
    expectedWorkflow: 'Pricing review before exception approval.',
    expectedEscalationPath: 'Escalate sub-floor margin to CFO.',
    expectedAgentUse: 'None stated.',
    confidence: 'High',
  },
  {
    id: 'cl-product-security',
    sourceOrg: 'Product',
    targetOrg: 'Security',
    relationshipLabel: 'Product → Security',
    claimedDependency: 'Product claims Security clears release readiness.',
    claimedDecisionRight: 'Security owns release clearance.',
    expectedWorkflow: 'Clearance review before launch checkpoint.',
    expectedEscalationPath: 'Escalate release-blocking risk to CISO.',
    expectedAgentUse: 'Security review agent (planned).',
    confidence: 'Medium',
  },
  {
    id: 'cl-cs-product',
    sourceOrg: 'Customer Success',
    targetOrg: 'Product',
    relationshipLabel: 'Customer Success → Product',
    claimedDependency: 'Customer Success claims Product owns roadmap commitment validation.',
    claimedDecisionRight: 'Product owns roadmap sequencing.',
    expectedWorkflow: 'Commitment validation before customer promise.',
    expectedEscalationPath: 'Escalate at-risk commitments to Product lead.',
    expectedAgentUse: 'None stated.',
    confidence: 'Medium',
  },
]

// --- Operational reading + interventions -----------------------------------

export const OPERATIONAL_READINGS: string[] = [
  'The Sales–Legal edge is where cross-org time is concentrating. The relationship is both high-volume and slow. This is the primary operating finding, drawn from receipts rather than interviews.',
  'For Legal–Finance, volume is low but escalation is high. That suggests a broken input definition, unclear decision rights, or a trust gap. This is the strongest Phase 2 agent target.',
  'The missing Sales–Finance edge is not a conclusion. It is a question: is Finance intentionally separated, or are pricing decisions happening outside the expected governance path?',
]

export const OPERATIONAL_INTERVENTIONS: string[] = [
  'Require meeting contracts for contract exception reviews.',
  'Require pre-read before Sales–Legal live review.',
  'Route low-risk contract exceptions through async workflow.',
  'Deploy Legal intake agent for first-pass validation.',
  'Create shared Legal–Finance input definition.',
  'Validate missing Sales–Finance pricing-governance path.',
  'Redraw the graph at the next QBR.',
]

// ===========================================================================
// Attendee View — attendee-validated facts from a meeting invite link
// ===========================================================================

/** The signed-in attendee for the mock invite. */
export const ATTENDEE = {
  name: 'A. Reyes',
  org: 'Sales',
  role: 'Required Contributor',
  meetingId: 'CE-0412',
  meeting: 'Pricing Exception Review',
  decisionType: 'Pricing exception',
  targetOrg: 'Finance',
}

export const ATTENDEE_INVITE = {
  meeting: 'Pricing Exception Review',
  inviteStatus: 'You were invited as a Required Contributor.',
  reason:
    'You own customer context for the pricing exception and are expected to confirm urgency, account impact, and customer deadline.',
  contract: [
    { label: 'Purpose', value: 'Resolve customer pricing exception' },
    { label: 'Required output', value: 'Approve, reject, or revise exception' },
    { label: 'Decision owner', value: 'Finance Director' },
    { label: 'Required attendees', value: 'Sales, Finance, Legal, Product' },
    { label: 'Summary recipients', value: 'Customer Success, Revenue Operations' },
    { label: 'Time limit', value: '25 minutes' },
    { label: 'Pre-read required', value: 'Margin model, contract redline, customer timeline' },
    { label: 'Agent coverage', value: 'Agent may observe, human required for Sales input' },
    { label: 'Sensitivity level', value: 'Internal restricted' },
  ],
}

export const WHY_INVITED: { k: string; v: string }[] = [
  { k: 'Assigned role', v: 'Required Contributor' },
  { k: 'Expected input', v: 'Customer urgency, commercial impact, deadline risk' },
  { k: 'Impacted orgs', v: 'Sales, Finance, Legal' },
  { k: 'Required live judgment', v: 'Yes' },
  { k: 'Agent eligibility', v: 'Agent may observe, but cannot replace human' },
]

/** Attendance actions → the receipt each one would create. */
export const ATTENDANCE_ACTIONS: {
  key: string
  label: string
  eventType: string
  description: string
}[] = [
  {
    key: 'accept',
    label: 'Accept live role',
    eventType: 'role_accepted',
    description: 'Sales accepted Required Contributor role for Pricing Exception Review.',
  },
  {
    key: 'send_agent',
    label: 'Send my agent to observe',
    eventType: 'agent_observe_requested',
    description: 'Sales sent an agent to observe Pricing Exception Review.',
  },
  {
    key: 'summary_only',
    label: 'Move me to summary-only',
    eventType: 'summary_only_requested',
    description: 'Sales requested summary-only participation for Pricing Exception Review.',
  },
  {
    key: 'request_preread',
    label: 'Request pre-read',
    eventType: 'preread_requested',
    description: 'Required Contributor requested pre-read before accepting live attendance.',
  },
  {
    key: 'request_async',
    label: 'Request async workflow',
    eventType: 'async_requested',
    description: 'Sales requested an async workflow instead of live time.',
  },
  {
    key: 'challenge',
    label: 'Challenge my assigned role',
    eventType: 'role_challenged',
    description: 'Sales challenged the assigned Required Contributor role.',
  },
  {
    key: 'decline',
    label: 'Decline live attendance with reason',
    eventType: 'attendance_declined',
    description: 'Sales declined live attendance with a stated reason.',
  },
]

/** Role-challenge reasons → the receipt description they produce. */
export const CHALLENGE_OPTIONS: { label: string; description: string }[] = [
  {
    label: 'I am informed-only',
    description: 'Sales challenged required attendance, stating an informed-only role.',
  },
  {
    label: 'My org can send an agent',
    description: 'Sales challenged required attendance because an org agent can cover.',
  },
  {
    label: 'Required context is missing',
    description: 'Sales challenged required attendance because required pre-read was missing.',
  },
  {
    label: 'I am not the decision owner',
    description: 'Sales challenged required attendance, stating they are not the decision owner.',
  },
  {
    label: 'This should be async',
    description: 'Sales challenged required attendance because the work can resolve async.',
  },
  {
    label: 'Another person should represent this role',
    description: 'Sales challenged required attendance, nominating another representative.',
  },
]

export const PREREAD_ITEMS: { item: string; status: 'Available' | 'Missing' | 'Needs review' }[] = [
  { item: 'Margin model', status: 'Available' },
  { item: 'Contract redline', status: 'Needs review' },
  { item: 'Customer timeline', status: 'Available' },
  { item: 'Product delivery impact', status: 'Missing' },
  { item: 'Legal exception language', status: 'Missing' },
]

export const AGENT_OPTIONS: string[] = [
  'Agent observes only',
  'Agent attends instead of me',
  'Agent summarizes for my org',
  'Human required',
]

export const AGENT_RECOMMENDED = 'Human required; agent may observe.'

export const ATTENDANCE_JUDGMENT: string[] = [
  'Your live attendance is justified because customer judgment is required.',
  'Agent can observe but should not replace you.',
  'Pre-read should be reviewed before joining.',
  'If Legal language is missing, request pre-read before accepting.',
  'Your response will become a factual receipt.',
]
