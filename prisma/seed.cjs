const Module = require('module')
const path = require('path')

const srcRoot = path.join(__dirname, '../src')
const originalResolve = Module._resolveFilename

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
   if (request.startsWith('@/')) {
      request = path.join(srcRoot, request.slice(2))
   }
   return originalResolve.call(this, request, parent, isMain, options)
}

for (const ext of ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']) {
   Module._extensions[ext] = function loadAsset(module, filename) {
      module.exports = filename
   }
}

require('ts-node').register({
   transpileOnly: true,
   compilerOptions: {
      module: 'CommonJS',
      esModuleInterop: true,
      moduleResolution: 'node',
   },
})

require('./seed.ts')
