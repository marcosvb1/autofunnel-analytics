import { z } from 'zod'

export const posthogIntegrationSchema = z.object({
  api_key: z.string().min(1, 'API key is required'),
  project_id: z.string().min(1, 'Project ID is required'),
  host: z.string().url().optional(),
})

export const metaAdsIntegrationSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  ad_account_id: z.string().min(1, 'Ad account ID is required'),
})

export type PostHogIntegrationInput = z.infer<typeof posthogIntegrationSchema>
export type MetaAdsIntegrationInput = z.infer<typeof metaAdsIntegrationSchema>