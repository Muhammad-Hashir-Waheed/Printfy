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

function mirrorPath(source, target) {
   if (!fs.existsSync(source)) {
      return
   }

   fs.mkdirSync(path.dirname(target), { recursive: true })
   fs.rmSync(target, { recursive: true, force: true })
   fs.cpSync(source, target, { recursive: true })
}

const storefrontNodeModules = path.join(storefrontDir, 'node_modules')
const rootNodeModules = path.join(repoRoot, 'node_modules')

fs.mkdirSync(rootNodeModules, { recursive: true })
mirrorPath(
   path.join(storefrontNodeModules, '.prisma'),
   path.join(rootNodeModules, '.prisma')
)
mirrorPath(
   path.join(storefrontNodeModules, '@prisma', 'client'),
   path.join(rootNodeModules, '@prisma', 'client')
)

if (!fs.existsSync(sourceDir)) {
   process.exit(0)
}

fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })
