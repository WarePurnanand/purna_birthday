/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'peach': {
          100: '#fef3e2',
          200: '#fce4bc',
          300: '#fad394',
          400: '#f7c26b',
          500: '#f4b942',
          600: '#e6a635',
          700: '#d49129',
          800: '#c27c1c',
          900: '#b06710'
        },
        'lavender': {
          100: '#f3f1ff',
          200: '#e8e5ff',
          300: '#d6d0ff',
          400: '#c4bbff',
          500: '#b2a6ff',
          600: '#9f91ff',
          700: '#8c7cff',
          800: '#7967ff',
          900: '#6652ff'
        },
        'cream': {
          100: '#fffef7',
          200: '#fffdeb',
          300: '#fffbdb',
          400: '#fff8c7',
          500: '#fff5b3',
          600: '#fff29f',
          700: '#ffef8b',
          800: '#ffec77',
          900: '#ffe963'
        }
      },
      fontFamily: {
        'dancing': ['Dancing Script', 'cursive'],
        'poppins': ['Poppins', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        }
      }
    },
  },
  plugins: [],
};