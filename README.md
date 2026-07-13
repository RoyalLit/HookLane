<div align="center">
  <h1>
    <span style="color: #FF6B35">Hook</span><span style="color: #fff">lane</span>
  </h1>
  <p align="center">
    <strong>Prove your fandom. Guess the song.</strong><br>
    Search any artist → choose your difficulty → listen to audio previews → guess the track → share your score
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
    <img src="https://img.shields.io/badge/deployed-Vercel-black?logo=vercel" alt="Vercel" />
  </p>
</div>

## Why This Exists

Music quizzes are often restricted to preset playlists, require clunky logins, or are heavily rate-limited by strict API terms (like Spotify's). Hooklane solves this by combining the **Deezer API** for fast artist searching with the **iTunes Search API** for restriction-free audio previews. The result is a lightning-fast, login-free quiz for *any* artist on earth — with genuine difficulty that scales from casual fan to superfan.

## Features

- 🔎 **Universal Artist Search**: Search any artist globally via the Deezer API. Results are deduplicated and ranked by fan count.
- 🎵 **Auto-Playing Previews**: Audio clips start automatically on each new round. iTunes streams up to 200 tracks per artist.
- 🎯 **3-Tier Difficulty System**: Choose Easy, Medium, or Hard before each quiz. Each mode changes which tracks are selected, how hard the distractors are, how long the clip is, and how many times you can replay it.
- 🃏 **Shareable Score Cards**: A Canvas-drawn 1080×1080 PNG is generated at the end of each quiz, including your score, difficulty badge, artist art, a 2×2 album grid, and a `hooklane.vercel.app` watermark.
- 📊 **Personal Stats**: Your best score per artist (tracked by difficulty), play count, and last 5 results are stored locally via `localStorage` — no account needed.
- ⚡ **Zero Backend**: Fully static frontend. API calls are proxied through Vercel Rewrites to bypass CORS — no custom server required.
- ♿ **Accessible**: Answer cards use `role="radiogroup"` / `role="radio"` semantics, the difficulty picker is grouped with `aria-label`, and the play button announces state changes via `aria-label`.

## Difficulty Levels

| | 🟢 Easy | 🟡 Medium | 🔴 Hard |
|---|---|---|---|
| **Rounds** | 10 | 10 | 10 |
| **Question tracks** | Top-tier hits | Mixed popularity | Deep cuts / B-sides |
| **Distractors** | Far-popularity (obvious) | Same-tier (ambiguous) | Same-tier (ambiguous) |
| **Clip length** | 10 seconds | 10 seconds | 5 seconds |
| **Replays** | Unlimited | 2 | 1 — no replay |

## Quick Start

**Prerequisites**: Node.js 20+, npm 10+

```bash
git clone https://github.com/RoyalLit/HookLane.git
cd HookLane
npm install
npm run dev
```

Visit `http://localhost:5173`.

> **Note**: API calls to Deezer and iTunes are automatically proxied via the Vite dev server config (`vite.config.js`) to bypass CORS during development.

## How It Works

1. **Search**: User types an artist name. Hooklane queries the Deezer API (`/search/artist`) and returns the closest matches. Results are deduplicated by lowercased name, keeping the entry with the highest fan count.

2. **Pick Difficulty**: A full-screen difficulty picker appears. The selected difficulty controls track selection, distractor strategy, clip duration, and replay limit for the entire quiz.

3. **Generate Rounds**: Hooklane queries the iTunes Search API (`attribute=artistTerm`, `limit=200`) to fetch tracks for the artist. Results are filtered to exact artist-name matches, deduplicated by title, and sorted by iTunes result position (a proxy for popularity). Tracks are then split into popularity tertiles and 10 rounds are assembled according to the chosen difficulty.

4. **Play**: Each round autoplays a preview clip. The user chooses from 4 options. Hard mode gives you just 5 seconds and one listen — no replays. After answering, the correct option is highlighted and a "Next" button appears.

5. **Score & Share**: After 10 rounds, a score card is displayed showing your result (`X / 10`), difficulty badge, and percentage. The score is saved to `localStorage`. A Canvas-rendered 1080×1080 PNG can be downloaded or shared to WhatsApp, Instagram, or any app via the Web Share API.

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19, Vite 8 |
| **State** | Zustand |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS custom properties (`index.css`) |
| **Animation** | Motion (`motion/react`) |
| **Audio / Data** | iTunes Search API (tracks + previews), Deezer API (artist search) |
| **Share Card** | Canvas 2D API — renders a 1080×1080 PNG client-side |
| **Local Storage** | `localStorage` via `src/lib/storage.js` — per-artist stats, difficulty-aware best score |
| **Proxy** | Vercel Rewrites (`vercel.json`) in production, Vite proxy (`vite.config.js`) in dev |

### Project Structure

```text
hooklane/
├── src/
│   ├── screens/
│   │   ├── SearchScreen.jsx   # Landing, artist search, difficulty picker
│   │   ├── QuizScreen.jsx     # 10-round quiz loop with autoplay + replay limits
│   │   └── ScoreScreen.jsx    # Results, stats, share modal
│   ├── components/
│   │   ├── ArtistSearchBar.jsx  # Debounced search with clear button
│   │   ├── PlayButton.jsx       # Audio player with maxPlays + clipDuration props
│   │   ├── AnswerCard.jsx       # Radio-button-semantic answer option
│   │   ├── ShareCard.jsx        # Canvas-drawn shareable PNG (1080×1080)
│   │   ├── ProfileCard.jsx      # Interactive 3D tilt score display
│   │   ├── StatBox.jsx          # Per-artist play history from localStorage
│   │   └── ...                  # HooklaneHero, QuizProgress, AlbumArt, etc.
│   ├── lib/
│   │   ├── api.js               # Deezer + iTunes fetch wrappers with artist-name filter
│   │   ├── quizGenerator.js     # Difficulty-aware round generation (tertile logic)
│   │   └── storage.js           # localStorage stats with per-difficulty best score
│   ├── store.js                 # Zustand store: screen, rounds, score, difficulty
│   └── main.jsx                 # Entry point
├── vercel.json                  # Production CORS proxy rewrites
└── vite.config.js               # Dev server + local proxy config
```

### Key Design Decisions

**Why iTunes instead of Spotify?**
Spotify's API requires OAuth and restricts preview URLs to authenticated users. iTunes provides 30-second previews (we use 5–10s) with no auth, no CORS issues when proxied, and a 200-track limit per query — more than enough for 10 rounds.

**Why proxy instead of a backend?**
Hooklane is intentionally serverless. A Vercel Rewrite rule forwards `/api/deezer/*` and `/api/itunes/*` at the edge — zero cold starts, zero maintenance, zero cost.

**Why Canvas for the share card instead of HTML-to-image?**
`html2canvas` and `dom-to-image` are brittle across browsers, especially on mobile and with cross-origin images. A hand-drawn Canvas 2D card is deterministic, fast, and produces a clean 1080×1080 PNG every time.

**Why main-thread audio?**
The Web Audio API runs on the main thread intentionally. The 10-second clip duration means we never need complex scheduling, and keeping audio simple avoids the Safari `AudioContext` autoplay policy pitfalls that plague Web Audio workarounds.

## Deployment

Hooklane is deployed on **Vercel**. The `vercel.json` configures rewrites that proxy Deezer and iTunes API calls server-side to avoid CORS in production.

```bash
npm run build
```

Deploying to Vercel:
1. Connect your GitHub repository to Vercel.
2. Vercel auto-detects the Vite preset and runs `npm run build`.
3. The `vercel.json` rewrites handle CORS for both APIs automatically — no environment variables required.

Live at: **[hooklane.vercel.app](https://hooklane.vercel.app)**

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes with clear commit messages
4. Open a pull request against `main`

Please ensure new features include updated documentation in this README.

## License

MIT © [Pahul](https://github.com/RoyalLit)
