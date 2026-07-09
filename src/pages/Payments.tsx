import { useState, useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { useAppStore } from '../store/useAppStore'
import { formatDate, formatTime } from '../lib/utils'
import { submitPayment } from '../lib/api'
import { ChevronDown, ChevronUp, Zap, CheckCircle, AlertTriangle } from 'lucide-react'
import type { Payment } from '../types'

/**
 * Payments
 * table of recent payments with matched and flagged status badges
 * flagged payments expand to show agent reasoning in a dark container
 * includes a simulate incoming payment section for demo and testing
 */
export function Payments() {
  const payments = useAppStore((s) => s.payments)
  const invoices = useAppStore((s) => s.invoices)
  const fetchAll = useAppStore((s) => s.fetchAll)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // simulate payment form state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentSource, setPaymentSource] = useState<'bank' | 'crypto'>('bank')
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<{
    status: string
    reason: string
    summary?: string
  } | null>(null)
  const [simError, setSimError] = useState<string | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  /** pre-fill the amount field when a different invoice is selected */
  const handleInvoiceChange = (id: string) => {
    setSelectedInvoiceId(id)
    setSimResult(null)
    setSimError(null)
    const inv = invoices.find((i) => i.id === id)
    if (inv) setPaymentAmount(String(inv.amount))
  }

  /**
   * submit a simulated payment webhook to the backend
   * qwen max reconciles the payment against the selected invoice
   */
  const handleSimulate = async () => {
    if (!selectedInvoiceId || !paymentAmount) return
    const inv = invoices.find((i) => i.id === selectedInvoiceId)
    if (!inv) return

    setSimulating(true)
    setSimResult(null)
    setSimError(null)

    try {
      const result = await submitPayment({
        amount: Number(paymentAmount),
        source: paymentSource,
        client_id: inv.client_id,
        invoice_id: selectedInvoiceId,
      })
      setSimResult(result)
      await fetchAll()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'simulation failed'
      setSimError(message)
    } finally {
      setSimulating(false)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const matchedCount = payments.filter((p) => p.status === 'matched').length
  const flaggedCount = payments.filter((p) => p.status === 'flagged').length
  const outstandingInvoices = invoices.filter((i) => i.status === 'outstanding')

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

      {/* simulate incoming payment */}
      <FadeIn delay={0.05}>
        <div
          className="liquid-glass rounded-2xl p-6 mb-10"
          style={{ borderLeft: '2px solid var(--accent)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap size={14} style={{ color: 'var(--accent)' }} />
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}
            >
              simulate incoming payment
            </span>
          </div>

          {outstandingInvoices.length === 0 ? (
            <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
              no outstanding invoices — upload an invoice first on the invoices page
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-end">
              <div className="lg:col-span-2">
                <label
                  htmlFor="invoice-select"
                  className="block font-mono text-xs mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  invoice
                </label>
                <select
                  id="invoice-select"
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full liquid-glass rounded-xl px-4 py-3 font-body text-sm outline-none"
                  style={{
                    color: selectedInvoiceId ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <option value="" disabled>
                    select an outstanding invoice
                  </option>
                  {outstandingInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.client_name ?? inv.client_id}
                      {inv.invoice_number ? ` · ${inv.invoice_number}` : ''}
                      {' · '}NGN {Number(inv.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="payment-amount"
                  className="block font-mono text-xs mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  amount (NGN)
                </label>
                <input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value)
                    setSimResult(null)
                  }}
                  placeholder="0.00"
                  className="w-full liquid-glass rounded-xl px-4 py-3 font-mono text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <div
                  className="block font-mono text-xs mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  source
                </div>
                <div className="flex gap-2">
                  {(['bank', 'crypto'] as const).map((src) => (
                    <button
                      key={src}
                      id={`source-${src}-btn`}
                      onClick={() => setPaymentSource(src)}
                      className="flex-1 rounded-xl px-3 py-3 font-body text-sm transition-colors"
                      style={{
                        background:
                          paymentSource === src
                            ? 'rgba(200, 137, 95, 0.1)'
                            : 'transparent',
                        color:
                          paymentSource === src
                            ? 'var(--accent)'
                            : 'var(--text-secondary)',
                        border: `1px solid ${
                          paymentSource === src
                            ? 'var(--accent)'
                            : 'var(--border-default)'
                        }`,
                      }}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {outstandingInvoices.length > 0 && (
            <button
              id="simulate-payment-btn"
              onClick={handleSimulate}
              disabled={simulating || !selectedInvoiceId || !paymentAmount}
              className="mt-5 liquid-glass rounded-full px-6 py-2.5 font-body text-sm inline-flex items-center gap-2 transition-colors"
              style={{
                color: simulating ? 'var(--text-muted)' : 'var(--accent)',
                cursor:
                  simulating || !selectedInvoiceId || !paymentAmount
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {simulating ? 'qwen reconciling...' : 'submit payment'}
            </button>
          )}

          {simError && (
            <div
              className="mt-4 flex items-center gap-2 font-body text-sm"
              style={{ color: 'var(--error)' }}
            >
              <AlertTriangle size={14} />
              {simError}
            </div>
          )}

          {simResult && (
            <FadeIn>
              <div
                className="mt-5 rounded-xl p-4"
                style={{
                  background:
                    simResult.status === 'matched'
                      ? 'rgba(127, 176, 105, 0.07)'
                      : 'rgba(229, 115, 115, 0.07)',
                  border: `1px solid ${
                    simResult.status === 'matched'
                      ? 'rgba(127, 176, 105, 0.2)'
                      : 'rgba(229, 115, 115, 0.2)'
                  }`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {simResult.status === 'matched' ? (
                    <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                  ) : (
                    <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
                  )}
                  <span
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{
                      color:
                        simResult.status === 'matched'
                          ? 'var(--success)'
                          : 'var(--error)',
                    }}
                  >
                    {simResult.status}
                  </span>
                </div>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {simResult.reason}
                </p>
              </div>
            </FadeIn>
          )}
        </div>
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

/**
 * PaymentRow
 * single row in the payments list
 * flagged payments expand to show agent reasoning
 */
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
            NGN {Number(payment.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })} via {payment.source}
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

      {!isMatched && expanded && (
        <div className="liquid-glass-dark rounded-xl p-4 mt-2 mb-4">
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
