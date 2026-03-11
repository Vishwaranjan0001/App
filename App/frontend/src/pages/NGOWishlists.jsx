import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, getAuth } from '../utils/auth'

/* ─── Injected styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0e1a10;
    --bg2:       #152118;
    --bg3:       #1c2e1e;
    --surface:   rgba(255,255,255,0.07);
    --border:    rgba(255,255,255,0.13);
    --gold:      #d4a843;
    --gold-dim:  rgba(212,168,67,0.15);
    --green:     #2d6a4f;
    --green-lt:  #6abf8e;
    --text:      #eeeae0;
    --muted:     rgba(238,234,224,0.65);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Grain overlay ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.032;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    animation: grainShift 0.4s steps(1) infinite;
  }
  @keyframes grainShift {
    0%   { background-position: 0 0; }
    25%  { background-position: -50px 20px; }
    50%  { background-position: 30px -40px; }
    75%  { background-position: -70px 60px; }
    100% { background-position: 10px -10px; }
  }

  /* ── Canvas ── */
  #particle-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.22;
  }

  /* ── Nav ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 60px;
    background: rgba(13,26,14,0.85);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Lora', serif;
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--gold);
    cursor: pointer;
  }
  .nav-logo span { color: var(--green-lt); font-style: italic; }
  .nav-back {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 500;
    transition: color 0.25s;
  }
  .nav-back:hover { color: var(--green-lt); }
  .nav-back-arrow { font-size: 16px; transition: transform 0.25s; }
  .nav-back:hover .nav-back-arrow { transform: translateX(-3px); }

  /* ── Page ── */
  .page {
    position: relative;
    z-index: 1;
    padding-top: 100px;
    min-height: 100vh;
  }

  /* ── Page header ── */
  .page-header {
    padding: 64px 60px 52px;
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .page-header::after {
    content: '';
    position: absolute;
    top: -120px; right: -80px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,106,79,0.12) 0%, transparent 65%);
    pointer-events: none;
  }
  /* subtle dot grid */
  .page-header::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 320px; height: 100%;
    background-image: radial-gradient(circle, rgba(212,168,67,0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .header-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 18px;
    opacity: 0;
    animation: fadeUp 0.7s 0.1s forwards;
  }
  .header-title {
    font-family: 'Lora', serif;
    font-size: clamp(32px, 4.5vw, 56px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 16px;
    opacity: 0;
    animation: fadeUp 0.8s 0.2s forwards;
  }
  .header-title em { font-style: italic; color: var(--gold); }
  .header-desc {
    font-size: 16px;
    line-height: 1.75;
    color: var(--muted);
    max-width: 520px;
    opacity: 0;
    animation: fadeUp 0.8s 0.35s forwards;
  }

  /* ── Content area ── */
  .content {
    max-width: 1160px;
    margin: 0 auto;
    padding: 56px 60px 100px;
  }

  /* ── NGO count badge ── */
  .results-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    opacity: 0;
    animation: fadeUp 0.7s 0.5s forwards;
  }
  .results-count {
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }
  .results-count strong { color: var(--gold); font-family: 'Lora', serif; font-size: 16px; }
  .results-tag {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--green-lt);
    border: 1px solid rgba(106,191,142,0.3);
    padding: 5px 14px;
    font-weight: 600;
    background: rgba(106,191,142,0.06);
  }

  /* ── NGO group card ── */
  .ngo-group {
    margin-bottom: 32px;
    border: 1px solid var(--border);
    background: var(--bg3);
    overflow: hidden;
    opacity: 0;
    animation: fadeUp 0.7s forwards;
    width: fit-content;
    max-width: 100%;
  }

  /* ── NGO group header ── */
  .ngo-header {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    padding: 28px 36px;
    border-bottom: 1px solid var(--border);
    background: rgba(28,46,30,0.6);
    cursor: pointer;
    transition: background 0.3s;
    user-select: none;
  }
  .ngo-header:hover { background: rgba(45,106,79,0.2); }

  .ngo-header-left { display: flex; align-items: center; gap: 20px; }

  .ngo-avatar {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--green), rgba(212,168,67,0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.15);
  }

  .ngo-name-wrap { display: flex; flex-direction: column; gap: 4px; }
  .ngo-name {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.2px;
  }
  .ngo-meta {
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  .ngo-header-right { display: flex; align-items: center; gap: 16px; }
  .item-count-badge {
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid rgba(212,168,67,0.3);
    padding: 5px 14px;
    background: var(--gold-dim);
    font-weight: 600;
    white-space: nowrap;
  }
  .chevron {
    color: var(--muted);
    font-size: 18px;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), color 0.2s;
  }
  .chevron.open { transform: rotate(180deg); color: var(--green-lt); }

  /* ── Accordion body ── */
  .ngo-body {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.22,1,0.36,1),
                opacity 0.35s ease;
    max-height: 0;
    opacity: 0;
  }
  .ngo-body.open {
    max-height: 2000px;
    opacity: 1;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, auto));
    gap: 20px;
    padding: 0;
  }

  /* ── Wishlist item ── */
  .wishlist-item {
    background: linear-gradient(135deg, rgba(45,106,79,0.15) 0%, rgba(28,46,30,0.1) 100%);
    border: 1px solid rgba(106,191,142,0.3);
    padding: 24px 28px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .wishlist-item::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at top-right, rgba(212,168,67,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .wishlist-item:hover { 
    background: linear-gradient(135deg, rgba(45,106,79,0.25) 0%, rgba(28,46,30,0.15) 100%);
    border-color: rgba(106,191,142,0.6);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }

  .item-icon {
    width: 48px; height: 48px;
    border: 1px solid rgba(106,191,142,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: rgba(106,191,142,0.1);
    flex-shrink: 0;
    border-radius: 6px;
  }

  .item-title {
    font-family: 'Lora', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.4;
    letter-spacing: -0.1px;
  }

  .item-url-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    background: rgba(106,191,142,0.08);
    border: 1px solid rgba(106,191,142,0.3);
    border-radius: 4px;
    overflow: hidden;
  }
  .item-url-icon { font-size: 12px; flex-shrink: 0; opacity: 0.6; }
  .item-url {
    font-size: 12px;
    color: var(--green-lt);
    text-decoration: none;
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
    font-weight: 500;
  }
  .item-url:hover { color: var(--gold); }

  .item-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(212,168,67,0.25);
    padding: 8px 16px;
    background: var(--gold-dim);
    transition: background 0.25s, border-color 0.25s, transform 0.2s;
    align-self: flex-start;
    margin-top: 4px;
  }
  .item-cta:hover {
    background: rgba(212,168,67,0.25);
    border-color: var(--gold);
    transform: translateY(-1px);
  }
  .item-cta-arrow { transition: transform 0.2s; }
  .item-cta:hover .item-cta-arrow { transform: translateX(3px); }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 100px 40px;
    border: 1px solid var(--border);
    background: var(--bg3);
    opacity: 0;
    animation: fadeUp 0.7s 0.5s forwards;
  }
  .empty-icon { font-size: 52px; margin-bottom: 24px; display: block; opacity: 0.6; }
  .empty-title {
    font-family: 'Lora', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }
  .empty-desc { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 360px; margin: 0 auto; }

  /* ── Loading skeleton ── */
  .skeleton-group { margin-bottom: 32px; }
  .skeleton-header {
    height: 96px;
    background: var(--bg3);
    border: 1px solid var(--border);
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
  }
  .skeleton-body {
    height: 160px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-top: none;
    position: relative;
    overflow: hidden;
  }
  .skeleton-header::after,
  .skeleton-body::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
    animation: shimmer 1.8s infinite;
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* ── Error state ── */
  .error-state {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 28px 32px;
    background: rgba(224,96,96,0.08);
    border: 1px solid rgba(224,96,96,0.25);
    border-left: 3px solid #e06060;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 0.6s 0.3s forwards;
  }
  .error-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
  .error-text { font-size: 14px; color: #e09090; line-height: 1.6; }
  .error-title { font-weight: 600; color: #e06060; margin-bottom: 4px; font-size: 15px; }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid var(--border);
    padding: 32px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  .footer-logo { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; color: var(--gold); }
  .footer-copy { font-size: 12px; color: var(--muted); letter-spacing: 0.5px; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @media (max-width: 900px) {
    .nav { padding: 18px 24px; }
    .page-header { padding: 48px 24px 40px; }
    .content { padding: 40px 24px 80px; }
    .ngo-header { padding: 20px 20px; }
    .items-grid { grid-template-columns: 1fr; }
    .footer { flex-direction: column; gap: 10px; text-align: center; padding: 28px 24px; }
  }
`

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, particles, raf
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    const Particle = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.22 - 0.06,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? '#52b788' : '#e8a838'
    })
    resize()
    particles = Array.from({ length: 90 }, Particle)
    window.addEventListener('resize', resize)
    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.hue; ctx.globalAlpha = p.alpha; ctx.fill()
      })
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas id="particle-canvas" ref={canvasRef} />
}

/* ─── NGO initials avatar helper ─── */
function ngoInitialEmoji(name = '') {
  const emojis = ['🏠', '🤝', '🌱', '💚', '🕊️', '🌿', '🫶', '🏡']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return emojis[Math.abs(hash) % emojis.length]
}

/* ─── Collapsible NGO group ─── */
function NGOGroup({ group, animDelay }) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className="ngo-group"
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* Header */}
      <div className="ngo-header" onClick={() => setOpen(v => !v)}>
        <div className="ngo-header-left">
          <div className="ngo-avatar">{ngoInitialEmoji(group.ngo)}</div>
          <div className="ngo-name-wrap">
            <span className="ngo-name">{group.ngo || 'Unknown NGO'}</span>
            <span className="ngo-meta">NGO Partner · Verified</span>
          </div>
        </div>
        <div className="ngo-header-right">
          <span className="item-count-badge">
            {group.items.length} {group.items.length === 1 ? 'Need' : 'Needs'}
          </span>
          <span className={`chevron${open ? ' open' : ''}`}>▾</span>
        </div>
      </div>

      {/* Body */}
      <div className={`ngo-body${open ? ' open' : ''}`}>
        <div className="items-grid">
          {group.items.map((item, idx) => (
            <div className="wishlist-item" key={idx}>
              <div className="item-icon">📦</div>
              <div className="item-title">{item.title || 'Untitled Item'}</div>
              {item.url && (
                <div className="item-url-wrap">
                  <span className="item-url-icon">🔗</span>
                  <a
                    className="item-url"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.url}
                  >
                    {item.url}
                  </a>
                </div>
              )}
              {item.url && (
                <a
                  className="item-cta"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fulfill Need
                  <span className="item-cta-arrow">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════ */
export default function NGOWishlists() {
  const nav = useNavigate()
  const auth = getAuth()
  const [wishlists, setWishlists] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token || auth?.role !== 'donor') { nav('/login'); return }

    async function fetchWishlists() {
      try {
        const res  = await fetch('http://localhost:5000/api/ngo/wishlists', {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) setError(data.message || 'Unable to fetch wishlists')
        else setWishlists(data || [])
      } catch { setError('Network error — please check your connection.') }
      setLoading(false)
    }
    fetchWishlists()
  }, [nav, auth])

  /* Group by NGO */
  const grouped = wishlists.reduce((acc, item) => {
    const existing = acc.find(g => g.ngoId === item.ngoId)
    if (existing) existing.items.push(item)
    else acc.push({ ngo: item.ngo, ngoId: item.ngoId, items: [item] })
    return acc
  }, [])

  const totalNeeds = wishlists.length

  return (
    <>
      <style>{STYLES}</style>
      <ParticleCanvas />

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => nav('/')}>Food<span>Bridge</span></div>
        <button className="nav-back" onClick={() => nav('/')}>
          <span className="nav-back-arrow">←</span>
          Back to Home
        </button>
      </nav>

      <div className="page">

        {/* ── Page Header ── */}
        <div className="page-header">
          <p className="header-eyebrow">❤️ NGO Network · Donor View</p>
          <h1 className="header-title">
             In-Kind<em> Donations</em>
          </h1>
          <p className="header-desc">
            Support NGOs in our network by fulfilling their resource needs.
            Every item you contribute directly helps families, shelters, and communities.
          </p>
        </div>

        {/* ── Main Content ── */}
        <div className="content">

          {/* Loading skeletons */}
          {loading && (
            <>
              {[0, 1, 2].map(i => (
                <div className="skeleton-group" key={i}>
                  <div className="skeleton-header" />
                  <div className="skeleton-body" />
                </div>
              ))}
            </>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <div>
                <div className="error-title">Unable to load wishlists</div>
                <div className="error-text">{error}</div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && wishlists.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3 className="empty-title">No requirements yet</h3>
              <p className="empty-desc">
                NGO partners haven't posted any needs at the moment.
                Check back soon — new requests are added regularly.
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && wishlists.length > 0 && (
            <>
              <div className="results-meta">
                <span className="results-count">
                  <strong>{grouped.length}</strong> &nbsp;NGO{grouped.length !== 1 ? 's' : ''} &nbsp;·&nbsp; <strong>{totalNeeds}</strong> &nbsp;total need{totalNeeds !== 1 ? 's' : ''}
                </span>
                <span className="results-tag">🟢 Live</span>
              </div>

              {grouped.map((group, i) => (
                <NGOGroup
                  key={group.ngoId}
                  group={group}
                  animDelay={0.1 + i * 0.08}
                />
              ))}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-logo">FoodBridge</div>
          <div className="footer-copy">© 2026 · Fighting hunger, one meal at a time.</div>
        </footer>
      </div>
    </>
  )
}