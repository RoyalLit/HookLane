<div align="center">
  <h1>
    <span style="color: #FF6B35">Hook</span><span style="color: #fff">lane</span>
  </h1>
  <p align="center">
    <strong>Instant music quiz for any artist</strong><br>
    Search → listen to 10-second previews → guess the song title → share your score
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" />
  </p>
</div>

## Overview

Hooklane is a browser-based music quiz game. Pick any artist, listen to 10-second song previews, and guess the correct title from four options. No account required — play instantly, share your score as a beautiful image card.

Built with React + Vite, powered by Deezer and iTunes APIs via a Cloudflare Worker proxy.

## Features

- **Artist search**: Search any artist; Deezer returns results with album art
- **Adaptive quiz**: 5–10 rounds per game, answers sorted by track popularity
- **10-second previews**: Stream from iTunes; replay button after preview ends
- **Score card**: Animated 3D shareable card with score, percentage, and artist art
- **Share anywhere**: Download PNG or share directly to WhatsApp, Instagram, etc.
- **No login**: Full gameplay as guest; optional account mode (coming soon)
- **Dark theme**: #0A0A0B base with #FF6B35 orange accent

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install & Dev

```bash
git clone <repo-url>
cd hooklane
npm install
npm run dev
```

Opens at `http://localhost:5173`. API calls to Deezer / iTunes are proxied via Vite dev server.

### Build

```bash
npm run build
npm run preview
```

## Architecture

```
hooklane/
├── src/
│   ├── screens/       — SearchScreen, QuizScreen, ScoreScreen
│   ├── components/    — Reusable UI (Hero, Grainient, ProfileCard, etc.)
│   ├── lib/           — api.js, quizGenerator.js, storage.js
│   └── main.jsx       — Entry point
├── worker/
│   └── index.js       — Cloudflare Worker (API proxy + rate limiter)
├── public/            — Static assets
└── vite.config.js     — Dev server + proxy config
```

### Data Flow

1. **Search**: User types artist name → Deezer `/search/artist` → results list
2. **Quiz**: Select artist → iTunes Search API (`attribute=artistTerm`) → 40 tracks → tertile-split into easy/medium/hard → shuffle → 5–10 rounds
3. **Play**: Each round shows album art + plays 10s iTunes preview → pick correct title from 4 options
4. **Score**: Results screen → animated ProfileCard → share as PNG

### APIs

- **Deezer Search API**: Artist search only. Album/top endpoints are region-blocked.
- **iTunes Search API**: Primary track source. Album art via URL transformation.
- **Cloudflare Worker**: `/api/deezer/*`, `/api/itunes/*` — CORS proxy + 50 req/min rate limit.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, Vite 8 |
| State | Zustand |
| Animation | Motion (motion.dev) |
| Styling | Tailwind CSS v4 |
| 3D Effects | OGL (WebGL shaders) |
| Routing | State-driven (no URL router) |
| Worker | Cloudflare Workers |
| CI | GitHub Actions |
| Lint | Oxlint |

## Configuration

Environment variables (`.dev.vars` for local worker dev):

```env
# No secrets required for Deezer Simple API
# Add worker environment variables as needed
```

## Deployment

### Cloudflare Pages + Worker

```bash
npm run build
# Deploy dist/ to Cloudflare Pages
# Deploy worker/ to Cloudflare Workers
```

The worker handles API proxying and CORS. Ensure your Pages domain is in the worker's CORS allowlist.

## Testing

```bash
npm test
```

Uses Vitest. Tests cover quiz generation logic and API integration.

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

---

<div align="center">
  <sub>Built by <a href="https://hooklane.pages.dev">Hooklane</a></sub>
</div>
