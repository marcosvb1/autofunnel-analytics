import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatVolume, formatSpend, formatConversion } from '@/lib/canvas/utils'

interface MetricsPanelProps {
  totalVolume: number
  totalSpend: number
  totalConversions: number
  overallConversion: number
  roi: number
}

export default function MetricsPanel({
  totalVolume,
  totalSpend,
  totalConversions,
  overallConversion,
  roi,
}: MetricsPanelProps) {
  const metrics = [
    { label: 'Total Visitors', value: formatVolume(totalVolume) },
    { label: 'Total Conversions', value: formatVolume(totalConversions) },
    { label: 'Conversion Rate', value: formatConversion(overallConversion) },
    { label: 'Total Spend', value: formatSpend(totalSpend) },
    { label: 'ROI', value: roi > 0 ? `${roi.toFixed(1)}x` : '-' },
  ]

  return (
    <Card className="w-64">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Funnel Metrics</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{metric.label}</span>
              <span className="font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}