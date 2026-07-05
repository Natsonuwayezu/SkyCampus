// ============================================================
// SkyCampus — Formatters
// ============================================================

// Currency (RWF)
export function formatRWF(amount: number): string {
  return new Intl.NumberFormat('fr-RW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' RWF'
}

// Date: "16 June 2026"
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date))
}

// Date short: "16/06/2026"
export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB').format(new Date(date))
}

// Percentage
export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals) + '%'
}

// Ordinal rank: 1 → "1st", 2 → "2nd"
export function formatRank(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// cn helper (clsx + tailwind-merge)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Admission number
export function formatAdmissionNumber(schoolSlug: string, year: number, seq: number): string {
  return `SC-${year}-${String(seq).padStart(3, '0')}`
}

// Receipt number
export function formatReceiptNumber(year: number, seq: number): string {
  return `RCP-${year}-${String(seq).padStart(4, '0')}`
}

// Status badge color
export function feeStatusColor(status: string): string {
  switch (status) {
    case 'paid':    return 'bg-green-100 text-green-800'
    case 'partial': return 'bg-amber-100 text-amber-800'
    case 'pending': return 'bg-red-100 text-red-800'
    case 'waived':  return 'bg-gray-100 text-gray-600'
    default:        return 'bg-gray-100 text-gray-600'
  }
}
