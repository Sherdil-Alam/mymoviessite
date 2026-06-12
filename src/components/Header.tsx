'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { BellIcon } from '@heroicons/react/24/solid'
import Logo from './Logo'
import { CATEGORIES } from '@/lib/utils'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies', children: [
    { label: 'Bollywood', href: '/category/bollywood' },
    { label: 'Hollywood', href: '/category/hollywood' },
    { label: 'South Indian', href: '/category/south-indian' },
    { label: 'Punjabi', href: '/category/punjabi' },
    { label: 'Pakistani', href: '/category/pakistani' },
    { label: 'Bengali', href: '/category/bengali' },
  ]},
  { label: 'TV Shows', href: '/tv' },
  { label: 'Web Series', href: '/tv?type=series' },
  { label: 'A-Z List', href: '/az-list' },
]

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-nav/98 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {NAV_LINKS.map(link => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                >
                  {link.label}
                  {link.children && <ChevronDownIcon className="w-3.5 h-3.5" />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-1 w-44 bg-brand-card border border-brand-border rounded-lg shadow-2xl overflow-hidden"
                  >
                    {link.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="hidden lg:flex items-center bg-black/60 border border-brand-border rounded-full overflow-hidden"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 ml-3 text-gray-400 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search movies, shows..."
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              )}
            </AnimatePresence>

            {/* Mobile search */}
            <Link href="/search" className="lg:hidden p-2 text-gray-300 hover:text-white">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>

            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-brand-red"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-300" />
                  )}
                  <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-brand-card border border-brand-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-brand-border">
                        <p className="text-white text-sm font-medium truncate">{session.user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{session.user.email}</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-redDark text-white text-sm font-semibold rounded-full transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-brand-nav border-t border-brand-border overflow-hidden"
          >
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="flex items-center bg-black/40 border border-brand-border rounded-lg mb-4">
                <MagnifyingGlassIcon className="w-4 h-4 ml-3 text-gray-400" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none"
                />
              </form>
              {NAV_LINKS.map(link => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-gray-300 hover:text-white font-medium border-b border-brand-border/50"
                  >
                    {link.label}
                  </Link>
                  {link.children?.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block pl-4 py-2.5 text-sm text-gray-400 hover:text-white border-b border-brand-border/30"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              {!session?.user && (
                <button
                  onClick={() => signIn('google')}
                  className="mt-4 w-full py-3 bg-brand-red text-white font-semibold rounded-lg"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
