import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PlayIcon, StarIcon, ClockIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/solid'
import { getMovieDetails, getBackdropUrl, getPosterUrl, getYear, formatRuntime, formatRating } from '@/lib/tmdb'
import { LANGUAGE_NAMES } from '@/lib/utils'
import MovieRow from '@/components/MovieRow'
import GenreBadge from '@/components/ui/GenreBadge'
import WatchButton from '@/components/WatchButton'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(parseInt(params.id))
    return {
      title: movie.title,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.backdrop_path ? [getBackdropUrl(movie.backdrop_path, 'w780')] : [],
      },
    }
  } catch {
    return { title: 'Movie Not Found' }
  }
}

export default async function MoviePage({ params }: Props) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  let movie
  try {
    movie = await getMovieDetails(id)
  } catch {
    notFound()
  }

  const director = movie.credits?.crew.find(c => c.job === 'Director')
  const cast = movie.credits?.cast.slice(0, 8) || []
  const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')

  return (
    <div className="bg-brand-dark min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative h-[50vh] lg:h-[65vh]">
        <Image
          src={getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 lg:w-64 mx-auto lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-brand-border">
              <Image
                src={getPosterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                width={256}
                height={384}
                className="w-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded">
                HD
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-red/20 border border-brand-red/50 text-brand-red text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                Movie
              </span>
              {movie.status && (
                <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs px-2.5 py-1 rounded-full">
                  {movie.status}
                </span>
              )}
            </div>

            <h1 className="text-white text-3xl lg:text-5xl font-black mb-2 leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-400 text-base italic mb-4">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span className="flex items-center gap-1.5 text-brand-gold font-semibold">
                <StarIcon className="w-5 h-5" />
                {formatRating(movie.vote_average)} / 10
                <span className="text-gray-500 text-sm font-normal">({movie.vote_count?.toLocaleString()} votes)</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                {getYear(movie.release_date)}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1.5 text-gray-300">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-300">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                {LANGUAGE_NAMES[movie.original_language] || movie.original_language.toUpperCase()}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(g => <GenreBadge key={g.id} name={g.name} id={g.id} />)}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mb-7">
              <WatchButton movieId={String(id)} mediaType="movie" />
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all"
                >
                  <PlayIcon className="w-4 h-4 text-brand-red" />
                  Watch Trailer
                </a>
              )}
            </div>

            {/* Overview */}
            <div className="mb-7">
              <h3 className="text-white font-bold text-lg mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {director && (
                <div className="bg-brand-card rounded-xl p-4 border border-brand-border">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Director</p>
                  <p className="text-white font-medium">{director.name}</p>
                </div>
              )}
              {movie.original_title !== movie.title && (
                <div className="bg-brand-card rounded-xl p-4 border border-brand-border">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Original Title</p>
                  <p className="text-white font-medium">{movie.original_title}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-3">
              <div className="w-1 h-6 bg-brand-red rounded-full" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {cast.map(person => (
                <div key={person.id} className="text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-brand-card border border-brand-border mx-auto mb-2">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                        {person.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-semibold truncate">{person.name}</p>
                  <p className="text-gray-500 text-[11px] truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {movie.similar?.results.length ? (
          <div className="mt-10 -mx-4 lg:-mx-8">
            <MovieRow
              title="Similar Movies"
              items={movie.similar.results}
              type="movie"
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
