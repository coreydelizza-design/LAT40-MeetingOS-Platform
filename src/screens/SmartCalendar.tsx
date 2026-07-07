import { useState } from 'react'
import type { ReactNode } from 'react'
import { Kicker, SectionHeader, StatusLabel, ModeratorPanel } from '../components/primitives'
import { GuidanceHint, type GuidanceCopy } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import { MEETINGS } from '../data/mock'
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
            'Your agent can attend the Product Launch Checkpoint.',
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

function TimeBlock({
  meeting,
  selected,
  onSelect,
}: {
  meeting: Meeting
  selected: boolean
  onSelect: () => void
}) {
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
