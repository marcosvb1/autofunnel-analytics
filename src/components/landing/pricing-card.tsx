import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PricingCardProps {
  tier: string
  price: string
  features: string[]
  isPopular?: boolean
  buttonText: string
  buttonHref: string
}

export default function PricingCard({
  tier,
  price,
  features,
  isPopular,
  buttonText,
  buttonHref,
}: PricingCardProps) {
  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
          Popular
        </span>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{tier}</CardTitle>
        <p className="text-3xl font-bold">{price}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature) => (
            <li key={feature} className="text-sm text-gray-600">
              ✓ {feature}
            </li>
          ))}
        </ul>
        <a
          href={buttonHref}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full h-9 px-4 py-2 ${
            isPopular 
              ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90' 
              : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {buttonText}
        </a>
      </CardContent>
    </Card>
  )
}