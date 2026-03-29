import { cn } from '@/lib/utils/helpers'

interface IntegrationBadgeProps {
  name: string
  status: 'connected' | 'disconnected' | 'error'
  className?: string
}

const statusColors = {
  connected: 'bg-success',
  disconnected: 'bg-text-muted',
  error: 'bg-error',
}

const bgColors = {
  connected: 'bg-success/10 text-success border-success/20',
  disconnected: 'bg-bg-secondary text-text-tertiary border-border-default',
  error: 'bg-error/10 text-error border-error/20',
}

export default function IntegrationBadge({
  name,
  status,
  className,
}: IntegrationBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        bgColors[status],
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          statusColors[status],
          status === 'connected' && 'animate-pulse'
        )}
      />
      {name}
    </span>
  )
}
