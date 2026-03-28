export type LLMProvider = 'openai' | 'anthropic'

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  model?: string
  dangerouslyAllowBrowser?: boolean
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

export interface ChatCompletionOptions {
  messages: LLMMessage[]
  temperature?: number
  maxTokens?: number
  responseFormat?: 'text' | 'json'
}

export interface FunnelDetectionInput {
  paths: Array<{
    nodes: string[]
    occurrences: number
  }>
  conversionUrls: string[]
  excludePatterns: string[]
}

export interface FunnelDetectionOutput {
  nodes: Array<{
    id: string
    label: string
    url: string
    type: 'page' | 'event'
    volume: number
  }>
  edges: Array<{
    source: string
    target: string
    conversion: number
    volume: number
  }>
  mainFunnel: string[]
  insights: string[]
}