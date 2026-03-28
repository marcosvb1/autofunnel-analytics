'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Tables } from '@/types/database'

interface ProjectCardProps {
  project: Tables<'projects'> & {
    integrations?: Tables<'integrations'>[]
    funnel_maps?: Tables<'funnel_maps'>[]
  }
  onDelete?: (id: string) => void
}

const integrationLabels = {
  posthog: 'PostHog',
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          <Link href={`/dashboard/projects/${project.id}`}>
            {project.name}
          </Link>
        </CardTitle>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            Delete
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-sm text-gray-600 mb-4">{project.description}</p>
        )}
        
        {project.integrations && project.integrations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.integrations.map((integration) => (
              <span
                key={integration.id}
                className={`px-2 py-1 text-xs rounded ${
                  integration.status === 'connected'
                    ? 'bg-green-100 text-green-700'
                    : integration.status === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {integrationLabels[integration.type]} ({integration.status})
              </span>
            ))}
          </div>
        )}
        
        {!project.integrations?.length && (
          <p className="text-sm text-gray-400">No integrations connected</p>
        )}
      </CardContent>
    </Card>
  )
}