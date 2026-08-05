import { Kicker, SectionHeader } from '../../components/primitives'
import { buildMetrics } from '../../data/metrics'

/**
 * Metrics — every derived data point the current app structure yields, grouped
 * by domain and computed live from the source datasets. No new instrumentation.
 */
export function SignalNoiseMetrics() {
  const groups = buildMetrics()
  const totalRows = groups.reduce((n, g) => n + g.rows.length, 0)

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Admin · Data Integrity</Kicker>
        <h1 className="display">Metrics</h1>
        <p className="thesis">
          Every data point derivable from the app as it is structured today — {totalRows} metrics
          across {groups.length} domains, each computed live from its source with no new
          instrumentation.
        </p>
      </header>

      {groups.map((g) => (
        <div key={g.domain}>
          <SectionHeader title={g.domain} aside={g.note} />
          <table className="exec-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th style={{ width: '34%', textAlign: 'right' }}>Value</th>
                <th style={{ width: '26%' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r) => (
                <tr key={r.label}>
                  <td className="strong" style={{ fontSize: 13 }}>
                    {r.label}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13 }}>{r.value}</td>
                  <td className="muted" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                    {r.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
