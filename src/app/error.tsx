'use client'

import { useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-brand-red mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="bg-brand-red hover:bg-brand-redDark text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
