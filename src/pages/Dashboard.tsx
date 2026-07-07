import { useEffect } from 'react'
import { FadeIn } from '../components/ui/FadeIn'
import { Counter } from '../components/ui/Counter'
import { useAppStore } from '../store/useAppStore'
import { formatDate, formatTime } from '../lib/utils'
import type { ActivityItem } from '../types'

const STATUS_BADGES: Record<ActivityItem['status'], { bg: string; text: string; border: string; label: string }> = {
  approved: {
    bg: 'rgba(127, 176, 105, 0.1)',
    text: 'var(--success)',
    border: 'rgba(127, 176, 105, 0.2)',
    label: 'approved',
  },
  flagged: {
    bg: 'rgba(229, 115, 115, 0.1)',
    text: 'var(--error)',
    border: 'rgba(229, 115, 115, 0.2)',
    label: 'flagged',
  },
  settled: {
    bg: 'rgba(127, 176, 105, 0.1)',
    text: 'var(--success)',
    border: 'rgba(127, 176, 105, 0.2)',
    label: 'settled',
  },
  escalated: {
    bg: 'rgba(200, 137, 95, 0.1)',
    text: 'var(--accent-dim)',
    border: 'rgba(200, 137, 95, 0.2)',
    label: 'escalated',
  },
}

/**
 * Dashboard
 * overview of active clients pending reviews and settled payments
 * stat cards animate from 0 to their value on scroll into view
 */
export function Dashboard() {
  const clients = useAppStore((s) => s.clients)
  const escalations = useAppStore((s) => s.escalations)
  const payments = useAppStore((s) => s.payments)
  const activity = useAppStore((s) => s.activity)
  const loading = useAppStore((s) => s.loading)
  const fetchAll = useAppStore((s) => s.fetchAll)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const activeClients = clients.filter((c) => c.status === 'active').length
  const pendingReviews = escalations.filter((e) => e.status === 'pending').length
  const settledPayments = payments.filter((p) => p.status === 'matched').length

  const stats = [
    {
      label: 'pending reviews',
      value: pendingReviews,
      sub: 'awaiting human decision',
    },
    {
      label: 'active clients',
      value: activeClients,
      sub: 'onboarded and verified',
    },
    {
      label: 'settled payments',
      value: settledPayments,
      sub: 'matched and reconciled',
    },
  ]

  return (
    <div className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn>
        <h1
          className="font-display font-semibold text-3xl tracking-tight mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          dashboard
        </h1>
        <p
          className="font-body text-sm mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          your compliance and finance ops overview
        </p>
      </FadeIn>

      {/* stat cards with counter animation */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1}>
            <div className="liquid-glass-strong rounded-2xl p-6">
              <div
                className="font-mono text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {stat.label}
              </div>
              <div
                className="font-display font-bold text-4xl tracking-tight leading-none mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                <Counter value={stat.value} duration={1.5} />
              </div>
              <div
                className="font-body text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stat.sub}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* recent activity */}
      <div className="mt-12">
        <FadeIn>
          <h2
            className="font-mono text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            recent activity
          </h2>
        </FadeIn>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {activity.map((item, i) => {
            const badge = STATUS_BADGES[item.status]
            return (
              <FadeIn key={item.id} delay={i * 0.05}>
                <div
                  className="flex items-center justify-between py-4"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {formatDate(item.date)} {formatTime(item.date)}
                    </div>
                    <div
                      className="font-body text-sm mt-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.summary}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 font-body text-xs"
                    style={{
                      background: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
