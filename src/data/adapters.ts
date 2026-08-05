/**
 * Data-source seam for the admin Signal & Noise module.
 *
 * The whole point of the module is to check the app's numbers against the app's
 * data — so it must read the SAME source every other screen reads. Today that is
 * the in-memory mock constants below, which makes reconciliation honest for free.
 *
 * This file is the single boundary to change when a real backend arrives: swap
 * these bodies to fetch from the API (returning the same shapes) and every admin
 * screen keeps working unchanged. Keep it the ONLY place the module reaches into
 * `mock.ts`, so the migration stays a one-file edit.
 */
import { LIVE_TIME_GOVERNANCE, SIGNAL_NOISE, WEEK_CALLS } from './mock'
import type { SignalNoiseModel, Call } from './mock'

/** Executive Review's published live-time figures — the reconciliation anchor. */
export function getLiveTimeGovernance(): { label: string; value: string }[] {
  return LIVE_TIME_GOVERNANCE
}

/** The derived signal/noise model rendered by the instrument. */
export function getSignalNoise(): SignalNoiseModel {
  return SIGNAL_NOISE
}

/** Every scored call plotted in the matrix. */
export function getWeekCalls(): Call[] {
  return WEEK_CALLS
}
