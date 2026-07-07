import { useState } from 'react'
import type { ReactNode } from 'react'
import { Kicker, SectionHeader, BulletList, KVPanel } from '../components/primitives'
import { GuidanceHint, type GuidanceCopy } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  AGENTS,
  ORG_SUMMARIES,
  AGENT_AUTHORIZATIONS,
  GOVERNED_DELEGATION,
  AUTHORITY_BOUNDARY_COPY,
  DELEGATION_PRINCIPLE,
  DELEGATION_STRATEGY,
} from '../data/mock'
import type { Agent, AgentAuthorization } from '../types'

const SCOPE_TEXT: Record<string, string> = {
  observe: 'Observe',
  summarize: 'Summarize',
  represent_context: 'Represent context',
  answer_from_approved_knowledge: 'Answer from approved knowledge',
  escalate_only: 'Escalate only',
  none: 'None',
}

function authStatusDisplay(a: AgentAuthorization): { text: string; cls: string } {
  switch (a.authorizationStatus) {
    case 'authorized':
      return {
        text: a.delegationScope === 'summarize' ? 'Authorized — summary-only' : 'Authorized to observe',
        cls: '',
      }
    case 'human_required':
      return { text: 'Human required — observe only', cls: 'critical' }
    case 'blocked':
      return { text: 'Authorization blocked', cls: 'health-missing' }
    case 'observe_only':
      return { text: 'Observe only', cls: '' }
    case 'summary_only':
      return { text: 'Summary-only', cls: '' }
    default:
      return { text: a.authorizationStatus, cls: '' }
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const MODE_GUIDE: Record<string, GuidanceCopy> = {
  'Listen Mode': GUIDANCE.listen_mode,
  'Represent Mode': GUIDANCE.represent_mode,
  'Proxy Mode': GUIDANCE.proxy_mode,
  'Escalation Mode': GUIDANCE.escalation_mode,
}

const MODES: { mode: string; def: string }[] = [
  { mode: 'Listen Mode', def: 'Attends silently and summarizes.' },
  { mode: 'Represent Mode', def: 'Captures information based on approved instructions.' },
  { mode: 'Proxy Mode', def: 'Answers only from approved knowledge.' },
  { mode: 'Escalation Mode', def: 'Alerts a human when live intervention is required.' },
]

const GOVERNANCE = [
  'Agents must show their mode.',
  'Agents must show authority boundaries.',
  'Agents cannot make unauthorized commitments.',
  'Agents escalate decisions requiring human authority.',
  'Agents summarize only to authorized recipients.',
  'Sensitive meetings require explicit permission.',
]

export function Agents() {
  const [selectedId, setSelectedId] = useState('agent-revops')
  const selected = AGENTS.find((a) => a.id === selectedId) ?? AGENTS[0]
  const summary = ORG_SUMMARIES.find((s) => s.org === selected.representing) ?? ORG_SUMMARIES[0]

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Representation Layer</Kicker>
        <h1 className="display">Agents</h1>
        <p className="thesis">
          Agents extend coverage only through governed delegation. They do not replace
          accountability.
        </p>
      </header>

      <div className="big-statement" style={{ fontSize: 20, marginBottom: 16 }}>
        {DELEGATION_PRINCIPLE}
      </div>
      <p className="muted" style={{ maxWidth: '72ch', marginBottom: 40 }}>
        {DELEGATION_STRATEGY}
      </p>

      <div className="canvas-split" style={{ gridTemplateColumns: '260px 1fr', gap: 40 }}>
        <div className="stack-24">
          <div className="select-list">
            {AGENTS.map((a) => (
              <button
                key={a.id}
                className={`select-item${selectedId === a.id ? ' active' : ''}`}
                onClick={() => setSelectedId(a.id)}
              >
                <div className="si-title">{a.name}</div>
                <div className="si-note">
                  {a.agentType} · {a.mode}
                </div>
              </button>
            ))}
          </div>

          <div>
            <div className="label" style={{ marginBottom: 12 }}>
              Agent modes
            </div>
            <div className="kv-panel">
              {MODES.map((m) => (
                <div className="kv-row" key={m.mode} style={{ display: 'block' }}>
                  <div className="strong" style={{ fontWeight: 600, fontSize: 13 }}>
                    {MODE_GUIDE[m.mode] ? (
                      <GuidanceHint {...MODE_GUIDE[m.mode]}>{m.mode}</GuidanceHint>
                    ) : (
                      m.mode
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                    {m.def}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AgentDetail agent={selected} summary={summary} />
      </div>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.governed_delegation} underline={false}>
            Governed Delegation
          </GuidanceHint>
        }
        aside="Consented · bounded · auditable"
      />
      <KVPanel rows={GOVERNED_DELEGATION.map((r) => ({ k: r.k, v: r.v }))} />

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.authorized_agent_coverage} underline={false}>
            Authorized Coverage Examples
          </GuidanceHint>
        }
        aside="Supported by receipts"
      />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '34%' }}>Meeting</th>
            <th>Authorization</th>
            <th>Scope</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {AGENT_AUTHORIZATIONS.map((a) => {
            const s = authStatusDisplay(a)
            const highRisk = a.riskLevel === 'restricted' || a.riskLevel === 'high'
            return (
              <tr key={a.id}>
                <td>
                  <div className="strong">{a.meetingTitle}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                    {a.reason}
                  </div>
                </td>
                <td>
                  <span className={`status ${s.cls}`}>{s.text}</span>
                </td>
                <td className="muted">{SCOPE_TEXT[a.delegationScope]}</td>
                <td>
                  <span className={`status ${highRisk ? 'critical' : ''}`}>
                    {capitalize(a.riskLevel)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="stack-8" style={{ marginTop: 16 }}>
        {AGENT_AUTHORIZATIONS.map((a) => (
          <div className="receipt-line" key={a.id}>
            {a.receiptDescription}
          </div>
        ))}
      </div>

      <SectionHeader
        title={
          <GuidanceHint {...GUIDANCE.authority_boundary} underline={false}>
            Authority Boundary
          </GuidanceHint>
        }
      />
      <div className="big-statement" style={{ fontSize: 18 }}>
        {AUTHORITY_BOUNDARY_COPY}
      </div>

      <SectionHeader title="Governance Rules" aside="Non-negotiable" />
      <div className="grid-3">
        {GOVERNANCE.map((g) => (
          <div className="work-card" key={g}>
            <p style={{ fontSize: 14, color: 'var(--graphite)', lineHeight: 1.5 }}>{g}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentDetail({
  agent,
  summary,
}: {
  agent: Agent
  summary: { org: string; lines: string[] }
}) {
  return (
    <div>
      <div className="contract">
        <div className="c-head">
          <span className="title">{agent.name}</span>
          <span className="seal">{agent.mode}</span>
        </div>
        <div className="contract-grid">
          <Item label="Representing" value={agent.representing} />
          <Item label="Agent type" value={agent.agentType} />
          <Item label="Active mode" value={agent.mode} />
          <Item label="Summary format" value={agent.summaryFormat} />
          <Item
            label={
              <GuidanceHint {...GUIDANCE.authority_boundary}>Authority boundary</GuidanceHint>
            }
            value={agent.authorityBoundary}
            full
          />
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 12 }}>
            Captures
          </div>
          <BulletList items={agent.captures} />
        </div>
        <div>
          <div className="label" style={{ marginBottom: 12 }}>
            Escalates when
          </div>
          <BulletList items={agent.escalatesWhen} />
        </div>
      </div>

      <SectionHeader title="Authorized Coverage" aside="Under this agent's delegation" />
      <table className="exec-table">
        <tbody>
          {agent.allowedMeetings.map((m) => (
            <tr key={m.meeting}>
              <td className="strong">{m.meeting}</td>
              <td className="muted" style={{ textAlign: 'right' }}>
                {m.coverage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Org-Specific Summary" aside={summary.org} />
      <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
        <BulletList items={summary.lines} />
      </div>
    </div>
  )
}

function Item({ label, value, full }: { label: ReactNode; value: string; full?: boolean }) {
  return (
    <div className={`contract-item${full ? ' full' : ''}`}>
      <div className="ci-label">{label}</div>
      <div className="ci-value">{value}</div>
    </div>
  )
}
