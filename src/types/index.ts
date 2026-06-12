export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  genres?: Genre[]
  runtime?: number
  tagline?: string
  status?: string
  original_language: string
  popularity: number
  adult: boolean
  video: boolean
  media_type?: 'movie'
  imdb_code?: string
  production_companies?: { id: number; name: string; logo_path: string | null }[]
  credits?: Credits
  videos?: { results: Video[] }
  similar?: { results: Movie[] }
}

export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  genres?: Genre[]
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  original_language: string
  popularity: number
  media_type?: 'tv'
  imdb_id?: string
  seasons?: Season[]
  credits?: Credits
  videos?: { results: Video[] }
  similar?: { results: TVShow[] }
}

export interface Season {
  id: number
  name: string
  season_number: number
  episode_count: number
  overview: string
  poster_path: string | null
  air_date: string
  episodes?: Episode[]
}

export interface Episode {
  id: number
  name: string
  episode_number: number
  season_number: number
  overview: string
  still_path: string | null
  air_date: string
  vote_average: number
  runtime: number | null
}

export interface Genre {
  id: number
  name: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MediaItem = Movie | TVShow

export interface WatchProgress {
  count: number
  lastWatched: string
}
