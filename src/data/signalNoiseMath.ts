/**
 * Pure scoring helpers for the Signal & Noise instrument.
 *
 * Shared by the view, the reconciliation checks, and the raw-data inspector so
 * all three agree by construction — the checks verify the app's numbers using
 * the very same functions the view renders with, never a re-implementation.
 */
import type { Call } from './mock'

export const VALUE_SCORE: Record<Call['value'], number> = {
  Low: 25,
  Medium: 50,
  High: 78,
  Critical: 95,
  Protected: 100,
}

/** Truth — validated by receipts (operational truth). Horizontal, signal → right. */
export const truthOf = (c: Call) => c.outcome
/** Application data — what the app captured / declared. Vertical, signal → top. */
export const appDataOf = (c: Call) => Math.round(c.liveNeed * 0.55 + VALUE_SCORE[c.value] * 0.45)

export type Quad = 'signal' | 'appdata' | 'receipts' | 'noise'
export const QUAD_LABEL: Record<Quad, string> = {
  signal: 'Signal',
  appdata: 'App-data only',
  receipts: 'Receipts only',
  noise: 'Noise',
}
export const quadOf = (c: Call): Quad => {
  const t = truthOf(c) >= 50
  const a = appDataOf(c) >= 50
  return a ? (t ? 'signal' : 'appdata') : t ? 'receipts' : 'noise'
}
/** A single headline score — the call's blend toward the signal corner. */
export const signalScore = (c: Call) => Math.round((truthOf(c) + appDataOf(c)) / 2)
