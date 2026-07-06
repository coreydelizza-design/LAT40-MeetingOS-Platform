import { useState } from 'react'
import { Kicker, SectionHeader, ContractBlock, BulletList } from '../components/primitives'
import { PRICING_CONTRACT } from '../data/mock'

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
  'Agent Representative',
]

const CONTEXT = [
  'Pre-read',
  'Dashboard',
  'Customer record',
  'Ticket',
  'Prior decision',
  'Open risk',
  'Proposed options',
  'Approval request',
]

const RECOMMENDATION_TYPES = [
  'Schedule live meeting',
  'Shorten meeting',
  'Reduce attendees',
  'Convert to async',
  'Create decision workflow',
  'Send agent instead',
  'Require pre-read',
  'Merge with existing meeting',
  'Do not schedule',
]

export function BuildMeeting() {
  const [intent, setIntent] = useState('Make a decision')
  const [output, setOutput] = useState('Decision')
  const [live, setLive] = useState(LIVE_OPTIONS[0])
  const [roles, setRoles] = useState<string[]>(['Decision Owner', 'Approver'])
  const [context, setContext] = useState<string[]>(['Pre-read'])

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Moderated Intake</Kicker>
        <h1 className="display">Build Smart Meeting</h1>
        <p className="thesis">Start with the outcome. The calendar comes later.</p>
      </header>

      <div className="canvas-split">
        <div>
          <Step n="1" title="Intent" question="What are you trying to accomplish?">
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
          </Step>

          <Step n="2" title="Required Output" question="What must exist when this is complete?">
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
          </Step>

          <Step
            n="3"
            title="Live Discussion Requirement"
            question="Is live discussion required?"
          >
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
          </Step>

          <Step
            n="4"
            title="Attendance Roles"
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
          </Step>

          <Step
            n="5"
            title="Context"
            question="What context should be reviewed before live time is consumed?"
          >
            <div className="chip-row">
              {CONTEXT.map((o) => (
                <button
                  key={o}
                  className={`chip${context.includes(o) ? ' selected' : ''}`}
                  onClick={() => toggle(context, setContext, o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </Step>
        </div>

        <div className="stack-24">
          <aside className="moderator" style={{ position: 'static' }}>
            <div className="mod-head">
              <div className="title">Meeting Judgment</div>
              <div className="sub">Recommendation</div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <p className="serif" style={{ fontSize: 17, lineHeight: 1.45 }}>
                Recommended format: 25-minute decision meeting. Required live attendees: 4. Summary
                recipients: 6. Add a pre-read before scheduling.
              </p>
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

      <SectionHeader title="Meeting Contract" aside="Generated decision object" />
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
  title: string
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
