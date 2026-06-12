/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'yts.mx' },
      { protocol: 'https', hostname: 'yts.bz' },
      { protocol: 'https', hostname: 'yts.rs' },
      { protocol: 'https', hostname: 'yts.lt' },
      { protocol: 'https', hostname: 'movies-api.accel.li' },
      { protocol: 'https', hostname: '*.yts.mx' },
      { protocol: 'https', hostname: 'static.yts.mx' },
      { protocol: 'https', hostname: 'img.tvmaze.com' },
      { protocol: 'https', hostname: 'static.tvmaze.com' },
      { protocol: 'https', hostname: 'mediaimage.tvmaze.com' },
      { protocol: 'https', hostname: 'images.metahub.space' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
