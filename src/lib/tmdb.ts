/**
 * Data layer — powered by two free public APIs (no keys needed):
 *   Movies  → YTS.mx API   (https://yts.mx/api)
 *   TV      → TVMaze API   (https://www.tvmaze.com/api)
 *   Player  → vidsrc.to    (IMDB-based free embeds)
 */

import axios from 'axios'
import type { Movie, TVShow, Credits, Season, Episode, Genre } from '@/types'

const YTS_BASE    = 'https://movies-api.accel.li/api/v2'
const TVMAZE_BASE = 'https://api.tvmaze.com'

const yts     = axios.create({ baseURL: YTS_BASE,    timeout: 10000 })
const tvmaze  = axios.create({ baseURL: TVMAZE_BASE, timeout: 10000 })

// ─── Image helpers ────────────────────────────────────────────────────────────
// Accepts both full URLs (YTS/TVMaze) and legacy TMDB relative paths
export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (path: string | null, _size?: string): string =>
  !path            ? '/placeholder-poster.svg' :
  path.startsWith('http') ? path :
  `${IMAGE_BASE}/w342${path}`

export const getBackdropUrl = (path: string | null, _size?: string): string =>
  !path            ? '/placeholder-backdrop.svg' :
  path.startsWith('http') ? path :
  `${IMAGE_BASE}/w1280${path}`

// Always false — no API key required anymore
export const isApiKeyMissing = () => false

// ─── Formatting ───────────────────────────────────────────────────────────────
export const getYear        = (date: string) => date?.split('-')[0] || 'N/A'
export const formatRating   = (r: number)    => (r || 0).toFixed(1)
export const formatRuntime  = (mins?: number) => {
  if (!mins) return 'N/A'
  const h = Math.floor(mins / 60), m = mins % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

// ─── YTS raw types ────────────────────────────────────────────────────────────
interface YTSMovie {
  id: number; url: string; imdb_code: string
  title: string; title_english: string; year: number
  rating: number; runtime: number; genres: string[]
  description_full: string; synopsis: string
  yt_trailer_code: string; language: string
  background_image: string; background_image_original: string
  small_cover_image: string; medium_cover_image: string; large_cover_image: string
  cast?: Array<{ name: string; character_name: string; url_small_image: string; imdb_code: string }>
}
interface YTSListResp  { status: string; data: { movie_count: number; movies: YTSMovie[] } }
interface YTSDetailResp { status: string; data: { movie: YTSMovie } }

// ─── TVMaze raw types ─────────────────────────────────────────────────────────
interface TvShow {
  id: number; name: string; type: string; language: string | null
  genres: string[]; status: string; runtime: number | null
  premiered: string | null; rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
  externals: { tvrage: number | null; thetvdb: number | null; imdb: string | null }
  network?: { name: string; country?: { name: string } } | null
  _embedded?: { cast: TvCast[] }
}
interface TvCast {
  person: { id: number; name: string; image: { medium: string } | null }
  character: { id: number; name: string }
}
interface TvSeason {
  id: number; number: number; name: string
  episodeOrder: number | null; premiereDate: string | null
  image: { medium: string; original: string } | null; summary: string | null
}
interface TvEpisode {
  id: number; name: string; season: number; number: number
  airdate: string; runtime: number | null
  image: { medium: string; original: string } | null
  summary: string | null; rating: { average: number | null }
}

// ─── Adapters ─────────────────────────────────────────────────────────────────
const stripHtml = (s: string) => s?.replace(/<[^>]*>/g, '') || ''

const adaptMovie = (m: YTSMovie): Movie => ({
  id:               m.id,
  title:            m.title,
  original_title:   m.title_english || m.title,
  overview:         m.description_full || m.synopsis || '',
  poster_path:      m.large_cover_image || m.medium_cover_image || null,
  backdrop_path:    m.background_image_original || m.background_image || null,
  release_date:     `${m.year}-01-01`,
  vote_average:     m.rating ?? 0,
  vote_count:       0,
  genre_ids:        [],
  genres:           (m.genres || []).map((name, i) => ({ id: 100 + i, name })),
  runtime:          m.runtime || 0,
  original_language:(m.language || 'en').toLowerCase(),
  popularity:       (m.rating ?? 0) * 10,
  adult:            false,
  video:            false,
  media_type:       'movie',
  imdb_code:        m.imdb_code,
  credits: m.cast ? {
    cast: m.cast.map((c, i) => ({
      id: i, name: c.name, character: c.character_name,
      profile_path: c.url_small_image || null, order: i,
    })),
    crew: [],
  } : undefined,
})

const adaptTV = (show: TvShow): TVShow => ({
  id:               show.id,
  name:             show.name,
  original_name:    show.name,
  overview:         stripHtml(show.summary || ''),
  poster_path:      show.image?.original || show.image?.medium || null,
  backdrop_path:    show.image?.original || null,
  first_air_date:   show.premiered || '',
  vote_average:     show.rating?.average ?? 0,
  vote_count:       0,
  genre_ids:        [],
  genres:           (show.genres || []).map((name, i) => ({ id: 200 + i, name })),
  original_language:(show.language || 'en').toLowerCase().slice(0, 2),
  popularity:       (show.rating?.average ?? 0) * 10,
  media_type:       'tv',
  imdb_id:          show.externals?.imdb ?? undefined,
  credits: show._embedded?.cast ? {
    cast: show._embedded.cast.slice(0, 12).map((c, i) => ({
      id: c.person.id, name: c.person.name, character: c.character.name,
      profile_path: c.person.image?.medium || null, order: i,
    })),
    crew: [],
  } : undefined,
})

// ─── Movies (YTS) ─────────────────────────────────────────────────────────────
const ytsMovies = async (params: Record<string, unknown>) => {
  const { data } = await yts.get<YTSListResp>('/list_movies.json', { params })
  return (data.data?.movies || []).map(adaptMovie)
}

export const getPopularMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, sort_by: 'like_count', minimum_rating: 6, quality: '1080p' }),
  page, total_pages: 50, total_results: 0,
})

export const getNowPlayingMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, sort_by: 'date_added', quality: '1080p' }),
  page, total_pages: 50, total_results: 0,
})

export const getTopRatedMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, sort_by: 'rating', minimum_rating: 7 }),
  page, total_pages: 50, total_results: 0,
})

export const getUpcomingMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, sort_by: 'year', quality: '1080p', genre: 'Action' }),
  page, total_pages: 50, total_results: 0,
})

export const getBollywoodMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, query_term: 'hindi', sort_by: 'year' }),
  page, total_pages: 10, total_results: 0,
})

export const getSouthIndianMovies = async (page = 1) => ({
  results: await ytsMovies({ limit: 20, page, query_term: 'tamil', sort_by: 'year' }),
  page, total_pages: 10, total_results: 0,
})

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const { data } = await yts.get<YTSDetailResp>('/movie_details.json', {
    params: { movie_id: id, with_cast: true },
  })
  const raw = data.data?.movie
  if (!raw) throw new Error('Movie not found')
  const movie = adaptMovie(raw)

  if (raw.yt_trailer_code) {
    movie.videos = { results: [{ id: raw.yt_trailer_code, key: raw.yt_trailer_code, name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }] }
  }

  try {
    const { data: sug } = await yts.get<YTSListResp>('/movie_suggestions.json', { params: { movie_id: id } })
    movie.similar = { results: (sug.data?.movies || []).map(adaptMovie) }
  } catch { /* suggestions optional */ }

  return movie
}

// ─── TV Shows (TVMaze) ────────────────────────────────────────────────────────
export const getPopularTV = async (page = 1) => {
  const { data } = await tvmaze.get<TvShow[]>('/shows', { params: { page: page - 1 } })
  return { results: data.map(adaptTV), page, total_pages: 100, total_results: 0 }
}

export const getTopRatedTV = async (page = 1) => {
  const { data } = await tvmaze.get<TvShow[]>('/shows', { params: { page: (page - 1) * 2 } })
  const sorted = data.filter(s => s.rating?.average).sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
  return { results: sorted.map(adaptTV), page, total_pages: 50, total_results: 0 }
}

export const getAiringTodayTV = async (page = 1) => {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await tvmaze.get<Array<{ show: TvShow }>>('/schedule/web', { params: { date: today } })
  const unique = Array.from(new Map(data.map(e => [e.show.id, e.show])).values())
  return { results: unique.slice(0, 20).map(adaptTV), page, total_pages: 1, total_results: 0 }
}

export const getTVDetails = async (id: number): Promise<TVShow> => {
  const [showRes, seasonsRes] = await Promise.all([
    tvmaze.get<TvShow>(`/shows/${id}`, { params: { embed: 'cast' } }),
    tvmaze.get<TvSeason[]>(`/shows/${id}/seasons`),
  ])
  const show = adaptTV(showRes.data)

  show.seasons = seasonsRes.data.map(s => ({
    id:             s.id,
    name:           s.name || `Season ${s.number}`,
    season_number:  s.number,
    episode_count:  s.episodeOrder || 0,
    overview:       stripHtml(s.summary || ''),
    poster_path:    s.image?.original || show.poster_path || null,
    air_date:       s.premiereDate || '',
  }))
  show.number_of_seasons = seasonsRes.data.length

  try {
    const { data: page0 } = await tvmaze.get<TvShow[]>('/shows', { params: { page: 0 } })
    const srcGenres = showRes.data.genres || []
    show.similar = {
      results: page0
        .filter(s => s.id !== id && s.genres?.some(g => srcGenres.includes(g)))
        .slice(0, 12)
        .map(adaptTV),
    }
  } catch { /* similar optional */ }

  return show
}

export const getTVSeason = async (tvId: number, seasonNumber: number): Promise<Season> => {
  const { data: seasons } = await tvmaze.get<TvSeason[]>(`/shows/${tvId}/seasons`)
  const season = seasons.find(s => s.number === seasonNumber)
  if (!season) throw new Error('Season not found')
  const { data: eps } = await tvmaze.get<TvEpisode[]>(`/seasons/${season.id}/episodes`)
  return {
    id:            season.id,
    name:          season.name || `Season ${seasonNumber}`,
    season_number: seasonNumber,
    episode_count: eps.length,
    overview:      stripHtml(season.summary || ''),
    poster_path:   season.image?.original || null,
    air_date:      season.premiereDate || '',
    episodes:      eps.map(ep => ({
      id:             ep.id,
      name:           ep.name || `Episode ${ep.number}`,
      episode_number: ep.number,
      season_number:  ep.season,
      overview:       stripHtml(ep.summary || ''),
      still_path:     ep.image?.original || null,
      air_date:       ep.airdate || '',
      vote_average:   ep.rating?.average ?? 0,
      runtime:        ep.runtime,
    })),
  }
}

// ─── Search ───────────────────────────────────────────────────────────────────
export const searchMulti = async (query: string, page = 1) => {
  const [movRes, tvRes] = await Promise.all([
    yts.get<YTSListResp>('/list_movies.json', { params: { query_term: query, limit: 15, page } }),
    tvmaze.get<Array<{ score: number; show: TvShow }>>('/search/shows', { params: { q: query } }),
  ])
  return {
    results: [
      ...(movRes.data.data?.movies || []).map(adaptMovie),
      ...tvRes.data.map(r => adaptTV(r.show)),
    ] as (Movie | TVShow)[],
    page, total_pages: 10, total_results: 0,
  }
}

export const searchMovies = async (query: string, page = 1) => ({
  results: await ytsMovies({ query_term: query, limit: 20, page }),
  page, total_pages: 10, total_results: 0,
})

export const searchTV = async (query: string) => {
  const { data } = await tvmaze.get<Array<{ score: number; show: TvShow }>>('/search/shows', { params: { q: query } })
  return { results: data.map(r => adaptTV(r.show)), page: 1, total_pages: 1, total_results: data.length }
}

// ─── Discover ─────────────────────────────────────────────────────────────────
const GENRE_TO_YTS: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
}

export const discoverMoviesByGenre = async (genreId: number, page = 1) => ({
  results: await ytsMovies({ genre: GENRE_TO_YTS[genreId] || 'drama', sort_by: 'rating', minimum_rating: 6, limit: 20, page }),
  page, total_pages: 50, total_results: 0,
})

export const discoverTVByGenre = async (genreId: number) => {
  const genre = GENRE_TO_YTS[genreId] || 'drama'
  const { data } = await tvmaze.get<Array<{ score: number; show: TvShow }>>('/search/shows', { params: { q: genre } })
  return { results: data.map(r => adaptTV(r.show)), page: 1, total_pages: 1, total_results: data.length }
}

const LANG_QUERY: Record<string, string> = {
  hi: 'hindi', ta: 'tamil', te: 'telugu', ml: 'malayalam',
  pa: 'punjabi', bn: 'bengali', ur: 'urdu', ko: 'korean',
  zh: 'chinese', ja: 'japanese',
}

export const discoverByLanguage = async (lang: string, type: 'movie' | 'tv' = 'movie', page = 1) => {
  if (type === 'tv') {
    const q = { ur: 'Pakistani drama', hi: 'Hindi serial', ta: 'Tamil serial', ko: 'Korean drama', zh: 'Chinese drama', ja: 'Japanese drama' }[lang] || lang
    const { data } = await tvmaze.get<Array<{ score: number; show: TvShow }>>('/search/shows', { params: { q } })
    return { results: data.map(r => adaptTV(r.show)), page: 1, total_pages: 1, total_results: data.length }
  }
  const query = LANG_QUERY[lang] || 'english'
  return { results: await ytsMovies({ query_term: query, sort_by: 'year', limit: 20, page }), page, total_pages: 10, total_results: 0 }
}

// ─── Trending (interleaved movies + TV) ──────────────────────────────────────
export const getTrending = async (type: 'movie' | 'tv' | 'all' = 'all', _window = 'week') => {
  if (type === 'tv')  return getPopularTV()
  if (type === 'movie') return getPopularMovies()

  const [movies, tv] = await Promise.all([getPopularMovies(), getPopularTV()])
  const mixed: (Movie | TVShow)[] = []
  const len = Math.max(movies.results.length, tv.results.length)
  for (let i = 0; i < len; i++) {
    if (movies.results[i]) mixed.push(movies.results[i])
    if (tv.results[i])     mixed.push(tv.results[i])
  }
  return { results: mixed.slice(0, 20) as (Movie | TVShow)[], page: 1, total_pages: 10, total_results: 0 }
}

// ─── Genre lists ──────────────────────────────────────────────────────────────
export const getMovieGenres = async (): Promise<Genre[]> =>
  Object.entries(GENRE_TO_YTS).map(([id, name]) => ({ id: parseInt(id), name }))

export const getTVGenres = async (): Promise<Genre[]> => [
  { id: 10759, name: 'Action & Adventure' }, { id: 18, name: 'Drama' },
  { id: 35, name: 'Comedy' }, { id: 27, name: 'Horror' },
  { id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 80, name: 'Crime' },
]
