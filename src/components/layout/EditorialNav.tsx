import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const TICKER_MESSAGES = [
  'qwen-vl online',
  'verification queue clear',
  'reconciliation latency 1.2s',
  'oss bucket healthy',
  '0 escalations waiting',
  'last settlement 3m ago',
]

/**
 * EditorialNav
 * fixed top strip for the landing page
 * row layout wordmark left ticker center enter button right
 * liquid glass treatment on the button
 */
export function EditorialNav() {
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: 'rgba(17, 19, 26, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          trustflow
        </Link>

        <div
          className="hidden md:block font-mono text-xs"
          style={{ color: 'var(--accent-dim)' }}
          aria-live="polite"
        >
          {TICKER_MESSAGES[tickerIndex]}
        </div>

        <Link
          to="/dashboard"
          className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm flex items-center gap-1.5"
          style={{ color: 'var(--accent)' }}
        >
          enter dashboard
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  )
}

export default EditorialNav
