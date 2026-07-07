import { useState } from 'react'
import type { ReactNode } from 'react'
import { Kicker, SectionHeader, ContractBlock, ModeratorPanel } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import { PRICING_CONTRACT } from '../data/mock'
import type { ViewId } from '../types'

const EVIDENCE = [
  { item: 'Margin model', detail: 'Current vs. proposed exception margin.' },
  { item: 'Contract redline', detail: 'Non-standard terms flagged by Legal.' },
  { item: 'Customer timeline', detail: 'Signature expected before quarter close.' },
  { item: 'Product delivery impact', detail: 'No delivery impact if approved this week.' },
  { item: 'Legal exception', detail: 'Requires contract language change.' },
]

const RISKS = [
  'Margin exposure',
  'Contract precedent',
  'Delivery timeline',
  'Customer escalation risk',
]

const POSITIONS = [
  { org: 'Sales', position: 'Approve with urgency' },
  { org: 'Finance', position: 'Revise margin threshold' },
  { org: 'Legal', position: 'Approve only with contract language change' },
  { org: 'Product', position: 'No delivery impact if approved this week' },
]

const DECISION_OPTIONS = ['Approved', 'Rejected', 'Revised', 'Deferred']

const CLOSE_REQUIREMENTS: { key: string; label: ReactNode }[] = [
  {
    key: 'deferral',
    label: (
      <>
        Decision or{' '}
        <GuidanceHint {...GUIDANCE.deferral_reason}>deferral reason</GuidanceHint>
      </>
    ),
  },
  { key: 'owner', label: 'Owner' },
  { key: 'actions', label: 'Action items' },
  { key: 'recipients', label: 'Summary recipients' },
  { key: 'followup', label: 'Follow-up destination' },
]

export function DecisionRoom({ navigate }: { navigate: (v: ViewId) => void }) {
  const [decision, setDecision] = useState('Revised')

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Moderated Decision Room</Kicker>
        <h1 className="display">Decision Room</h1>
        <p className="thesis">Pricing Exception Review</p>
      </header>

      <ContractBlock
        title="Meeting Contract"
        seal="Confidential"
        items={[
          { label: 'Purpose', value: PRICING_CONTRACT.purpose, full: true },
          { label: 'Required output', value: PRICING_CONTRACT.requiredOutput },
          { label: 'Decision owner', value: PRICING_CONTRACT.decisionOwner },
          { label: 'Required attendees', value: PRICING_CONTRACT.requiredAttendees.join(' · ') },
          { label: 'Summary recipients', value: PRICING_CONTRACT.summaryRecipients.join(' · ') },
          { label: 'Time limit', value: PRICING_CONTRACT.timeLimit },
          { label: 'Success criteria', value: PRICING_CONTRACT.successCriteria, full: true },
        ]}
      />

      <div className="canvas-split" style={{ marginTop: 40 }}>
        <div>
          <SectionHeader title="Decision Under Review" />
          <div className="big-statement">
            Approve, reject, or revise the customer pricing exception.
          </div>

          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.evidence} underline={false}>
                Evidence Table
              </GuidanceHint>
            }
          />
          <table className="exec-table">
            <thead>
              <tr>
                <th style={{ width: '34%' }}>Evidence</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE.map((e) => (
                <tr key={e.item}>
                  <td className="strong">{e.item}</td>
                  <td className="muted">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <SectionHeader title="Open Risks" />
          <div className="tag-list">
            {RISKS.map((r) => (
              <span className="tag" key={r} style={{ fontSize: 13, padding: '6px 12px' }}>
                {r}
              </span>
            ))}
          </div>

          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.stakeholder_positions} underline={false}>
                Stakeholder Positions
              </GuidanceHint>
            }
          />
          <table className="exec-table">
            <tbody>
              {POSITIONS.map((p) => (
                <tr key={p.org}>
                  <td className="strong" style={{ width: '26%' }}>
                    {p.org}
                  </td>
                  <td>{p.position}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <SectionHeader title="Decision Capture" />
          <div className="contract">
            <div className="contract-item full" style={{ borderBottom: '1px solid var(--line)' }}>
              <div className="ci-label">Decision</div>
              <div className="chip-row" style={{ marginTop: 8 }}>
                {DECISION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    className={`chip${decision === d ? ' selected' : ''}`}
                    onClick={() => setDecision(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="contract-grid">
              <Capture label="Rationale" value="Approved at revised margin floor; Legal condition to follow." />
              <Capture
                label={<GuidanceHint {...GUIDANCE.decision_owner}>Owner</GuidanceHint>}
                value="VP, Revenue Operations"
              />
              <Capture label="Impacted orgs" value="Revenue Operations · Finance · Legal" />
              <Capture label="Follow-up actions" value="Legal to update exception language." />
              <Capture label="Due date" value="Fri, Jul 10" full />
            </div>
          </div>
        </div>

        <div className="stack-24">
          <ModeratorPanel
            sub="Facilitating this room"
            notes={[
              'Decision owner is present.',
              'Legal condition remains unresolved.',
              'Finance has not accepted current margin.',
              'A decision must be captured before this meeting can close.',
              'If deferred, assign next decision date.',
            ]}
          />

          <aside className="moderator" style={{ position: 'static' }}>
            <div className="mod-head">
              <div className="title">
                <GuidanceHint {...GUIDANCE.closeout} underline={false}>
                  Close Meeting
                </GuidanceHint>
              </div>
              <div className="sub">Cannot close without</div>
            </div>
            <div className="mod-body">
              {CLOSE_REQUIREMENTS.map((req) => (
                <div className="mod-note" key={req.key}>
                  <span className="tick" />
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
            <div className="mod-foot stack-8">
              <button className="btn btn-solid btn-sm" style={{ width: '100%' }}>
                Close &amp; Record Decision
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%' }}
                onClick={() => navigate('closeout')}
              >
                Open Meeting Closeout
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Capture({ label, value, full }: { label: ReactNode; value: string; full?: boolean }) {
  return (
    <div className={`contract-item${full ? ' full' : ''}`}>
      <div className="ci-label">{label}</div>
      <div className="ci-value">{value}</div>
    </div>
  )
}
