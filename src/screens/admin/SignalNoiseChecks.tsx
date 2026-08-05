import { Kicker, SectionHeader } from '../../components/primitives'
import { runReconciliation } from '../../data/reconcile'

/**
 * Reconciliation — the admin test panel. Runs every tie-out check against the
 * app's own constants and shows pass/fail live. This is the instrument that
 * answers "can we trust the app's signal/noise math?".
 */
export function SignalNoiseChecks() {
  const { checks, passCount, total, allPass } = runReconciliation()

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Admin · Data Integrity</Kicker>
        <h1 className="display">Reconciliation</h1>
        <p className="thesis">
          Every number the instrument shows, checked against the app's own source of truth and its
          internal invariants. Green means the math ties out; red means something has drifted.
        </p>
      </header>

      <div className={`sn-verdict${allPass ? '' : ' fail'}`}>
        <span className="v-mark">{allPass ? 'ALL CHECKS PASS' : 'DRIFT DETECTED'}</span>
        <span className="v-count">
          {passCount} / {total} checks pass
        </span>
      </div>

      <SectionHeader title="Tie-out checks" aside="Source → expected vs actual" />
      <table className="exec-table sn-check-table">
        <thead>
          <tr>
            <th style={{ width: '58px' }}>Result</th>
            <th>Check</th>
            <th>Source</th>
            <th style={{ width: '90px', textAlign: 'right' }}>Expected</th>
            <th style={{ width: '90px', textAlign: 'right' }}>Actual</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id} className={c.pass ? '' : 'row-fail'}>
              <td>
                <span className={`sn-chip${c.pass ? '' : ' fail'}`}>{c.pass ? 'PASS' : 'FAIL'}</span>
              </td>
              <td className="strong" style={{ fontSize: 13.5 }}>
                {c.label}
              </td>
              <td className="muted" style={{ fontSize: 11.5, fontFamily: 'var(--mono)' }}>
                {c.source}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13 }}>{c.expected}</td>
              <td
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: c.pass ? 400 : 700,
                }}
              >
                {c.actual}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="faint" style={{ fontSize: 12, marginTop: 14, lineHeight: 1.6, maxWidth: '74ch' }}>
        Checks run on the live data every time this screen renders, using the same scoring functions
        the view renders with — not a re-implementation — so a mismatch here is a real disagreement
        in the app's data, not a copy that fell behind.
      </p>
    </div>
  )
}
