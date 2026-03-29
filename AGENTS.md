# AGENTS.md - Coding Agent Instructions

This file provides guidance for AI coding agents working in this repository.

## Project Overview

AutoFunnel Analytics is a Next.js 14 application (App Router) for marketing funnel visualization and analysis. It integrates with PostHog for analytics and Meta Ads for campaign data, using AI (OpenAI/Anthropic) for funnel detection.

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)

# Build
npm run build            # Next.js production build
npm run start            # Start production server

# Linting
npm run lint             # ESLint via Next.js (eslint-config-next)

# Testing (Vitest)
npm run test             # Vitest in watch mode
npm run test:run         # Vitest run once (CI mode)

# Single test file
npm run test:run -- tests/path/to/file.test.ts
npx vitest run tests/lib/supabase/client.test.ts

# Specific test pattern
npx vitest run -t "should fetch projects"
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── api/             # REST endpoints (route.ts files)
│   ├── auth/            # Auth pages (login, signup, callback)
│   └── dashboard/       # Dashboard pages
├── components/          # React components organized by domain
│   ├── ui/              # Base UI components (button, card, input)
│   ├── canvas/          # Funnel canvas components (nodes, edges)
│   └── integrations/    # Integration-related components
├── hooks/               # Custom React hooks (use-projects.ts, etc.)
├── lib/                 # Core library code
│   ├── ai/              # AI client and processing logic
│   ├── db/              # Database operations (Supabase)
│   ├── integrations/    # PostHog & Meta Ads integration
│   ├── store/           # Zustand stores
│   ├── supabase/        # Supabase client setup
│   ├── utils/           # Utility functions
│   └── validations/     # Zod validation schemas
├── types/               # TypeScript type definitions
└── middleware.ts        # Auth middleware

tests/                   # Test files mirroring src/ structure
```

## Code Style Guidelines

### Imports

- Use absolute imports with `@/` alias: `import { foo } from '@/lib/utils'`
- Import types separately: `import type { Foo } from '@/types/foo'`
- Group imports: external packages → internal modules → types
- Use named exports preferentially

```typescript
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types/project'
```

### TypeScript

- Strict mode enabled - no implicit any, strict null checks
- Use `interface` for object shapes, `type` for unions/inferred types
- Prefer explicit return types for public functions
- Avoid enums - use union types or const objects

```typescript
// Interface for data structures
export interface CanvasState {
  nodes: FunnelNode[]
  error: string | null
}

// Type for unions/inferred
export type NodeType = 'page' | 'event' | 'conversion'
export type CreateProjectInput = z.infer<typeof createProjectSchema>
```

### Naming Conventions

- **Files**: kebab-case (`use-projects.ts`, `funnel-store.ts`, `project-card.tsx`)
- **Components**: PascalCase (`Button`, `ProjectCard`, `FunnelCanvas`)
- **Functions**: camelCase (`createProject`, `getProjects`, `layoutNodes`)
- **Hooks**: `use` prefix (`useProjects`, `useAuth`, `useFunnelStore`)
- **Constants**: UPPER_SNAKE_CASE for config, camelCase for values
- **Types**: PascalCase with descriptive names (`CanvasState`, `FunnelNodeData`)
- **API routes**: RESTful naming (`route.ts` in appropriate directory)

### React Components

- Use `React.forwardRef` for UI components with refs
- Set `displayName` for forwarded components
- Extract variants/props types with `VariantProps<typeof variants>`
- Use `cn()` utility for conditional class merging

```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
```

### API Routes (Next.js App Router)

- Export async functions: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextRequest` and `NextResponse` from `next/server`
- Validate input with Zod before processing
- Return structured error responses with status codes
- Always authenticate via Supabase first

```typescript
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // ... business logic
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
```

### Error Handling

- Use try/catch in async operations
- Throw errors directly in lib functions (let API routes handle response)
- Return error objects in hooks with `setError`
- Validate with Zod - catch `ZodError` specifically

```typescript
// In lib/db
const { data, error } = await supabase.from('projects').select()
if (error) throw error
return data

// In API route
try {
  const validated = schema.parse(body)
} catch (error) {
  if (error instanceof Error && error.name === 'ZodError') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
```

### State Management (Zustand)

- Use `create` from zustand
- Define state interface and actions interface separately
- Spread initial state, then define actions
- Use `set` callback for updates

```typescript
export const useFunnelStore = create<CanvasState & CanvasActions>((set) => ({
  ...initialState,
  setNodes: (nodes) => set({ nodes }),
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
  })),
}))
```

### Validation (Zod)

- Define schemas in `src/lib/validations/`
- Export both schema and inferred type
- Use `.optional()` and sensible defaults

```typescript
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
})
export type CreateProjectInput = z.infer<typeof createProjectSchema>
```

### Testing (Vitest)

- Test files mirror src structure: `tests/lib/supabase/client.test.ts`
- Use `describe`/`it` blocks, `expect` for assertions
- Mock external dependencies with `vi.mock`
- Clear mocks in `beforeEach`
- Use `@testing-library/react` for component tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Component', () => {
  beforeEach(() => vi.clearAllMocks())
  
  it('should render', () => {
    render(<Component />)
    expect(screen.getByText('text')).toBeDefined()
  })
})
```

### Environment Variables

- Public vars: `NEXT_PUBLIC_*` prefix (accessible in browser)
- Server vars: No prefix (only in API routes/server components)
- Required vars use `!` assertion: `process.env.SUPABASE_URL!`
- See `.env.example` for required variables

## Key Dependencies

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **State**: Zustand
- **Styling**: Tailwind CSS + class-variance-authority
- **Validation**: Zod
- **Testing**: Vitest + @testing-library/react
- **Canvas**: @xyflow/react (React Flow) + elkjs (layout)
- **AI**: OpenAI SDK, Anthropic SDK

## Notes

- Node.js >=18 required
- Tests excluded from tsconfig (separate compilation)
- Uses `eslint-config-next` - no custom ESLint config
- Tailwind colors defined in tailwind.config.ts
- Path alias `@/*` maps to `./src/*`