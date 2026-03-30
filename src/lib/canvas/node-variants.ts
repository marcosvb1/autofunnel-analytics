import { cva, type VariantProps } from 'class-variance-authority'

const nodeVariantsBase = [
  'rounded-lg',
  'cursor-pointer',
  'overflow-hidden',
  'transition-all',
  'duration-200',
  'min-h-[80px]',
]

const nodeVariantsConfig = {
  variants: {
    group: {
      traffic: ['border-2', 'shadow-md'],
      page: ['border-2', 'shadow-lg', 'bg-white'],
      event: ['border-2', 'shadow-md', 'bg-gradient-to-br'],
      conversion: ['border-2', 'shadow-xl', 'bg-gradient-to-br'],
    },
    size: {
      compact: ['min-w-[120px]', 'max-w-[160px]', 'p-2'],
      default: ['min-w-[180px]', 'max-w-[220px]', 'p-3'],
      expanded: ['min-w-[280px]', 'max-w-[320px]', 'p-4'],
    },
    state: {
      default: ['opacity-100'],
      selected: ['ring-2', 'ring-blue-400', 'ring-offset-2'],
      expanded: ['shadow-xl', 'z-10'],
      dimmed: ['opacity-50'],
    },
  },
  defaultVariants: {
    group: 'page' as const,
    size: 'default' as const,
    state: 'default' as const,
  },
}

export const nodeVariants = Object.assign(
  cva(nodeVariantsBase, nodeVariantsConfig),
  {
    base: nodeVariantsBase,
    variants: nodeVariantsConfig.variants,
  }
)

export interface NodeVariantProps extends VariantProps<typeof nodeVariants> {
  group: 'traffic' | 'page' | 'event' | 'conversion'
}

export function getNodeVariantClasses(props: NodeVariantProps): string {
  return nodeVariants(props)
}

export function getIconContainerClasses(group: 'traffic' | 'page' | 'event' | 'conversion'): string {
  const classes: Record<string, string> = {
    traffic: 'w-8 h-8 rounded-full flex items-center justify-center',
    page: 'w-6 h-6',
    event: 'w-7 h-7 rounded-full',
    conversion: 'w-8 h-8 rounded-full animate-pulse',
  }
  return classes[group] || classes.page
}

export function getBadgeClasses(group: 'traffic' | 'page' | 'event' | 'conversion'): string {
  const classes: Record<string, string> = {
    traffic: 'bg-blue-100 text-blue-700',
    page: 'bg-gray-100 text-gray-700',
    event: 'bg-purple-100 text-purple-700',
    conversion: 'bg-green-100 text-green-700',
  }
  return classes[group] || classes.page
}
