const fs = require('fs')
const path = require('path')

if (process.env.VERCEL !== '1') {
   process.exit(0)
}

const storefrontDir = path.join(__dirname, '..')
const repoRoot = path.join(storefrontDir, '..', '..')
const sourceDir = path.join(storefrontDir, '.next')
const targetDir = path.join(repoRoot, '.next')

if (!fs.existsSync(path.join(repoRoot, 'vercel.json'))) {
   process.exit(0)
}

const storefrontNodeModules = path.join(storefrontDir, 'node_modules')
const rootNodeModules = path.join(repoRoot, 'node_modules')

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
         fs.cpSync(from, to, { recursive: true, force: true })
      } catch (err) {
         console.warn(`sync-vercel-output: skip ${name}:`, err.message)
      }
   }
}

mergeStorefrontNodeModulesIntoRoot()

if (!fs.existsSync(path.join(sourceDir, 'routes-manifest.json'))) {
   console.error(
      'sync-vercel-output: missing routes-manifest.json in apps/storefront/.next'
   )
   process.exit(1)
}

fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })

console.log(
   'sync-vercel-output: copied apps/storefront/.next -> repo root .next (for Vercel path0)'
)
