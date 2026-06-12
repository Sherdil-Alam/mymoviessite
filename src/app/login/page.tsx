'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon, StarIcon, FilmIcon, TvIcon, SparklesIcon } from '@heroicons/react/24/solid'
import Logo from '@/components/Logo'

const features = [
  { icon: FilmIcon, title: 'Bollywood', desc: 'Latest Hindi blockbusters in HD' },
  { icon: TvIcon, title: 'Pakistani Dramas', desc: 'Top rated Pakistani TV shows' },
  { icon: PlayIcon, title: 'South Indian', desc: 'Tamil, Telugu, Malayalam movies' },
  { icon: SparklesIcon, title: 'Web Series', desc: 'Binge-worthy web originals' },
]

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) router.push('/')
  }, [session, router])

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/30 via-purple-900/20 to-brand-dark" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div>
            <Logo size="lg" className="mb-8" />
            <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-md">
              Your ultimate destination for Bollywood, Hollywood, South Indian, and Pakistani content — all in one place.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-brand-red" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-gray-400 text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 lg:hidden">
            <Logo size="lg" className="justify-center mb-4" />
          </div>

          <div className="bg-brand-card border border-brand-border rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="w-8 h-8 text-brand-red" />
              </div>
              <h1 className="text-white text-2xl font-black mb-2">Welcome to NetMirror</h1>
              <p className="text-gray-400 text-sm">
                Sign in for free to access unlimited movies, shows, and more
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { value: '10K+', label: 'Movies' },
                { value: 'HD', label: 'Quality' },
                { value: 'Free', label: 'Access' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center bg-brand-dark rounded-xl p-3 border border-brand-border">
                  <p className="text-brand-red font-black text-xl">{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Sign In Button */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-gray-600 text-xs">
              Free forever · No credit card · No spam
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            By signing in you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            {' '}&{' '}
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
