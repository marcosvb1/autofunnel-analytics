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
        <Button
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          asChild
        >
          <a href={buttonHref}>{buttonText}</a>
        </Button>
      </CardContent>
    </Card>
  )
}