import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ─── TAMBAHKAN BLOK SERVER DI BAWAH INI ───
  server: {
    port: 5173,          // Mengunci aplikasi lu murni di port 5173
    strictPort: true,    // Memaksa error/berhenti kalau port penuh, biar gak lari ke port 5174
  },
})