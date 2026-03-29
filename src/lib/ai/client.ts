import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type { LLMConfig, LLMMessage, LLMResponse, ChatCompletionOptions } from '@/types/ai'

const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
}

let openaiInstance: OpenAI | null = null
let anthropicInstance: Anthropic | null = null

async function getOpenAI(apiKey: string, browserOption?: { dangerouslyAllowBrowser: boolean }): Promise<OpenAI> {
  if (!openaiInstance) {
    const OpenAIModule = await import('openai')
    openaiInstance = new OpenAIModule.default({ apiKey, ...browserOption })
  }
  return openaiInstance
}

async function getAnthropic(apiKey: string, browserOption?: { dangerouslyAllowBrowser: boolean }): Promise<Anthropic> {
  if (!anthropicInstance) {
    const AnthropicModule = await import('@anthropic-ai/sdk')
    anthropicInstance = new AnthropicModule.default({ apiKey, ...browserOption })
  }
  return anthropicInstance
}

export class LLMClient {
  private provider: 'openai' | 'anthropic'
  private apiKey: string
  private model: string

  constructor(config: LLMConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }

    this.provider = config.provider
    this.model = config.model || DEFAULT_MODELS[config.provider]
    this.apiKey = config.apiKey
  }

  async complete(options: ChatCompletionOptions): Promise<LLMResponse> {
    if (this.provider === 'openai') {
      return this.openaiComplete(options)
    }
    return this.anthropicComplete(options)
  }

  private async openaiComplete(options: ChatCompletionOptions): Promise<LLMResponse> {
    const browserOption = this.constructor.name ? { dangerouslyAllowBrowser: true } : undefined
    const openai = await getOpenAI(this.apiKey, browserOption)
    
    const response = await openai.chat.completions.create({
      model: this.model,
      messages: options.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      response_format: options.responseFormat === 'json' 
        ? { type: 'json_object' } 
        : { type: 'text' },
    })

    return {
      content: response.choices[0].message.content || '',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      model: response.model,
    }
  }

  private async anthropicComplete(options: ChatCompletionOptions): Promise<LLMResponse> {
    const browserOption = this.constructor.name ? { dangerouslyAllowBrowser: true } : undefined
    const anthropic = await getAnthropic(this.apiKey, browserOption)
    
    const systemMessage = options.messages.find(m => m.role === 'system')
    const otherMessages = options.messages.filter(m => m.role !== 'system')

    const response = await anthropic.messages.create({
      model: this.model,
      system: systemMessage?.content,
      messages: otherMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    })

    const textBlock = response.content.find((b: any) => b.type === 'text') as any
    
    return {
      content: (textBlock as any)?.text || '',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      model: response.model,
    }
  }

  async completeJSON<T>(options: ChatCompletionOptions): Promise<T> {
    const response = await this.complete({
      ...options,
      responseFormat: 'json',
    })

    try {
      return JSON.parse(response.content)
    } catch {
      throw new Error('Failed to parse JSON response')
    }
  }
}

export function createLLMClient(provider?: 'openai' | 'anthropic'): LLMClient {
  const defaultProvider = (process.env.DEFAULT_LLM_PROVIDER as 'openai' | 'anthropic') || 'openai'
  const selectedProvider: 'openai' | 'anthropic' = provider || defaultProvider
  
  const apiKey = selectedProvider === 'openai' 
    ? process.env.OPENAI_API_KEY 
    : process.env.ANTHROPIC_API_KEY

  return new LLMClient({
    provider: selectedProvider,
    apiKey: apiKey!,
  })
}
