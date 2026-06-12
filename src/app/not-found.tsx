import Link from 'next/link'
import { FilmIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center">
        <FilmIcon className="w-20 h-20 text-gray-700 mx-auto mb-6" />
        <h1 className="text-brand-red text-8xl font-black mb-4">404</h1>
        <h2 className="text-white text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or the movie has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redDark text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
