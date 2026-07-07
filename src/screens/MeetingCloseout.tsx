import { useState } from 'react'
import { Kicker, SectionHeader } from '../components/primitives'
import {
  CLOSEOUT_HOST_QUESTIONS,
  CLOSEOUT_ATTENDEE_QUESTIONS,
  CLOSURE_SCORES,
  CLOSEOUT_RECEIPTS,
  ATTENDEE_OUTCOME_SIGNALS,
  FALSE_CLOSURE,
  type CloseoutQuestion,
} from '../data/mock'

/** A closeout question with click options + a receipt cue for the answer. */
function QuestionRow({
  q,
  answer,
  onAnswer,
}: {
  q: CloseoutQuestion
  answer: string | undefined
  onAnswer: (label: string) => void
}) {
  const opt = q.options.find((o) => o.label === answer)
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="row" style={{ gap: 10, marginBottom: 10 }}>
        <span className="meta-line">{q.n}</span>
        <span style={{ fontWeight: 600 }}>{q.question}</span>
      </div>
      <div className="chip-row">
        {q.options.map((o) => (
          <button
            key={o.label}
            className={`chip${answer === o.label ? ' selected' : ''}`}
            onClick={() => onAnswer(o.label)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {opt ? (
        <div className="receipt-cue">
          Receipt created: closeout · {opt.event} · {opt.description}
        </div>
      ) : null}
    </div>
  )
}

export function MeetingCloseout() {
  const [hostAnswers, setHostAnswers] = useState<Record<string, string>>({})
  const [attendeeAnswers, setAttendeeAnswers] = useState<Record<string, string>>({})

  const set = (
    store: Record<string, string>,
    setStore: (v: Record<string, string>) => void,
    id: string,
    label: string,
  ) => setStore({ ...store, [id]: store[id] === label ? '' : label })

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Outcome Validation</Kicker>
        <h1 className="display">Meeting Closeout</h1>
        <p className="thesis">Close the meeting by validating the outcome, not by ending the call.</p>
      </header>

      <p className="note-box" style={{ marginBottom: 20, maxWidth: '72ch' }}>
        MeetingOS does not measure whether people liked a meeting. It measures whether the meeting
        achieved its declared outcome.
      </p>

      <div className="kv-panel" style={{ marginBottom: 8 }}>
        <div className="kv-row">
          <span className="k">Meeting</span>
          <span className="v">Pricing Exception Review</span>
        </div>
        <div className="kv-row">
          <span className="k">Required output</span>
          <span className="v">Approve, reject, or revise pricing exception.</span>
        </div>
      </div>

      {/* Host Closeout */}
      <SectionHeader title="Host Closeout" aside="Finance Director · host" />
      <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
        {CLOSEOUT_HOST_QUESTIONS.map((q) => (
          <QuestionRow
            key={q.id}
            q={q}
            answer={hostAnswers[q.id]}
            onAnswer={(label) => set(hostAnswers, setHostAnswers, q.id, label)}
          />
        ))}
      </div>

      {/* Attendee Outcome Validation */}
      <SectionHeader title="Attendee Outcome Validation" aside="Product · attendee" />
      <p className="muted" style={{ marginBottom: 20, maxWidth: '72ch' }}>
        Attendee clicks validate whether live time was necessary, whether the role was accurate, and
        whether the outcome was clear.
      </p>
      <div className="work-card">
        {CLOSEOUT_ATTENDEE_QUESTIONS.map((q) => (
          <QuestionRow
            key={q.id}
            q={q}
            answer={attendeeAnswers[q.id]}
            onAnswer={(label) => set(attendeeAnswers, setAttendeeAnswers, q.id, label)}
          />
        ))}
      </div>

      {/* False Closure Risk */}
      <SectionHeader title="False Closure Risk" aside={`Risk · ${FALSE_CLOSURE.risk}`} />
      <div className="work-card">
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>
          {FALSE_CLOSURE.copy}
        </p>
        <div className="receipt-line" style={{ marginTop: 16 }}>
          {FALSE_CLOSURE.example}
        </div>
        <div style={{ marginTop: 18 }} className="label">
          Attendee signals
        </div>
        <table className="exec-table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Attendee org</th>
              <th>Outcome clarity</th>
              <th>Next action</th>
              <th>Role accuracy</th>
            </tr>
          </thead>
          <tbody>
            {ATTENDEE_OUTCOME_SIGNALS.map((s) => (
              <tr key={s.id}>
                <td className="strong">{s.attendeeOrg}</td>
                <td className="muted">{s.outcomeClear}</td>
                <td className="muted">{s.nextActionKnown}</td>
                <td className="muted">{s.assignedRoleAccurate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Closure Scores */}
      <SectionHeader title="Closure Scores" aside="Evidence-based, not KPIs" />
      <div className="kv-panel">
        {CLOSURE_SCORES.map((s) => (
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

      {/* Closeout Receipts Ledger */}
      <SectionHeader
        title="Closeout Receipts"
        aside={`${CLOSEOUT_RECEIPTS.length} validated facts`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '112px' }}>Timestamp</th>
            <th>Event type</th>
            <th>Actor org</th>
            <th>Evidence</th>
            <th style={{ width: '38%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {CLOSEOUT_RECEIPTS.map((r) => (
            <tr key={r.id}>
              <td className="muted" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                {r.timestamp}
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
