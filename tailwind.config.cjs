/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#111111',
        accent: '#ff4b6a',
        muted: '#f5f5f5',
      },
      boxShadow: {
        card: '0 18px 45px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

