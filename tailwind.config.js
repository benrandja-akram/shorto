/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      londrina: 'var(--londrina)',
      inter: 'var(--inter)',
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
