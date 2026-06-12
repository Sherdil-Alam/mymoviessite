'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon, ShareIcon, StarIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { getMovieDetails, getBackdropUrl, getPosterUrl, getYear, formatRuntime, formatRating } from '@/lib/tmdb'
import { incrementWatchCount, shouldPromptAuth } from '@/lib/watchCount'
import AuthModal from '@/components/AuthModal'
import type { Movie } from '@/types'
import { GENRES } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function WatchMoviePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)

  useEffect(() => {
    if (!id) return

    const watchData = incrementWatchCount(id)
    if (shouldPromptAuth(!!session?.user)) {
      setShowAuthModal(true)
    }

    getMovieDetails(parseInt(id))
      .then(setMovie)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [id, session, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-16">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-brand-border rounded-full" />
          <div className="absolute inset-0 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!movie) return null

  const genres = movie.genre_ids?.slice(0, 3).map(id => GENRES[id]).filter(Boolean) || []

  return (
    <div className="min-h-screen bg-brand-dark pt-16">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Player Section */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/60"
              style={{ aspectRatio: '16/9' }}
            >
              {!playerLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Image
                    src={getBackdropUrl(movie.backdrop_path, 'w1280')}
                    alt={movie.title}
                    fill className="object-cover opacity-30"
                  />
                  <div className="relative z-10 text-center">
                    <button
                      onClick={() => setPlayerLoaded(true)}
                      className="w-20 h-20 bg-brand-red/90 hover:bg-brand-red rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all mb-4"
                    >
                      <PlayIcon className="w-10 h-10 text-white ml-1" />
                    </button>
                    <p className="text-white font-semibold text-lg">{movie.title}</p>
                    <p className="text-gray-400 text-sm">Click to start playback</p>
                  </div>
                </div>
              )}
              {playerLoaded && (
                <iframe
                  src={movie.imdb_code
                    ? `https://vidsrc.to/embed/movie/${movie.imdb_code}`
                    : `https://vidsrc.to/embed/movie/${id}`}
                  allowFullScreen
                  className="w-full h-full border-0"
                  allow="fullscreen; autoplay"
                  title={movie.title}
                />
              )}
            </motion.div>

            {/* Player controls bar */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div>
                <h1 className="text-white text-xl font-bold">{movie.title}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-brand-gold" />
                    {formatRating(movie.vote_average)}
                  </span>
                  <span>{getYear(movie.release_date)}</span>
                  {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied!')
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {genres.map(g => (
                <span key={g} className="bg-brand-card border border-brand-border text-gray-300 text-xs px-3 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mt-6 bg-brand-card border border-brand-border rounded-xl p-5">
              <h3 className="text-white font-bold mb-2">Synopsis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {movie.overview || 'No synopsis available.'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            {/* Movie Info Card */}
            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden mb-6">
              <div className="flex gap-4 p-4">
                <Image
                  src={getPosterUrl(movie.poster_path, 'w185')}
                  alt={movie.title}
                  width={80} height={120}
                  className="rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{getYear(movie.release_date)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarIcon className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-gold text-sm font-semibold">{formatRating(movie.vote_average)}</span>
                  </div>
                  <Link
                    href={`/movies/${id}`}
                    className="inline-block mt-2 text-brand-red hover:text-red-400 text-xs transition-colors"
                  >
                    Full Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* Watch notice */}
            {!session?.user && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 mb-6">
                <p className="text-brand-gold text-sm font-semibold mb-1">Free Watch Limit</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Sign in with Google for unlimited, uninterrupted access to all movies and shows.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-3 w-full bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Sign In Free
                </button>
              </div>
            )}

            {/* Similar movies */}
            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-brand-red rounded-full" />
                  Up Next
                </h3>
                <div className="space-y-3">
                  {movie.similar.results.slice(0, 6).map(similar => (
                    <Link
                      key={similar.id}
                      href={`/watch/movie/${similar.id}`}
                      className="flex gap-3 bg-brand-card hover:bg-white/5 border border-brand-border rounded-xl p-3 transition-colors group"
                    >
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={getPosterUrl(similar.poster_path, 'w185')}
                          alt={similar.title}
                          fill className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                          <PlayIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-brand-red transition-colors">
                          {similar.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{getYear(similar.release_date)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon className="w-3 h-3 text-brand-gold" />
                          <span className="text-gray-400 text-xs">{formatRating(similar.vote_average)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
