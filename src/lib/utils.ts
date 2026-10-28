import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Asks Unsplash for a WebP/AVIF copy at the width it's shown at, instead of the
// 800px original everywhere. Other image hosts are returned as they are.
export function imageAt(url: string, width: number) {
  if (!url.startsWith("https://images.unsplash.com/")) return url

  const sized = new URL(url)
  sized.searchParams.set("w", String(width))
  sized.searchParams.set("q", "75")
  sized.searchParams.set("auto", "format")
  sized.searchParams.set("fit", "crop")
  return sized.toString()
}
