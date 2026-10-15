import config from '@/config/site'

const exact = new Intl.NumberFormat(config.locale, {
   style: 'currency',
   currency: config.currency,
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
})

const fine = new Intl.NumberFormat(config.locale, {
   style: 'currency',
   currency: config.currency,
   minimumFractionDigits: 2,
   maximumFractionDigits: 3,
})

const whole = new Intl.NumberFormat(config.locale, {
   style: 'currency',
   currency: config.currency,
   maximumFractionDigits: 0,
})

/** $12.50 */
export function money(value: number) {
   return exact.format(value)
}

/** Unit prices under 10¢ can be fractions of a cent: $0.045 */
export function unitMoney(value: number) {
   return value < 0.1 ? fine.format(value) : exact.format(value)
}

/** $1,200 — for "from" prices on quote-only products */
export function roundMoney(value: number) {
   return whole.format(value)
}

/** "1 box", "250 boxes", "5 m²" */
export function units(qty: number, unit: string) {
   const n = qty.toLocaleString('en-US')
   if (qty === 1 || unit.endsWith('²')) return `${n} ${unit}`
   if (/(x|s|ch|sh)$/.test(unit)) return `${n} ${unit}es`
   return `${n} ${unit}s`
}
