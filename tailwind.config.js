/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        shop: ['Syne', 'sans-serif'], // Font Brand unik
        sans: ['Lexend', 'sans-serif'], // Font UI bersih
      },
    },
  },
  plugins: [],
}