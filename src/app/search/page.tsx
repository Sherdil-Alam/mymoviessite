'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { searchMulti } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Movie, TVShow } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    inputRef.current?.focus()
    if (initialQuery) {
      doSearch(initialQuery)
    }
  }, [])

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchMulti(q)
      setResults(data.results.filter(r => (r as Movie).title || (r as TVShow).name))
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (val: string) => {
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      router.replace(`/search?q=${encodeURIComponent(val)}`, { scroll: false })
      doSearch(val)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16 px-4 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-white text-3xl font-black text-center mb-6">
            Search <span className="text-brand-red">NetMirror</span>
          </h1>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleChange(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full bg-brand-card border border-brand-border rounded-2xl py-4 pl-13 pr-12 text-white placeholder-gray-500 text-lg focus:outline-none focus:border-brand-red transition-colors"
              style={{ paddingLeft: '3.25rem' }}
            />
            {query && (
              <button
                onClick={() => handleChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && searched && (
          <div>
            <p className="text-gray-400 mb-6 text-sm">
              {results.length > 0
                ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                : `No results for "${query}"`}
            </p>
            <AnimatePresence>
              {results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {results.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <MovieCard item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <MagnifyingGlassIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No results found</p>
                  <p className="text-gray-600 text-sm mt-1">Try different keywords</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="w-20 h-20 text-gray-800 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">Search for your favorite content</p>
            <p className="text-gray-600 text-sm mt-2">Movies, TV shows, web series and more</p>
          </div>
        )}
      </div>
    </div>
  )
}
