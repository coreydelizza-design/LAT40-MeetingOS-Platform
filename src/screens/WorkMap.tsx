import { useMemo, useState } from 'react'
import { Kicker, SectionHeader, BulletList, KVPanel } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  CLAIMED_RELATIONSHIPS,
  GRAPH_EDGES,
  SCORECARDS,
  EVENT_RECEIPTS,
  OPERATIONAL_INTERVENTIONS,
  SCORECARD_READINGS,
  SCORECARD_LINKAGE,
  REDRAW_TARGETS,
} from '../data/mock'
import type { HealthState, RelationshipScorecard, EventReceipt } from '../types'

const HEALTH_TEXT: Record<HealthState, string> = {
  healthy: 'Healthy',
  slow: 'Slow',
  escalated: 'Escalated',
  missing: 'Missing',
  improving: 'Improving',
}

const SOURCE_TEXT: Record<EventReceipt['source'], string> = {
  meeting_builder: 'Meeting Builder',
  attendee_view: 'Attendee View',
  decision_room: 'Decision Room',
  agent_layer: 'Agent Layer',
  closeout: 'Close-out',
}

function HealthLabel({ state }: { state: HealthState }) {
  return <span className={`status health-${state}`}>{HEALTH_TEXT[state]}</span>
}

export function WorkMap() {
  const [selectedId, setSelectedId] = useState('sc-sales-legal')
  const selected =
    SCORECARDS.find((s) => s.id === selectedId) ?? SCORECARDS[0]

  const receipts = useMemo(() => {
    const byId = new Map(EVENT_RECEIPTS.map((r) => [r.id, r]))
    return selected.evidenceReceiptIds
      .map((id) => byId.get(id))
      .filter((r): r is EventReceipt => Boolean(r))
  }, [selected])

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Work Reality Map</Kicker>
        <h1 className="display">
          <GuidanceHint {...GUIDANCE.true_operational_graph} underline={false}>
            True Operational Graph
          </GuidanceHint>
        </h1>
        <p className="thesis">
          The org chart shows structure. The True Operational Graph shows measured operating
          reality.
        </p>
      </header>

      <div
        className="serif"
        style={{
          fontSize: 19,
          lineHeight: 1.4,
          padding: '18px 0',
          borderTop: '1px solid var(--line-ink)',
          borderBottom: '1px solid var(--line-ink)',
          marginBottom: 40,
          maxWidth: '70ch',
        }}
      >
        Every line is drawn from relationship scorecards. Every scorecard opens to the receipts
        behind it.
      </div>

      {/* 1 — Claimed vs Measured */}
      <SectionHeader title="Claimed vs Measured" aside="Structure said vs. operating reality" />
      <p className="muted" style={{ maxWidth: '74ch', marginBottom: 24, fontSize: 13.5 }}>
        The distance between the claimed model and the measured model is not a reporting error. It
        is the operating gap — and closing it is a consulting engagement, not a dashboard toggle.
      </p>
      <div className="grid-2">
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            <GuidanceHint {...GUIDANCE.claimed_model}>Claimed Model</GuidanceHint>
          </div>
          <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Built from Org Cards and leadership-stated dependencies.
          </p>
          <div className="ledger">
            {CLAIMED_RELATIONSHIPS.map((c) => (
              <div className="ledger-row" key={c.id} style={{ gridTemplateColumns: '1fr auto' }}>
                <div>
                  <div className="primary" style={{ fontWeight: 500 }}>
                    {c.claimedDependency}
                  </div>
                  <div className="secondary">
                    {c.expectedWorkflow} · {c.expectedAgentUse}
                  </div>
                </div>
                <span className="meta-line">{c.confidence}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            <GuidanceHint {...GUIDANCE.measured_model}>Measured Model</GuidanceHint>
          </div>
          <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Drawn from 60 days of meeting, attendee, agent, decision, and dependency receipts.
          </p>
          <div className="select-list">
            {GRAPH_EDGES.map((e) => {
              const sc = SCORECARDS.find((s) => s.id === e.scorecardId)
              return (
                <button
                  key={e.scorecardId}
                  className={`edge${selectedId === e.scorecardId ? ' active' : ''}`}
                  onClick={() => setSelectedId(e.scorecardId)}
                >
                  <span className="edge-label">{e.label}</span>
                  <span className={`edge-line ${e.lineStyle}`} />
                  <span className="edge-note">{e.note}</span>
                  {sc ? <HealthLabel state={sc.healthState} /> : null}
                </button>
              )
            })}
          </div>
          <p className="faint" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
            Line weight reflects measured volume and speed — thick is heavy and slow, dotted is a{' '}
            <GuidanceHint {...GUIDANCE.missing_expected_relationship} align="right">
              missing expected relationship
            </GuidanceHint>
            . Select an edge to open its scorecard.
          </p>
        </div>
      </div>

      {/* Relationship Scorecards — the bank-statement layer */}
      <SectionHeader title="Relationship Scorecards" aside="The evidence layer" />
      <div
        className="serif"
        style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 10 }}
      >
        Receipts are the facts. Scorecards are the bank statements.
      </div>
      <p className="muted" style={{ maxWidth: '74ch', marginBottom: 8 }}>
        Each scorecard aggregates factual receipts by organization relationship, decision type,
        workflow type, and period. These scorecards are what the True Operational Graph renders.
      </p>

      {/* 2 — Selected Scorecard Detail (bank statement) */}
      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.relationship_scorecard} underline={false}>
            Relationship Scorecard
          </GuidanceHint>
        }
        aside={selected.relationshipLabel}
      />
      <Scorecard sc={selected} />

      {/* 3 — Receipts Ledger */}
      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.receipts_ledger} underline={false}>
            Receipts Ledger
          </GuidanceHint>
        }
        aside={`${receipts.length} events behind this scorecard`}
      />
      {receipts.length ? (
        <table className="exec-table">
          <thead>
            <tr>
              <th style={{ width: '118px' }}>Timestamp</th>
              <th>Source</th>
              <th>Actor org</th>
              <th>Target org</th>
              <th>Event type</th>
              <th>Evidence</th>
              <th style={{ width: '26%' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((r) => (
              <tr key={r.id}>
                <td className="muted" style={{ whiteSpace: 'nowrap', fontSize: 12.5 }}>
                  {r.timestamp}
                </td>
                <td>{SOURCE_TEXT[r.source]}</td>
                <td className="muted">{r.actorOrg}</td>
                <td className="muted">{r.targetOrg}</td>
                <td className="strong" style={{ fontSize: 13 }}>
                  {r.eventType}
                </td>
                <td className="muted" style={{ fontSize: 12.5 }}>
                  {r.evidenceLabel}
                </td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="work-card">
          <p className="muted">
            No direct measured events. This edge is expected from the claimed model but has no
            receipts in the current period.
          </p>
        </div>
      )}

      {/* 4 — Operational Reading (per selected edge) */}
      <SectionHeader title="Operational Reading" aside="Drawn from receipts, not interviews" />
      <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
        <p className="serif" style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--graphite)' }}>
          {SCORECARD_READINGS[selected.id]}
        </p>
      </div>

      {/* 5 — Intervention Linkage (selected) */}
      <SectionHeader title="Intervention Linkage" aside="From evidence to action" />
      <KVPanel
        rows={[
          { k: 'Recommended process fix', v: SCORECARD_LINKAGE[selected.id].processFix },
          { k: 'Meeting Builder requirement', v: SCORECARD_LINKAGE[selected.id].meetingBuilderRequirement },
          {
            k: 'Attendee validation requirement',
            v: SCORECARD_LINKAGE[selected.id].attendeeValidationRequirement,
          },
          {
            k: 'Governed delegation opportunity',
            v: SCORECARD_LINKAGE[selected.id].governedDelegationOpportunity,
          },
          {
            k: 'Quarterly redraw expectation',
            v: SCORECARD_LINKAGE[selected.id].quarterlyRedrawExpectation,
          },
        ]}
      />

      {/* 5 — Recommended Interventions */}
      <SectionHeader title="Recommended Interventions" />
      <div className="ledger">
        {OPERATIONAL_INTERVENTIONS.map((it, i) => (
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

      {/* 6 — Quarterly Redraw */}
      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.quarterly_redraw} underline={false}>
            Quarterly Redraw
          </GuidanceHint>
        }
      />
      <div className="big-statement" style={{ fontSize: 20 }}>
        Each quarter, the graph is redrawn from new scorecards. Edges should become thinner, faster,
        and less escalation-heavy where interventions worked.
      </div>
      <div className="label" style={{ margin: '28px 0 12px' }}>
        Targets for next redraw
      </div>
      <div className="ledger">
        {REDRAW_TARGETS.map((t) => (
          <div className="ledger-row" key={t.label} style={{ gridTemplateColumns: '200px 1fr' }}>
            <span className="primary" style={{ fontWeight: 500 }}>
              {t.label}
            </span>
            <span className="secondary">{t.value}</span>
          </div>
        ))}
      </div>

      <div
        className="serif"
        style={{
          fontSize: 19,
          lineHeight: 1.45,
          padding: '24px 0 4px',
          marginTop: 40,
          borderTop: '1px solid var(--line-ink)',
          maxWidth: '72ch',
        }}
      >
        MeetingOS does not turn meetings into recaps. It turns meeting behavior into auditable
        operating evidence.
      </div>
    </div>
  )
}

function Scorecard({ sc }: { sc: RelationshipScorecard }) {
  const rows: { k: string; v: string; serif?: boolean }[] = [
    { k: 'Relationship', v: sc.relationshipLabel, serif: true },
    { k: 'Decision type', v: sc.decisionType },
    { k: 'Workflow type', v: sc.workflowType },
    { k: 'Period', v: sc.period },
    { k: 'Event count', v: String(sc.eventCount) },
    { k: 'Meeting count', v: String(sc.meetingCount) },
    { k: 'Joint hours', v: `${sc.jointHours} hrs` },
    { k: 'Average resolution time', v: sc.averageResolutionTime },
    { k: 'Median resolution time', v: sc.medianResolutionTime },
    { k: 'Async resolution rate', v: sc.asyncResolutionRate },
    { k: 'Live escalation rate', v: sc.liveEscalationRate },
    { k: 'Decision deferral rate', v: sc.decisionDeferralRate },
    { k: 'Reopen rate', v: sc.reopenRate },
    { k: 'Unresolved dependencies', v: String(sc.unresolvedDependencyCount) },
    { k: 'Average dependency age', v: sc.averageDependencyAge },
    { k: 'Agent-coverable hours', v: `${sc.agentCoverableHours} hrs` },
    { k: 'Authorized agent coverage hours', v: `${sc.authorizedAgentCoverageHours} hrs` },
  ]

  return (
    <div>
      <div className="row" style={{ marginBottom: 12, gap: 12 }}>
        <HealthLabel state={sc.healthState} />
        <span className="meta-line">Statement period · {sc.period}</span>
      </div>
      <div className="kv-panel">
        {rows.map((r) => (
          <div className="kv-row" key={r.k}>
            <span className="k">{r.k}</span>
            <span className={`v${r.serif ? ' serif' : ''}`}>{r.v}</span>
          </div>
        ))}
        <div className="kv-row">
          <span className="k">Top repeat topics</span>
          <span className="v" style={{ textAlign: 'right', fontWeight: 400, maxWidth: '60%' }}>
            {sc.topRepeatTopics.join(' · ')}
          </span>
        </div>
      </div>
      <div className="work-card" style={{ marginTop: 20, borderColor: 'var(--line-ink)' }}>
        <div className="label" style={{ marginBottom: 10 }}>
          Recommended intervention
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--graphite)' }}>
          {sc.recommendedIntervention}
        </p>
      </div>
    </div>
  )
}
