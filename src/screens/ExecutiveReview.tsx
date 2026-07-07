import { Kicker, SectionHeader } from '../components/primitives'
import {
  LIVE_TIME_GOVERNANCE,
  DECISION_VELOCITY,
  ORG_FRICTION,
  AGENT_LEVERAGE,
  EXEC_INTERVENTIONS,
} from '../data/mock'

export function ExecutiveReview() {
  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Leadership Operating Review</Kicker>
        <h1 className="display">Executive Review</h1>
        <p className="thesis">
          Review the cost of live time, the speed of decisions, and the friction slowing the
          organization.
        </p>
      </header>

      <SectionHeader title="Live Time Governance" aside="Measured from receipts" />
      <StatPanel
        rows={LIVE_TIME_GOVERNANCE}
        source="Aggregated from meeting-builder and attendee receipts across the last 60 days."
      />

      <SectionHeader title="Decision Velocity" aside="Measured from receipts" />
      <StatPanel
        rows={DECISION_VELOCITY}
        source="Aggregated from decision-room and close-out receipts across the last 60 days."
      />

      <div className="grid-2" style={{ marginTop: 40 }}>
        <div>
          <SectionHeader title="Organizational Friction" />
          <div className="kv-panel">
            {ORG_FRICTION.map((r) => (
              <div className="kv-row" key={r.label}>
                <span className="k">{r.label}</span>
                <span className="v">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="Agent Leverage" />
          <div className="kv-panel">
            {AGENT_LEVERAGE.map((r) => (
              <div className="kv-row" key={r.label}>
                <span className="k">{r.label}</span>
                <span className="v serif">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionHeader title="Executive Interventions" aside="Recommended actions" />
      <div className="ledger">
        {EXEC_INTERVENTIONS.map((it, i) => (
          <div className="ledger-row" key={i} style={{ gridTemplateColumns: '28px 1fr auto' }}>
            <span className="serif faint" style={{ fontSize: 18 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="primary" style={{ fontWeight: 500 }}>
              {it}
            </span>
            <button className="btn btn-sm btn-ghost">Assign</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatPanel({
  rows,
  source,
}: {
  rows: { label: string; value: string }[]
  source?: string
}) {
  return (
    <div>
      <div className="panel-row" style={{ gridTemplateColumns: `repeat(${rows.length}, 1fr)` }}>
        {rows.map((r) => (
          <div className="exec-panel" key={r.label}>
            <div className="label" style={{ marginBottom: 14, minHeight: 28 }}>
              {r.label}
            </div>
            <div className="figure" style={{ fontSize: 20 }}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
      {source ? (
        <p className="faint" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
          {source}
        </p>
      ) : null}
    </div>
  )
}
