import { Kicker, SectionHeader, BulletList } from '../components/primitives'
import { DEPENDENCIES, ORG_LOAD, MEETING_DEBT, INTERVENTIONS } from '../data/mock'

const DECISION_FLOW = [
  { label: 'Decisions made', value: '34' },
  { label: 'Decisions deferred', value: '9' },
  { label: 'Average time to decision', value: '3.4 days' },
  { label: 'Decisions reopened', value: '3' },
  { label: 'Decisions without clear owner', value: '4' },
]

const FRICTION = [
  'Repeated unresolved topics — release clearance SLA',
  'Teams with highest dependency load — Product (5 open)',
  'Meetings with no outcome — 7 recurring',
  'Approval bottlenecks — Finance exception queue',
  'Cross-functional handoff delays — Legal ↔ Sales',
  'Topics repeatedly escalated — pricing exceptions',
]

export function WorkMap() {
  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Work Reality Map</Kicker>
        <h1 className="display">Work Map</h1>
        <p className="thesis">
          The org chart shows structure. The Work Map shows motion, friction, decisions, and
          dependency.
        </p>
      </header>

      <SectionHeader title="Decision Flow" aside="Trailing 30 days" />
      <div className="kv-panel">
        {DECISION_FLOW.map((d) => (
          <div className="kv-row" key={d.label}>
            <span className="k">{d.label}</span>
            <span className="v serif">{d.value}</span>
          </div>
        ))}
      </div>

      <SectionHeader title="Dependency Map" aside="Who waits on whom" />
      <div className="ledger">
        {DEPENDENCIES.map((d) => (
          <div
            className="ledger-row"
            key={d.id}
            style={{ gridTemplateColumns: '1fr auto' }}
          >
            <div>
              <div className="primary">
                {d.requestingOrg} <span className="faint">depends on</span> {d.providingOrg}
              </div>
              <div className="secondary">
                {d.dependencyType} · {d.description}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="status">{d.status}</span>
              <div className="meta-line" style={{ marginTop: 6 }}>
                Open {d.timeOpen}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Operating Friction" />
      <div className="grid-2">
        <BulletList items={FRICTION} />
        <div className="work-card">
          <div className="label" style={{ marginBottom: 12 }}>
            Meeting Debt
          </div>
          <BulletList items={MEETING_DEBT} />
        </div>
      </div>

      <SectionHeader title="Org Load" aside="Attention carried by each org" />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Meeting hrs</th>
            <th>Decisions owned</th>
            <th>Open deps</th>
            <th>Risks carried</th>
            <th>Observer burden</th>
          </tr>
        </thead>
        <tbody>
          {ORG_LOAD.map((o) => (
            <tr key={o.org}>
              <td className="strong">{o.org}</td>
              <td>{o.meetingHours}</td>
              <td>{o.decisionsOwned}</td>
              <td>{o.openDeps}</td>
              <td>{o.risks}</td>
              <td className="muted">{o.observerBurden}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Recommended Interventions" />
      <div className="ledger">
        {INTERVENTIONS.map((it, i) => (
          <div className="ledger-row" key={i} style={{ gridTemplateColumns: '28px 1fr' }}>
            <span className="serif faint" style={{ fontSize: 18 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="primary" style={{ fontWeight: 500 }}>
              {it}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
