import { Kicker, SectionHeader } from '../../components/primitives'
import { buildGaps } from '../../data/gaps'

/**
 * Gaps — the reconciliation signals. Each pairs one data layer against another
 * and flags where they diverge, in the spirit of the truth × application-data
 * matrix. These are the most instrument-worthy derived data points.
 */
export function SignalNoiseGaps() {
  const gaps = buildGaps()

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Admin · Data Integrity</Kicker>
        <h1 className="display">Gaps</h1>
        <p className="thesis">
          The most valuable derived data points are disagreements between two layers of the ledger.
          Each gap below pairs one source against another and flags the divergence — false closure,
          unclaimed delegation, unvalidated value, and more.
        </p>
      </header>

      {gaps.map((g) => (
        <div key={g.id}>
          <SectionHeader title={g.title} aside={g.sources} />
          <p className="muted" style={{ fontSize: 13, margin: '0 0 6px', maxWidth: '80ch' }}>
            {g.description}
          </p>
          <p className="sn-gap-summary">{g.summary}</p>
          <table className="exec-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }} />
                <th>{g.leftLabel}</th>
                <th>{g.rightLabel}</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r, i) => (
                <tr key={`${g.id}-${i}`}>
                  <td className="strong" style={{ fontSize: 13 }}>
                    {r.item}
                  </td>
                  <td className="muted" style={{ fontSize: 12.5 }}>
                    {r.left}
                  </td>
                  <td className="muted" style={{ fontSize: 12.5 }}>
                    {r.right}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`sn-chip${r.flag ? ' fail' : ''}`}>{r.verdict}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <p className="faint" style={{ fontSize: 12, marginTop: 18, lineHeight: 1.6, maxWidth: '74ch' }}>
        Sample sets are small (one week, one closeout scenario), so treat these as the shapes the
        structure exposes rather than settled volumes. Each is computed from the same source data the
        rest of the app renders.
      </p>
    </div>
  )
}
