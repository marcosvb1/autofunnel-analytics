'use client'

import type { ProjectWithIntegrations } from '@/types/project'
import { useCachedFetch } from './use-cache'

export function useProjects() {
  const {
    data: projects,
    isLoading,
    error,
    refetch,
    invalidate,
  } = useCachedFetch<ProjectWithIntegrations[]>(
    'projects:list',
    async () => {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }
      
      return data.projects
    },
    { ttl: 5 * 60 * 1000 }
  )

  const createProject = async (name: string, description?: string) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error)
    }
    
    invalidate()
    return data.project
  }

  const deleteProject = async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error)
    }
    
    invalidate()
  }

  return {
    projects: projects || [],
    isLoading,
    error,
    createProject,
    deleteProject,
    refetch,
  }
}