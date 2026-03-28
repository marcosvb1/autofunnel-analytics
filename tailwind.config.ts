import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-foreground': '#ffffff',
        secondary: '#64748b',
        'secondary-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        muted: '#94a3b8',
        'muted-foreground': '#1e293b',
        accent: '#f1f5f9',
        'accent-foreground': '#1e293b',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#3b82f6',
        background: '#ffffff',
        foreground: '#1e293b',
        card: '#ffffff',
        'card-foreground': '#1e293b',
      },
    },
  },
  plugins: [],
}
export default config