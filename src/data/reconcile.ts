/**
 * Reconciliation checks for the admin Signal & Noise module.
 *
 * Each check compares a number the instrument renders against the app's own
 * source of truth (Executive Review's LIVE_TIME_GOVERNANCE) or an internal
 * invariant that must hold. Pure and dependency-free so it can be unit-tested
 * or run headless. Green = the app's math is trustworthy; red = something drifted.
 */
import { getLiveTimeGovernance, getSignalNoise, getWeekCalls } from './adapters'
import { appDataOf, quadOf, signalScore, truthOf } from './signalNoiseMath'
import type { Quad } from './signalNoiseMath'

export interface Check {
  id: string
  label: string
  source: string
  expected: string
  actual: string
  pass: boolean
}

export interface Reconciliation {
  checks: Check[]
  passCount: number
  total: number
  allPass: boolean
}

const liveHrs = (rows: { label: string; value: string }[], label: string): number => {
  const r = rows.find((x) => x.label === label)
  return r ? parseInt(r.value, 10) : NaN
}
const round1 = (n: number) => Math.round(n * 10) / 10

export function runReconciliation(): Reconciliation {
  const gov = getLiveTimeGovernance()
  const sn = getSignalNoise()
  const calls = getWeekCalls()
  const checks: Check[] = []
  const add = (id: string, label: string, source: string, expected: unknown, actual: unknown) =>
    checks.push({
      id,
      label,
      source,
      expected: String(expected),
      actual: String(actual),
      pass: String(expected) === String(actual),
    })

  add(
    'total',
    'Total live hours match Executive Review',
    'LIVE_TIME_GOVERNANCE → SIGNAL_NOISE.totalLiveHours',
    liveHrs(gov, 'Total live meeting hours'),
    sn.totalLiveHours,
  )
  add(
    'recover',
    'Recoverable hours match Executive Review',
    'LIVE_TIME_GOVERNANCE → SIGNAL_NOISE.recoverableHours',
    liveHrs(gov, 'Recoverable time'),
    sn.recoverableHours,
  )
  add('sum-total', 'Signal + noise = total live', 'signalHours + noiseHours', sn.totalLiveHours, sn.signalHours + sn.noiseHours)
  add(
    'parts',
    'Signal + recoverable + floor = total',
    'signal + recoverable + floor',
    sn.totalLiveHours,
    sn.signalHours + sn.recoverableHours + sn.floorHours,
  )
  add(
    'classes',
    'Noise classes sum to recoverable',
    'Σ class hours = recoverableHours',
    sn.recoverableHours,
    sn.classes.reduce((n, c) => n + c.hours, 0),
  )
  add('ratio', 'Headline ratio = total ÷ signal', 'round(total / signal, 1)', sn.ratio, round1(sn.totalLiveHours / sn.signalHours))
  add('ceiling', 'Signal ceiling = total − floor', 'totalLiveHours − floorHours', sn.signalCeilingHours, sn.totalLiveHours - sn.floorHours)

  const orgBad = sn.perOrg.filter(
    (o) => o.signalHours + o.noiseHours !== o.liveHours || o.ratio !== round1(o.liveHours / o.signalHours),
  )
  add('per-org', 'Every org: signal + noise = live, ratio = live ÷ signal', `${sn.perOrg.length} orgs consistent`, sn.perOrg.length, sn.perOrg.length - orgBad.length)

  const qBad = sn.quarters.filter((q) => q.ratio !== round1(sn.totalLiveHours / q.signalHours))
  add('quarters', 'Every quarter: ratio = total ÷ signal', `${sn.quarters.length} quarters consistent`, sn.quarters.length, sn.quarters.length - qBad.length)

  const target = sn.quarters[sn.quarters.length - 1]
  add('target', 'Q4 target stays under the signal ceiling', 'targetSignal ≤ ceiling', 'yes', target.signalHours <= sn.signalCeilingHours ? 'yes' : 'no')

  const counts: Record<Quad, number> = { signal: 0, appdata: 0, receipts: 0, noise: 0 }
  calls.forEach((c) => (counts[quadOf(c)] += 1))
  add('quad-sum', 'Matrix quadrant counts sum to all calls', 'Σ quadrant counts = calls', calls.length, counts.signal + counts.appdata + counts.receipts + counts.noise)

  const scoreBad = calls.filter(
    (c) =>
      [signalScore(c), truthOf(c), appDataOf(c)].some((v) => v < 0 || v > 100),
  )
  add('scores', 'Every call scores within 0–100', `${calls.length} calls in range`, calls.length, calls.length - scoreBad.length)

  const passCount = checks.filter((c) => c.pass).length
  return { checks, passCount, total: checks.length, allPass: passCount === checks.length }
}
