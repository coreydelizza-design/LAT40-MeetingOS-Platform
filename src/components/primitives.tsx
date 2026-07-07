import type { ReactNode } from 'react'
import type { MeetingState, MeetingValue } from '../types'

/** Small uppercase section eyebrow. */
export function Kicker({ children }: { children: ReactNode }) {
  return <div className="eyebrow kicker">{children}</div>
}

/** Section header with serif title and optional right-aligned aside. */
export function SectionHeader({ title, aside }: { title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {aside ? <span className="aside">{aside}</span> : null}
    </div>
  )
}

/** Quiet executive briefing panel — deliberately NOT a KPI card. */
export function ExecPanel({
  label,
  figure,
  unit,
  foot,
}: {
  label: ReactNode
  figure: ReactNode
  unit?: string
  foot?: ReactNode
}) {
  return (
    <div className="exec-panel">
      <div className="label">{label}</div>
      <div className="figure">
        {figure}
        {unit ? <span className="unit">{unit}</span> : null}
      </div>
      {foot ? <div className="foot">{foot}</div> : null}
    </div>
  )
}

/** Monochrome status label. Weight/border differentiate state, never hue. */
export function StatusLabel({ state }: { state: MeetingState }) {
  const cls =
    state === 'LIVE REQUIRED'
      ? 'live'
      : state === 'FOCUS PROTECTED'
        ? 'protected'
        : state === 'ASYNC RECOMMENDED'
          ? 'async'
          : state === 'AUTHORIZATION AVAILABLE'
            ? 'agent'
            : ''
  return <span className={`status ${cls}`}>{state}</span>
}

export function ValueMark({ value }: { value: MeetingValue }) {
  return <span className="value-mark">Value · {value}</span>
}

/** Key/value stacked panel. */
export function KVPanel({ rows }: { rows: { k: string; v: ReactNode; serif?: boolean }[] }) {
  return (
    <div className="kv-panel">
      {rows.map((r, i) => (
        <div className="kv-row" key={i}>
          <span className="k">{r.k}</span>
          <span className={`v${r.serif ? ' serif' : ''}`}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

/** The calm facilitator panel. Never a chatbot. */
export function ModeratorPanel({
  title = 'Moderator',
  sub,
  notes,
  foot,
}: {
  title?: ReactNode
  sub?: string
  notes: ReactNode[]
  foot?: ReactNode
}) {
  return (
    <aside className="moderator">
      <div className="mod-head">
        <div className="title">{title}</div>
        {sub ? <div className="sub">{sub}</div> : null}
      </div>
      <div className="mod-body">
        {notes.map((n, i) => (
          <div className="mod-note" key={i}>
            <span className="tick" />
            <span>{n}</span>
          </div>
        ))}
      </div>
      {foot ? <div className="mod-foot">{foot}</div> : null}
    </aside>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

/** Meeting contract block — a boardroom-quality decision object. */
export function ContractBlock({
  title = 'Meeting Contract',
  seal,
  items,
}: {
  title?: string
  seal?: string
  items: { label: string; value: ReactNode; full?: boolean }[]
}) {
  return (
    <div className="contract">
      <div className="c-head">
        <span className="title">{title}</span>
        {seal ? <span className="seal">{seal}</span> : null}
      </div>
      <div className="contract-grid">
        {items.map((it, i) => (
          <div className={`contract-item${it.full ? ' full' : ''}`} key={i}>
            <div className="ci-label">{it.label}</div>
            <div className="ci-value">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
