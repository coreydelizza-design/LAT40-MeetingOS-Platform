import type { GuidanceCopy } from '../components/GuidanceHint'

/**
 * Product Guidance Layer copy.
 * Every descriptor: a short concept title, one or two sentences on what it
 * means and why it matters, and an optional verb-first action.
 * Guidance should clarify the operating logic without making the UI noisy.
 */
export const GUIDANCE = {
  // --- Today / Executive Alignment Room ---
  live_required: {
    title: 'Live Required',
    description:
      'Meetings where human judgment, authority, trust, or escalation is required. These should not be delegated unless an agent is explicitly approved to observe.',
    action: 'Attend these yourself, or approve an agent to observe.',
  },
  agent_coverage: {
    title: 'Agent Coverage',
    description:
      'Meetings where the employee or org can stay informed without attending live. The agent captures relevant decisions, risks, actions, and dependencies.',
    action: 'Send your org agent instead of attending live.',
  },
  decisions_pending: {
    title: 'Decisions Pending',
    description:
      'Open decisions that need input, ownership, or closure. These are prioritized because unresolved decisions create organizational drag.',
    action: 'Resolve or assign an owner to clear the drag.',
  },
  structure_needed: {
    title: 'Structure Needed',
    description:
      'Meetings missing a clear output, owner, agenda, or required context. These should be fixed before live time is consumed.',
    action: 'Add the missing output or owner before it is scheduled.',
  },
  recoverable_time: {
    title: 'Recoverable Time',
    description:
      'Estimated live time that may be reclaimed by converting meetings to async, sending an agent, shortening the meeting, or moving observers to summary-only.',
    action: 'Convert, shorten, or delegate to reclaim the time.',
  },
  work_friction_signals: {
    title: 'Work Friction Signals',
    description:
      'Repeated patterns showing where work slows down, decisions defer, or dependencies remain unresolved.',
    action: 'Address the repeated pattern, not the single meeting.',
  },

  // --- Smart Calendar ---
  async_recommended: {
    title: 'Async Recommended',
    description:
      'The meeting appears to be informational, low-conflict, or update-oriented. The platform recommends replacing live time with structured async input.',
    action: 'Replace the live meeting with a structured async update.',
  },
  decision_ready: {
    title: 'Decision Ready',
    description:
      'The meeting has a defined decision, owner, required participants, and enough context to justify live discussion.',
    action: 'Attend with the pre-read and close the decision.',
  },
  agent_can_cover: {
    title: 'Agent Can Cover',
    description:
      'The meeting is relevant for awareness but does not require the employee’s live judgment. An agent can attend and summarize what matters.',
    action: 'Send an agent and read the summary.',
  },
  focus_protected: {
    title: 'Focus Protected',
    description:
      'Time reserved for deep work. The platform protects this block unless a live-required escalation overrides it.',
    action: 'Protect this block unless a live-required escalation overrides it.',
  },
  meeting_value: {
    title: 'Meeting Value',
    description:
      'A directional assessment of whether the meeting’s expected outcome justifies the live time it consumes.',
    action: 'Weigh the value against the live time before attending.',
  },

  // --- Build Smart Meeting ---
  intent: {
    title: 'Intent',
    description:
      'The reason this work is being initiated. Intent determines whether the right path is a live meeting, async workflow, decision room, or agent coverage.',
    action: 'State the intent first — it selects the right path.',
  },
  required_output: {
    title: 'Required Output',
    description:
      'What must exist after the work is complete. Without a required output, the meeting is likely too vague to justify live time.',
    action: 'Define the output before choosing a format.',
  },
  live_discussion_required: {
    title: 'Live Discussion Required',
    description:
      'Live discussion should be reserved for judgment, conflict, trust, urgency, or decision-making that cannot resolve async.',
    action: 'Reserve live time for what cannot resolve async.',
  },
  attendance_roles: {
    title: 'Attendance Roles',
    description:
      'Every attendee should have a reason to be present. People without a required role should usually receive the summary instead.',
    action: 'Give every attendee a role, or move them to summary.',
  },
  meeting_judgment: {
    title: 'Meeting Judgment',
    description:
      'The platform’s recommendation on whether to schedule, shorten, restructure, convert to async, or send an agent.',
    action: 'Follow the recommendation before scheduling.',
  },
  meeting_contract: {
    title: 'Meeting Contract',
    description:
      'Defines why the meeting exists, what it must produce, who owns the decision, and who truly needs to attend.',
    action: 'Use it to prevent vague meetings from consuming live time.',
  },
  async_override: {
    title: 'Async Recommendation Override',
    description:
      'When the system recommends async but the organizer chooses live time anyway. The override reason becomes an auditable receipt.',
    action: 'Record the override reason — it becomes a receipt.',
  },

  // --- Org Cards ---
  claimed_operating_model: {
    title: 'Claimed Operating Model',
    description:
      'How leadership believes work should flow across teams. This becomes the baseline compared against measured behavior.',
    action: 'Compare it against the measured model in the Work Map.',
  },
  decision_rights: {
    title: 'Decision Rights',
    description:
      'The decisions this org is authorized to make or influence. Clear decision rights reduce meeting loops and escalation drag.',
    action: 'Clarify rights to reduce meeting loops and escalation.',
  },
  dependencies: {
    title: 'Dependencies',
    description:
      'The teams, inputs, approvals, or systems this org needs to succeed. Repeated dependencies become visible in the Work Map.',
    action: 'Track repeated dependencies where they surface on the graph.',
  },
  escalation_rules: {
    title: 'Escalation Rules',
    description:
      'When the org requires leadership attention, human judgment, or live intervention.',
    action: 'Escalate only when these conditions are met.',
  },
  agent_instructions: {
    title: 'Agent Instructions',
    description:
      'The rules that tell an org-based agent what to capture, ignore, summarize, or escalate.',
    action: 'Tune what the agent captures, ignores, and escalates.',
  },

  // --- Agents ---
  listen_mode: {
    title: 'Listen Mode',
    description:
      'The agent attends silently and summarizes what matters. It does not speak, decide, approve, or commit.',
    action: 'Use it for awareness without live attendance.',
  },
  represent_mode: {
    title: 'Represent Mode',
    description:
      'The agent captures information based on approved org instructions. It can represent context but not make unauthorized commitments.',
    action: 'Use it to carry approved context, not commitments.',
  },
  proxy_mode: {
    title: 'Proxy Mode',
    description:
      'The agent can answer only from approved knowledge and predefined constraints.',
    action: 'Use it only within approved knowledge and constraints.',
  },
  escalation_mode: {
    title: 'Escalation Mode',
    description:
      'The agent alerts a human when authority, judgment, risk, or live intervention is required.',
    action: 'Rely on it to pull in a human when judgment is required.',
  },
  authority_boundary: {
    title: 'Authority Boundary',
    description:
      'The explicit limit on what the agent can and cannot do. This prevents agents from approving, negotiating, or committing beyond permission.',
    action: 'Check the boundary before delegating to an agent.',
  },

  // --- Decision Room ---
  decision_owner: {
    title: 'Decision Owner',
    description:
      'The person accountable for closure. A decision meeting without a decision owner should not proceed.',
    action: 'Assign an owner, or do not proceed.',
  },
  evidence: {
    title: 'Evidence',
    description:
      'The required context needed before live judgment is consumed. Evidence prevents opinion-only meetings.',
    action: 'Require evidence before consuming live judgment.',
  },
  stakeholder_positions: {
    title: 'Stakeholder Positions',
    description:
      'The current view of each required role or org. This makes alignment gaps visible before the meeting closes.',
    action: 'Close the alignment gaps before the meeting ends.',
  },
  deferral_reason: {
    title: 'Deferral Reason',
    description:
      'The factual reason a decision was not made. Deferrals become receipts that feed scorecards and the True Operational Graph.',
    action: 'Record why — the deferral becomes a receipt.',
  },
  closeout: {
    title: 'Closeout',
    description:
      'The structured end of the meeting. Closeout captures outcome, actions, dependencies, risks, owners, and follow-up.',
    action: 'Capture outcome, actions, owners, and follow-up to close.',
  },

  // --- Structured Capture ---
  receipt: {
    title: 'Receipt',
    description:
      'A factual event captured by the system. Receipts are timestamped, source-labeled, and used as evidence behind scorecards.',
    action: 'Trace any scorecard back to its receipts.',
  },
  capture_dependency: {
    title: 'Dependency',
    description:
      'A relationship where one org needs another org, input, approval, or decision to move work forward.',
    action: 'Assign an owner to move the work forward.',
  },
  risk: {
    title: 'Risk',
    description:
      'A potential impact to time, cost, customer, compliance, revenue, or delivery that needs ownership or mitigation.',
    action: 'Give the risk an owner and a mitigation.',
  },
  action_item: {
    title: 'Action',
    description:
      'A follow-up commitment with an owner, due date, related org, and status.',
    action: 'Track it to a due date and status.',
  },
  closeout_event: {
    title: 'Closeout Event',
    description:
      'The final meeting record that confirms what was decided, deferred, assigned, escalated, or carried forward.',
    action: 'Confirm what was decided, deferred, or carried forward.',
  },

  // --- Work Map / True Operational Graph ---
  true_operational_graph: {
    title: 'True Operational Graph',
    description:
      'A measured map of how work actually moves across the organization. It is drawn from scorecards, not opinion.',
    action: 'Read the measured map, not the org chart.',
  },
  claimed_model: {
    title: 'Claimed Model',
    description:
      'The organization’s stated view of how work should flow, captured through Org Cards and leadership input.',
    action: 'Treat it as the baseline, not the truth.',
  },
  measured_model: {
    title: 'Measured Model',
    description:
      'What actually happened, measured from meeting builder, attendee, agent, decision, dependency, and closeout receipts.',
    action: 'Trust the receipts over the interviews.',
  },
  relationship_scorecard: {
    title: 'Relationship Scorecard',
    description:
      'The bank-statement layer. It aggregates receipts by org relationship, decision type, workflow type, and time period.',
    action: 'Open it to see the relationship’s operating statement.',
  },
  receipts_ledger: {
    title: 'Receipts Ledger',
    description:
      'The audit trail behind the scorecard. Every receipt is a factual event that explains why a relationship appears on the graph.',
    action: 'Audit the events behind the number.',
  },
  missing_expected_relationship: {
    title: 'Missing Expected Relationship',
    description:
      'A relationship expected in the claimed model but not measured in actual work. This is a question for leadership, not an automatic conclusion.',
    action: 'Ask leadership why it is missing.',
  },
  quarterly_redraw: {
    title: 'Quarterly Redraw',
    description:
      'The graph is redrawn each quarter from new scorecards. Successful interventions should make edges thinner, faster, and less escalation-heavy.',
    action: 'Redraw next quarter to confirm interventions worked.',
  },

  // --- Attendee View ---
  assigned_role: {
    title: 'Assigned Role',
    description:
      'The role the organizer declared for you. It determines whether you are needed live, can send an agent, or should receive the summary.',
    action: 'Confirm it is accurate before accepting live time.',
  },
  required_contributor: {
    title: 'Required Contributor',
    description:
      'You are expected to provide input the decision cannot be made without. Contributors shape the outcome; observers do not.',
    action: 'Bring the input you were invited for, or challenge the role.',
  },
  summary_only: {
    title: 'Summary-only',
    description:
      'You receive the structured outcome instead of attending live. Reserved for roles without required live input.',
    action: 'Choose this when your presence would be informational.',
  },
  role_challenge: {
    title: 'Role Challenge',
    description:
      'A structured way to dispute an inaccurate role before live time is consumed. The challenge is recorded as a factual receipt.',
    action: 'Challenge when your role does not match your actual input.',
  },
  receipt_preview: {
    title: 'Receipt Preview',
    description:
      'The factual event your response will create. Receipts are timestamped, source-labeled, and feed the True Operational Graph.',
    action: 'Review what will be recorded before you respond.',
  },
  attendance_judgment: {
    title: 'Attendance Judgment',
    description:
      'The platform’s read on whether your live attendance is justified, and what to do before joining.',
    action: 'Follow it before you accept or decline.',
  },
} satisfies Record<string, GuidanceCopy>
