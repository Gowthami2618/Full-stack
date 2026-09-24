/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0b0f19',
          900: '#111827',
          800: '#1e293b',
          750: '#243247',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        rose: {
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.4)',
        'glass-sm': '0 4px 16px 0 rgba(15, 23, 42, 0.25)',
        'glass-glow': '0 0 25px rgba(56, 189, 248, 0.22)',
        'glass-subtle': '0 2px 8px 0 rgba(56, 189, 248, 0.12)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
