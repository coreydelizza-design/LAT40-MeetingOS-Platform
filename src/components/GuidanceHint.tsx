import { useId } from 'react'
import type { ReactNode } from 'react'

/**
 * GuidanceHint — executive product guidance cue.
 *
 * Not a generic tooltip. It explains what a concept means, why it matters, and
 * what action it supports. CSS-only reveal on hover AND keyboard focus
 * (`:focus-within`), no state library, no tooltip dependency.
 *
 * Accessibility: the trigger is a real <button> (focusable, tappable) with
 * `aria-describedby` pointing at the panel (`role="tooltip"`), so the guidance
 * is announced on focus. Touch users can tap the trigger to focus it and reveal
 * the panel; richer mobile/touch expansion can be added later.
 */
export interface GuidanceCopy {
  title: string
  description: string
  action?: string
}

interface GuidanceHintProps extends GuidanceCopy {
  children: ReactNode
  /** Dotted underline marker on the trigger text. Disable for chips/large titles. */
  underline?: boolean
  position?: 'top' | 'bottom'
  align?: 'left' | 'right'
}

export function GuidanceHint({
  children,
  title,
  description,
  action,
  underline = true,
  position = 'bottom',
  align = 'left',
}: GuidanceHintProps) {
  const id = useId()
  return (
    <span className={`guidance guidance-${position} align-${align}`}>
      <button
        type="button"
        className={`guidance-trigger${underline ? '' : ' plain'}`}
        aria-describedby={id}
      >
        {children}
      </button>
      <span className="guidance-panel" role="tooltip" id={id}>
        <span className="gp-eyebrow">Guidance</span>
        <span className="gp-title">{title}</span>
        <span className="gp-desc">{description}</span>
        {action ? <span className="gp-action">{action}</span> : null}
      </span>
    </span>
  )
}
