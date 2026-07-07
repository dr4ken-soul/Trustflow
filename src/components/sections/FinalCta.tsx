import { FadeIn } from '../ui/FadeIn'
import { MagneticButton } from '../ui/MagneticButton'
import { ArrowRight } from 'lucide-react'

/**
 * FinalCta
 * centered headline and magnetic cta button closing the landing page
 */
export function FinalCta() {
  return (
    <section className="py-32 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8">
      <FadeIn>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 'tight',
            color: 'var(--text-primary)',
          }}
        >
          let the agent handle the trust pipeline
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p
          className="font-body text-base lg:text-lg leading-relaxed max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          built on qwen cloud and alibaba cloud infrastructure see the full flow
          from document upload to payment settlement in the dashboard
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <MagneticButton
          to="/dashboard"
          className="liquid-glass-strong rounded-full px-8 py-4 font-body text-sm inline-flex items-center gap-2"
        >
          <span style={{ color: 'var(--accent)' }}>open the dashboard</span>
          <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
        </MagneticButton>
      </FadeIn>
    </section>
  )
}

export default FinalCta
