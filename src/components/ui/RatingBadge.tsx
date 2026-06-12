import { StarIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { formatRating } from '@/lib/tmdb'

export default function RatingBadge({ rating, className }: { rating: number; className?: string }) {
  const color = rating >= 7 ? 'text-green-400' : rating >= 5 ? 'text-brand-gold' : 'text-red-400'
  return (
    <span className={cn('flex items-center gap-1 font-semibold', color, className)}>
      <StarIcon className="w-4 h-4 text-brand-gold" />
      {formatRating(rating)}
    </span>
  )
}
