import { getPopularTV, getTopRatedTV, getAiringTodayTV } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import type { Metadata } from 'next'
import type { TVShow } from '@/types'

export const metadata: Metadata = {
  title: 'TV Shows & Web Series',
  description: 'Watch popular TV shows, dramas, and web series on NetMirror',
}

export const revalidate = 3600

export default async function TVPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const filter = searchParams.filter || 'popular'

  const fetchMap: Record<string, () => Promise<{ results: TVShow[] }>> = {
    popular:      getPopularTV,
    top_rated:    getTopRatedTV,
    airing_today: getAiringTodayTV,
  }

  let results: TVShow[] = []
  try {
    const fetcher = fetchMap[filter] || getPopularTV
    const data = await fetcher()
    results = data.results
  } catch (err) {
    console.error('TV fetch error:', err)
  }

  const tabs = [
    { key: 'popular',      label: 'Popular' },
    { key: 'top_rated',    label: 'Top Rated' },
    { key: 'airing_today', label: 'Airing Today' },
  ]

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-brand-red rounded-full" />
          <h1 className="text-white text-3xl font-black">TV Shows &amp; Web Series</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <a
              key={tab.key}
              href={`/tv?filter=${tab.key}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                  : 'bg-brand-card border border-brand-border text-gray-300 hover:text-white hover:border-brand-red'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No shows found. Try refreshing.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(show => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
