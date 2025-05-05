import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine class names with Tailwind's merge functionality
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a string with the specified format
 */
export function formatDate(date: Date, format: string = "MMMM dd, yyyy"): string {
  const options: Intl.DateTimeFormatOptions = {}
  
  if (format.includes("MMMM")) options.month = "long"
  else if (format.includes("MMM")) options.month = "short"
  else if (format.includes("MM")) options.month = "2-digit"
  
  if (format.includes("dd")) options.day = "2-digit"
  if (format.includes("yyyy")) options.year = "numeric"
  if (format.includes("HH")) options.hour = "2-digit"
  if (format.includes("mm")) options.minute = "2-digit"
  
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

/**
 * Get the timezone offset in hours for the current location
 */
export function timezoneOffset(): number {
  return -(new Date().getTimezoneOffset() / 60)
}

/**
 * Format a duration in minutes to hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array/object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
