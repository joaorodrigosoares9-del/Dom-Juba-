import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border, 215 28% 17%))',
        input: 'hsl(var(--input, 215 28% 17%))',
        ring: 'hsl(var(--ring, 350 80% 50%))',
        background: 'hsl(var(--background, 222 47% 4%))',
        foreground: 'hsl(var(--foreground, 210 40% 98%))',
        primary: {
          DEFAULT: '#E31837',
          foreground: '#FFFFFF',
          dark: '#B9102A',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          foreground: '#FFFFFF',
          dark: '#0284C7',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
        },
        accent: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC',
        },
        card: {
          DEFAULT: '#0E1322',
          foreground: '#F8FAFC',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Raleway', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
