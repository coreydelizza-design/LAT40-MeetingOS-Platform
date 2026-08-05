import { useState } from 'react'
import { Kicker, SectionHeader } from '../components/primitives'
import { getSignalNoise, getWeekCalls } from '../data/adapters'
import type { NoiseClass } from '../data/mock'
import type { ViewId } from '../types'
import { QUAD_LABEL, appDataOf, quadOf, signalScore, truthOf } from '../data/signalNoiseMath'
import type { Quad } from '../data/signalNoiseMath'

const FILL_CLASS: Record<NoiseClass['fill'], string> = {
  dots: 'sn-fill-dots',
  hatch: 'sn-fill-hatch',
  cross: 'sn-fill-cross',
  sparse: 'sn-fill-sparse',
  outline: 'sn-fill-outline',
}

/** Deterministic ±3px jitter so co-located dots don't perfectly overlap. */
const jitter = (id: string, salt: number) => {
  let h = salt
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff
  return (h % 7) - 3
}

/**
 * Signal & Noise — the derived read of live time, second stage under Review.
 *
 * Not a dashboard: a routing surface. The number is led editorially, noise is
 * decomposed into named classes, and every class links to the lever that
 * reduces it. Monochrome only — every distinction is carried by fill density.
 */
export function SignalNoise({ navigate }: { navigate: (v: ViewId) => void }) {
  const sn = getSignalNoise()
  const calls = getWeekCalls()
  const pct = (hrs: number) => Math.round((hrs / sn.totalLiveHours) * 100)
  const target = sn.quarters[sn.quarters.length - 1]
  const targetPct = (target.signalHours / sn.totalLiveHours) * 100

  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredCall = calls.find((c) => c.id === hovered) ?? null
  const quadCount = (q: Quad) => calls.filter((c) => quadOf(c) === q).length

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Leadership Operating Review</Kicker>
        <h1 className="display">Signal &amp; Noise</h1>
        <p className="thesis">
          Every hour of live organizational time is either signal or noise. Signal is an hour that
          produced a validated outcome a receipt can point to. Noise is every other hour.
        </p>
      </header>

      {/* ---- HERO: the editorial rule ---- */}
      <div className="sn-lede">
        <span className="mark">1&nbsp;hour of outcome</span> for every&nbsp;{sn.ratio}&nbsp;hours of
        live time.
      </div>
      <p className="sn-sub">
        Signal is drawn from <strong>closeout: required output achieved</strong>, decisions closed
        with an owner and rationale, and authorizations granted — nothing self-reported. This week:{' '}
        <strong>{sn.totalLiveHours} live hours</strong>, of which{' '}
        <strong>{sn.signalHours} produced a receipt.</strong>
      </p>

      <div className="sn-bar-caps">
        <span>Signal · {sn.signalHours} hrs</span>
        <span>Noise · {sn.noiseHours} hrs</span>
      </div>
      <div className="sn-bar" role="img" aria-label={`Signal ${sn.signalHours} hours, noise ${sn.noiseHours} hours, of ${sn.totalLiveHours} live hours`}>
        <div className="sn-seg sn-fill-solid" style={{ flexGrow: sn.signalHours }} title={`Signal — ${sn.signalHours} hrs`} />
        {sn.classes.map((c) => (
          <div
            key={c.id}
            className={`sn-seg ${FILL_CLASS[c.fill]}`}
            style={{ flexGrow: c.hours }}
            title={`${c.label} — ${c.hours} hrs`}
          />
        ))}
        <div className="sn-seg sn-fill-irr" style={{ flexGrow: sn.floorHours }} title={`Irreducible floor — ${sn.floorHours} hrs`} />
      </div>
      <div className="sn-ticks">
        <div className="sn-tick" style={{ flexGrow: sn.signalHours }}>
          <div className="th">Signal</div>
          <div className="tl">validated outcomes</div>
        </div>
        <div className="sn-tick" style={{ flexGrow: sn.recoverableHours }}>
          <div className="th">Recoverable noise</div>
          <div className="tl">five classes → levers, below</div>
        </div>
        <div className="sn-tick" style={{ flexGrow: sn.floorHours }}>
          <div className="th">Irreducible</div>
          <div className="tl">declared floor</div>
        </div>
      </div>

      {/* ---- THE CALL MATRIX (signal / noise 2×2) ---- */}
      <SectionHeader title="The call matrix" aside="Every call, scored on truth × application data" />
      <p className="sn-sub" style={{ marginTop: 0, marginBottom: 6 }}>
        Each dot is one call this week; its size is the attendee-hours at stake. Horizontal is
        <strong> truth</strong> — whether receipts validated it. Vertical is
        <strong> application data</strong> — what the app captured about it. Signal is top-right,
        where both agree; noise is bottom-left, where neither does. The off-diagonals are the
        disagreements: app-flagged but unproven (top-left), or receipt-proven but under-flagged
        (bottom-right). Hover a dot for the call and its score.
      </p>

      <div className="sn-matrix">
        <div className="sn-yaxis"><span>Application data — did the app flag it →</span></div>
        <div className="sn-plot" onMouseLeave={() => setHovered(null)}>
          <div className="sn-quad-label tl">
            <b>{QUAD_LABEL.appdata} · {quadCount('appdata')}</b>
            app flags · no receipt
          </div>
          <div className="sn-quad-label tr">
            <b>{QUAD_LABEL.signal} · {quadCount('signal')}</b>
            app flags · receipt
          </div>
          <div className="sn-quad-label bl">
            <b>{QUAD_LABEL.noise} · {quadCount('noise')}</b>
            neither
          </div>
          <div className="sn-quad-label br">
            <b>{QUAD_LABEL.receipts} · {quadCount('receipts')}</b>
            receipt · not flagged
          </div>

          {calls.map((c) => {
            const size = 8 + (c.hours - 4) * 1.1
            const dx = jitter(c.id, 7)
            const dy = jitter(c.id, 13)
            return (
              <div
                key={c.id}
                className={`sn-dot q-${quadOf(c)}${hovered === c.id ? ' on' : ''}`}
                style={{
                  left: `${truthOf(c)}%`,
                  top: `${100 - appDataOf(c)}%`,
                  width: size,
                  height: size,
                  transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
                }}
                onMouseEnter={() => setHovered(c.id)}
                tabIndex={0}
                onFocus={() => setHovered(c.id)}
                aria-label={`${c.title}, signal score ${signalScore(c)}`}
                title={`${c.title} — signal score ${signalScore(c)}`}
              />
            )
          })}

          {hoveredCall ? (
            <div
              className={`sn-tt ${truthOf(hoveredCall) > 55 ? 'tt-l' : 'tt-r'}`}
              style={{ left: `${truthOf(hoveredCall)}%`, top: `${100 - appDataOf(hoveredCall)}%` }}
            >
              <div className="tt-row">
                <span className="tt-title">{hoveredCall.title}</span>
                <span className="tt-quad">{QUAD_LABEL[quadOf(hoveredCall)]}</span>
              </div>
              <div className="tt-kind">
                {hoveredCall.kind} · {hoveredCall.state}
              </div>
              <div className="tt-score">
                <span className="n">{signalScore(hoveredCall)}</span>
                <span className="l">Signal score</span>
              </div>
              <div className="tt-grid">
                <span className="k">Truth · receipts</span>
                <span className="v">{truthOf(hoveredCall)} / 100</span>
                <span className="k">Application data</span>
                <span className="v">{appDataOf(hoveredCall)} / 100</span>
                <span className="k">At stake</span>
                <span className="v">{hoveredCall.hours} attendee-hrs</span>
                <span className="k">Value</span>
                <span className="v">{hoveredCall.value}</span>
              </div>
              <div className="tt-org">{hoveredCall.org}</div>
            </div>
          ) : null}
        </div>
        <div className="sn-xaxis">Truth — did receipts validate it →</div>
      </div>

      {/* ---- NOISE DECOMPOSITION → LEVERS ---- */}
      <SectionHeader
        title="Noise, decomposed"
        aside="Every segment routes to the screen that reduces it"
      />
      <table className="exec-table sn-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }} aria-label="Fill" />
            <th>Noise class</th>
            <th style={{ width: '92px' }}>Hours</th>
            <th>Measured from</th>
            <th style={{ width: '190px', textAlign: 'right' }}>Routes to →</th>
          </tr>
        </thead>
        <tbody>
          {sn.classes.map((c) => (
            <tr key={c.id}>
              <td>
                <span className={`sn-swatch ${FILL_CLASS[c.fill]}`} />
              </td>
              <td className="strong" style={{ fontSize: 14 }}>
                {c.label}
              </td>
              <td>
                <span className="serif" style={{ fontSize: 17 }}>
                  {c.hours}
                </span>
                <div className="faint" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>
                  {pct(c.hours)}% of live
                </div>
              </td>
              <td className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                {c.measuredFrom}
              </td>
              <td style={{ textAlign: 'right' }}>
                <button className="sn-lever" onClick={() => navigate(c.routesTo)}>
                  {c.lever} <span className="faint">↗</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="faint" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.55, maxWidth: '72ch' }}>
        The graph is a routing surface, not a report — noise only becomes actionable when it has
        named classes, each with an owner and a lever. Fill density carries every distinction; no
        color, no gauge, no individual scoring.
      </p>

      {/* ---- NOISE FLOOR ---- */}
      <SectionHeader
        title="Declared noise floor"
        aside="Do not build toward 100% signal"
      />
      <div className="sn-floor">
        <div className="sn-floor-signal" style={{ flexGrow: sn.signalHours }} title={`Signal today — ${sn.signalHours} hrs`} />
        <div className="sn-floor-recover" style={{ flexGrow: sn.recoverableHours }} title={`Recoverable noise — ${sn.recoverableHours} hrs`} />
        <div className="sn-floor-irr" style={{ flexGrow: sn.floorHours }} title={`Irreducible floor — ${sn.floorHours} hrs`} />
        <div className="sn-target" style={{ left: `${targetPct}%` }}>
          <div className="sn-target-flag">{target.label.replace(' · target', '')} target · {target.ratio}</div>
        </div>
      </div>
      <div className="sn-floor-labels">
        <span>Signal today {sn.signalHours} hrs</span>
        <span>Recoverable {sn.recoverableHours} hrs</span>
        <span>Irreducible floor {sn.floorHours} hrs</span>
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 18, lineHeight: 1.6, maxWidth: '74ch' }}>
        Some live time is legitimately unmeasurable — relationship building, protected exploration,
        escalation that had to happen in a room. We publish the irreducible band ({sn.floorHours} hrs)
        and place the target line inside it. A metric that admits its own limit earns trust; without a
        floor the tab would reward cancelling exactly the meetings that hold the org together.
      </p>

      {/* ---- QUARTERLY REDRAW ---- */}
      <SectionHeader
        title="Quarterly redraw"
        aside="Direction beats level — every gain attributed to one intervention"
      />
      <div className="sn-redraw">
        {sn.quarters.map((q) => (
          <div key={q.id} className={`sn-rq${q.current ? ' cur' : ''}`}>
            <div className="q">{q.label}</div>
            <div className="r">{q.ratio}</div>
            <div className="rs">
              {q.signalHours} signal / {sn.totalLiveHours - q.signalHours} noise hrs
            </div>
            <div className="iv">
              <b>{q.interventionLabel}</b>
              {q.intervention}
            </div>
          </div>
        ))}
      </div>

      {/* ---- PER-ORG SMALL MULTIPLES ---- */}
      <SectionHeader
        title="Per-relationship read"
        aside="Org-level only, never individual (ORG_LOAD)"
      />
      <div className="sn-orggrid">
        {sn.perOrg.map((o) => (
          <div key={o.org}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span className="strong" style={{ fontSize: 13.5 }}>
                {o.org}
                {o.worst ? <span className="sn-oflag" style={{ marginLeft: 8 }}>worst</span> : null}
              </span>
              <span className="serif" style={{ fontSize: 14 }}>
                {o.ratio}
              </span>
            </div>
            <div className="sn-obar">
              <div className="os" style={{ flexGrow: o.signalHours }} />
              <div className="on" style={{ flexGrow: o.noiseHours }} />
            </div>
            <div className="sn-floor-labels" style={{ marginTop: 6 }}>
              <span>{o.signalHours} signal</span>
              <span>{o.liveHours} live hrs</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sn-legend">
        <div className="li"><span className="sw sn-fill-solid" />Signal — solid</div>
        <div className="li"><span className="sw sn-fill-dots" />Async-eligible</div>
        <div className="li"><span className="sw sn-fill-hatch" />Observer burden</div>
        <div className="li"><span className="sw sn-fill-cross" />Deferral</div>
        <div className="li"><span className="sw sn-fill-sparse" />Rework</div>
        <div className="li"><span className="sw sn-fill-outline" />Delegation gap</div>
        <div className="li"><span className="sw sn-fill-irr" />Irreducible floor</div>
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
        MeetingOS does not score opinions. It reads signal from receipts — and routes the noise to
        the screen that removes it.
      </div>
    </div>
  )
}
