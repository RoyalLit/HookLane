export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const rest = url.pathname.replace(/^\/api\/itunes/, '') || '/'
  const target = `https://itunes.apple.com${rest}${url.search}`
  try {
    const r = await fetch(target, { headers: { Accept: 'application/json', 'User-Agent': 'Hooklane/1.0' } })
    const body = await r.text()
    res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') || 'application/json' })
    res.end(body)
  } catch {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Upstream failed' }))
  }
}
