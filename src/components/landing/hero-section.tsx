import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="py-24 md:py-32 text-center px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary tracking-tight">
          Discover Your Funnel{' '}
          <span className="text-primary">Automatically</span>
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Stop manually drawing funnels. Our AI analyzes your traffic, 
          detects conversion paths, and shows you exactly what's working 
          and what's not - all automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}