const STORAGE_KEY = 'nm_watch_count'
const WATCHED_IDS_KEY = 'nm_watched_ids'
const FREE_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_WATCH_LIMIT || '3', 10)

export interface WatchData {
  count: number
  ids: string[]
}

export const getWatchData = (): WatchData => {
  if (typeof window === 'undefined') return { count: 0, ids: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { count: 0, ids: [] }
  } catch {
    return { count: 0, ids: [] }
  }
}

export const incrementWatchCount = (id: string): WatchData => {
  const data = getWatchData()
  if (data.ids.includes(id)) return data
  const updated: WatchData = {
    count: data.count + 1,
    ids: [...data.ids, id],
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export const shouldPromptAuth = (isAuthenticated: boolean): boolean => {
  if (isAuthenticated) return false
  const data = getWatchData()
  return data.count >= FREE_LIMIT
}

export const getFreeWatchesRemaining = (): number => {
  const data = getWatchData()
  return Math.max(0, FREE_LIMIT - data.count)
}

export const resetWatchCount = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(WATCHED_IDS_KEY)
}
