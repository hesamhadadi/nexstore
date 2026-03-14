import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'IRR', locale = 'fa-IR') {
  if (currency === 'IRR') {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price)
}

export function generateToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent) / 100
}

export function isDiscountActive(startDate?: Date, endDate?: Date): boolean {
  const now = new Date()
  if (startDate && now < startDate) return false
  if (endDate && now > endDate) return false
  return true
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}
