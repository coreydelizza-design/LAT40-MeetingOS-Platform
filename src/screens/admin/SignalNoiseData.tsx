import { Kicker, SectionHeader, KVPanel } from '../../components/primitives'
import { getLiveTimeGovernance, getSignalNoise, getWeekCalls } from '../../data/adapters'
import { QUAD_LABEL, appDataOf, quadOf, signalScore, truthOf } from '../../data/signalNoiseMath'

/**
 * Raw-data inspector — the admin's eyeball view. Source figures next to the
 * derived model and every scored call, so an admin can trace any number on the
 * instrument back to where it came from.
 */
export function SignalNoiseData() {
  const gov = getLiveTimeGovernance()
  const sn = getSignalNoise()
  const calls = getWeekCalls()
  const pct = (hrs: number) => Math.round((hrs / sn.totalLiveHours) * 100)

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Admin · Data Integrity</Kicker>
        <h1 className="display">Raw data</h1>
        <p className="thesis">
          The source figures the instrument derives from, the derived model itself, and every scored
          call — so any number on the view can be traced back by hand.
        </p>
      </header>

      <div className="grid-2">
        <div>
          <SectionHeader title="Source" aside="Executive Review · LIVE_TIME_GOVERNANCE" />
          <KVPanel rows={gov.map((r) => ({ k: r.label, v: r.value }))} />
        </div>
        <div>
          <SectionHeader title="Derived model" aside="SIGNAL_NOISE" />
          <KVPanel
            rows={[
              { k: 'Total live hours', v: `${sn.totalLiveHours} hrs`, serif: true },
              { k: 'Signal', v: `${sn.signalHours} hrs` },
              { k: 'Noise', v: `${sn.noiseHours} hrs` },
              { k: 'Recoverable', v: `${sn.recoverableHours} hrs` },
              { k: 'Irreducible floor', v: `${sn.floorHours} hrs` },
              { k: 'Signal ceiling', v: `${sn.signalCeilingHours} hrs` },
              { k: 'Ratio', v: `${sn.ratio} : 1`, serif: true },
            ]}
          />
        </div>
      </div>

      <SectionHeader title="Noise classes" aside={`${sn.classes.length} classes → Σ ${sn.recoverableHours} hrs`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Class</th>
            <th style={{ width: '70px', textAlign: 'right' }}>Hours</th>
            <th style={{ width: '70px', textAlign: 'right' }}>% live</th>
            <th>Measured from</th>
            <th style={{ width: '150px' }}>Routes to</th>
          </tr>
        </thead>
        <tbody>
          {sn.classes.map((c) => (
            <tr key={c.id}>
              <td className="strong">{c.label}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{c.hours}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="muted">
                {pct(c.hours)}%
              </td>
              <td className="muted" style={{ fontSize: 12 }}>
                {c.measuredFrom}
              </td>
              <td className="muted" style={{ fontSize: 12 }}>
                {c.lever}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Per-org" aside="ORG_LOAD" />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Org</th>
            <th style={{ width: '80px', textAlign: 'right' }}>Live hrs</th>
            <th style={{ width: '80px', textAlign: 'right' }}>Signal</th>
            <th style={{ width: '80px', textAlign: 'right' }}>Noise</th>
            <th style={{ width: '70px', textAlign: 'right' }}>Ratio</th>
            <th style={{ width: '120px' }}>Observer load</th>
          </tr>
        </thead>
        <tbody>
          {sn.perOrg.map((o) => (
            <tr key={o.org}>
              <td className="strong">
                {o.org}
                {o.worst ? <span className="sn-oflag" style={{ marginLeft: 8 }}>worst</span> : null}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{o.liveHours}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{o.signalHours}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{o.noiseHours}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{o.ratio}</td>
              <td className="muted">{o.observerBurden}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Calls" aside={`${calls.length} scored · truth × application data`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Call</th>
            <th>Type</th>
            <th style={{ width: '64px', textAlign: 'right' }}>Truth</th>
            <th style={{ width: '80px', textAlign: 'right' }}>App data</th>
            <th style={{ width: '70px', textAlign: 'right' }}>Score</th>
            <th style={{ width: '120px' }}>Quadrant</th>
            <th style={{ width: '70px', textAlign: 'right' }}>Hrs</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((c) => (
            <tr key={c.id}>
              <td className="strong" style={{ fontSize: 13 }}>
                {c.title}
              </td>
              <td className="muted" style={{ fontSize: 12 }}>
                {c.kind}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{truthOf(c)}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{appDataOf(c)}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="strong">
                {signalScore(c)}
              </td>
              <td className="muted" style={{ fontSize: 12 }}>
                {QUAD_LABEL[quadOf(c)]}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{c.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
