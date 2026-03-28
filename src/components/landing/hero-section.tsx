import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Discover Your Funnel Automatically
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Stop manually drawing funnels. Our AI analyzes your traffic, 
        detects conversion paths, and shows you exactly what's working 
        and what's not - all automatically.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/auth/signup">
          <Button size="lg">Get Started Free</Button>
        </Link>
        <Link href="#pricing">
          <Button variant="outline" size="lg">View Pricing</Button>
        </Link>
      </div>
    </section>
  )
}