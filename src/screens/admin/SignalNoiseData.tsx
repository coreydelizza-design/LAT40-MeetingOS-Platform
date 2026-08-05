import { Kicker, SectionHeader, KVPanel } from '../../components/primitives'
import {
  getLiveTimeGovernance,
  getSignalNoise,
  getWeekCalls,
  getScorecards,
  getDecisions,
  getActions,
  getDependencies,
  getRisks,
  getAgents,
  getAgentAuthorizations,
  getAttendeeSignals,
  getMeetingCloseout,
  getEventReceipts,
  getOrgCards,
} from '../../data/adapters'
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
  const scorecards = getScorecards()
  const decisions = getDecisions()
  const actions = getActions()
  const dependencies = getDependencies()
  const risks = getRisks()
  const agents = getAgents()
  const auths = getAgentAuthorizations()
  const signals = getAttendeeSignals()
  const closeout = getMeetingCloseout()
  const receipts = getEventReceipts()
  const orgCards = getOrgCards()
  const pct = (hrs: number) => Math.round((hrs / sn.totalLiveHours) * 100)

  return (
    <div className="canvas">
      <header className="page-head">
        <Kicker>Admin · Data Integrity</Kicker>
        <h1 className="display">Catalog</h1>
        <p className="thesis">
          The full raw-data catalog — the Signal &amp; Noise source and derived model, plus every
          underlying dataset the app carries: scorecards, decisions, dependencies, risks, agents and
          authorizations, closeout and attendee signals, the receipts ledger, and org cards.
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

      <SectionHeader title="Relationship scorecards" aside={`${scorecards.length} · RelationshipScorecard`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Relationship</th>
            <th style={{ textAlign: 'right' }}>Joint hrs</th>
            <th style={{ textAlign: 'right' }}>Async</th>
            <th style={{ textAlign: 'right' }}>Escal.</th>
            <th style={{ textAlign: 'right' }}>Deferral</th>
            <th style={{ textAlign: 'right' }}>Reopen</th>
            <th style={{ textAlign: 'right' }}>Cover / Auth</th>
            <th>Health</th>
          </tr>
        </thead>
        <tbody>
          {scorecards.map((s) => (
            <tr key={s.id}>
              <td className="strong" style={{ fontSize: 12.5 }}>
                {s.relationshipLabel}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{s.jointHours}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="muted">{s.asyncResolutionRate}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="muted">{s.liveEscalationRate}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="muted">{s.decisionDeferralRate}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }} className="muted">{s.reopenRate}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>
                {s.agentCoverableHours} / {s.authorizedAgentCoverageHours}
              </td>
              <td className="muted">{s.healthState}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid-2">
        <div>
          <SectionHeader title="Decisions" aside={`${decisions.length} · Decision`} />
          <table className="exec-table">
            <thead>
              <tr><th>Statement</th><th>Owner</th><th style={{ width: '90px' }}>Status</th><th style={{ width: '60px', textAlign: 'right' }}>Age</th></tr>
            </thead>
            <tbody>
              {decisions.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontSize: 12.5 }}>{d.statement}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{d.owner}</td>
                  <td className="strong" style={{ fontSize: 12 }}>{d.status}</td>
                  <td className="muted" style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{d.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <SectionHeader title="Action items" aside={`${actions.length} · ActionItem`} />
          <table className="exec-table">
            <thead>
              <tr><th>Action</th><th>Owner</th><th style={{ width: '96px' }}>Status</th></tr>
            </thead>
            <tbody>
              {actions.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontSize: 12.5 }}>{a.action}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{a.owner}</td>
                  <td className="strong" style={{ fontSize: 12 }}>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <SectionHeader title="Dependencies" aside={`${dependencies.length} · Dependency`} />
          <table className="exec-table">
            <thead>
              <tr><th>From → to</th><th style={{ width: '84px' }}>Status</th><th style={{ width: '70px', textAlign: 'right' }}>Age</th></tr>
            </thead>
            <tbody>
              {dependencies.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontSize: 12.5 }}>
                    <span className="strong">{d.requestingOrg}</span> → {d.providingOrg}
                    <div className="muted" style={{ fontSize: 11 }}>{d.dependencyType}</div>
                  </td>
                  <td className="strong" style={{ fontSize: 12 }}>{d.status}</td>
                  <td className="muted" style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{d.timeOpen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <SectionHeader title="Risks" aside={`${risks.length} · Risk`} />
          <table className="exec-table">
            <thead>
              <tr><th>Risk</th><th style={{ width: '84px' }}>Severity</th><th>Owner</th></tr>
            </thead>
            <tbody>
              {risks.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12.5 }}>{r.risk}</td>
                  <td className="strong" style={{ fontSize: 12 }}>{r.severity}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeader title="Agents & authorizations" aside={`${agents.length} agents · ${auths.length} authorizations`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Agent / represents</th>
            <th>Type</th>
            <th>Mode</th>
            <th>Auth status</th>
            <th>Scope</th>
            <th>Risk</th>
            <th style={{ textAlign: 'right' }}>Consent</th>
          </tr>
        </thead>
        <tbody>
          {auths.map((a) => {
            const agent = agents.find((g) => g.id === a.agentId)
            return (
              <tr key={a.id}>
                <td className="strong" style={{ fontSize: 12.5 }}>
                  {agent?.name ?? a.agentId}
                  <div className="muted" style={{ fontSize: 11 }}>{a.representedOrg}</div>
                </td>
                <td className="muted" style={{ fontSize: 12 }}>{agent?.agentType ?? '—'}</td>
                <td className="muted" style={{ fontSize: 12 }}>{agent?.mode ?? '—'}</td>
                <td style={{ fontSize: 12 }}>{a.authorizationStatus}</td>
                <td className="muted" style={{ fontSize: 12 }}>{a.delegationScope}</td>
                <td className="muted" style={{ fontSize: 12 }}>{a.riskLevel}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{a.consentCaptured ? 'yes' : 'no'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="grid-2">
        <div>
          <SectionHeader title="Meeting closeout" aside={closeout.meetingId} />
          <KVPanel
            rows={[
              { k: 'Required output achieved', v: closeout.requiredOutputAchieved, serif: true },
              { k: 'Live time justified', v: closeout.liveTimeJustified },
              { k: 'Decision status', v: closeout.decisionStatus },
              { k: 'Deferral reason', v: closeout.deferralReason ?? '—' },
              { k: 'False closure risk', v: closeout.falseClosureRisk },
              { k: 'Follow-through readiness', v: closeout.followThroughReadinessScore },
              { k: 'Recurrence', v: closeout.recurrenceRecommendation },
            ]}
          />
        </div>
        <div>
          <SectionHeader title="Attendee signals" aside={`${signals.length} · AttendeeOutcomeSignal`} />
          <table className="exec-table">
            <thead>
              <tr><th>Attendee</th><th>Outcome clear</th><th>Live needed</th><th>Agent next time</th></tr>
            </thead>
            <tbody>
              {signals.map((s) => (
                <tr key={s.id}>
                  <td className="strong" style={{ fontSize: 12.5 }}>
                    {s.attendee}
                    <div className="muted" style={{ fontSize: 11 }}>{s.attendeeOrg}</div>
                  </td>
                  <td className="muted" style={{ fontSize: 12 }}>{s.outcomeClear}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{s.liveAttendanceRequired}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{s.agentCouldCoverNextTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHeader title="Event receipts (ledger)" aside={`${receipts.length} · EventReceipt`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th style={{ width: '120px' }}>Timestamp</th>
            <th>Source</th>
            <th>Flow</th>
            <th>Event type</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.id}>
              <td className="muted" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, whiteSpace: 'nowrap' }}>{r.timestamp}</td>
              <td className="muted" style={{ fontSize: 12 }}>{r.source}</td>
              <td style={{ fontSize: 12 }}>
                <span className="muted">{r.actorOrg}</span> → <span className="muted">{r.targetOrg}</span>
              </td>
              <td className="strong" style={{ fontSize: 12 }}>{r.eventType}</td>
              <td className="muted" style={{ fontSize: 11.5 }}>{r.evidenceLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionHeader title="Org cards" aside={`${orgCards.length} · OrgCard operating profiles`} />
      <table className="exec-table">
        <thead>
          <tr>
            <th>Org</th>
            <th style={{ textAlign: 'right' }}>Priorities</th>
            <th style={{ textAlign: 'right' }}>Decision rights</th>
            <th style={{ textAlign: 'right' }}>Dependencies</th>
            <th style={{ textAlign: 'right' }}>Escalation rules</th>
          </tr>
        </thead>
        <tbody>
          {orgCards.map((o) => (
            <tr key={o.id}>
              <td className="strong" style={{ fontSize: 13 }}>{o.orgName}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{o.strategicPriorities.length}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{o.decisionRights.length}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{o.dependencies.length}</td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12 }}>{o.escalationRules.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
