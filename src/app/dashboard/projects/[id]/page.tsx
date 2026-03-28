'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import IntegrationStatus from '@/components/integrations/integration-status'
import type { Tables } from '@/types/database'

interface Project {
  id: string
  name: string
  description: string | null
  integrations: Tables<'integrations'>[]
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projectId, setProjectId] = useState<string>('')

  useEffect(() => {
    params.then(p => setProjectId(p.id))
  }, [params])

  useEffect(() => {
    if (!projectId) return
    
    const fetchProject = async () => {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      setProject(data.project)
      setIsLoading(false)
    }
    fetchProject()
  }, [projectId])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600">{project.description}</p>
          )}
        </div>
        <Link href={`/dashboard/projects/${projectId}/integrations`}>
          <Button>Manage Integrations</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          {project.integrations.length === 0 ? (
            <p className="text-gray-500">
              No integrations connected. 
              <Link href={`/dashboard/projects/${projectId}/integrations`} className="text-blue-600 ml-1">
                Connect now
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {project.integrations.map((integration) => (
                <IntegrationStatus key={integration.id} integration={integration} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funnel Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">
              Connect PostHog and sync to generate your first funnel map.
            </p>
            <Link href={`/dashboard/projects/${projectId}/funnel`}>
              <Button variant="outline">View Funnel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}