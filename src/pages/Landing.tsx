import { EditorialNav } from '../components/layout/EditorialNav'
import { Hero } from '../components/sections/Hero'
import { TrustFlowDiagram } from '../components/sections/TrustFlowDiagram'
import { Features } from '../components/sections/Features'
import { HumanLoop } from '../components/sections/HumanLoop'
import { FinalCta } from '../components/sections/FinalCta'

/**
 * Landing
 * the marketing page with all five sections in order
 * hero trust flow diagram features human in the loop final cta
 */
export function Landing() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        skip to main content
      </a>
      <EditorialNav />
      <main id="main-content">
        <Hero />
        <TrustFlowDiagram />
        <Features />
        <HumanLoop />
        <FinalCta />
      </main>
    </>
  )
}

export default Landing
