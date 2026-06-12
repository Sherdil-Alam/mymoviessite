import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News',
  10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics',
}

export const LANGUAGE_NAMES: Record<string, string> = {
  hi: 'Hindi', en: 'English', ta: 'Tamil', te: 'Telugu',
  ml: 'Malayalam', kn: 'Kannada', pa: 'Punjabi', bn: 'Bengali',
  ur: 'Urdu', mr: 'Marathi', ko: 'Korean', ja: 'Japanese',
  zh: 'Chinese', fr: 'French', es: 'Spanish', de: 'German',
}

export const CATEGORIES = [
  { label: 'Bollywood', href: '/category/bollywood', lang: 'hi' },
  { label: 'Hollywood', href: '/category/hollywood', lang: 'en' },
  { label: 'South Indian', href: '/category/south-indian', lang: 'ta' },
  { label: 'Punjabi', href: '/category/punjabi', lang: 'pa' },
  { label: 'Pakistani', href: '/category/pakistani', lang: 'ur' },
  { label: 'Web Series', href: '/tv', lang: '' },
  { label: 'Bengali', href: '/category/bengali', lang: 'bn' },
]

export const truncate = (text: string, length: number) =>
  text?.length > length ? text.slice(0, length) + '...' : text
