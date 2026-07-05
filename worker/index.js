// ---------------------------------------------------------------------------
// ALLOW-LIST — permitted browser origins (Master Plan §5.4: validate Origin,
// never wildcard). Edit this list to add/remove origins. Origins are NOT
// secrets, so a hardcoded default is fine; an optional extra origin can be
// supplied via the EXTRA_ORIGIN env var (e.g. a preview deployment URL).
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173', // Vite preview server
  'https://hooklane.pages.dev', // production placeholder — update on deploy
]

const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}

const RATE_LIMIT = 50
const RATE_WINDOW_MS = 60_000

// NOTE: This Map is per-isolate and best-effort ONLY. Cloudflare runs many
// isolates across its edge, each with its own copy of this Map, so the true
// limit a client sees is higher than RATE_LIMIT and resets when an isolate is
// recycled. It is a lightweight abuse throttle, not a strict quota. A strict,
// globally-consistent limit would require Durable Objects or KV — do NOT add
// those without sign-off (AGENTS.md hard constraints).
const requestCounts = new Map()

// Resolve which Origin (if any) we should echo back. Returns the origin string
// when it is in the allow-list, otherwise null.
function resolveAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin) return null // no Origin (same-origin/curl) — pass through, no ACAO
  const allowList =
    env && env.EXTRA_ORIGIN
      ? [...ALLOWED_ORIGINS, env.EXTRA_ORIGIN]
      : ALLOWED_ORIGINS
  return allowList.includes(origin) ? origin : null
}

// Build CORS headers for a resolved origin. When allowedOrigin is null we omit
// Access-Control-Allow-Origin entirely so the browser blocks the response.
function corsHeaders(allowedOrigin) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  }
  if (allowedOrigin) headers['Access-Control-Allow-Origin'] = allowedOrigin
  return headers
}

function rateLimited(ip) {
  const now = Date.now()
  const entry = requestCounts.get(ip)
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now })
    cleanupStaleEntries(now)
    return false
  }
  entry.count += 1
  if (entry.count > RATE_LIMIT) return true
  return false
}

// Lightweight stale-entry sweep so the in-memory Map doesn't grow unbounded
// over the isolate's lifetime. Runs opportunistically on new-window inserts.
function cleanupStaleEntries(now) {
  for (const [ip, entry] of requestCounts) {
    if (now - entry.windowStart > RATE_WINDOW_MS) requestCounts.delete(ip)
  }
}

export default {
  async fetch(request, env) {
    const allowedOrigin = resolveAllowedOrigin(request, env)
    const cors = corsHeaders(allowedOrigin)

    // Preflight: short-circuit before any routing/proxying.
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const url = new URL(request.url)
    const match = url.pathname.match(/^\/api\/(deezer|itunesrss|itunes)(\/.*)?$/)
    if (!match) {
      return new Response('Not found', { status: 404 })
    }
    const backend = match[1]
    const path = match[2] || '/'

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown'
    if (rateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: cors,
      })
    }

    const target = `${BACKENDS[backend]}${path}${url.search}`

    let response
    try {
      response = await fetch(target, {
        headers: { 'Accept': 'application/json' },
      })
    } catch (err) {
      // Upstream unreachable — return a clean error WITH CORS headers so the
      // client sees a real 502 instead of an opaque CORS failure.
      return new Response(
        JSON.stringify({ error: 'Upstream request failed', detail: String(err) }),
        { status: 502, headers: cors },
      )
    }

    if (response.status === 204) {
      return new Response(null, { status: 204, headers: cors })
    }

    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: cors,
    })
  },
}
