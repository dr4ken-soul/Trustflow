import { FadeIn } from '../ui/FadeIn'
import { FileImage, ScanText, ShieldCheck, UserCheck, ArrowLeftRight, Receipt } from 'lucide-react'

const STEPS = [
  {
    icon: FileImage,
    label: 'document upload',
    description: 'client id or business record lands in oss',
  },
  {
    icon: ScanText,
    label: 'qwen vl extraction',
    description: 'vision model reads the image into structured json',
  },
  {
    icon: ShieldCheck,
    label: 'qwen max verification',
    description: 'reasoning model scores confidence and decides',
  },
  {
    icon: UserCheck,
    label: 'human checkpoint',
    description: 'low confidence items escalate to a reviewer',
  },
  {
    icon: ArrowLeftRight,
    label: 'payment matching',
    description: 'incoming transactions match against invoices',
  },
  {
    icon: Receipt,
    label: 'receipt generated',
    description: 'matched payments settle and a receipt is written',
  },
]

/**
 * TrustFlowDiagram
 * visual pipeline of the kyc to payment flow
 * six liquid glass cards connected by svg lines with staggered reveal
 */
export function TrustFlowDiagram() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6 lg:px-8">
      <FadeIn>
        <div
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent-dim)' }}
        >
          the pipeline
        </div>
        <h2
          className="font-display text-3xl lg:text-4xl mb-12"
          style={{ color: 'var(--text-primary)' }}
        >
          from document to settlement without a human in between
        </h2>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <FadeIn key={step.label} delay={i * 0.15}>
              <div className="liquid-glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(200, 137, 95, 0.1)',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <Icon size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <span
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: 'var(--accent-dim)' }}
                  >
                    step {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3
                  className="font-display text-lg mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {step.label}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {step.description}
                </p>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}

export default TrustFlowDiagram
