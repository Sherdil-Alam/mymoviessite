import { discoverMoviesByGenre, discoverTVByGenre } from '@/lib/tmdb'
import { GENRES } from '@/lib/utils'
import MovieCard from '@/components/MovieCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props { params: { id: string }; searchParams: { type?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = GENRES[parseInt(params.id)] || 'Genre'
  return { title: `${name} Movies & Shows` }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const genreId = parseInt(params.id)
  if (isNaN(genreId)) notFound()

  const type = searchParams.type === 'tv' ? 'tv' : 'movie'
  const genreName = GENRES[genreId] || 'Unknown'

  const data = type === 'tv'
    ? await discoverTVByGenre(genreId)
    : await discoverMoviesByGenre(genreId)

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-brand-red rounded-full" />
            <h1 className="text-white text-3xl font-black">{genreName}</h1>
          </div>
          <div className="flex gap-2">
            <a
              href={`/genre/${genreId}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                type === 'movie' ? 'bg-brand-red text-white' : 'bg-brand-card border border-brand-border text-gray-300 hover:text-white'
              }`}
            >
              Movies
            </a>
            <a
              href={`/genre/${genreId}?type=tv`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                type === 'tv' ? 'bg-brand-red text-white' : 'bg-brand-card border border-brand-border text-gray-300 hover:text-white'
              }`}
            >
              TV Shows
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.results.map(item => (
            <MovieCard key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}
