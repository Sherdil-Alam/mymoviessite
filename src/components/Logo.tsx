import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' }

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <div className="relative">
        <svg
          width={size === 'sm' ? 28 : size === 'md' ? 36 : 44}
          height={size === 'sm' ? 28 : size === 'md' ? 36 : 44}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-110"
        >
          <rect width="44" height="44" rx="8" fill="#e50914" />
          <path d="M8 14h4v16H8V14z" fill="white" />
          <path d="M14 14l8 8-8 8V14z" fill="white" />
          <path d="M24 14h4v16h-4V14z" fill="white" />
          <path d="M30 14h4v6l-4 4V14z" fill="white" fillOpacity="0.7" />
          <path d="M30 28l4-4v6h-4v-2z" fill="white" fillOpacity="0.7" />
          <circle cx="36" cy="10" r="5" fill="#f5c518" />
        </svg>
      </div>
      <span className={cn('font-extrabold tracking-tight', sizes[size])}>
        <span className="text-white">Net</span>
        <span className="text-brand-red">Mirror</span>
      </span>
    </Link>
  )
}
