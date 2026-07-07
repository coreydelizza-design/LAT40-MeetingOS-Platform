import { Kicker, SectionHeader, ExecPanel, ModeratorPanel, BulletList } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import { PRODUCT } from '../constants'
import type { ViewId } from '../types'
import {
  TODAY_OPENING,
  ALIGNMENT_SUMMARY,
  JUDGMENT_MEETINGS,
  MY_ROLE_TODAY,
  ORG_IMPACT,
  AGENT_COVERAGE_TODAY,
  DECISION_QUEUE,
  FRICTION_SIGNALS,
  TODAY_MODERATOR,
} from '../data/mock'

/** Guidance keyed by the summary panel label text. */
const SUMMARY_GUIDANCE: Record<string, (typeof GUIDANCE)[keyof typeof GUIDANCE]> = {
  'Live Required': GUIDANCE.live_required,
  'Agent Coverage': GUIDANCE.agent_coverage,
  'Decisions Pending': GUIDANCE.decisions_pending,
  'Structure Needed': GUIDANCE.structure_needed,
  'Recoverable Time': GUIDANCE.recoverable_time,
}

/** Where each recommended action takes the employee. Low-risk navigation only. */
const ACTION_TARGET: Record<string, ViewId> = {
  'Attend live': 'decision-room',
  'Attend with prep': 'decision-room',
  'Authorize agent': 'attendee',
  'Convert or decline': 'calendar',
  'Add decision owner': 'build',
}

export function TodayView({ navigate }: { navigate: (v: ViewId) => void }) {
  return (
    <div className="canvas">
      <header className="page-head hero">
        <Kicker>{PRODUCT.workspace}</Kicker>
        <h1 className="display">Executive Alignment Room</h1>
        <p className="thesis">
          Today&rsquo;s operating brief for live time, decisions, agent coverage, and
          organizational friction.
        </p>
      </header>

      {/* Opening brief — one authoritative line */}
      <div
        className="serif"
        style={{
          fontSize: 20,
          lineHeight: 1.4,
          padding: '20px 0',
          borderTop: '1px solid var(--line-ink)',
          borderBottom: '1px solid var(--line-ink)',
          marginBottom: 40,
          maxWidth: '68ch',
        }}
      >
        {TODAY_OPENING}
      </div>

      {/* 1. Today's Alignment Summary — restrained briefing signals */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Today&rsquo;s Alignment Summary
      </div>
      <div
        className="panel-row"
        style={{ gridTemplateColumns: `repeat(${ALIGNMENT_SUMMARY.length}, 1fr)` }}
      >
        {ALIGNMENT_SUMMARY.map((s) => {
          const guide = SUMMARY_GUIDANCE[s.label]
          return (
            <ExecPanel
              key={s.label}
              label={
                guide ? (
                  <GuidanceHint {...guide}>{s.label}</GuidanceHint>
                ) : (
                  s.label
                )
              }
              figure={s.figure}
              unit={s.unit}
              foot={s.foot}
            />
          )
        })}
      </div>

      <div className="canvas-split" style={{ marginTop: 8 }}>
        <div>
          {/* 2. Meetings That Need Judgment — the core section */}
          <SectionHeader title="Meetings That Need Judgment" aside="Where your attention decides the outcome" />
          <table className="exec-table">
            <thead>
              <tr>
                <th style={{ width: '26%' }}>Meeting</th>
                <th>System judgment</th>
                <th>Your role</th>
                <th>Recommended action</th>
                <th>Time impact</th>
              </tr>
            </thead>
            <tbody>
              {JUDGMENT_MEETINGS.map((m) => {
                const target = ACTION_TARGET[m.action]
                return (
                  <tr key={m.title}>
                    <td className="strong">{m.title}</td>
                    <td>
                      <span className="status">{m.judgment}</span>
                    </td>
                    <td className="muted">{m.role}</td>
                    <td>
                      {target ? (
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => navigate(target)}
                        >
                          {m.action}
                        </button>
                      ) : (
                        m.action
                      )}
                    </td>
                    <td className="muted">{m.impact}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* 3. My Role Today */}
          <SectionHeader title="My Role Today" aside="Why you matter today" />
          <table className="exec-table">
            <tbody>
              {MY_ROLE_TODAY.map((r) => (
                <tr key={r.role + r.where}>
                  <td className="strong" style={{ width: '34%' }}>
                    {r.role}
                  </td>
                  <td className="muted">{r.where}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Org Impact Panel — org-aware */}
          <SectionHeader title="Revenue Operations Impact" aside="Your organization" />
          <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
            <BulletList items={ORG_IMPACT.signals} />
            <p className="faint" style={{ fontSize: 12.5, marginTop: 16, lineHeight: 1.5 }}>
              Employees in {ORG_IMPACT.otherOrgs.join(', ')} see their organization&rsquo;s own
              impact in this panel.
            </p>
          </div>

          {/* 5. Authorized Agent Coverage */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.authorized_agent_coverage} underline={false}>
                Authorized Agent Coverage
              </GuidanceHint>
            }
            aside="Governed delegation"
          />
          <table className="exec-table">
            <tbody>
              {AGENT_COVERAGE_TODAY.map((a) => (
                <tr key={a.meeting}>
                  <td className="strong">{a.meeting}</td>
                  <td className="muted" style={{ textAlign: 'right' }}>
                    {a.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 6. Decision Queue */}
          <SectionHeader title="Decision Queue" aside="Awaiting input or ownership" />
          <table className="exec-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Decision</th>
                <th>Owner</th>
                <th>Status</th>
                <th>What it needs</th>
              </tr>
            </thead>
            <tbody>
              {DECISION_QUEUE.map((d) => (
                <tr key={d.decision}>
                  <td className="strong">{d.decision}</td>
                  <td className="muted">{d.owner}</td>
                  <td>
                    <span className="status">{d.status}</span>
                  </td>
                  <td>{d.need}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 7. Work Friction Signals */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.work_friction_signals} underline={false}>
                Work Friction Signals
              </GuidanceHint>
            }
            aside="Where the organization creates drag"
          />
          <div className="work-card">
            <BulletList items={FRICTION_SIGNALS} />
          </div>
        </div>

        {/* 8. Moderator Panel — guides the employee */}
        <ModeratorPanel
          sub="Guiding your day"
          notes={TODAY_MODERATOR}
          foot={
            <div className="stack-8">
              <button
                className="btn btn-sm btn-ghost"
                style={{ width: '100%' }}
                onClick={() => navigate('attendee')}
              >
                Review invite
              </button>
              <button
                className="btn btn-sm btn-solid"
                style={{ width: '100%' }}
                onClick={() => navigate('build')}
              >
                {PRODUCT.primaryAction}
              </button>
            </div>
          }
        />
      </div>
    </div>
  )
}
