/// <reference types="vite/client" />

/**
 * Build-time flag injected by Vite `define` (see vite.config.ts).
 * true only in the admin build (`npm run build:admin`); false in the public
 * build, where every reference behind `if (__ADMIN_TOOLS__)` is compiled out.
 */
declare const __ADMIN_TOOLS__: boolean
