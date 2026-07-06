const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
]

const BACKENDS = {
  deezer: 'https://api.deezer.com',
  itunes: 'https://itunes.apple.com',
  itunesrss: 'https://rss.applemarketingtools.com',
}

const RATE_LIMIT = 50
const RATE_WINDOW_MS = 60_000
const requestCounts = new Map()

function resolveAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin) return null
  const allowList =
    env && env.EXTRA_ORIGIN
      ? [...ALLOWED_ORIGINS, env.EXTRA_ORIGIN]
      : ALLOWED_ORIGINS
  return allowList.includes(origin) ? origin : null
}

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

function cleanupStaleEntries(now) {
  for (const [ip, entry] of requestCounts) {
    if (now - entry.windowStart > RATE_WINDOW_MS) requestCounts.delete(ip)
  }
}

export async function onRequest(context) {
  const { request, env } = context
  const allowedOrigin = resolveAllowedOrigin(request, env)
  const cors = corsHeaders(allowedOrigin)

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
}
