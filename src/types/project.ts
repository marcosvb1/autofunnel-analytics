import { Tables } from './database'

export type Project = Tables<'projects'>

export interface ProjectWithIntegrations extends Project {
  integrations: Tables<'integrations'>[]
  funnel_maps: Tables<'funnel_maps'>[]
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  settings?: Record<string, unknown>
}