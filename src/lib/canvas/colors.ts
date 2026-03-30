import { colors } from '@/lib/design/tokens'

export function getEdgeColor(conversionRate: number): string {
  if (conversionRate >= 0.05) return colors.success
  if (conversionRate >= 0.03) return colors.successLight
  if (conversionRate >= 0.01) return colors.warning
  return colors.danger
}

export function getEdgeWidth(volume: number): number {
  const logVolume = Math.log10(volume + 1)
  return Math.min(8, Math.max(1, logVolume))
}
