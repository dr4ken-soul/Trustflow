import {
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface MagneticButtonProps {
  children: ReactNode
  to?: string
  onClick?: () => void
  className?: string
  /** max displacement in px default 6 */
  strength?: number
}

/**
 * MagneticButton
 * primary cta that pulls toward the cursor on hover
 * capped at 6px movement so it reads as attraction not jitter
 * degrades to a normal button on touch devices
 */
export function MagneticButton({
  children,
  to,
  onClick,
  className,
  strength = 6,
}: MagneticButtonProps) {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isTouch) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    // scale to the strength cap
    x.set((relX / rect.width) * strength * 2)
    y.set((relY / rect.height) * strength * 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const motionStyle = {
    x: isTouch ? 0 : springX,
    y: isTouch ? 0 : springY,
  }

  if (to) {
    return (
      <motion.div style={motionStyle}>
        <Link
          to={to}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
        >
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={motionStyle}
      className={className}
    >
      {children}
    </motion.button>
  )
}

export default MagneticButton
