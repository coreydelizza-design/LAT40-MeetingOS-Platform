import { useState } from 'react'
import type { ReactNode } from 'react'
import { Kicker, SectionHeader, BulletList } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import { ORG_CARDS } from '../data/mock'
import type { OrgCard } from '../types'

export function OrgCards() {
  const [selectedId, setSelectedId] = useState('org-revops')
  const selected = ORG_CARDS.find((o) => o.id === selectedId) ?? ORG_CARDS[0]

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Operating Profiles</Kicker>
        <h1 className="display">Org Cards</h1>
        <p className="thesis">
          The org chart shows reporting lines. Org Cards show what each organization needs to
          succeed.
        </p>
      </header>

      <div
        className="canvas-split"
        style={{ gridTemplateColumns: '260px 1fr', gap: 40 }}
      >
        <div className="select-list">
          {ORG_CARDS.map((o) => (
            <button
              key={o.id}
              className={`select-item${selectedId === o.id ? ' active' : ''}`}
              onClick={() => setSelectedId(o.id)}
            >
              <div className="si-title">{o.orgName}</div>
              <div className="si-note">{o.strategicPriorities[0]}</div>
            </button>
          ))}
        </div>

        <OrgDetail org={selected} />
      </div>
    </div>
  )
}

function OrgDetail({ org }: { org: OrgCard }) {
  return (
    <div>
      <div className="big-statement" style={{ fontSize: 22 }}>
        <span className="label" style={{ display: 'block', marginBottom: 12 }}>
          <GuidanceHint {...GUIDANCE.claimed_operating_model}>
            {org.orgName} · Mission
          </GuidanceHint>
        </span>
        {org.mission}
      </div>

      <div className="grid-2" style={{ marginTop: 32 }}>
        <Column title="Strategic priorities" items={org.strategicPriorities} />
        <Column title="Owned metrics" items={org.ownedMetrics} />
        <Column
          title={<GuidanceHint {...GUIDANCE.decision_rights}>Decision rights</GuidanceHint>}
          items={org.decisionRights}
        />
        <Column title="Critical inputs" items={org.criticalInputs} />
        <Column title="Critical outputs" items={org.criticalOutputs} />
        <Column
          title={<GuidanceHint {...GUIDANCE.dependencies}>Key dependencies</GuidanceHint>}
          items={org.dependencies}
        />
        <Column title="Common blockers" items={org.commonBlockers} />
        <Column title="Active initiatives" items={org.activeInitiatives} />
        <Column
          title={<GuidanceHint {...GUIDANCE.escalation_rules}>Escalation rules</GuidanceHint>}
          items={org.escalationRules}
        />
        <Column
          title={<GuidanceHint {...GUIDANCE.agent_instructions}>Agent instructions</GuidanceHint>}
          items={org.agentInstructions}
        />
      </div>

      <SectionHeader title="Meetings This Org Should Attend" />
      <div className="grid-2">
        <MeetingClass label="Required live" items={org.meetingsToAttend.requiredLive} strong />
        <MeetingClass label="Agent can cover" items={org.meetingsToAttend.agentCanCover} />
        <MeetingClass label="Summary only" items={org.meetingsToAttend.summaryOnly} />
        <MeetingClass label="Not relevant" items={org.meetingsToAttend.notRelevant} muted />
      </div>
    </div>
  )
}

function Column({ title, items }: { title: ReactNode; items: string[] }) {
  return (
    <div>
      <div className="label" style={{ marginBottom: 12 }}>
        {title}
      </div>
      <BulletList items={items} />
    </div>
  )
}

function MeetingClass({
  label,
  items,
  strong,
  muted,
}: {
  label: string
  items: string[]
  strong?: boolean
  muted?: boolean
}) {
  return (
    <div
      className="work-card"
      style={strong ? { borderColor: 'var(--line-ink)' } : undefined}
    >
      <div className="label" style={{ marginBottom: 12 }}>
        {label}
      </div>
      {items.length ? (
        <ul className="stack-8">
          {items.map((it) => (
            <li
              key={it}
              style={{
                fontSize: 14,
                fontWeight: strong ? 600 : 400,
                color: muted ? 'var(--gray)' : 'var(--graphite)',
              }}
            >
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <span className="faint" style={{ fontSize: 13 }}>
          None
        </span>
      )}
    </div>
  )
}
