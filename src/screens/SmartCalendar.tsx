import { useState } from 'react'
import { Kicker, SectionHeader, StatusLabel, ModeratorPanel } from '../components/primitives'
import { MEETINGS } from '../data/mock'
import type { Meeting } from '../types'

const INTERVENTIONS = [
  'Send agent',
  'Request agenda',
  'Convert to async',
  'Shorten meeting',
  'Move observers to summary',
  'Protect focus block',
]

export function SmartCalendar() {
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
      <button className="time-card" onClick={onSelect}>
        <div className="tc-top">
          <span className="tc-title">{meeting.title}</span>
          <StatusLabel state={meeting.state} />
          <span className="tc-dur">{meeting.duration}</span>
        </div>
        <div className="tc-grid">
          <Field label="Type" value={meeting.meetingType} />
          <Field label="Required output" value={meeting.requiredOutput} />
          <Field label="Attendee role" value={meeting.attendeeRole} />
          <Field label="Agent eligibility" value={meeting.agentEligibility} />
          <Field label="Meeting value" value={meeting.meetingValue} />
          <Field label="Est. cost" value={meeting.estimatedCost} />
        </div>
      </button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="tc-field">
      <span className="f-label">{label}</span>
      <span className="f-value">{value}</span>
    </div>
  )
}
