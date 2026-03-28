'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/dashboard/project-card'
import CreateProjectModal from '@/components/dashboard/create-project-modal'
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
    return <div className="text-center py-8">Loading projects...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects yet. Create your first project to get started.</p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4">
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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