/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream base (page backgrounds)
        cream: {
          50: '#FFFBF7',   // Page background
          100: '#FFF7ED',  // Card backgrounds
          200: '#FEE8D6',  // Borders, dividers
          300: '#FDDCBE',  // Hover states
        },
        // Rich warm brown (text colors)
        espresso: {
          600: '#78563D',  // Secondary text
          700: '#5C4030',  // Primary text
          800: '#3D2A1E',  // Headings
          900: '#2A1D14',  // Bold emphasis
        },
        // Fresh coral accent (primary actions)
        coral: {
          400: '#FF8B7B',  // Hover
          500: '#FF6B5B',  // Primary buttons
          600: '#E5554A',  // Active/pressed
        },
        // Sage green (secondary/success)
        sage: {
          100: '#E8F5E8',  // Light background
          400: '#7CB47C',  // Hover
          500: '#5A9A5A',  // Secondary buttons
          600: '#4A8A4A',  // Active
          700: '#3D7A3D',  // Dark
        },
        // Warm gold (highlights/badges)
        honey: {
          100: '#FFF8E7',
          400: '#F5C842',
          500: '#E5B732',
        },
        // Keep cookbook for backwards compatibility during transition
        cookbook: {
          50: '#FFFBF7',
          100: '#FFF7ED',
          200: '#FEE8D6',
          300: '#FDDCBE',
          400: '#9C8B7A',
          500: '#78563D',
          600: '#5C4030',
          700: '#3D2A1E',
          800: '#2A1D14',
          900: '#1A110C',
        },
        // Keep accent for backwards compatibility
        accent: {
          100: '#FFE4E0',
          400: '#FF8B7B',
          500: '#FF6B5B',
          600: '#E5554A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(61, 42, 30, 0.08)',
        'soft': '0 4px 16px -4px rgba(61, 42, 30, 0.12)',
        'soft-lg': '0 8px 32px -8px rgba(61, 42, 30, 0.16)',
        'soft-xl': '0 16px 48px -12px rgba(61, 42, 30, 0.20)',
        'glow-coral': '0 4px 20px -4px rgba(255, 107, 91, 0.35)',
        'glow-sage': '0 4px 20px -4px rgba(90, 154, 90, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'soft-pulse': 'softPulse 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
