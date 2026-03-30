import { Button } from '@/components/ui/button'
import { formatVolume, formatSpend, formatConversion } from '@/lib/canvas/utils'
import { X } from 'lucide-react'

interface MetricsPanelProps {
  totalVolume: number
  totalSpend: number
  totalConversions: number
  overallConversion: number
  roi: number
  onClose: () => void
}

export default function MetricsPanel({
  totalVolume,
  totalSpend,
  totalConversions,
  overallConversion,
  roi,
  onClose,
}: MetricsPanelProps) {
  const metrics = [
    { label: 'Total Visitors', value: formatVolume(totalVolume) },
    { label: 'Total Conversions', value: formatVolume(totalConversions) },
    { label: 'Conversion Rate', value: formatConversion(overallConversion) },
    { label: 'Total Spend', value: formatSpend(totalSpend) },
    { label: 'ROI', value: roi > 0 ? `${roi.toFixed(1)}x` : '-' },
  ]

  return (
    <div className="absolute top-4 right-4 z-40">
      <div className="w-72 bg-white/90 backdrop-blur-md shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Funnel Metrics</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 hover:bg-gray-200 transition-colors"
            title="Close metrics"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Metrics Content */}
        <div className="p-3 space-y-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{metric.label}</span>
              <span className="font-medium text-gray-900">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
