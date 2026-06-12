import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function WatchTVLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>{children}</Suspense>
}
