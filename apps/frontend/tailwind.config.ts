import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      maxWidth: {
        content: 'clamp(960px, 62.5vw, 1600px)',
        'content-narrow': 'clamp(960px, 50vw, 1100px)',
      },
    },
  },
  plugins: [],
}
export default config
