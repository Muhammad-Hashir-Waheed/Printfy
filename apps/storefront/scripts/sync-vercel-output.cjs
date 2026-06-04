const fs = require('fs')
const path = require('path')

if (process.env.VERCEL !== '1') {
   process.exit(0)
}

const storefrontDir = path.join(__dirname, '..')
const repoRoot = path.join(storefrontDir, '..', '..')
const sourceDir = path.join(storefrontDir, '.next')
const targetDir = path.join(repoRoot, '.next')

/** Vercel project Root Directory = apps/storefront */
const buildingFromStorefrontRoot =
   path.resolve(process.cwd()) === path.resolve(storefrontDir)

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
         fs.cpSync(from, to, { recursive: true })
      } catch (err) {
         console.error(`sync-vercel-output: failed to copy ${name}:`, err.message)
         process.exit(1)
      }
   }
}

mergeStorefrontNodeModulesIntoRoot()

if (buildingFromStorefrontRoot) {
   console.log('sync-vercel-output: keeping .next in apps/storefront')
   process.exit(0)
}

if (!fs.existsSync(sourceDir)) {
   console.error('sync-vercel-output: missing apps/storefront/.next after build')
   process.exit(1)
}

fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })
console.log('sync-vercel-output: copied apps/storefront/.next to repo root')
