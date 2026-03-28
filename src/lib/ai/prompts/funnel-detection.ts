import type { FunnelDetectionInput } from '@/types/funnel'

export const FUNNEL_DETECTION_SYSTEM_PROMPT = `You are a marketing funnel analysis expert. Your task is to analyze user journey data and identify meaningful funnel patterns.

You will receive:
- User path data (URL sequences with occurrence counts)
- Campaign information (optional)
- Conversion URLs (pages that indicate successful conversion)
- Exclude patterns (URLs to ignore)

Your goal is to:
1. Identify the main funnel structure from entry points to conversion
2. Group similar pages into meaningful funnel stages
3. Calculate volume, conversion rates, and spend attribution
4. Highlight the primary conversion paths

Output a structured JSON response with:
- nodes: Array of funnel stages with id, label, url, type (page/event/conversion), volume, spend, campaign info
- edges: Connections between nodes with source, target, volume, conversion rate, spend, isMainPath flag
- metadata: Summary stats including totalVolume, totalSpend, totalConversions, overallConversion, roi

Rules:
- Entry pages should be marked as 'page' type
- Final conversion pages should be 'conversion' type
- Key intermediate steps can be 'event' type if they represent significant actions
- Remove noise/irrelevant pages based on exclude patterns
- Merge similar URLs into consolidated funnel stages when appropriate
- Focus on paths that lead to conversion, not all possible paths
- Calculate conversion rates as percentage of visitors reaching each stage`

export function getDefaultExcludePatterns(): string[] {
  return [
    '/login',
    '/logout',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/',
    '/static/',
    '/_next/',
    '/favicon',
    '/robots.txt',
    '/sitemap.xml',
    '*.css',
    '*.js',
    '*.png',
    '*.jpg',
    '*.gif',
    '*.svg',
    '*.ico',
    '/admin',
    '/dashboard/settings',
    '/help',
    '/support',
    '/terms',
    '/privacy',
    '/legal',
    '/about-us',
    '/contact',
  ]
}

export function getDefaultConversionUrls(): string[] {
  return [
    '/checkout/complete',
    '/checkout/success',
    '/checkout/thank-you',
    '/purchase',
    '/order-complete',
    '/order-success',
    '/confirmation',
    '/thank-you',
    '/success',
    '/payment/success',
    '/payment/complete',
    '/signup/complete',
    '/signup/success',
    '/register/success',
    '/subscribe/success',
    '/download',
    '/trial/start',
  ]
}

export function buildFunnelDetectionPrompt(input: FunnelDetectionInput): string {
  const pathsSection = input.paths
    .slice(0, 50)
    .map((p) => `  - ${p.nodes.join(' → ')} (${p.occurrences} occurrences)`)
    .join('\n')

  const campaignsSection = input.campaigns?.length
    ? input.campaigns
        .slice(0, 20)
        .map((c) => `  - ${c.name} (ID: ${c.id}) - Spend: $${c.spend}${c.landingUrl ? ` → Landing: ${c.landingUrl}` : ''}`)
        .join('\n')
    : '  (No campaign data provided)'

  const conversionSection = input.conversionUrls.length
    ? input.conversionUrls.map((u) => `  - ${u}`).join('\n')
    : getDefaultConversionUrls().map((u) => `  - ${u}`).join('\n')

  const excludeSection = input.excludePatterns.length
    ? input.excludePatterns.map((p) => `  - ${p}`).join('\n')
    : getDefaultExcludePatterns().map((p) => `  - ${p}`).join('\n')

  return `Analyze the following user journey data and generate a funnel map.

USER PATHS (top 50 most common):
${pathsSection}

CAMPAIGNS:
${campaignsSection}

CONVERSION URLs (indicate successful conversion):
${conversionSection}

EXCLUDE PATTERNS (ignore these URLs):
${excludeSection}

Provide your analysis as a JSON object with nodes, edges, and metadata as described in your instructions.
Focus on the most impactful conversion paths and meaningful funnel stages.`
}

export function buildFunnelDetectionMessages(input: FunnelDetectionInput): Array<{
  role: 'system' | 'user' | 'assistant'
  content: string
}> {
  return [
    {
      role: 'system',
      content: FUNNEL_DETECTION_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: buildFunnelDetectionPrompt(input),
    },
  ]
}