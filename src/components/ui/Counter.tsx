import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CounterProps {
  /** final value to count up to */
  value: number
  /** duration in seconds default 1.5 */
  duration?: number
  /** prefix string eg $ */
  prefix?: string
  /** suffix string eg % */
  suffix?: string
  /** format with thousands separators default true */
  format?: boolean
  className?: string
}

/**
 * Counter
 * animates from 0 to value when scrolled into view
 * only runs once per page load
 * uses requestAnimationFrame for smooth 60fps counting
 */
export function Counter({
  value,
  duration = 1.5,
  prefix = '',
  suffix = '',
  format = true,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    let raf: number
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic for a natural slowdown at the end
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * value
      setDisplay(current)
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(value)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  const formatted = format
    ? Math.round(display).toLocaleString('en-GB')
    : Math.round(display).toString()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export default Counter
