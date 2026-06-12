import { notFound } from 'next/navigation'
import Image from 'next/image'
import { StarIcon, CalendarIcon, GlobeAltIcon, TvIcon } from '@heroicons/react/24/solid'
import { getTVDetails, getBackdropUrl, getPosterUrl, getYear, formatRating } from '@/lib/tmdb'
import { LANGUAGE_NAMES } from '@/lib/utils'
import MovieRow from '@/components/MovieRow'
import GenreBadge from '@/components/ui/GenreBadge'
import WatchButton from '@/components/WatchButton'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const show = await getTVDetails(parseInt(params.id))
    return { title: show.name, description: show.overview }
  } catch {
    return { title: 'Show Not Found' }
  }
}

export default async function TVPage({ params }: Props) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  let show
  try {
    show = await getTVDetails(id)
  } catch {
    notFound()
  }

  const cast = show.credits?.cast.slice(0, 8) || []

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="relative h-[50vh] lg:h-[60vh]">
        <Image
          src={getBackdropUrl(show.backdrop_path, 'original')}
          alt={show.name}
          fill priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 w-48 lg:w-64 mx-auto lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-brand-border">
              <Image
                src={getPosterUrl(show.poster_path, 'w500')}
                alt={show.name}
                width={256} height={384}
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 pb-8">
            <span className="inline-block bg-brand-red/20 border border-brand-red/50 text-brand-red text-xs font-bold px-2.5 py-1 rounded-full uppercase mb-3">
              TV Show
            </span>
            <h1 className="text-white text-3xl lg:text-5xl font-black mb-4 leading-tight">{show.name}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span className="flex items-center gap-1.5 text-brand-gold font-semibold">
                <StarIcon className="w-5 h-5" />
                {formatRating(show.vote_average)} / 10
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                {getYear(show.first_air_date)}
              </span>
              {show.number_of_seasons && (
                <span className="flex items-center gap-1.5 text-gray-300">
                  <TvIcon className="w-4 h-4 text-gray-500" />
                  {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-300">
                <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                {LANGUAGE_NAMES[show.original_language] || show.original_language.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map(g => <GenreBadge key={g.id} name={g.name} id={g.id} />)}
            </div>

            <div className="flex flex-wrap gap-3 mb-7">
              <WatchButton movieId={String(id)} mediaType="tv" season={1} episode={1} size="lg" />
            </div>

            <div className="mb-7">
              <h3 className="text-white font-bold text-lg mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{show.overview || 'No overview available.'}</p>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {show.seasons && show.seasons.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-3">
              <div className="w-1 h-6 bg-brand-red rounded-full" />
              Seasons
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {show.seasons.filter(s => s.season_number > 0).map(season => (
                <div key={season.id} className="bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-red transition-colors group">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={getPosterUrl(season.poster_path, 'w342')}
                      alt={season.name}
                      fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold truncate">{season.name}</p>
                    <p className="text-gray-500 text-xs">{season.episode_count} episodes</p>
                    <WatchButton
                      movieId={String(id)}
                      mediaType="tv"
                      season={season.season_number}
                      episode={1}
                      size="sm"
                      className="mt-2 w-full justify-center text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                        alt={person.name} width={80} height={80}
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

        {show.similar?.results.length ? (
          <div className="mt-10 -mx-4 lg:-mx-8">
            <MovieRow title="Similar Shows" items={show.similar.results} type="tv" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
