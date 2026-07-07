import { FadeIn } from '../ui/FadeIn'
import { Check, AlertTriangle } from 'lucide-react'

/**
 * HumanLoop
 * two panel layout showing agent autonomy vs human checkpoint
 * left panel auto approval right panel escalation
 */
export function HumanLoop() {
  return (
    <section className="py-24 max-w-5xl mx-auto px-6 lg:px-8">
      <FadeIn>
        <div
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: 'var(--accent-dim)' }}
        >
          human in the loop
        </div>
        <h2
          className="font-display text-3xl lg:text-4xl mb-12 max-w-2xl"
          style={{ color: 'var(--text-primary)' }}
        >
          the agent runs the clean pipelines humans only touch the edge cases
        </h2>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* auto approve panel */}
        <FadeIn delay={0.1}>
          <div className="liquid-glass-dark rounded-2xl p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(127, 176, 105, 0.1)',
                  border: '1px solid rgba(127, 176, 105, 0.2)',
                }}
              >
                <Check size={16} style={{ color: 'var(--success)' }} />
              </div>
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                agent auto approves
              </span>
            </div>

            <div className="font-mono text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>input </span>
                id card uploaded
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>extract </span>
                name jane anderson dob 1991-03-14 doc id-9920-1145-7
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>reason </span>
                all fields present values consistent pattern matches
              </div>
              <div style={{ color: 'var(--success)' }} className="pt-2">
                confidence 92 status approved
              </div>
            </div>

            <p
              className="font-body text-sm leading-relaxed mt-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              qwen max scored this identity 92 percent confidence the document was
              complete the name matched across fields and the id number followed
              the expected pattern so the agent moved the client to active without
              a human touching it
            </p>
          </div>
        </FadeIn>

        {/* escalation panel */}
        <FadeIn delay={0.25}>
          <div
            className="liquid-glass-dark rounded-2xl p-8 h-full"
            style={{ borderLeft: '2px solid var(--accent)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(229, 115, 115, 0.1)',
                  border: '1px solid rgba(229, 115, 115, 0.2)',
                }}
              >
                <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
              </div>
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                agent escalates
              </span>
            </div>

            <div className="font-mono text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>input </span>
                payment 450 from bank for invoice inv-102
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>invoice </span>
                amount 500 outstanding
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>reason </span>
                paid amount does not match invoice amount difference 50
              </div>
              <div style={{ color: 'var(--error)' }} className="pt-2">
                status flagged routed to review queue
              </div>
            </div>

            <p
              className="font-body text-sm leading-relaxed mt-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              the agent compared the incoming payment to the outstanding invoice
              found a 50 shortfall and wrote a reason explaining the mismatch then
              it held the payment for human review instead of settling it
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default HumanLoop
