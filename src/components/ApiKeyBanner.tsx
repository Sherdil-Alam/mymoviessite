import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

export default function ApiKeyBanner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-brand-card border border-yellow-500/30 rounded-2xl p-8 text-center">
        <ExclamationTriangleIcon className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">TMDB API Key Required</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Movie data is powered by TMDB. You need a free API key to load content.
        </p>
        <ol className="text-left space-y-3 mb-6">
          {[
            <>Go to <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer" className="text-brand-red underline">themoviedb.org/signup</a> and create a free account</>,
            <>Visit <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="text-brand-red underline">themoviedb.org/settings/api</a> → Create → Developer</>,
            <>Copy your <span className="text-white font-semibold">API Key (v3 auth)</span></>,
            <>Open <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-300">.env.local</code> in the project root and replace <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-300">your_tmdb_api_key_here</code> with your key</>,
            <>Restart the dev server: <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-300">npm run dev</code></>,
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-gray-300 text-sm">
              <span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-gray-600 text-xs">TMDB API is completely free, no credit card required.</p>
      </div>
    </div>
  )
}
