import { notFound } from 'next/navigation'
import { discoverByLanguage, getPopularMovies, getPopularTV } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import type { Metadata } from 'next'
import type { Movie, TVShow } from '@/types'

export const revalidate = 3600

const CATEGORY_CONFIG: Record<string, { title: string; lang: string; type: 'movie' | 'tv' | 'both'; description: string }> = {
  bollywood: { title: 'Bollywood Movies', lang: 'hi', type: 'movie', description: 'Latest Hindi movies from Bollywood' },
  hollywood: { title: 'Hollywood Movies', lang: 'en', type: 'movie', description: 'Top Hollywood blockbusters' },
  'south-indian': { title: 'South Indian Movies', lang: 'ta', type: 'movie', description: 'Tamil, Telugu, Malayalam, Kannada movies' },
  punjabi: { title: 'Punjabi Movies', lang: 'pa', type: 'movie', description: 'Latest Punjabi movies' },
  pakistani: { title: 'Pakistani Dramas', lang: 'ur', type: 'tv', description: 'Popular Pakistani drama series' },
  bengali: { title: 'Bengali Movies', lang: 'bn', type: 'movie', description: 'Bengali movies and shows' },
}

interface Props { params: { genre: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const config = CATEGORY_CONFIG[params.genre]
  if (!config) return { title: 'Category Not Found' }
  return { title: config.title, description: config.description }
}

export default async function CategoryPage({ params }: Props) {
  const config = CATEGORY_CONFIG[params.genre]
  if (!config) notFound()

  let items: (Movie | TVShow)[] = []
  try {
    const data = await discoverByLanguage(config.lang, config.type === 'tv' ? 'tv' : 'movie')
    items = data.results
  } catch {
    items = []
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-16">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-brand-red/20 to-transparent border-b border-brand-border mb-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-brand-red rounded-full" />
            <h1 className="text-white text-3xl lg:text-4xl font-black">{config.title}</h1>
          </div>
          <p className="text-gray-400 ml-5">{config.description}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map(item => (
              <MovieCard key={item.id} item={item} type={config.type === 'tv' ? 'tv' : 'movie'} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No content available for this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
