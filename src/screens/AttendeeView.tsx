import { useState } from 'react'
import { Kicker, SectionHeader, ModeratorPanel, KVPanel } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  ATTENDEE,
  ATTENDEE_INVITE,
  WHY_INVITED,
  ATTENDANCE_ACTIONS,
  CHALLENGE_OPTIONS,
  PREREAD_ITEMS,
  AGENT_OPTIONS,
  AGENT_RECOMMENDED,
  ATTENDANCE_JUDGMENT,
} from '../data/mock'
import type { AttendeeReceiptPreview, ViewId } from '../types'

export function AttendeeView({ navigate }: { navigate: (v: ViewId) => void }) {
  const [actionKey, setActionKey] = useState<string | null>(null)
  const [challenge, setChallenge] = useState<string | null>(null)
  const [agent, setAgent] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  const action = ATTENDANCE_ACTIONS.find((a) => a.key === actionKey) ?? null
  const challengeOpt = CHALLENGE_OPTIONS.find((c) => c.label === challenge) ?? null

  // A role challenge takes precedence in the receipt (it is the stronger fact).
  const eventType = challengeOpt ? 'role_challenged' : (action?.eventType ?? '—')
  const description = challengeOpt
    ? challengeOpt.description
    : (action?.description ?? 'No response captured yet. Select an attendance decision below.')
  const hasResponse = Boolean(action || challengeOpt)

  const preview: AttendeeReceiptPreview = {
    id: 'preview',
    meetingId: ATTENDEE.meetingId,
    attendee: ATTENDEE.name,
    attendeeOrg: ATTENDEE.org,
    assignedRole: ATTENDEE.role,
    selectedAction: action?.label ?? (challengeOpt ? 'Challenge my assigned role' : '—'),
    reason: challengeOpt?.label,
    agentSelection: agent ?? undefined,
    receiptEventType: eventType,
    receiptDescription: description,
    timestamp: 'On submission',
  }

  const selectChallenge = (label: string) => {
    setChallenge((prev) => (prev === label ? null : label))
    setActionKey('challenge')
  }

  return (
    <div className="canvas">
      <div className="canvas-split">
        <div>
          <header className="page-head">
            <Kicker>Governed Attendance</Kicker>
            <h1 className="display">Attendee View</h1>
            <p className="thesis">Before you accept live time, confirm why you are needed.</p>
          </header>

          {/* Opening brief */}
          <div className="contract">
            <div className="c-head">
              <span className="title">{ATTENDEE_INVITE.meeting}</span>
              <span className="seal">Invite · Internal restricted</span>
            </div>
            <div className="contract-item full" style={{ borderRight: 0 }}>
              <div className="ci-label">Invite status</div>
              <div className="ci-value">{ATTENDEE_INVITE.inviteStatus}</div>
            </div>
            <div className="contract-item full" style={{ borderRight: 0 }}>
              <div className="ci-label">Reason</div>
              <div className="ci-value">{ATTENDEE_INVITE.reason}</div>
            </div>
            <div className="contract-grid">
              {ATTENDEE_INVITE.contract.map((c, i) => (
                <div
                  className={`contract-item${i === ATTENDEE_INVITE.contract.length - 1 ? ' full' : ''}`}
                  key={c.label}
                >
                  <div className="ci-label">{c.label}</div>
                  <div className="ci-value">{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 1 — Why You Are Invited */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.assigned_role} underline={false}>
                Why You Are Invited
              </GuidanceHint>
            }
          />
          <KVPanel
            rows={WHY_INVITED.map((r) => ({
              k: r.k,
              v:
                r.v === 'Required Contributor' ? (
                  <GuidanceHint {...GUIDANCE.required_contributor}>{r.v}</GuidanceHint>
                ) : (
                  r.v
                ),
            }))}
          />
          <p className="note-box" style={{ marginTop: 16 }}>
            If your assigned role is inaccurate, challenge it before accepting live time.
          </p>

          {/* 2 — Attendance Decision */}
          <SectionHeader title="Attendance Decision" aside="Frontend mock — creates a receipt" />
          <div className="choice-grid">
            {ATTENDANCE_ACTIONS.map((a) => (
              <button
                key={a.key}
                className={`choice${actionKey === a.key ? ' selected' : ''}`}
                onClick={() => {
                  setActionKey((prev) => (prev === a.key ? null : a.key))
                  if (a.key !== 'challenge') setChallenge(null)
                }}
              >
                {a.key === 'authorize_summary' ? (
                  <GuidanceHint {...GUIDANCE.summary_only} underline={false}>
                    {a.label}
                  </GuidanceHint>
                ) : (
                  a.label
                )}
              </button>
            ))}
          </div>
          {hasResponse ? (
            <div className="receipt-line" style={{ marginTop: 16 }}>
              Receipt created: attendee_view · {eventType} · {description}
            </div>
          ) : null}

          {/* 3 — Role Challenge */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.role_challenge} underline={false}>
                Role Challenge
              </GuidanceHint>
            }
          />
          <p className="muted" style={{ marginBottom: 16 }}>
            Why is this role inaccurate?
          </p>
          <div className="chip-row">
            {CHALLENGE_OPTIONS.map((c) => (
              <button
                key={c.label}
                className={`chip${challenge === c.label ? ' selected' : ''}`}
                onClick={() => selectChallenge(c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {challengeOpt ? (
            <div className="receipt-line" style={{ marginTop: 16 }}>
              Attendee View: {challengeOpt.description}
            </div>
          ) : null}

          {/* 4 — Pre-Read Readiness */}
          <SectionHeader title="Pre-Read Readiness" aside="Context required before live time" />
          <table className="exec-table">
            <tbody>
              {PREREAD_ITEMS.map((p) => (
                <tr key={p.item}>
                  <td className="strong">{p.item}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="status">{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 16, gap: 12 }}>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setActionKey('request_preread')
                setChallenge(null)
              }}
            >
              Request missing pre-read
            </button>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Two items missing · one needs review
            </span>
          </div>

          {/* 5 — Agent Substitution */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.agent_coverage} underline={false}>
                Agent Coverage
              </GuidanceHint>
            }
          />
          <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
            <p style={{ fontSize: 14, color: 'var(--graphite)', lineHeight: 1.55 }}>
              An agent may attend to observe and summarize, but cannot provide customer judgment,
              approve pricing, negotiate terms, or make commitments.
            </p>
            <div className="chip-row" style={{ marginTop: 16 }}>
              {AGENT_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`chip${agent === o ? ' selected' : ''}`}
                  onClick={() => setAgent((prev) => (prev === o ? null : o))}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="row" style={{ marginTop: 16, gap: 10 }}>
              <span className="label">Recommended</span>
              <span className="status critical">{AGENT_RECOMMENDED}</span>
            </div>
          </div>

          {/* Delegation Authorization */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.governed_delegation} underline={false}>
                Delegation Authorization
              </GuidanceHint>
            }
            aside="Consented · bounded"
          />
          <KVPanel
            rows={[
              { k: 'Assigned role', v: ATTENDEE.role },
              { k: 'Delegation recommendation', v: 'Human required — agent may observe only' },
              { k: 'Risk level', v: 'Restricted' },
              { k: 'Allowed scope', v: 'Observe' },
              {
                k: 'Authority boundary',
                v: 'Agent may observe and summarize, but cannot approve, negotiate, or commit.',
              },
            ]}
          />
          <div className="row" style={{ marginTop: 16, gap: 12 }}>
            <button
              className={`chip${consent ? ' selected' : ''}`}
              aria-pressed={consent}
              onClick={() => setConsent((v) => !v)}
            >
              {consent ? 'Consent captured' : 'Capture consent'}
            </button>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Delegation requires consent before an agent is authorized.
            </span>
          </div>
          {consent ? (
            <div className="receipt-line" style={{ marginTop: 16 }}>
              Receipt created: attendee_view · agent_authorization_granted · Sales authorized
              observe-only agent coverage for Pricing Exception Review under restricted delegation
              boundary.
            </div>
          ) : null}

          {/* 6 — Receipt Preview */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.receipt_preview} underline={false}>
                Receipt Preview
              </GuidanceHint>
            }
            aside="Feeds the True Operational Graph"
          />
          <div className="receipt-line" style={{ marginBottom: 16 }}>
            attendee_view · {preview.receiptEventType} · {preview.attendeeOrg} · {ATTENDEE.meetingId}
          </div>
          <KVPanel
            rows={[
              { k: 'source', v: 'attendee_view' },
              { k: 'event type', v: preview.receiptEventType },
              { k: 'actor', v: preview.attendee },
              { k: 'actor org', v: preview.attendeeOrg },
              { k: 'target org', v: ATTENDEE.targetOrg },
              { k: 'meeting', v: ATTENDEE.meeting },
              { k: 'decision type', v: ATTENDEE.decisionType },
              {
                k: 'evidence label',
                v: `Attendee · ${preview.receiptEventType.replace(/_/g, ' ')}`,
              },
              { k: 'description', v: preview.receiptDescription },
            ]}
          />
        </div>

        {/* 7 — Attendance Judgment */}
        <ModeratorPanel
          title={
            <GuidanceHint {...GUIDANCE.attendance_judgment} underline={false}>
              Attendance Judgment
            </GuidanceHint>
          }
          sub="Is your live time justified?"
          notes={ATTENDANCE_JUDGMENT}
          foot={
            <button
              className="btn btn-sm btn-ghost"
              style={{ width: '100%' }}
              onClick={() => navigate('calendar')}
            >
              Back to Smart Calendar
            </button>
          }
        />
      </div>
    </div>
  )
}
