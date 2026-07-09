import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/Onboarding'
import { Invoices } from './pages/Invoices'
import { ReviewQueue } from './pages/ReviewQueue'
import { Payments } from './pages/Payments'
import { AppLayout } from './components/layout/AppLayout'
import type { ReactNode } from 'react'

/**
 * PageTransition
 * wraps each page in a blur in entry and blur out exit
 * entry opacity 0 to 1 blur in y 12 duration 0.4
 * exit opacity 1 to 0 y -8 duration 0.3
 */
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(8px)',
    y: 12,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

/**
 * AnimatedRoutes
 * wraps the route outlet in AnimatePresence with mode wait
 * so each navigation animates out before the new page animates in
 */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/onboarding"
          element={
            <AppLayout>
              <PageTransition>
                <Onboarding />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/invoices"
          element={
            <AppLayout>
              <PageTransition>
                <Invoices />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/review-queue"
          element={
            <AppLayout>
              <PageTransition>
                <ReviewQueue />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <AppLayout>
              <PageTransition>
                <Payments />
              </PageTransition>
            </AppLayout>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

/**
 * App
 * root component wires react router v6 with animated page transitions
 */
export function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
