import Link from 'next/link'
import Image from 'next/image'
import { getPopularMovies, getTopRatedMovies, getPosterUrl, getYear, formatRating } from '@/lib/tmdb'
import { StarIcon } from '@heroicons/react/24/solid'
import type { Metadata } from 'next'
import type { Movie } from '@/types'

export const metadata: Metadata = {
  title: 'A-Z Movie List',
  description: 'Browse all movies alphabetically on NetMirror',
}

export const revalidate = 3600

export default async function AZListPage() {
  const [pop1, pop2, top1, top2] = await Promise.all([
    getPopularMovies(1),
    getPopularMovies(2),
    getTopRatedMovies(1),
    getTopRatedMovies(2),
  ])

  const allMovies: Movie[] = [
    ...pop1.results, ...pop2.results,
    ...top1.results, ...top2.results,
  ]

  const unique = Array.from(new Map(allMovies.map(m => [m.id, m])).values())
  const sorted = unique.sort((a, b) => a.title.localeCompare(b.title))

  const alpha = ['0-9', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))]

  const grouped: Record<string, Movie[]> = {}
  for (const letter of alpha) {
    if (letter === '0-9') {
      grouped[letter] = sorted.filter(m => /^[0-9]/.test(m.title))
    } else {
      grouped[letter] = sorted.filter(m => m.title.toUpperCase().startsWith(letter))
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-brand-red rounded-full" />
          <h1 className="text-white text-3xl font-black">A-Z Movie List</h1>
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap gap-2 mb-10 bg-brand-card border border-brand-border rounded-2xl p-4">
          {alpha.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                grouped[letter]?.length > 0
                  ? 'bg-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/30'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Movie lists by letter */}
        {alpha.map(letter => {
          const movies = grouped[letter]
          if (!movies?.length) return null
          return (
            <div key={letter} id={`letter-${letter}`} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center font-black text-white text-lg">
                  {letter}
                </div>
                <span className="text-gray-500 text-sm">{movies.length} titles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {movies.map(movie => (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="flex items-center gap-3 bg-brand-card hover:bg-white/5 border border-brand-border hover:border-brand-red rounded-xl p-3 transition-all group"
                  >
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={getPosterUrl(movie.poster_path, 'w185')}
                        alt={movie.title}
                        fill className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate group-hover:text-brand-red transition-colors">
                        {movie.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{getYear(movie.release_date)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-3 h-3 text-brand-gold" />
                        <span className="text-gray-400 text-xs">{formatRating(movie.vote_average)}</span>
                        <span className="text-gray-700 text-xs ml-1 bg-brand-red/20 text-brand-red px-1.5 rounded text-[10px] font-bold">HD</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
