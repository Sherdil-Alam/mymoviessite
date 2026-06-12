import {
  getTrending,
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getPopularTV,
  getBollywoodMovies,
  getSouthIndianMovies,
  discoverByLanguage,
} from '@/lib/tmdb'
import HeroSlider from '@/components/HeroSlider'
import MovieRow from '@/components/MovieRow'
import type { Movie, TVShow } from '@/types'

export const revalidate = 3600

export default async function HomePage() {
  try {
    const [
      trending,
      nowPlaying,
      popular,
      topRated,
      popularTV,
      bollywood,
      southIndian,
      pakistani,
    ] = await Promise.all([
      getTrending('all', 'week'),
      getNowPlayingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getPopularTV(),
      getBollywoodMovies(),
      getSouthIndianMovies(),
      discoverByLanguage('ur', 'tv'),
    ])

    const heroItems = trending.results.filter(i => i.backdrop_path).slice(0, 8)

    return (
      <div className="bg-brand-dark">
        <HeroSlider items={heroItems} />
        <div className="pt-8">
          <MovieRow title="Now Playing in Cinemas"       items={nowPlaying.results}          viewAllHref="/movies?filter=now_playing" type="movie" />
          <MovieRow title="Trending This Week"           items={trending.results}            viewAllHref="/movies" />
          <MovieRow title="Latest Bollywood"             items={bollywood.results}           viewAllHref="/category/bollywood"       type="movie" />
          <MovieRow title="South Indian (Hindi Dubbed)"  items={southIndian.results}         viewAllHref="/category/south-indian"    type="movie" />
          <MovieRow title="Popular TV Shows"             items={popularTV.results}           viewAllHref="/tv"                       type="tv" />
          <MovieRow title="Pakistani Dramas"             items={pakistani.results as TVShow[]} viewAllHref="/category/pakistani"     type="tv" />
          <MovieRow title="Top Rated Movies"             items={topRated.results}            viewAllHref="/movies?filter=top_rated"  type="movie" />
          <MovieRow title="Popular Movies"               items={popular.results}             viewAllHref="/movies"                   type="movie" />
        </div>
      </div>
    )
  } catch (err) {
    console.error('Homepage fetch error:', err)
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-400 text-lg">Could not load content. Please refresh the page.</p>
        </div>
      </div>
    )
  }
}
