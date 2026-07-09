import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, ClipboardCheck, Wallet, LogOut, Receipt } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
  { to: '/onboarding', label: 'onboarding', icon: Upload },
  { to: '/invoices', label: 'invoices', icon: Receipt },
  { to: '/review-queue', label: 'review queue', icon: ClipboardCheck },
  { to: '/payments', label: 'payments', icon: Wallet },
]

/**
 * AppSidebar
 * fixed left sidebar for the app interior
 * desktop only on mobile it is replaced by the bottom tab bar in AppLayout
 */
export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 hidden lg:flex flex-col"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      <div className="px-6 h-16 flex items-center">
        <Link
          to="/"
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          trustflow
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-2.5 font-body text-sm transition-colors"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    borderLeft: isActive
                      ? '2px solid var(--accent)'
                      : '2px solid transparent',
                    paddingLeft: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          id="sidebar-logout-btn"
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-6 py-4 font-body text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
          aria-label="sign out"
        >
          <LogOut size={16} />
          sign out
        </button>
      </div>

      <div
        className="px-6 py-4 font-mono text-xs"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}
      >
        v1.0.0
      </div>
    </aside>
  )
}

/**
 * MobileTabBar
 * fixed bottom tab bar shown only on mobile
 * replaces the sidebar below the lg breakpoint
 */
export function MobileTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-6 h-16"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
            aria-label={item.label}
          >
            <Icon size={18} />
            <span className="font-body text-[10px]">{item.label}</span>
          </Link>
        )
      })}
      <button
        id="mobile-logout-btn"
        onClick={() => navigate('/')}
        className="flex flex-col items-center justify-center gap-1"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="sign out"
      >
        <LogOut size={18} />
        <span className="font-body text-[10px]">sign out</span>
      </button>
    </nav>
  )
}

export default AppSidebar
