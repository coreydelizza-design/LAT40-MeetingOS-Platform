import { Kicker, SectionHeader } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  DECISIONS,
  ACTIONS,
  DEPENDENCIES,
  RISKS,
  ORG_SUMMARIES,
} from '../data/mock'

const SCORES = [
  { label: 'Readiness score', value: '88 / 100', note: 'Pre-read complete; owner present.' },
  { label: 'Necessity score', value: '92 / 100', note: 'Decision could not be made async.' },
  { label: 'Meeting value score', value: 'High', note: 'Direct quarter-close impact.' },
  { label: 'Async replaceability', value: 'Low', note: 'Live disagreement required resolution.' },
  { label: 'Estimated time cost', value: '4 attendee-hrs', note: 'Against a critical decision.' },
]

export function StructuredCapture() {
  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>
          <GuidanceHint {...GUIDANCE.receipt}>Evidence Ledger</GuidanceHint>
        </Kicker>
        <h1 className="display">Structured Capture</h1>
        <p className="thesis">
          Meetings disappear when they end. Structured capture turns them into decisions, actions,
          risks, and dependencies.
        </p>
      </header>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.closeout_event} underline={false}>
            Captured Decisions
          </GuidanceHint>
        }
        aside={`${DECISIONS.length} recorded`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '34%' }}>Decision</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Impacted orgs</th>
          </tr>
        </thead>
        <tbody>
          {DECISIONS.map((d) => (
            <tr key={d.id}>
              <td>
                <div className="strong">{d.statement}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                  {d.rationale}
                </div>
              </td>
              <td>{d.owner}</td>
              <td>
                <span className="status">{d.status}</span>
              </td>
              <td className="muted">{d.impactedOrgs.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.action_item} underline={false}>
            Created Actions
          </GuidanceHint>
        }
        aside={`${ACTIONS.length} open`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Action</th>
            <th>Owner</th>
            <th>Related org</th>
            <th>Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {ACTIONS.map((a) => (
            <tr key={a.id}>
              <td className="strong">{a.action}</td>
              <td>{a.owner}</td>
              <td className="muted">{a.relatedOrg}</td>
              <td>{a.dueDate}</td>
              <td>
                <span className="status">{a.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.capture_dependency} underline={false}>
            Mapped Dependencies
          </GuidanceHint>
        }
        aside={`${DEPENDENCIES.length} tracked`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Requesting</th>
            <th>Providing</th>
            <th>Type</th>
            <th>Status</th>
            <th>Open</th>
            <th style={{ width: '28%' }}>Business impact</th>
          </tr>
        </thead>
        <tbody>
          {DEPENDENCIES.map((d) => (
            <tr key={d.id}>
              <td className="strong">{d.requestingOrg}</td>
              <td>{d.providingOrg}</td>
              <td className="muted">{d.dependencyType}</td>
              <td>
                <span className="status">{d.status}</span>
              </td>
              <td>{d.timeOpen}</td>
              <td className="muted">{d.businessImpact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.risk} underline={false}>
            Raised Risks
          </GuidanceHint>
        }
        aside={`${RISKS.length} carried`}
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '34%' }}>Risk</th>
            <th>Severity</th>
            <th>Owner</th>
            <th>Impacted orgs</th>
            <th style={{ width: '24%' }}>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          {RISKS.map((r) => (
            <tr key={r.id}>
              <td className="strong">{r.risk}</td>
              <td>
                <span className="status">{r.severity}</span>
              </td>
              <td>{r.owner}</td>
              <td className="muted">{r.impactedOrgs.join(', ')}</td>
              <td className="muted">{r.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Org Summaries Generated" aside="Different by context" />
      <div className="grid-3">
        {ORG_SUMMARIES.map((s) => (
          <div className="work-card" key={s.org}>
            <div className="label" style={{ marginBottom: 12 }}>
              {s.org}
            </div>
            <ul className="stack-8">
              {s.lines.map((l, i) => (
                <li
                  key={i}
                  style={{ fontSize: 13, color: 'var(--graphite)', lineHeight: 1.5 }}
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SectionHeader title="Meeting Scores" aside="Formal review labels" />
      <div className="kv-panel">
        {SCORES.map((s) => (
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
    </div>
  )
}
