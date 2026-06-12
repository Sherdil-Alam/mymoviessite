'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import MovieCard from './MovieCard'
import type { Movie, TVShow } from '@/types'

interface MovieRowProps {
  title: string
  items: (Movie | TVShow)[]
  viewAllHref?: string
  type?: 'movie' | 'tv'
}

export default function MovieRow({ title, items, viewAllHref, type }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    const el = rowRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = rowRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  if (!items?.length) return null

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand-red rounded-full" />
          <h2 className="text-white text-lg lg:text-xl font-bold">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-brand-red hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="relative group/row">
        {/* Scroll Left */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-brand-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-8 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <div key={item.id} className="w-[140px] sm:w-[160px] lg:w-[180px] flex-shrink-0">
              <MovieCard item={item} type={type} priority={idx < 4} />
            </div>
          ))}
        </div>

        {/* Scroll Right */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-brand-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <div className="w-9 h-9 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </div>
          </button>
        )}
      </div>
    </section>
  )
}
