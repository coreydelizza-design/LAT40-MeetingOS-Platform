import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MeetingOS is a frontend-only, mock-data build. Production is the static
// `dist/` output served by the `serve` package (see the "start" script), so
// there is no Vite `preview` server and no host-check config to relax. This
// config only governs `vite dev` (local) and `vite build`. No backend, proxy,
// or env vars.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
