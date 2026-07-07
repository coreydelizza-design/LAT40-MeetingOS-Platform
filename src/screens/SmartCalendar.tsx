import { useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { Kicker, SectionHeader, StatusLabel, ModeratorPanel } from '../components/primitives'
import { GuidanceHint, type GuidanceCopy } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import { MEETINGS, CALENDAR_DELEGATION_LINES } from '../data/mock'
import type { Meeting, MeetingState, ViewId } from '../types'

const STATE_GUIDE: Record<MeetingState, GuidanceCopy> = {
  'ASYNC RECOMMENDED': GUIDANCE.async_recommended,
  'DECISION READY': GUIDANCE.decision_ready,
  'AUTHORIZATION AVAILABLE': GUIDANCE.authorized_agent_coverage,
  'FOCUS PROTECTED': GUIDANCE.focus_protected,
  'LIVE REQUIRED': GUIDANCE.live_required,
}

const INTERVENTIONS = [
  'Authorize agent',
  'Request agenda',
  'Convert to async',
  'Shorten meeting',
  'Move observers to summary',
  'Protect focus block',
]

export function SmartCalendar({ navigate }: { navigate: (v: ViewId) => void }) {
  const [selected, setSelected] = useState<string>('mtg-pricing-exception')

  return (
    <div className="canvas">
      <div className="canvas-split">
        <div>
          <header className="page-head">
            <Kicker>Time Governance</Kicker>
            <h1 className="display">Smart Calendar</h1>
            <p className="thesis">
              Your calendar is not a list of events. It is a map of where organizational attention
              is being spent.
            </p>
          </header>

          <div className="timeline">
            {MEETINGS.map((m) => (
              <TimeBlock
                key={m.id}
                meeting={m}
                selected={selected === m.id}
                onSelect={() => setSelected(m.id)}
                navigate={navigate}
              />
            ))}
          </div>

          <SectionHeader title="Calendar Interventions" aside="Applied to selected meeting" />
          <div className="chip-row">
            {INTERVENTIONS.map((label) => (
              <button className="chip" key={label}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <ModeratorPanel
          title="Time Counsel"
          sub="Where attention should move"
          notes={[
            'You can recover 90 minutes today.',
            'Two meetings do not require live attendance.',
            'One meeting lacks a decision owner.',
            'Your agent is authorized to observe the Product Launch Checkpoint.',
            'The Pricing Exception Review requires a pre-read before joining.',
          ]}
          foot={
            <button
              className="btn btn-sm btn-solid"
              style={{ width: '100%' }}
              onClick={() => navigate('attendee')}
            >
              Review invite
            </button>
          }
        />
      </div>
    </div>
  )
}

/** A contextual secondary action per meeting; all route to Review Invite. */
const BLOCK_VERB: Record<string, string> = {
  'mtg-pricing-exception': 'Request pre-read',
  'mtg-launch-checkpoint': 'Authorize agent',
  'mtg-status-sync': 'Validate role',
}

function TimeBlock({
  meeting,
  selected,
  onSelect,
  navigate,
}: {
  meeting: Meeting
  selected: boolean
  onSelect: () => void
  navigate: (v: ViewId) => void
}) {
  const verb = BLOCK_VERB[meeting.id]
  const delegationLine = CALENDAR_DELEGATION_LINES[meeting.id]
  const stop = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    fn()
  }
  return (
    <div className={`time-block${selected ? ' selected' : ''}`}>
      <div className="clock">{meeting.time}</div>
      <div
        className="time-card"
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
      >
        <div className="tc-top">
          <span className="tc-title">{meeting.title}</span>
          <GuidanceHint {...STATE_GUIDE[meeting.state]} underline={false}>
            <StatusLabel state={meeting.state} />
          </GuidanceHint>
          <span className="tc-dur">{meeting.duration}</span>
        </div>
        <div className="tc-grid">
          <Field label="Type" value={meeting.meetingType} />
          <Field label="Required output" value={meeting.requiredOutput} />
          <Field label="Attendee role" value={meeting.attendeeRole} />
          <Field label="Agent eligibility" value={meeting.agentEligibility} />
          <Field
            label={<GuidanceHint {...GUIDANCE.meeting_value}>Meeting value</GuidanceHint>}
            value={meeting.meetingValue}
          />
          <Field label="Est. cost" value={meeting.estimatedCost} />
        </div>
        {delegationLine ? (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            <span className="label" style={{ marginRight: 8 }}>
              Delegation
            </span>
            <span className="muted" style={{ fontSize: 13 }}>
              {delegationLine}
            </span>
          </div>
        ) : null}
        {meeting.state !== 'FOCUS PROTECTED' ? (
          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={stop(() => navigate('attendee'))}
            >
              Review invite
            </button>
            {verb ? (
              <button
                className="btn btn-sm btn-ghost"
                onClick={stop(() => navigate('attendee'))}
              >
                {verb}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: ReactNode; value: string }) {
  return (
    <div className="tc-field">
      <span className="f-label">{label}</span>
      <span className="f-value">{value}</span>
    </div>
  )
}
