import { FadeIn } from '../ui/FadeIn'
import { TiltCard } from '../ui/TiltCard'
import { ScanText, Brain, Wrench, UserCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: ScanText,
    label: 'document extraction',
    headline: 'qwen vl reads any document',
    body: 'id cards utility bills and bank statements are passed to qwen-vl-max which returns structured json with name document number and business details no manual data entry',
  },
  {
    icon: Brain,
    label: 'autonomous reasoning',
    headline: 'qwen max decides and explains',
    body: 'the reasoning model takes the extracted json applies verification rules scores confidence from 0 to 100 and writes a plain english reason for every decision it makes',
  },
  {
    icon: Wrench,
    label: 'external tool calls',
    headline: 'oss storage and postgres writes',
    body: 'the agent uploads files to alibaba cloud oss queries the postgres database for outstanding invoices and updates invoice and payment status inside atomic transactions',
  },
  {
    icon: UserCheck,
    label: 'human in the loop',
    headline: 'reviewers only see edge cases',
    body: 'when confidence drops below 85 or a payment does not match the agent escalates to a human reviewer with its full reasoning attached so the human only touches what matters',
  },
]

/**
 * Features
 * three column grid of capability cards using liquid glass
 * each card has 3d tilt on hover for depth and engagement
 */
export function Features() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6 lg:px-8">
      <FadeIn>
        <div
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent-dim)' }}
        >
          capabilities
        </div>
        <h2
          className="font-display text-3xl lg:text-4xl mb-12 max-w-2xl"
          style={{ color: 'var(--text-primary)' }}
        >
          multi model ai that handles real business workflows end to end
        </h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <FadeIn key={feature.label} delay={i * 0.1}>
              <TiltCard className="liquid-glass rounded-2xl p-8 h-full" max={6}>
                <div style={{ transform: 'translateZ(40px)' }}>
                  <Icon size={20} style={{ color: 'var(--accent)' }} className="mb-4" />
                  <div
                    className="font-mono text-xs tracking-widest uppercase mb-4"
                    style={{ color: 'var(--accent-dim)' }}
                  >
                    {feature.label}
                  </div>
                  <h3
                    className="font-display text-xl mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {feature.headline}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {feature.body}
                  </p>
                </div>
              </TiltCard>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}

export default Features
