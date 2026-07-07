import { useState } from 'react'
import { Kicker, SectionHeader, ModeratorPanel, KVPanel } from '../components/primitives'
import { GuidanceHint } from '../components/GuidanceHint'
import { GUIDANCE } from '../data/guidance'
import {
  ATTENDEE,
  ATTENDEE_INVITE,
  ATTENDEE_ROSTER,
  WHY_INVITED,
  ATTENDANCE_ACTIONS,
  CHALLENGE_OPTIONS,
  PREREAD_ITEMS,
  AGENT_AUTH_OPTIONS,
  AGENT_AUTHORIZATION_FACTS,
  ATTENDANCE_JUDGMENT,
} from '../data/mock'
import type { AttendeeReceiptPreview, ViewId } from '../types'

type Selection =
  | { group: 'action'; key: string }
  | { group: 'challenge'; key: string }
  | { group: 'auth'; key: string }
  | null

export function AttendeeView({ navigate }: { navigate: (v: ViewId) => void }) {
  const [selection, setSelection] = useState<Selection>(null)
  const [consent, setConsent] = useState(false)

  // Resolve the single active selection into a factual receipt.
  const active = resolveReceipt(selection)
  const eventType = active?.eventType ?? '—'
  const description =
    active?.description ?? 'No response captured yet. Select an attendance decision below.'
  const hasResponse = Boolean(active)

  const preview: AttendeeReceiptPreview = {
    id: 'preview',
    meetingId: ATTENDEE.meetingId,
    attendee: ATTENDEE.name,
    attendeeOrg: ATTENDEE.org,
    assignedRole: ATTENDEE.role,
    expectedInput: 'Customer urgency, commercial impact, deadline risk',
    selectedAction: active?.label ?? '—',
    receiptEventType: eventType,
    receiptDescription: description,
    timestamp: 'On submission',
  }

  const isActive = (group: string, key: string) =>
    selection?.group === group && selection.key === key

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

          <div className="eyebrow" style={{ margin: '28px 0 12px' }}>
            Invited roster
          </div>
          <table className="exec-table">
            <tbody>
              {ATTENDEE_ROSTER.map((p) => (
                <tr key={p.name}>
                  <td className="strong" style={{ width: '32%' }}>
                    {p.org}
                    {p.org === ATTENDEE.org ? (
                      <span className="faint" style={{ fontSize: 11 }}>
                        {' '}
                        · you
                      </span>
                    ) : null}
                  </td>
                  <td>{p.name}</td>
                  <td className="muted" style={{ textAlign: 'right' }}>
                    {p.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 2 — Attendance Decision */}
          <SectionHeader title="Attendance Decision" aside="Frontend mock — creates a receipt" />
          <div className="choice-grid">
            {ATTENDANCE_ACTIONS.map((a) => (
              <button
                key={a.key}
                className={`choice${isActive('action', a.key) ? ' selected' : ''}`}
                onClick={() =>
                  setSelection((prev) =>
                    prev?.group === 'action' && prev.key === a.key
                      ? null
                      : { group: 'action', key: a.key },
                  )
                }
              >
                {a.key === 'summary_only' ? (
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
                className={`chip${isActive('challenge', c.label) ? ' selected' : ''}`}
                onClick={() =>
                  setSelection((prev) =>
                    prev?.group === 'challenge' && prev.key === c.label
                      ? null
                      : { group: 'challenge', key: c.label },
                  )
                }
              >
                {c.label}
              </button>
            ))}
          </div>
          {selection?.group === 'challenge' && active ? (
            <div className="receipt-line" style={{ marginTop: 16 }}>
              Attendee View: {active.description}
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
              onClick={() => setSelection({ group: 'action', key: 'request_preread' })}
            >
              Request missing pre-read
            </button>
            <span className="faint" style={{ fontSize: 12.5 }}>
              Two items missing · one needs review
            </span>
          </div>

          {/* 5 — Governed Agent Authorization */}
          <SectionHeader
            title={
              <GuidanceHint {...GUIDANCE.governed_delegation} underline={false}>
                Governed Agent Authorization
              </GuidanceHint>
            }
            aside="Consented · bounded"
          />
          <div className="work-card" style={{ borderColor: 'var(--line-ink)' }}>
            <p style={{ fontSize: 14, color: 'var(--graphite)', lineHeight: 1.55 }}>
              An agent may observe and summarize only inside authorized delegation boundaries. It
              cannot approve, negotiate, commit, or provide customer judgment.
            </p>
            <div style={{ marginTop: 18 }}>
              <KVPanel rows={AGENT_AUTHORIZATION_FACTS.map((r) => ({ k: r.k, v: r.v }))} />
            </div>
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
            <div className="chip-row" style={{ marginTop: 16 }}>
              {AGENT_AUTH_OPTIONS.map((o) => {
                const locked = o.needsConsent && !consent
                return (
                  <button
                    key={o.key}
                    className={`chip${isActive('auth', o.key) ? ' selected' : ''}`}
                    disabled={locked}
                    style={locked ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                    onClick={() =>
                      setSelection((prev) =>
                        prev?.group === 'auth' && prev.key === o.key
                          ? null
                          : { group: 'auth', key: o.key },
                      )
                    }
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
            {selection?.group === 'auth' && active ? (
              <div className="receipt-line" style={{ marginTop: 16 }}>
                Receipt created: attendee_view · {active.eventType} · {active.description}
              </div>
            ) : null}
          </div>

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

/** Map the single active selection to its receipt facts. */
function resolveReceipt(
  selection: Selection,
): { eventType: string; description: string; label: string } | null {
  if (!selection) return null
  if (selection.group === 'action') {
    const a = ATTENDANCE_ACTIONS.find((x) => x.key === selection.key)
    return a ? { eventType: a.eventType, description: a.description, label: a.label } : null
  }
  if (selection.group === 'challenge') {
    const c = CHALLENGE_OPTIONS.find((x) => x.label === selection.key)
    return c
      ? { eventType: 'role_challenged', description: c.description, label: 'Challenge my assigned role' }
      : null
  }
  const o = AGENT_AUTH_OPTIONS.find((x) => x.key === selection.key)
  return o ? { eventType: o.eventType, description: o.description, label: o.label } : null
}
