/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Daftarkan Sora sebagai font sans utama
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        // Daftarkan palet warna resmi Figma lo
        coffee: {
          brand: '#C67C4E',    // Cokelat Utama (Warna 01)
          cream: '#EDD6C8',    // Cream Medium (Warna 02)
          dark: '#2F2D2C',     // Charcoal Gelap Utama (Warna 03)
          gray: '#E6E6E6',     // Border & Placeholder (Warna 04)
          bgSoft: '#F9F2ED',   // Background Soft Kafe (Warna 05)
          muted: '#9B9B9B',    // Teks sekunder abu-abu
        }
      }
    },
  },
  plugins: [],
}