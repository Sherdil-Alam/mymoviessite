import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GenreBadgeProps {
  name: string
  id?: number
  className?: string
  clickable?: boolean
}

export default function GenreBadge({ name, id, className, clickable = true }: GenreBadgeProps) {
  const classes = cn(
    'inline-block px-3 py-1 text-xs font-medium rounded-full border border-brand-border text-gray-300 transition-colors',
    clickable && 'hover:bg-brand-red hover:border-brand-red hover:text-white cursor-pointer',
    className
  )

  if (clickable && id) {
    return <Link href={`/genre/${id}`} className={classes}>{name}</Link>
  }

  return <span className={classes}>{name}</span>
}
