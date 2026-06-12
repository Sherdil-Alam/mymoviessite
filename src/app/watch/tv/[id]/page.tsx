'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon, ShareIcon, StarIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { getTVDetails, getTVSeason, getBackdropUrl, getPosterUrl, getYear, formatRating } from '@/lib/tmdb'
import { incrementWatchCount, shouldPromptAuth } from '@/lib/watchCount'
import AuthModal from '@/components/AuthModal'
import type { TVShow, Season, Episode } from '@/types'
import toast from 'react-hot-toast'

export default function WatchTVPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [show, setShow] = useState<TVShow | null>(null)
  const [season, setSeason] = useState<Season | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(parseInt(searchParams.get('s') || '1'))
  const [selectedEpisode, setSelectedEpisode] = useState(parseInt(searchParams.get('e') || '1'))

  useEffect(() => {
    if (!id) return
    incrementWatchCount(id)
    if (shouldPromptAuth(!!session?.user)) setShowAuthModal(true)
    getTVDetails(parseInt(id)).then(data => {
      setShow(data)
      setLoading(false)
    }).catch(() => router.push('/'))
  }, [id, session, router])

  useEffect(() => {
    if (!id) return
    getTVSeason(parseInt(id), selectedSeason).then(setSeason).catch(() => null)
    setPlayerLoaded(false)
  }, [id, selectedSeason])

  if (loading || !show) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-16">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-brand-border rounded-full" />
          <div className="absolute inset-0 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-16">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 group">
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
              style={{ aspectRatio: '16/9' }}
            >
              {!playerLoaded ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Image
                    src={getBackdropUrl(show.backdrop_path, 'w1280')}
                    alt={show.name} fill className="object-cover opacity-30"
                  />
                  <div className="relative z-10 text-center">
                    <button
                      onClick={() => setPlayerLoaded(true)}
                      className="w-20 h-20 bg-brand-red/90 hover:bg-brand-red rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all mb-4"
                    >
                      <PlayIcon className="w-10 h-10 text-white ml-1" />
                    </button>
                    <p className="text-white font-semibold text-lg">{show.name}</p>
                    <p className="text-gray-400 text-sm">S{selectedSeason} E{selectedEpisode} • Click to play</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={show.imdb_id
                    ? `https://vidsrc.to/embed/tv/${show.imdb_id}/${selectedSeason}/${selectedEpisode}`
                    : `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
                  allowFullScreen
                  className="w-full h-full border-0"
                  allow="fullscreen; autoplay"
                  title={`${show.name} S${selectedSeason}E${selectedEpisode}`}
                />
              )}
            </motion.div>

            <div className="flex items-center justify-between mt-4 px-1">
              <div>
                <h1 className="text-white text-xl font-bold">{show.name}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Season {selectedSeason} • Episode {selectedEpisode}
                  {season?.episodes?.[selectedEpisode - 1]?.name && ` — ${season.episodes[selectedEpisode - 1].name}`}
                </p>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full"
              >
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Season selector */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-white font-bold">Season</h3>
                <div className="flex flex-wrap gap-2">
                  {show.seasons?.filter(s => s.season_number > 0).map(s => (
                    <button
                      key={s.season_number}
                      onClick={() => { setSelectedSeason(s.season_number); setSelectedEpisode(1) }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                        selectedSeason === s.season_number
                          ? 'bg-brand-red text-white'
                          : 'bg-brand-card border border-brand-border text-gray-300 hover:text-white'
                      }`}
                    >
                      S{s.season_number}
                    </button>
                  ))}
                </div>
              </div>

              {season?.episodes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {season.episodes.map(ep => (
                    <button
                      key={ep.episode_number}
                      onClick={() => { setSelectedEpisode(ep.episode_number); setPlayerLoaded(true) }}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        selectedEpisode === ep.episode_number
                          ? 'bg-brand-red/20 border border-brand-red/50'
                          : 'bg-brand-card border border-brand-border hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        selectedEpisode === ep.episode_number ? 'bg-brand-red text-white' : 'bg-brand-border text-gray-400'
                      }`}>
                        {ep.episode_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{ep.name || `Episode ${ep.episode_number}`}</p>
                        {ep.runtime && <p className="text-gray-500 text-xs">{ep.runtime}m</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden mb-6">
              <div className="flex gap-4 p-4">
                <Image src={getPosterUrl(show.poster_path, 'w185')} alt={show.name} width={80} height={120} className="rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{show.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{getYear(show.first_air_date)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarIcon className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-gold text-sm font-semibold">{formatRating(show.vote_average)}</span>
                  </div>
                  <Link href={`/tv/${id}`} className="inline-block mt-2 text-brand-red hover:text-red-400 text-xs">
                    Full Details →
                  </Link>
                </div>
              </div>
            </div>

            {!session?.user && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 mb-6">
                <p className="text-brand-gold text-sm font-semibold mb-1">Unlimited Access</p>
                <p className="text-gray-400 text-xs leading-relaxed">Sign in free for uninterrupted binge-watching.</p>
                <button onClick={() => setShowAuthModal(true)} className="mt-3 w-full bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold text-sm font-semibold py-2 rounded-lg transition-colors">
                  Sign In Free
                </button>
              </div>
            )}

            {show.similar?.results && show.similar.results.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-brand-red rounded-full" />
                  Similar Shows
                </h3>
                <div className="space-y-3">
                  {show.similar.results.slice(0, 6).map(similar => (
                    <Link key={similar.id} href={`/watch/tv/${similar.id}`} className="flex gap-3 bg-brand-card hover:bg-white/5 border border-brand-border rounded-xl p-3 group">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={getPosterUrl(similar.poster_path, 'w185')} alt={similar.name} fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50">
                          <PlayIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-brand-red">{similar.name}</p>
                        <p className="text-gray-500 text-xs">{getYear(similar.first_air_date)}</p>
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
