'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayIcon } from '@heroicons/react/24/solid'
import { useWatchGuard } from '@/hooks/useWatchGuard'
import AuthModal from './AuthModal'

interface WatchButtonProps {
  movieId: string
  mediaType: 'movie' | 'tv'
  season?: number
  episode?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function WatchButton({
  movieId,
  mediaType,
  season,
  episode,
  className,
  size = 'md',
}: WatchButtonProps) {
  const router = useRouter()
  const { showAuthModal, closeAuthModal, checkAndWatch } = useWatchGuard()

  const handleWatch = () => {
    checkAndWatch(movieId, () => {
      let path = `/watch/${mediaType}/${movieId}`
      if (season && episode) path += `?s=${season}&e=${episode}`
      router.push(path)
    })
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-3.5 text-lg gap-2.5',
  }

  return (
    <>
      <button
        onClick={handleWatch}
        className={`flex items-center bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${className || ''}`}
      >
        <PlayIcon className={size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
        Watch Now
      </button>
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </>
  )
}
