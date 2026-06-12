import Link from 'next/link'
import Logo from './Logo'
import { CATEGORIES } from '@/lib/utils'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-nav border-t border-brand-border mt-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              NetMirror — your ultimate destination for the latest Bollywood, Hollywood, South Indian,
              Pakistani dramas, and web series. Watch in HD quality, anytime, anywhere.
            </p>
            <div className="flex gap-3 mt-5">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-brand-border text-gray-400 hover:text-white hover:border-brand-red transition-colors text-xs font-bold"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Movies', href: '/movies' },
                { label: 'TV Shows', href: '/tv' },
                { label: 'A-Z List', href: '/az-list' },
                { label: 'Search', href: '/search' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {year} NetMirror. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs text-center">
            This site does not store any files on its server. All content is provided by third parties.
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Use', 'DMCA'].map(item => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
