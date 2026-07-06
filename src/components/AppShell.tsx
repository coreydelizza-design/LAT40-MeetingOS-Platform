import type { ReactNode } from 'react'
import { NAV, PRODUCT, TODAY_LABEL } from '../constants'
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
      <main className="main">{children}</main>
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
  return (
    <nav className="left-rail" aria-label="Primary">
      <div className="rail-section">Workspace</div>
      {NAV.map((item) => (
        <button
          key={item.id}
          className={`rail-item${view === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-current={view === item.id ? 'page' : undefined}
        >
          <div className="rail-label">{item.label}</div>
          <div className="rail-note">{item.note}</div>
        </button>
      ))}
    </nav>
  )
}
