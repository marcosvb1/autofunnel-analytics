'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/dashboard/project-card'
import CreateProjectModal from '@/components/dashboard/create-project-modal'
import PageHeader from '@/components/dashboard/page-header'
import EmptyState from '@/components/dashboard/empty-state'
import { useProjects } from '@/hooks/use-projects'

export default function DashboardPage() {
  const { projects, isLoading, error, createProject, deleteProject } = useProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreate = async (name: string, description?: string) => {
    await createProject(name, description)
  }

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-text-tertiary">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Your Projects"
        subtitle="Manage and monitor your funnel analytics"
        action={{
          label: 'New Project',
          onClick: () => setIsModalOpen(true),
        }}
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Create your first project"
          description="Start building your funnel analytics by creating a new project. Connect your data sources and let AI detect your conversion paths."
          action={{
            label: 'Create Project',
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}