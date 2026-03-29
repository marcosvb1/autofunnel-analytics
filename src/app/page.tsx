import Navbar from '@/components/nav/navbar'
import HeroSection from '@/components/landing/hero-section'
import PricingCard from '@/components/landing/pricing-card'

const pricingTiers = [
  {
    tier: 'Free',
    price: '$0',
    features: [
      '1 project',
      'PostHog connection only',
      'Manual sync',
      'Basic funnel detection',
    ],
    buttonText: 'Get Started',
    buttonHref: '/auth/signup',
  },
  {
    tier: 'Pro',
    price: '$49/month',
    features: [
      '5 projects',
      'PostHog + Meta Ads',
      'Auto sync (daily)',
      'AI chat for edits',
      'Attribution analysis',
      'ROI calculation',
    ],
    isPopular: true,
    buttonText: 'Start Free Trial',
    buttonHref: '/auth/signup',
  },
  {
    tier: 'Enterprise',
    price: '$199/month',
    features: [
      'Unlimited projects',
      'All integrations',
      'API access',
      'Webhooks',
      'White-label option',
      'Priority support',
    ],
    buttonText: 'Contact Sales',
    buttonHref: '/auth/signup',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroSection />
      
      <section id="pricing" className="py-20 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-text-primary text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-text-tertiary text-center mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.tier} {...tier} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}