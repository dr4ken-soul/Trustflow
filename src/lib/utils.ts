/**
 * trustflow lib utilities
 * small helpers shared across the frontend
 */

/**
 * format a number as a currency string
 * @param amount
 * @param currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * format an iso date string into a readable short format
 * @param iso
 */
export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * format an iso date string into a time string
 * @param iso
 */
export function formatTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * truncate a string to a max length adding an ellipsis
 * @param str
 * @param max
 */
export function truncate(str: string, max = 40): string {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '...' : str
}

/**
 * delay helper for simulating async work in mock mode
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
