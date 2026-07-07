import type { ReactNode } from 'react'
import { AppSidebar, MobileTabBar } from './AppSidebar'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout
 * wraps all app interior pages with the sidebar and mobile tab bar
 * applies the app-bg radial glow class and offset for the fixed sidebar
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-bg min-h-screen">
      <a href="#main-content" className="skip-link">
        skip to main content
      </a>
      <AppSidebar />
      <main
        id="main-content"
        className="lg:ml-64 pb-20 lg:pb-0 min-h-screen"
      >
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}

export default AppLayout
