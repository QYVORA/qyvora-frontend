/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#1fbf8f',
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eeeca',
          400: '#2dddb0',
          500: '#1fbf8f',
          600: '#14926c',
          700: '#137558',
          800: '#145c47',
          900: '#134c3b',
        },
        dark: {
          900: '#060608',
          800: '#0a0a0f',
          700: '#111118',
          600: '#16161f',
          500: '#1c1c28',
          400: '#242436',
          300: '#2e2e44',
          200: '#3d3d58',
          100: '#5a5a7a',
        },
        phase: {
          indigo: '#3A3F8F',
          blue: '#0EA5E9',
          green: '#22C55E',
          gold: '#B8860B',
          purple: '#6D28D9',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        glow: { '0%': { boxShadow: '0 0 5px #1fbf8f33' }, '100%': { boxShadow: '0 0 20px #1fbf8f66, 0 0 40px #1fbf8f22' } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%231fbf8f08' stroke-width='1'/%3E%3C/svg%3E\")",
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%231fbf8f15'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
