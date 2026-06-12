import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import SessionProvider from '@/providers/SessionProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: {
    template: '%s | NetMirror — Watch Free Movies & Shows Online',
    default: 'NetMirror — Watch Free Movies & Shows Online',
  },
  description:
    'Watch the latest Bollywood, Hollywood, South Indian, Pakistani and Web Series in HD quality. Free streaming at NetMirror.',
  keywords: 'bollywood movies, hollywood movies, south indian dubbed, pakistani dramas, web series, watch online free, HD movies',
  openGraph: {
    siteName: 'NetMirror',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="dark">
      <body>
        <SessionProvider session={session}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#141420',
                color: '#fff',
                border: '1px solid #2a2a3a',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
