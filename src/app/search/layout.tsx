import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner className="min-h-screen pt-24" />}>{children}</Suspense>
}
