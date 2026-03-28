import { useState, useEffect } from 'react'
import type { ProjectWithIntegrations } from '@/types/project'

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithIntegrations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }
      
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

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
    
    setProjects(prev => [data.project, ...prev])
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
    
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    isLoading,
    error,
    createProject,
    deleteProject,
    refetch: fetchProjects,
  }
}