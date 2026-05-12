const fs = require('fs')
const path = require('path')

if (process.env.VERCEL !== '1') {
   process.exit(0)
}

const storefrontDir = path.join(__dirname, '..')
const repoRoot = path.join(storefrontDir, '..', '..')
const sourceDir = path.join(storefrontDir, '.next')
const targetDir = path.join(repoRoot, '.next')

if (!fs.existsSync(sourceDir)) {
   process.exit(0)
}

if (!fs.existsSync(path.join(repoRoot, 'vercel.json'))) {
   process.exit(0)
}

fs.rmSync(targetDir, { recursive: true, force: true })
fs.cpSync(sourceDir, targetDir, { recursive: true })
