import { cn } from '@/lib/utils/helpers'

interface MetricDisplayProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export default function MetricDisplay({
  label,
  value,
  trend,
  className,
}: MetricDisplayProps) {
  return (
    <div className={cn('p-4 bg-bg-secondary rounded-lg', className)}>
      <p className="text-sm text-text-tertiary mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
        {trend && (
          <div
            className={cn(
              'flex items-center text-xs font-medium px-2 py-1 rounded-full',
              trend.direction === 'up'
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            )}
          >
            {trend.direction === 'up' ? '↑' : '↓'}
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
