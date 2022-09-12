/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { londrina: 'Londrina Outline', inter: 'Inter' },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
