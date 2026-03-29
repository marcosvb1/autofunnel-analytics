import { Button } from '@/components/ui/button'
import { formatVolume, formatSpend, formatConversion } from '@/lib/canvas/utils'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface MetricsPanelProps {
  totalVolume: number
  totalSpend: number
  totalConversions: number
  overallConversion: number
  roi: number
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function MetricsPanel({
  totalVolume,
  totalSpend,
  totalConversions,
  overallConversion,
  roi,
  isCollapsed,
  onToggleCollapse,
}: MetricsPanelProps) {
  const metrics = [
    { label: 'Total Visitors', value: formatVolume(totalVolume) },
    { label: 'Total Conversions', value: formatVolume(totalConversions) },
    { label: 'Conversion Rate', value: formatConversion(overallConversion) },
    { label: 'Total Spend', value: formatSpend(totalSpend) },
    { label: 'ROI', value: roi > 0 ? `${roi.toFixed(1)}x` : '-' },
  ]

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-3 border-b">
        {!isCollapsed && (
          <span className="text-sm font-medium text-gray-700">Funnel Metrics</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Metrics Content */}
      <div
        className={`
          flex-1 overflow-hidden transition-all duration-300
          ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
        `}
      >
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