const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}

const CORS_PROXY = 'https://corsproxy.io/?'
const CORS_PROXY_FAILOVER = 'https://api.allorigins.win/raw?url='

function buildUrl(backend, path, search) {
  return `${BACKENDS[backend]}${path || '/'}${search}`
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) return

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }

    const match = url.pathname.match(/^\/api\/(deezer|itunesrss|itunes)(\/.*)?$/)
    if (!match) {
      return new Response('Not found', { status: 404 })
    }

    const backend = match[1]
    const path = match[2]
    const target = buildUrl(backend, path, url.search)

    // Try direct fetch first
    let response
    try {
      response = await fetch(target, {
        headers: { Accept: 'application/json', 'User-Agent': 'Hooklane/1.0' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream request failed' }), { status: 502 })
    }

    // If upstream returns error, try via CORS proxy fallback
    if (!response.ok) {
      let proxyUrl = CORS_PROXY + encodeURIComponent(target)
      let proxyRes
      try {
        proxyRes = await fetch(proxyUrl, { headers: { Accept: 'application/json' } })
      } catch {
        // Try failover proxy
        proxyUrl = CORS_PROXY_FAILOVER + encodeURIComponent(target)
        try {
          proxyRes = await fetch(proxyUrl, { headers: { Accept: 'application/json' } })
        } catch {
          // Return original error if both proxies fail
          const body = await response.text()
          return new Response(body, { status: response.status })
        }
      }
      const body = await proxyRes.text()
      return new Response(body, { status: proxyRes.ok ? 200 : response.status })
    }

    const body = await response.text()
    return new Response(body, { status: response.status })
  },
}
