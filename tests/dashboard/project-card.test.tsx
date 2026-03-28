import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectCard from '@/components/dashboard/project-card'

describe('ProjectCard', () => {
  it('should render project name and description', () => {
    const project = {
      id: '1',
      name: 'Test Project',
      description: 'A test project',
      user_id: 'user1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      settings: {},
    }
    
    render(<ProjectCard project={project} />)
    
    expect(screen.getByText('Test Project')).toBeDefined()
    expect(screen.getByText('A test project')).toBeDefined()
  })

  it('should show integration status', () => {
    const project = {
      id: '1',
      name: 'Test Project',
      description: null,
      user_id: 'user1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      settings: {},
      integrations: [
        { id: 'i1', type: 'posthog', status: 'connected', project_id: '1', credentials: {}, created_at: '2024-01-01' }
      ],
    }
    
    render(<ProjectCard project={project} />)
    
    expect(screen.getByText('PostHog')).toBeDefined()
    expect(screen.getByText('connected')).toBeDefined()
  })
})