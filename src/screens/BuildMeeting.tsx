import { useState } from 'react'
import { Kicker, SectionHeader, ContractBlock, BulletList, KVPanel } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  PRICING_CONTRACT,
  BUILDER_CONTEXT_ITEMS,
  OVERRIDE_REASONS,
  PRE_MEETING_SCORES,
  BUILDER_RECEIPTS,
} from '../data/mock'
import type { MeetingBuilderState } from '../types'

const INTENTS = [
  'Make a decision',
  'Resolve a blocker',
  'Share an update',
  'Collect input',
  'Align stakeholders',
  'Brainstorm options',
  'Escalate an issue',
  'Approve a request',
  'Review performance',
]

const OUTPUTS = [
  'Decision',
  'Approval',
  'Action plan',
  'Risk response',
  'Prioritized list',
  'Written feedback',
  'Status awareness',
  'Escalation path',
]

const LIVE_OPTIONS = [
  'Yes, live discussion is required',
  'No, this can be async',
  'Only if there is disagreement',
  'Not sure — recommend a format',
]

const ROLES = [
  'Decision Owner',
  'Required Contributor',
  'Approver',
  'Facilitator',
  'Action Owner',
  'Optional Reviewer',
  'Informed Only',
  'Authorized Agent (Observe-Only)',
]

const RECOMMENDATION_TYPES = [
  'Schedule live meeting',
  'Shorten meeting',
  'Reduce attendees',
  'Convert to async',
  'Create decision workflow',
  'Authorize agent coverage',
  'Require pre-read',
  'Merge with existing meeting',
  'Do not schedule',
]

const IMPACTED_ORGS = ['Sales', 'Finance', 'Legal', 'Product']

/** A small monochrome receipt-preview cue shown under an instrumented section. */
function ReceiptCue({ event, detail }: { event: string; detail?: string }) {
  return (
    <div className="receipt-cue">
      Receipt preview: meeting_builder · {event}
      {detail ? ` · ${detail}` : ''}
    </div>
  )
}

export function BuildMeeting() {
  const [intent, setIntent] = useState('Make a decision')
  const [output, setOutput] = useState('Decision')
  const [live, setLive] = useState(LIVE_OPTIONS[0])
  const [roles, setRoles] = useState<string[]>(['Decision Owner', 'Approver'])
  const [context, setContext] = useState<string[]>(['Margin model', 'Customer timeline'])
  const [decision, setDecision] = useState<'accept' | 'override' | null>(null)
  const [overrideReason, setOverrideReason] = useState<string | null>(null)

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const overrideStatus =
    decision === 'override'
      ? `Overridden — ${overrideReason ?? 'reason pending'}`
      : decision === 'accept'
        ? 'Recommendation accepted'
        : 'Pending'

  // The organizer-declared state, typed for clarity (frontend-only).
  const builderState: MeetingBuilderState = {
    intent,
    requiredOutput: output,
    liveDiscussionRequirement: live,
    decisionOwner: 'Finance Director',
    impactedOrgs: IMPACTED_ORGS,
    attendeeRoles: roles,
    requiredContext: context,
    recommendation: '25-minute decision meeting',
    overrideReason: decision === 'override' ? overrideReason : null,
    meetingContractGenerated: true,
    receipts: BUILDER_RECEIPTS,
  }

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Moderated Intake</Kicker>
        <h1 className="display">Build Smart Meeting</h1>
        <p className="thesis">Start with the outcome. The calendar comes later.</p>
      </header>

      <p className="note-box" style={{ marginBottom: 32, maxWidth: '72ch' }}>
        We do not wait for the meeting to happen. We capture the operating decision that caused the
        meeting to exist. Each choice below is recorded as an organizer-declared receipt.
      </p>

      <div className="canvas-split">
        <div>
          <Step
            n="1"
            title={<GuidanceHint {...GUIDANCE.intent}>Intent</GuidanceHint>}
            question="What are you trying to accomplish?"
          >
            <div className="chip-row">
              {INTENTS.map((o) => (
                <button
                  key={o}
                  className={`chip${intent === o ? ' selected' : ''}`}
                  onClick={() => setIntent(o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <ReceiptCue event="intent_selected" detail={intent} />
          </Step>

          <Step
            n="2"
            title={<GuidanceHint {...GUIDANCE.required_output}>Required Output</GuidanceHint>}
            question="What must exist when this is complete?"
          >
            <div className="chip-row">
              {OUTPUTS.map((o) => (
                <button
                  key={o}
                  className={`chip${output === o ? ' selected' : ''}`}
                  onClick={() => setOutput(o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <ReceiptCue event="required_output_selected" detail={output} />
          </Step>

          <Step
            n="3"
            title={
              <GuidanceHint {...GUIDANCE.live_discussion_required}>
                Live Discussion Requirement
              </GuidanceHint>
            }
            question="Is live discussion required?"
          >
            <p className="muted" style={{ marginTop: -8, marginBottom: 16, fontSize: 13.5 }}>
              Live time should be justified by judgment, conflict, trust, urgency, decision
              authority, or escalation.
            </p>
            <div className="choice-grid">
              {LIVE_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`choice${live === o ? ' selected' : ''}`}
                  onClick={() => setLive(o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <ReceiptCue event="live_discussion_selected" detail={live} />
          </Step>

          <Step
            n="4"
            title={<GuidanceHint {...GUIDANCE.attendance_roles}>Attendance Roles</GuidanceHint>}
            question="Assign roles — not a guest list."
          >
            <div className="chip-row">
              {ROLES.map((o) => (
                <button
                  key={o}
                  className={`chip${roles.includes(o) ? ' selected' : ''}`}
                  onClick={() => toggle(roles, setRoles, o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <p className="note-box" style={{ marginTop: 16 }}>
              If this person does not have a role, they should receive the summary instead of
              attending live.
            </p>
            {roles.length ? (
              <ReceiptCue
                event="attendee_role_assigned"
                detail={`${roles.length} assigned — ${roles.join(', ')}`}
              />
            ) : null}
          </Step>

          <Step
            n="5"
            title="Context / Pre-Read"
            question="What context must be reviewed before live time is consumed?"
          >
            <div className="chip-row">
              {BUILDER_CONTEXT_ITEMS.map((o) => (
                <button
                  key={o}
                  className={`chip${context.includes(o) ? ' selected' : ''}`}
                  onClick={() => toggle(context, setContext, o)}
                >
                  {o}
                </button>
              ))}
            </div>
            <p className="note-box" style={{ marginTop: 16 }}>
              Missing context weakens meeting readiness and increases deferral risk.
            </p>
            <ReceiptCue event="pre_read_required" detail={`${context.length} context items`} />
          </Step>
        </div>

        <div className="stack-24">
          <aside className="moderator" style={{ position: 'static' }}>
            <div className="mod-head">
              <div className="title">
                <GuidanceHint {...GUIDANCE.meeting_judgment} underline={false}>
                  Meeting Judgment
                </GuidanceHint>
              </div>
              <div className="sub">Recommendation</div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <p className="serif" style={{ fontSize: 17, lineHeight: 1.45 }}>
                Recommended format: 25-minute decision meeting. Required live attendees: 4. Summary
                recipients: 6. Pre-read required before scheduling.
              </p>

              <div className="rule" />
              <Judgment label="Reason">
                Customer deadline and pricing authority require live judgment.
              </Judgment>
              <Judgment label="Alternative considered">
                Async approval workflow.
              </Judgment>
              <Judgment label="Risk if live without context">
                If Legal exception language is missing, the decision is likely to defer.
              </Judgment>

              <div className="rule" />
              <div className="label" style={{ marginBottom: 10 }}>
                Reading from your inputs
              </div>
              <BulletList
                items={[
                  `Intent — ${intent}`,
                  `Required output — ${output}`,
                  `Live requirement — ${live}`,
                  `Roles assigned — ${roles.length}`,
                  `Context to pre-read — ${context.length || 'none'}`,
                ]}
              />

              <div className="rule" />
              <div className="label" style={{ marginBottom: 10 }}>
                Organizer decision
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button
                  className={`btn btn-sm ${decision === 'accept' ? 'btn-solid' : 'btn-ghost'}`}
                  onClick={() => {
                    setDecision('accept')
                    setOverrideReason(null)
                  }}
                >
                  Accept recommendation
                </button>
                <button
                  className={`btn btn-sm ${decision === 'override' ? 'btn-solid' : 'btn-ghost'}`}
                  onClick={() => setDecision('override')}
                >
                  Override recommendation
                </button>
              </div>
              {decision === 'accept' ? (
                <ReceiptCue event="async_recommendation_accepted" />
              ) : null}
              {decision === 'override' ? (
                <>
                  <div className="label" style={{ margin: '16px 0 8px' }}>
                    <GuidanceHint {...GUIDANCE.async_override}>Override reason</GuidanceHint>
                  </div>
                  <div className="chip-row">
                    {OVERRIDE_REASONS.map((r) => (
                      <button
                        key={r}
                        className={`chip${overrideReason === r ? ' selected' : ''}`}
                        onClick={() => setOverrideReason(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <ReceiptCue event="async_recommendation_overridden" />
                  {overrideReason ? (
                    <ReceiptCue event="override_reason_submitted" detail={overrideReason} />
                  ) : null}
                </>
              ) : null}
            </div>
          </aside>

          <div>
            <div className="label" style={{ marginBottom: 10 }}>
              Available recommendations
            </div>
            <div className="tag-list">
              {RECOMMENDATION_TYPES.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.meeting_contract} underline={false}>
            Meeting Contract
          </GuidanceHint>
        }
        aside="Generated decision object"
      />
      <ContractBlock
        seal="Confidential"
        items={[
          { label: 'Purpose', value: PRICING_CONTRACT.purpose, full: true },
          { label: 'Required output', value: PRICING_CONTRACT.requiredOutput },
          { label: 'Decision owner', value: PRICING_CONTRACT.decisionOwner },
          {
            label: 'Required attendees',
            value: PRICING_CONTRACT.requiredAttendees.join(' · '),
          },
          {
            label: 'Summary recipients',
            value: PRICING_CONTRACT.summaryRecipients.join(' · '),
          },
          { label: 'Pre-read', value: PRICING_CONTRACT.preRead.join(' · ') },
          { label: 'Time limit', value: PRICING_CONTRACT.timeLimit },
          { label: 'Success criteria', value: PRICING_CONTRACT.successCriteria, full: true },
          { label: 'Follow-up destination', value: PRICING_CONTRACT.followUpDestination },
          { label: 'Agent coverage', value: PRICING_CONTRACT.agentCoverage },
          { label: 'Sensitivity level', value: PRICING_CONTRACT.sensitivityLevel },
        ]}
      />

      <SectionHeader title="Declared Facts" aside="Why this meeting exists" />
      <KVPanel
        rows={[
          { k: 'Intent', v: builderState.intent },
          { k: 'Required output', v: builderState.requiredOutput },
          { k: 'Decision owner', v: builderState.decisionOwner },
          { k: 'Impacted orgs', v: builderState.impactedOrgs.join(' · ') },
          { k: 'Required roles', v: builderState.attendeeRoles.join(' · ') || 'None' },
          { k: 'Required context', v: builderState.requiredContext.join(' · ') || 'None' },
          { k: 'Meeting judgment', v: builderState.recommendation },
          { k: 'Override status', v: overrideStatus },
          { k: 'Generated receipts', v: String(builderState.receipts.length), serif: true },
        ]}
      />

      <SectionHeader title="Pre-Meeting Scores" aside="Evidence-based, not KPIs" />
      <div className="kv-panel">
        {PRE_MEETING_SCORES.map((s) => (
          <div className="kv-row" key={s.label}>
            <span className="k">
              {s.label}
              <span className="faint" style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
                {s.note}
              </span>
            </span>
            <span className="v serif">{s.value}</span>
          </div>
        ))}
      </div>

      <SectionHeader
        title="Builder Receipts"
        aside={`${BUILDER_RECEIPTS.length} organizer-declared facts`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Event type</th>
            <th>Actor org</th>
            <th>Evidence</th>
            <th style={{ width: '38%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {BUILDER_RECEIPTS.map((r) => (
            <tr key={r.id}>
              <td className="muted" style={{ fontSize: 12.5 }}>
                {r.source}
              </td>
              <td className="strong" style={{ fontSize: 13 }}>
                {r.eventType}
              </td>
              <td className="muted">{r.actorOrg}</td>
              <td className="muted" style={{ fontSize: 12.5 }}>
                {r.evidenceLabel}
              </td>
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Judgment({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="label" style={{ marginBottom: 4 }}>
        {label}
      </div>
      <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
        {children}
      </p>
    </div>
  )
}

function Step({
  n,
  title,
  question,
  children,
}: {
  n: string
  title: React.ReactNode
  question: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="row" style={{ gap: 12, marginBottom: 4 }}>
        <span className="meta-line">Step {n}</span>
        <h3 className="serif" style={{ fontSize: 20, fontWeight: 500 }}>
          {title}
        </h3>
      </div>
      <p className="muted" style={{ marginBottom: 16 }}>
        {question}
      </p>
      {children}
    </section>
  )
}
