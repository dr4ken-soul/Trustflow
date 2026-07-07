import { useState, useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { useAppStore } from '../store/useAppStore'
import { formatCurrency, formatDate, formatTime } from '../lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Payment } from '../types'

/**
 * Payments
 * table of recent payments with matched and flagged status badges
 * flagged payments expand to show agent reasoning in a dark container
 */
export function Payments() {
  const payments = useAppStore((s) => s.payments)
  const fetchAll = useAppStore((s) => s.fetchAll)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const matchedCount = payments.filter((p) => p.status === 'matched').length
  const flaggedCount = payments.filter((p) => p.status === 'flagged').length

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 max-w-5xl mx-auto">
      <FadeIn>
        <h1
          className="font-display font-semibold text-3xl tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          payments
        </h1>
        <p
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          {matchedCount} matched {flaggedCount} flagged across {payments.length}{' '}
          recent transactions
        </p>
      </FadeIn>

      <FadeIn>
        <h2
          className="font-mono text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          recent transactions
        </h2>
      </FadeIn>

      <div>
        {payments.map((payment, i) => (
          <FadeIn key={payment.id} delay={i * 0.05}>
            <PaymentRow
              payment={payment}
              expanded={expandedId === payment.id}
              onToggle={() => toggleExpand(payment.id)}
              isFirst={i === 0}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

interface PaymentRowProps {
  payment: Payment
  expanded: boolean
  onToggle: () => void
  isFirst: boolean
}

function PaymentRow({ payment, expanded, onToggle, isFirst }: PaymentRowProps) {
  const isMatched = payment.status === 'matched'

  return (
    <div
      style={{ borderTop: isFirst ? 'none' : '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center justify-between py-4">
        <div>
          <div
            className="font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {formatDate(payment.created_at)} {formatTime(payment.created_at)}
          </div>
          <div
            className="font-body text-sm mt-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatCurrency(payment.amount)} via {payment.source}
            <span style={{ color: 'var(--text-muted)' }}>
              {' '}
              for {payment.client_name || payment.client_id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 font-body text-xs"
            style={{
              background: isMatched
                ? 'rgba(127, 176, 105, 0.1)'
                : 'rgba(229, 115, 115, 0.1)',
              color: isMatched ? 'var(--success)' : 'var(--error)',
              border: `1px solid ${
                isMatched
                  ? 'rgba(127, 176, 105, 0.2)'
                  : 'rgba(229, 115, 115, 0.2)'
              }`,
            }}
          >
            {payment.status}
          </span>
          {!isMatched && (
            <button
              onClick={onToggle}
              className="p-1 rounded"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={expanded ? 'collapse reasoning' : 'expand reasoning'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* expanded reasoning */}
      {!isMatched && expanded && (
        <div
          className="liquid-glass-dark rounded-xl p-4 mt-2 mb-4"
        >
          <div
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: 'var(--accent-dim)' }}
          >
            agent reasoning
          </div>
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {payment.summary}
          </p>
          <div
            className="font-mono text-xs mt-3 pt-3"
            style={{
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            invoice {payment.invoice_id} payment {payment.id}
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments
