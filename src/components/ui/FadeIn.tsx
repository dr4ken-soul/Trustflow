import { motion, type Variants } from 'framer-motion'
import type { ReactNode, ElementType } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  /** amount of the element that must be visible before triggering 0 to 1 */
  amount?: number
  /** render as a different element */
  as?: ElementType
}

/**
 * FadeIn
 * wraps children in a framer motion blur in entrance
 * respects the spec initial opacity 0 filter blur 8px y 20
 * triggers once when scrolled into view
 */
const variants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function FadeIn({
  children,
  delay = 0,
  className,
  amount = 0,
  as,
}: FadeInProps) {
  const MotionTag = (as ? motion(as as ElementType) : motion.div) as typeof motion.div
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px', amount }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

export default FadeIn
