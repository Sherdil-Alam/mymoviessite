'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, InformationCircleIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { getBackdropUrl, getYear, formatRuntime, formatRating } from '@/lib/tmdb'
import { GENRES, truncate } from '@/lib/utils'
import type { Movie, TVShow } from '@/types'

interface HeroSliderProps {
  items: (Movie | TVShow)[]
}

function isMovie(item: Movie | TVShow): item is Movie {
  return 'title' in item
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [next, isAutoPlaying])

  if (!items.length) return null

  const item = items[current]
  const title = isMovie(item) ? item.title : item.name
  const date = isMovie(item) ? item.release_date : item.first_air_date
  const mediaType = item.media_type || (isMovie(item) ? 'movie' : 'tv')
  const genres = item.genre_ids?.slice(0, 3).map(id => GENRES[id]).filter(Boolean) || []

  return (
    <div
      className="relative h-[70vh] lg:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={getBackdropUrl(item.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            className="object-cover object-center"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 lg:pb-20">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <span className="flex items-center gap-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold px-2.5 py-1 rounded-full">
                  <StarIcon className="w-3 h-3" />
                  {formatRating(item.vote_average)} IMDb
                </span>
                <span className="bg-white/10 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                  {getYear(date)}
                </span>
                <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                  HD
                </span>
              </div>

              {/* Title */}
              <h1 className="text-white text-4xl lg:text-6xl font-black leading-tight mb-3 drop-shadow-2xl">
                {title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {genres.map(g => (
                  <span key={g} className="text-gray-300 text-sm border border-gray-600 px-2.5 py-0.5 rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6 max-w-xl">
                {truncate(item.overview || 'No description available.', 180)}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/watch/${mediaType}/${item.id}`}
                  className="flex items-center gap-2.5 bg-brand-red hover:bg-brand-redDark text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 hover:scale-105"
                >
                  <PlayIcon className="w-5 h-5" />
                  Watch Now
                </Link>
                <Link
                  href={`/${mediaType === 'movie' ? 'movies' : 'tv'}/${item.id}`}
                  className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 border border-white/20 hover:border-white/40"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                  More Info
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10 hover:border-white/30 hover:scale-110"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10 hover:border-white/30 hover:scale-110"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-brand-red' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
