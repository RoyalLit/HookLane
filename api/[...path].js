const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)

  const match = url.pathname.match(/^\/api\/(deezer|itunesrss|itunes)(\/.*)?$/)
  if (!match) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  const target = `${BACKENDS[match[1]]}${match[2] || '/'}${url.search}`

  try {
    const response = await fetch(target, {
      headers: { Accept: 'application/json', 'User-Agent': 'Hooklane/1.0' },
    })
    const body = await response.text()
    const headers = { 'Content-Type': response.headers.get('content-type') || 'application/json' }
    res.writeHead(response.status, headers)
    res.end(body)
  } catch {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Upstream request failed' }))
  }
}
