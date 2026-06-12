'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { incrementWatchCount, shouldPromptAuth } from '@/lib/watchCount'

export const useWatchGuard = () => {
  const { data: session } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const checkAndWatch = useCallback(
    (mediaId: string, onAllowed: () => void) => {
      const isAuthenticated = !!session?.user
      const updated = incrementWatchCount(mediaId)
      const needsAuth = shouldPromptAuth(isAuthenticated)

      if (needsAuth && !isAuthenticated) {
        setShowAuthModal(true)
        return false
      }

      onAllowed()
      return true
    },
    [session]
  )

  const closeAuthModal = () => setShowAuthModal(false)

  return { showAuthModal, closeAuthModal, checkAndWatch }
}
