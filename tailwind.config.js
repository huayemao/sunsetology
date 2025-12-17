/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "app/**/*.{js,ts,jsx,tsx,mdx}",
    "components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Noto Sans JP', 'Noto Naskh Arabic', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        sunset: {
          900: '#0f0c29',
          800: '#302b63',
          700: '#24243e',
          500: '#8E2DE2',
          400: '#4A00E0',
          100: '#E0C3FC',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}