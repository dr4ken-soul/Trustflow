import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BlurText } from '../ui/BlurText'
import { FadeIn } from '../ui/FadeIn'
import { MagneticButton } from '../ui/MagneticButton'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Hero
 * split layout copy left abstract object right
 * the abstract object has mouse parallax shift for depth
 * the cta is magnetic and pulls toward the cursor
 */
export function Hero() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // mouse parallax motion values, only the abstract object shifts
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const heroX = useSpring(useTransform(mouseX, [0, 1200], [-12, 12]), {
    stiffness: 150,
    damping: 20,
  })
  const heroY = useSpring(useTransform(mouseY, [0, 800], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section className="min-h-[100dvh] grid lg:grid-cols-2 relative" onMouseMove={handleMouseMove}>
      {/* left column copy stays fixed */}
      <div className="flex flex-col justify-center px-6 lg:px-16 py-16 relative z-10">
        <FadeIn delay={0.4}>
          <div className="liquid-glass rounded-full px-4 py-2 w-fit flex items-center gap-2">
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--accent-dim)' }}
            >
              track 4 autopilot agent
            </span>
          </div>
        </FadeIn>

        <h1
          className="font-display font-bold mt-5"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          <BlurText text="verify identity" delay={0.5} />
          <br />
          <BlurText text="reconcile payments" delay={0.7} />
          <br />
          <BlurText text="automate trust" delay={0.9} />
        </h1>

        <FadeIn delay={1.1}>
          <p
            className="font-body text-base lg:text-lg leading-relaxed mt-5 max-w-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            trustflow is an ai agent that reads client documents scores their
            authenticity and matches incoming payments to invoices end to end
            with human checkpoints only for the edge cases
          </p>
        </FadeIn>

        <FadeIn delay={1.3}>
          <div className="mt-8">
            <MagneticButton
              to="/dashboard"
              className="liquid-glass-strong rounded-full px-6 py-3 font-body text-sm inline-flex items-center gap-2"
            >
              <span style={{ color: 'var(--accent)' }}>enter the agent</span>
              <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
            </MagneticButton>
          </div>
        </FadeIn>
      </div>

      {/* right column abstract object with parallax */}
      <div className="relative overflow-hidden hidden lg:block">
        {/* copper ambient glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 60%)',
          }}
        />
        {/* abstract geometric object shifts with cursor */}
        <motion.div
          style={{ x: isTouch ? 0 : heroX, y: isTouch ? 0 : heroY }}
          initial={{ opacity: 0, filter: 'blur(12px)', x: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <AbstractObject />
        </motion.div>
      </div>
    </section>
  )
}

/**
 * AbstractObject
 * a floating copper geometric shape built from svg
 * represents the trust pipeline visually
 */
function AbstractObject() {
  return (
    <svg
      width="420"
      height="420"
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="copperGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8895f" />
          <stop offset="100%" stopColor="#8a5d3e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* outer ring */}
      <circle
        cx="210"
        cy="210"
        r="180"
        stroke="url(#copperGrad)"
        strokeWidth="1"
        opacity="0.3"
      />
      <circle
        cx="210"
        cy="210"
        r="140"
        stroke="url(#copperGrad)"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* central hexagon */}
      <polygon
        points="210,90 320,155 320,265 210,330 100,265 100,155"
        stroke="url(#copperGrad)"
        strokeWidth="1.5"
        fill="rgba(200,137,95,0.04)"
        filter="url(#glow)"
      />

      {/* inner triangle */}
      <polygon
        points="210,140 270,235 150,235"
        stroke="#c8895f"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* nodes */}
      <circle cx="210" cy="90" r="4" fill="#c8895f" />
      <circle cx="320" cy="155" r="4" fill="#c8895f" />
      <circle cx="320" cy="265" r="4" fill="#c8895f" />
      <circle cx="210" cy="330" r="4" fill="#c8895f" />
      <circle cx="100" cy="265" r="4" fill="#c8895f" />
      <circle cx="100" cy="155" r="4" fill="#c8895f" />
      <circle cx="210" cy="210" r="6" fill="#d9a07a" filter="url(#glow)" />

      {/* connecting lines */}
      <line x1="210" y1="90" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
      <line x1="320" y1="155" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
      <line x1="320" y1="265" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
      <line x1="210" y1="330" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
      <line x1="100" y1="265" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
      <line x1="100" y1="155" x2="210" y2="210" stroke="#c8895f" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}

export default Hero
