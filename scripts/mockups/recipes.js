// Product key → studio scene, gathered from the department recipe files.
import goods from './recipes/goods.js'
import packaging from './recipes/packaging.js'
import print from './recipes/print.js'
import signage from './recipes/signage.js'

export const RECIPES = { ...packaging, ...print, ...goods, ...signage }
