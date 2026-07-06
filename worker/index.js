const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}


function buildUrl(backend, path, search) {
  return `${BACKENDS[backend]}${path || '/'}${search}`
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) return ctx.next()

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }

    const match = url.pathname.match(/^\/api\/(deezer|itunesrss|itunes)(\/.*)?$/)
    if (!match) {
      return new Response('Not found', { status: 404 })
    }

    const backend = match[1]
    const path = match[2]
    const safePath = path?.replace(/\.\./g, '').replace(/\/+/g, '/') || ''
    const target = buildUrl(backend, safePath, url.search)

    // Try direct fetch first
    let response
    try {
      response = await fetch(target, {
        redirect: 'manual',
        headers: { Accept: 'application/json', 'User-Agent': 'Hooklane/1.0' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream request failed' }), { status: 502 })
    }


    const body = await response.text()
    return new Response(body, { status: response.status })
  },
}
