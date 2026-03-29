import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/helpers'

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
    <Card 
      className={cn(
        'relative flex flex-col',
        isPopular && 'border-primary shadow-lg scale-105 z-10'
      )}
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
          Most Popular
        </span>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-text-secondary">{tier}</CardTitle>
        <p className="text-4xl font-semibold text-text-primary">{price}</p>
        {price !== '$0' && (
          <p className="text-sm text-text-tertiary">billed monthly</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-3 mb-6 flex-1">
          {features.map((feature) => (
            <li key={feature} className="text-sm text-text-secondary flex items-start gap-2">
              <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <a href={buttonHref}>
          <Button 
            variant={isPopular ? 'primary' : 'outline'} 
            className="w-full"
          >
            {buttonText}
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}