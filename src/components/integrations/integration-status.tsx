import type { Tables } from '@/types/database'

interface IntegrationStatusProps {
  integration: Tables<'integrations'>
}

const integrationLabels = {
  posthog: 'PostHog',
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
}

export default function IntegrationStatus({ integration }: IntegrationStatusProps) {
  const statusColors = {
    connected: 'bg-green-100 text-green-700',
    disconnected: 'bg-gray-100 text-gray-700',
    error: 'bg-red-100 text-red-700',
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{integrationLabels[integration.type]}</span>
      <span className={`px-2 py-1 text-xs rounded ${statusColors[integration.status]}`}>
        {integration.status}
      </span>
      {integration.last_sync_at && (
        <span className="text-xs text-gray-500">
          Last sync: {new Date(integration.last_sync_at).toLocaleString()}
        </span>
      )}
    </div>
  )
}