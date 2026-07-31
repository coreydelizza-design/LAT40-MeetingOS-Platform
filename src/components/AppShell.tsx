import type { ReactNode } from 'react'
import { NAV, PRODUCT, SCREEN_TO_NAV, TODAY_LABEL } from '../constants'
import type { ViewId } from '../types'

interface AppShellProps {
  view: ViewId
  onNavigate: (v: ViewId) => void
  children: ReactNode
}

export function AppShell({ view, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <CommandBar onNavigate={onNavigate} />
      <LeftRail view={view} onNavigate={onNavigate} />
      <main className="main">
        <StageBar view={view} onNavigate={onNavigate} />
        {children}
      </main>
    </div>
  )
}

function CommandBar({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  return (
    <header className="command-bar">
      <button
        className="brand"
        style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
        onClick={() => onNavigate('today')}
        aria-label="LAT40 MeetingOS home"
      >
        <span className="lat40">LAT40</span> Meeting<span className="os">OS</span>
      </button>
      <span className="workspace">{PRODUCT.workspace}</span>
      <span className="date">{TODAY_LABEL}</span>
      <div className="actions">
        <button className="btn btn-solid" onClick={() => onNavigate('build')}>
          {PRODUCT.primaryAction}
        </button>
        <button className="btn btn-ghost" onClick={() => onNavigate('org-cards')}>
          {PRODUCT.secondaryAction}
        </button>
      </div>
    </header>
  )
}

function LeftRail({ view, onNavigate }: { view: ViewId; onNavigate: (v: ViewId) => void }) {
  const activeNav = SCREEN_TO_NAV[view]
  return (
    <nav className="left-rail" aria-label="Primary">
      <div className="rail-section">Workspace</div>
      {NAV.map((item) => {
        const active = activeNav === item.id
        return (
          <button
            key={item.id}
            className={`rail-item${active ? ' active' : ''}`}
            // Already inside this group? Hold the current stage rather than
            // snapping back to the first one.
            onClick={() => !active && onNavigate(item.stages[0].id)}
            aria-current={active ? 'page' : undefined}
          >
            <div className="rail-label">{item.label}</div>
            <div className="rail-note">{item.note}</div>
          </button>
        )
      })}
    </nav>
  )
}

/**
 * Stages of the active rail group. Renders nothing for single-screen groups,
 * so Org Cards / Agents / Review look exactly as they did before.
 */
function StageBar({ view, onNavigate }: { view: ViewId; onNavigate: (v: ViewId) => void }) {
  const nav = NAV.find((n) => n.id === SCREEN_TO_NAV[view])
  if (!nav || nav.stages.length < 2) return null
  return (
    <div className="stage-bar" role="tablist" aria-label={`${nav.label} stages`}>
      {nav.stages.map((s, i) => {
        const active = view === s.id
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            className={`stage${active ? ' active' : ''}`}
            onClick={() => onNavigate(s.id)}
          >
            {nav.flow ? <span className="stage-num">{String(i + 1).padStart(2, '0')}</span> : null}
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
