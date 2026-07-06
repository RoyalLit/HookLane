export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const rest = url.pathname.replace(/^\/api\/itunesrss/, '') || '/'
  const target = `https://rss.applemarketingtools.com${rest}${url.search}`
  try {
    const r = await fetch(target, { headers: { Accept: 'application/json' } })
    const body = await r.text()
    res.writeHead(r.status, { 'Content-Type': r.headers.get('content-type') || 'application/json' })
    res.end(body)
  } catch {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Upstream failed' }))
  }
}
