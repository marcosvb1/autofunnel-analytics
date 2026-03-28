import { cn } from '@/lib/utils/helpers'
import { formatConversion, formatVolume } from '@/lib/canvas/utils'

interface EdgeLabelProps {
  volume: number
  conversion: number
  isMainPath: boolean
}

export default function EdgeLabel({ volume, conversion, isMainPath }: EdgeLabelProps) {
  return (
    <div
      className={cn(
        'bg-white px-2 py-1 rounded shadow text-xs',
        isMainPath && 'bg-yellow-50 border border-yellow-300'
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{formatVolume(volume)}</span>
        <span className={cn(
          'font-bold',
          conversion >= 30 ? 'text-green-600' : conversion >= 15 ? 'text-yellow-600' : 'text-red-600'
        )}>
          {formatConversion(conversion)}
        </span>
      </div>
    </div>
  )
}