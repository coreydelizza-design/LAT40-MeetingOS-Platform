import { Kicker, ExecPanel, ModeratorPanel } from '../components/primitives'
import { PRODUCT } from '../constants'
import type { ViewId } from '../types'

export function TodayView({ navigate }: { navigate: (v: ViewId) => void }) {
  return (
    <div className="canvas">
      <div className="canvas-split">
        <div>
          <header className="page-head hero">
            <Kicker>{PRODUCT.workspace}</Kicker>
            <h1 className="display">Govern live time before it becomes organizational drag.</h1>
            <p className="thesis">
              Build meetings as decision objects, assign role-based attendance, and capture the
              operating signals that reveal how work actually moves.
            </p>
            <div className="row" style={{ marginTop: 24, gap: 10 }}>
              <button className="btn btn-solid" onClick={() => navigate('build')}>
                {PRODUCT.primaryAction}
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('calendar')}>
                Open Smart Calendar
              </button>
            </div>
          </header>

          <div className="eyebrow" style={{ marginBottom: 12 }}>Executive Briefing</div>
          <div className="panel-row three">
            <ExecPanel
              label="Today's Live Time"
              figure="5"
              unit="meetings"
              foot="3 hr 20 min scheduled · 90 min recoverable through async and agent coverage."
            />
            <ExecPanel
              label="Decisions Pending"
              figure="3"
              unit="open"
              foot="1 decision ready today. 1 lacks a decision owner. 1 awaiting a pre-read."
            />
            <ExecPanel
              label="Requiring Structure"
              figure="4"
              unit="meetings"
              foot="Missing a defined output, an owner, or a required attendee contract."
            />
          </div>

          <div className="section-header" style={{ marginTop: 44 }}>
            <h2>The operating stance</h2>
          </div>
          <div className="grid-3">
            <StancePanel
              n="01"
              title="The meeting is a work object"
              body="Not a calendar event. Every meeting carries a purpose, a required output, and an owner — or it should not consume live time."
            />
            <StancePanel
              n="02"
              title="Attendance is a role"
              body="If a person has no role in the outcome, they receive the summary. Presence is earned by contribution, not habit."
            />
            <StancePanel
              n="03"
              title="Agents extend coverage"
              body="An agent can attend, capture, and escalate — but never approve, commit, or replace accountability."
            />
          </div>
        </div>

        <ModeratorPanel
          sub="Calm facilitation"
          notes={[
            '3 meetings lack a defined output.',
            '2 recurring meetings have no recent decisions.',
            '1 meeting can be agent-covered.',
            'Focus block protected from 1:00–3:00.',
          ]}
          foot={
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('review')}>
              Open Executive Review
            </button>
          }
        />
      </div>
    </div>
  )
}

function StancePanel({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="work-card">
      <div className="wc-meta">{n}</div>
      <div className="wc-title" style={{ fontSize: 18, marginTop: 6 }}>
        {title}
      </div>
      <p className="muted" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.55 }}>
        {body}
      </p>
    </div>
  )
}
