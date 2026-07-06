import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MeetingOS is a frontend-only, mock-data build. It is served on Railway by
// `vite preview` bound to $PORT. `allowedHosts: true` lets the *.railway.app
// domain through the preview host check. No backend, proxy, or env vars.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true,
  },
})
