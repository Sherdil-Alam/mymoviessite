'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { XMarkIcon, FilmIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/solid'
import Logo from './Logo'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-brand-red via-orange-500 to-brand-gold" />

            <div className="p-8">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-red/20 border border-brand-red/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LockClosedIcon className="w-8 h-8 text-brand-red" />
                </div>
                <Logo size="sm" className="justify-center mb-4" />
                <h2 className="text-white text-2xl font-bold mb-2">Continue Watching</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  You&apos;ve enjoyed your free previews! Sign in with Google to unlock unlimited access to thousands of movies and shows.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-7">
                {[
                  { icon: FilmIcon, text: 'Unlimited access to HD movies & shows' },
                  { icon: SparklesIcon, text: 'Personalized recommendations just for you' },
                  { icon: LockClosedIcon, text: '100% free — no credit card required' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-red" />
                    </div>
                    <span className="text-gray-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-gray-600 text-xs mt-4">
                By signing in, you agree to our{' '}
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
