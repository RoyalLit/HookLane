const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}

const RATE_LIMIT = 50
const RATE_WINDOW_MS = 60_000
const requestCounts = new Map()

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

function cleanupStaleEntries(now) {
  for (const [ip, entry] of requestCounts) {
    if (now - entry.windowStart > RATE_WINDOW_MS) requestCounts.delete(ip)
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Only handle API — let Cloudflare serve static assets for everything else
    if (!url.pathname.startsWith('/api/')) return

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }

    const match = url.pathname.match(/^\/api\/(deezer|itunesrss|itunes)(\/.*)?$/)
    if (!match) {
      return new Response('Not found', { status: 404 })
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown'
    if (rateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 })
    }

    const target = `${BACKENDS[match[1]]}${match[2] || '/'}${url.search}`

    let response
    try {
      response = await fetch(target, { headers: { Accept: 'application/json' } })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream request failed' }), { status: 502 })
    }

    const body = await response.text()
    return new Response(body, { status: response.status })
  },
}
