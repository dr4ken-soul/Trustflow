import { useState, useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { useAppStore } from '../store/useAppStore'
import { formatDate } from '../lib/utils'
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import type { Escalation } from '../types'

/**
 * ReviewQueue
 * list of escalated items with agent reasoning attached
 * each card expands to show agent context with approve and reject buttons
 */
export function ReviewQueue() {
  const escalations = useAppStore((s) => s.escalations)
  const approveEscalation = useAppStore((s) => s.approveEscalation)
  const rejectEscalation = useAppStore((s) => s.rejectEscalation)
  const fetchAll = useAppStore((s) => s.fetchAll)

  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (escalations.length === 0) {
    return (
      <div className="pt-24 pb-16 px-6 lg:px-8 max-w-5xl mx-auto">
        <FadeIn>
          <h1
            className="font-display font-semibold text-3xl tracking-tight mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            review queue
          </h1>
          <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
            no escalations waiting for review
          </p>
        </FadeIn>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 max-w-5xl mx-auto">
      <FadeIn>
        <h1
          className="font-display font-semibold text-3xl tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          review queue
        </h1>
        <p
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          {escalations.filter((e) => e.status === 'pending').length} items awaiting
          your decision
        </p>
      </FadeIn>

      <div className="space-y-4">
        {escalations.map((esc, i) => (
          <FadeIn key={esc.id} delay={i * 0.08}>
            <EscalationCard
              escalation={esc}
              expanded={expandedId === esc.id}
              onToggle={() => toggleExpand(esc.id)}
              onApprove={() => approveEscalation(esc.id)}
              onReject={() => rejectEscalation(esc.id)}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

interface EscalationCardProps {
  escalation: Escalation
  expanded: boolean
  onToggle: () => void
  onApprove: () => void
  onReject: () => void
}

function EscalationCard({
  escalation,
  expanded,
  onToggle,
  onApprove,
  onReject,
}: EscalationCardProps) {
  const isReviewed = escalation.status === 'reviewed'

  return (
    <div className="liquid-glass rounded-2xl p-6">
      {/* top row */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-display text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            {escalation.client_name || escalation.client_id}
          </div>
          <div
            className="font-body text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {escalation.reason}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 font-body text-xs"
            style={{
              background: isReviewed
                ? 'rgba(127, 176, 105, 0.1)'
                : 'rgba(200, 137, 95, 0.1)',
              color: isReviewed ? 'var(--success)' : 'var(--accent-dim)',
              border: `1px solid ${
                isReviewed ? 'rgba(127, 176, 105, 0.2)' : 'rgba(200, 137, 95, 0.2)'
              }`,
            }}
          >
            {isReviewed
              ? escalation.reviewer_decision === 'approve'
                ? 'approved'
                : 'rejected'
              : 'escalated'}
          </span>
          <button
            onClick={onToggle}
            className="p-1 rounded"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={expanded ? 'collapse agent context' : 'expand agent context'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* expanded agent context */}
      {expanded && (
        <div
          className="font-mono text-xs mt-4 rounded-xl p-4"
          style={{
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
          }}
        >
          <div className="mb-2" style={{ color: 'var(--accent-dim)' }}>
            agent context
          </div>
          <pre className="whitespace-pre-wrap">
{JSON.stringify(escalation.agent_context, null, 2)}
          </pre>
          <div className="mt-3" style={{ color: 'var(--text-muted)' }}>
            created {formatDate(escalation.created_at)}
          </div>
        </div>
      )}

      {/* action buttons */}
      {!isReviewed && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={onApprove}
            className="rounded-lg px-4 py-2 font-body text-sm font-medium inline-flex items-center gap-2"
            style={{
              background: 'var(--success)',
              color: 'var(--bg-primary)',
            }}
          >
            <Check size={14} />
            approve
          </button>
          <button
            onClick={onReject}
            className="rounded-lg px-4 py-2 font-body text-sm font-medium inline-flex items-center gap-2"
            style={{
              background: 'var(--error)',
              color: 'var(--bg-primary)',
            }}
          >
            <X size={14} />
            reject
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewQueue
