// Cross-platform stand-in for the POSIX-only `VITE_ADMIN_TOOLS=true <cmd>`
// prefix, which is a parse error in PowerShell/cmd. Sets the build-time admin
// flag (see vite.config.ts `define`) and runs the command it is given.
//
// Deliberately zero-dependency (no cross-env): MeetingOS keeps its dependency
// list locked, and this is the smallest change that makes `dev:admin` and
// `build:admin` work on Windows without altering their Linux behaviour.
import { spawn } from 'node:child_process'

const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error('usage: node scripts/with-admin.mjs <command> [args...]')
  process.exit(1)
}

// shell:true so npm-installed binaries resolve via their .cmd shims on Windows.
// The command is passed as one pre-joined string rather than (command, args):
// Node deprecates the array form under a shell (DEP0190) because it concatenates
// without escaping. Quoting anything with whitespace here does that escaping.
const quote = (arg) => (/\s/.test(arg) ? JSON.stringify(arg) : arg)

const child = spawn([command, ...args].map(quote).join(' '), {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VITE_ADMIN_TOOLS: 'true' },
})

child.on('error', (error) => {
  console.error(`failed to start "${command}": ${error.message}`)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  // Preserve Ctrl-C / kill semantics for the dev server.
  process.exit(signal ? 1 : (code ?? 1))
})
