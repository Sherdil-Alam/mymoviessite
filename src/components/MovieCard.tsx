'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PlayIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/solid'
import { getPosterUrl, getYear, formatRuntime, formatRating } from '@/lib/tmdb'
import { GENRES, truncate } from '@/lib/utils'
import type { Movie, TVShow } from '@/types'

interface MovieCardProps {
  item: Movie | TVShow
  type?: 'movie' | 'tv'
  priority?: boolean
}

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item
}

export default function MovieCard({ item, type, priority = false }: MovieCardProps) {
  const [imgError, setImgError] = useState(false)
  const mediaType = type || item.media_type || (isMovie(item) ? 'movie' : 'tv')
  const title = isMovie(item) ? item.title : item.name
  const date = isMovie(item) ? item.release_date : item.first_air_date
  const href = `/${mediaType === 'movie' ? 'movies' : 'tv'}/${item.id}`
  const year = getYear(date)
  const rating = formatRating(item.vote_average)
  const genreNames = item.genre_ids?.slice(0, 2).map(id => GENRES[id]).filter(Boolean) || []

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex-shrink-0"
    >
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-xl bg-brand-card shadow-lg shadow-black/40">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={imgError ? '/placeholder-poster.svg' : getPosterUrl(item.poster_path, 'w342')}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 18vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
              onError={() => setImgError(true)}
            />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-red/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <PlayIcon className="w-6 h-6 text-white ml-1" />
              </div>
            </div>

            {/* HD Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-brand-red/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HD</span>
            </div>

            {/* Rating */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
              <StarIcon className="w-3 h-3 text-brand-gold" />
              <span className="text-white text-[11px] font-semibold">{rating}</span>
            </div>

            {/* Bottom info on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {genreNames.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {genreNames.map(g => (
                    <span key={g} className="text-[10px] bg-brand-red/80 text-white px-2 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300 text-[11px]">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {year}
                </span>
                {isMovie(item) && item.runtime && (
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {formatRuntime(item.runtime)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="p-2.5 pb-3">
            <h3 className="text-white text-sm font-semibold truncate leading-tight group-hover:text-brand-red transition-colors">
              {title}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">{year}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
