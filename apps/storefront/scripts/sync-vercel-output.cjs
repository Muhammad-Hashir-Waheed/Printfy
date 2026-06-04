const fs = require('fs')
const path = require('path')

if (process.env.VERCEL !== '1') {
   process.exit(0)
}

const storefrontDir = path.join(__dirname, '..')
const repoRoot = path.join(storefrontDir, '..', '..')
const sourceDir = path.join(storefrontDir, '.next')
const targetDir = path.join(repoRoot, '.next')

const hasStorefrontVercelConfig = fs.existsSync(
   path.join(storefrontDir, 'vercel.json')
)

if (!fs.existsSync(path.join(repoRoot, 'vercel.json'))) {
   process.exit(0)
}

const storefrontNodeModules = path.join(storefrontDir, 'node_modules')
const rootNodeModules = path.join(repoRoot, 'node_modules')

/**
 * Monorepo root deploy: Next uses outputFileTracingRoot = repo root, so the
 * server trace expects deps under /vercel/path0/node_modules. They are
 * installed under apps/storefront/node_modules — merge them up after build.
 */
function mergeStorefrontNodeModulesIntoRoot() {
   if (!fs.existsSync(storefrontNodeModules)) {
      return
   }

   fs.mkdirSync(rootNodeModules, { recursive: true })

   for (const name of fs.readdirSync(storefrontNodeModules)) {
      if (name === '.cache') {
         continue
      }

      const from = path.join(storefrontNodeModules, name)
      const to = path.join(rootNodeModules, name)

      try {
         fs.cpSync(from, to, { recursive: true })
      } catch (err) {
         console.error(`sync-vercel-output: failed to copy ${name}:`, err.message)
         process.exit(1)
      }
   }
}

mergeStorefrontNodeModulesIntoRoot()

if (hasStorefrontVercelConfig) {
   process.exit(0)
}

if (!fs.existsSync(sourceDir)) {
   process.exit(0)
}

fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })
