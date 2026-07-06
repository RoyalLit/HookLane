<div align="center">
  <h1>
    <span style="color: #FF6B35">Hook</span><span style="color: #fff">lane</span>
  </h1>
  <p align="center">
    <strong>Prove your fandom. Guess the song.</strong><br>
    Search any artist → listen to 10-second previews → guess the track → share your perfect score
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#deployment">Deployment</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
    <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite" alt="Vite" />
  </p>
</div>

## Why This Exists

Music quizzes are often restricted to preset playlists, require clunky logins, or are heavily rate-limited by strict API terms (like Spotify's). Hooklane solves this by creatively combining the **Deezer API** for fast artist searching with the **iTunes Search API** for restriction-free 10-second audio previews. The result is a lightning-fast, login-free quiz for *any* artist on earth.

## Features

- 🔎 **Universal Search**: Search any artist globally.
- 🎵 **10-Second Previews**: High-quality audio streams directly from iTunes.
- 🧠 **Adaptive Difficulty**: Tracks are grouped by popularity. You'll get a mix of massive hits and deep cuts over 5-10 rounds.
- 🃏 **Premium Share Cards**: Generate a beautiful, tilt-interactive 3D score card that you can download as a PNG or share directly to social media.
- 📱 **Mobile-First Design**: Optimized touch targets, dynamic grid layouts, and glassmorphism UI that feels like a native app.
- ⚡ **Zero Backend**: Fully static frontend utilizing edge-proxied API routes.

## Quick Start

Get a local instance running in under 2 minutes.

**Prerequisites**: Node.js 20+, npm 10+

```bash
git clone https://github.com/RoyalLit/HookLane.git
cd HookLane
npm install
npm run dev
```

Visit `http://localhost:5173`. 
> **Note**: API calls to Deezer and iTunes are automatically proxied via the Vite dev server to bypass CORS.

## How It Works

1. **Search**: User types an artist name. Hooklane queries the Deezer API (`/search/artist`) and returns the closest matches with high-res album art.
2. **Generate**: We query the iTunes API (`attribute=artistTerm`) to pull up to 40 tracks for the artist. The tracks are split into difficulty tiers (easy/medium/hard) based on popularity and shuffled to create a dynamic 5–10 round quiz.
3. **Play**: Each round plays a 10-second audio clip. The user must identify the song from 4 multiple-choice options.
4. **Share**: At the end of the quiz, Hooklane renders an interactive, 3D `ProfileCard` using Framer Motion and generates a downloadable PNG of the user's score.

## Architecture & Tech Stack

Hooklane is built for maximum speed and zero operational overhead.

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19, Vite 8 |
| **State** | Zustand |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Modules |
| **Animation** | Motion (`motion/react`) |
| **Audio/Data**| iTunes Search API, Deezer API |
| **Proxy** | Vercel Edge Rewrites (`vercel.json`) |

### Project Structure
```text
hooklane/
├── src/
│   ├── screens/       # SearchScreen, QuizScreen, ScoreScreen
│   ├── components/    # Reusable UI (HooklaneHero, ShareCard, ProfileCard)
│   ├── lib/           # api.js, quizGenerator.js, storage.js
│   ├── store.js       # Zustand global state
│   └── main.jsx       # Entry point
├── vercel.json        # Production API proxy rules
└── vite.config.js     # Dev server & local proxy config
```

## Deployment

Hooklane is designed to be deployed seamlessly on **Vercel**. It uses Vercel's built-in `rewrites` to proxy external APIs without requiring a custom Node.js backend or Cloudflare Worker.

```bash
npm run build
```

Deploying to Vercel:
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Vite preset and run `npm run build`.
3. The `vercel.json` file automatically configures the API proxy rewrites for Deezer and iTunes to avoid CORS issues in production.

## Contributing

We love contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT © [Pahul](https://github.com/RoyalLit)
