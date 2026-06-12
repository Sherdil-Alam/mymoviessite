# NetMirror — Setup Guide

## Step 1 — TMDB API Key (Required for movies/shows data)

1. Go to https://www.themoviedb.org/signup and create a free account
2. Visit https://www.themoviedb.org/settings/api
3. Click **Create** → choose **Developer** → fill the form
4. Copy your **API Key (v3 auth)**
5. Open `.env.local` and replace `your_tmdb_api_key_here` with your key

## Step 2 — Google OAuth (Required for sign-in)

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g. "NetMirror")
3. Enable the **Google+ API** (or Google Identity)
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Set Application Type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3001/api/auth/callback/google`
   - (Add your production domain later)
7. Copy the **Client ID** and **Client Secret**
8. Open `.env.local` and fill them in

## Step 3 — Run the dev server

```bash
cd netmirror
npm run dev
```

Open http://localhost:3000 (or 3001 if 3000 is in use)

## Step 4 — Production build

```bash
npm run build
npm start
```

## Environment variables (.env.local)

```
NEXT_PUBLIC_TMDB_API_KEY=your_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=any_random_long_string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FREE_WATCH_LIMIT=3
```

## Features

- Homepage with hero slider, 8 content rows (Bollywood, Hollywood, South Indian, etc.)
- Movie & TV show detail pages with cast, genres, ratings
- Video player with embedded streams (via 2embed.cc)
- Google OAuth — users can watch 3 movies FREE before being asked to sign in
- A-Z browsing list
- Category pages (Bollywood, Hollywood, South Indian, Punjabi, Pakistani, Bengali)
- Genre filtering pages
- Full-text search with debounce
- Mobile-responsive dark UI
- Toast notifications, loading states, error pages
