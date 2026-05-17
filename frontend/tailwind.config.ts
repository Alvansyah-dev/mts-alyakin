import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#16a34a', // green-600
          DEFAULT: '#16a34a',
          dark: '#4ade80', // green-400 in dark mode
        },
        accent: '#16a34a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;
