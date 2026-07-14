import { useRef, useCallback, useImperativeHandle, forwardRef, useState, useEffect } from 'react'

const SIZE = 1080
const PREVIEW_SIZE = 200
const ACCENT = '#FF6B35'
const BG = '#0A0A0B'
const SURFACE = '#1A1A1C'
const BORDER = '#343438'
const MUTED = '#C8C6CB'

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCircularImage(ctx, img, cx, cy, r) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  if (img) {
    const s = Math.min(img.width, img.height)
    const scale = (r * 2) / s
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h)
  } else {
    ctx.fillStyle = SURFACE
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  }
  ctx.restore()
  // border
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawAlbumCover(ctx, img, x, y, size) {
  ctx.save()
  roundRect(ctx, x, y, size, size, 14)
  ctx.closePath()
  ctx.clip()
  if (img) {
    ctx.drawImage(img, x, y, size, size)
  } else {
    ctx.fillStyle = SURFACE
    ctx.fillRect(x, y, size, size)
  }
  ctx.restore()
  ctx.beginPath()
  roundRect(ctx, x, y, size, size, 14)
  ctx.closePath()
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 1.5
  ctx.stroke()
}

const ShareCard = forwardRef(function ShareCard({ score, totalRounds, selectedArtist, rounds, difficulty }, ref) {
  const DIFFICULTY_MAP = {
    easy:   { label: 'EASY' },
    medium: { label: 'MEDIUM' },
    hard:   { label: 'HARD' },
  }
  const diff = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.medium
  const canvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const generatingRef = useRef(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(async () => {
    if (generatingRef.current) return null
    generatingRef.current = true
    setGenerating(true)

    try {
      await document.fonts.ready

      const canvas = canvasRef.current
      if (!canvas) return null
      const ctx = canvas.getContext('2d')

      canvas.width = SIZE
      canvas.height = SIZE

      // background
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, SIZE, SIZE)

      // accent header bar
      ctx.fillStyle = ACCENT
      ctx.fillRect(0, 0, SIZE, 20)

      // load images
      const portraitImg = selectedArtist?.picture_big
        ? await loadImage(selectedArtist.picture_big)
        : null

      const albumImgs = await Promise.all(
        rounds.slice(0, 4).map((r) =>
          loadImage(r.correctTrack.album?.cover_big || r.correctTrack.album?.cover_medium),
        ),
      )

      // fill missing slots with null
      while (albumImgs.length < 4) albumImgs.push(null)

      // --- circular portrait ---
      const portraitR = 115
      const portraitCy = 175
      drawCircularImage(ctx, portraitImg, SIZE / 2, portraitCy, portraitR)

      // --- artist name ---
      const artistName = selectedArtist?.name || 'Artist'
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 36px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const nameY = portraitCy + portraitR + 28
      ctx.fillText(artistName, SIZE / 2, nameY)

      // --- score: "7 / 10" ---
      const scoreY = nameY + 44 + 24
      const pct = totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0

      ctx.font = 'bold 96px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const scoreStr = String(score)
      const scoreW = ctx.measureText(scoreStr).width
      const totalStr = ` / ${totalRounds}`
      ctx.font = '52px Inter, system-ui, -apple-system, sans-serif'
      const totalW = ctx.measureText(totalStr).width
      const fullW = scoreW + totalW
      const scoreX = (SIZE - fullW) / 2

      ctx.font = 'bold 96px Inter, system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(scoreStr, scoreX, scoreY)

      ctx.font = '52px Inter, system-ui, -apple-system, sans-serif'
      ctx.fillStyle = MUTED
      ctx.fillText(totalStr, scoreX + scoreW, scoreY + 18)

      // --- percentage ---
      ctx.fillStyle = ACCENT
      ctx.font = 'bold 32px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(`${pct}%`, SIZE / 2, scoreY + 110)

      // --- album grid 2x2 ---
      const albumSize = 210
      const gap = 20
      const gridW = albumSize * 2 + gap
      const gridX = (SIZE - gridW) / 2
      const gridY = scoreY + 160

      for (let i = 0; i < 4; i++) {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = gridX + col * (albumSize + gap)
        const y = gridY + row * (albumSize + gap)
        drawAlbumCover(ctx, albumImgs[i], x, y, albumSize)
      }

      // --- difficulty badge ---
      const diffBadgeY = scoreY + 118
      const diffText = `${diff.label}`
      ctx.font = 'bold 22px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const badgeW = ctx.measureText(diffText).width + 36
      const badgeH = 36
      const badgeBx = SIZE / 2 - badgeW / 2
      const badgeBg = difficulty === 'hard' ? 'rgba(239,68,68,0.15)' : difficulty === 'easy' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'
      const badgeBorder = difficulty === 'hard' ? '#EF4444' : difficulty === 'easy' ? '#22C55E' : '#EAB308'
      roundRect(ctx, badgeBx, diffBadgeY, badgeW, badgeH, 8)
      ctx.fillStyle = badgeBg
      ctx.fill()
      ctx.strokeStyle = badgeBorder
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = badgeBorder
      ctx.fillText(diffText, SIZE / 2, diffBadgeY + badgeH / 2)

      // --- Hooklane wordmark ---
      const wmY = SIZE - 90
      ctx.font = 'bold 44px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const hookTxt = 'Hook'
      const laneTxt = 'lane'
      const fullWm = ctx.measureText(hookTxt + laneTxt).width
      const hookW = ctx.measureText(hookTxt).width
      const wmX = (SIZE - fullWm) / 2

      ctx.fillStyle = ACCENT
      ctx.fillText(hookTxt, wmX, wmY)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(laneTxt, wmX + hookW, wmY)

      // --- site URL ---
      ctx.font = '22px Inter, system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = MUTED
      ctx.fillText('hooklane.vercel.app', SIZE / 2, wmY + 52)

      // generate blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))

      // draw preview
      const preview = previewCanvasRef.current
      if (preview) {
        const pctx = preview.getContext('2d')
        if (pctx) {
          pctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE)
          pctx.drawImage(canvas, 0, 0, SIZE, SIZE, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE)
        }
      }

      setGenerated(true)
      return blob
    } finally {
      generatingRef.current = false
      setGenerating(false)
    }
  }, [score, totalRounds, selectedArtist, rounds])

  useImperativeHandle(ref, () => ({ generate }))

  // auto-generate on mount
  useEffect(() => {
    generate()
  }, [generate])

  const _handleDownload = useCallback(async () => {
    const blob = await generate()
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hooklane-${(selectedArtist?.name || 'artist').replace(/\s+/g, '-').toLowerCase()}-${score}-${totalRounds}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generate, selectedArtist, score, totalRounds])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <canvas
        ref={previewCanvasRef}
        width={PREVIEW_SIZE}
        height={PREVIEW_SIZE}
        role="img"
        aria-label={`Quiz score: ${score}/${totalRounds} for ${selectedArtist?.name || 'artist'}`}
        style={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          borderRadius: 8,
          border: '1px solid var(--border)',
          display: 'block',
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!generated && !generating && (
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>Preview generating...</div>
      )}
      {generating && (
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>Generating...</div>
      )}
    </div>
  )
})

export default ShareCard
