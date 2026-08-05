import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MeetingOS is a frontend-only, mock-data build. Production is the static
// `dist/` output served by the `serve` package (see the "start" script), so
// there is no Vite `preview` server and no host-check config to relax. This
// config only governs `vite dev` (local) and `vite build`. No backend, proxy,
// or runtime env vars.
//
// The one build-time switch: __ADMIN_TOOLS__. The public build leaves it false,
// which dead-code-eliminates the admin-only Signal & Noise module out of the
// bundle entirely — users never receive that code. `npm run build:admin` sets
// VITE_ADMIN_TOOLS=true to produce the admin build for a protected deployment.
export default defineConfig({
  plugins: [react()],
  define: {
    __ADMIN_TOOLS__: JSON.stringify(process.env.VITE_ADMIN_TOOLS === 'true'),
  },
  server: {
    host: true,
    port: 5173,
  },
})
