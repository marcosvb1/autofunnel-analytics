'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import IntegrationBadge from './integration-badge'
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
    <Card variant="interactive" className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            <Link 
              href={`/dashboard/projects/${project.id}`}
              className="text-text-primary hover:text-primary transition-colors"
            >
              {project.name}
            </Link>
          </CardTitle>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                onDelete(project.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-text-tertiary line-clamp-2">
            {project.description}
          </p>
        )}
        
        {project.integrations && project.integrations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.integrations.map((integration) => (
              <IntegrationBadge
                key={integration.id}
                name={integrationLabels[integration.type]}
                status={integration.status as 'connected' | 'disconnected' | 'error'}
              />
            ))}
          </div>
        )}
        
        {!project.integrations?.length && (
          <p className="text-sm text-text-muted">No integrations connected</p>
        )}

        <div className="pt-4 border-t border-border-subtle">
          <Link 
            href={`/dashboard/projects/${project.id}/funnel`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors group/link"
          >
            View Funnel
            <svg 
              className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}