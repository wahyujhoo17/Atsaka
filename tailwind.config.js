/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        red: {
          500: '#EF4423', // Primary ATSAKA red
        },
        blue: {
          500: '#1F91CD', // Secondary ATSAKA blue
        },
        gray: {
          200: '#EAECEF',
          300: '#D9D9D9', // ATSAKA neutral gray
          900: '#18181B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};