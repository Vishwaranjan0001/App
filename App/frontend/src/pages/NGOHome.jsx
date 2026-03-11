import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../utils/auth'

/* ─── Styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0e1a10;
    --bg2:      #152118;
    --bg3:      #1c2e1e;
    --bg4:      #223426;
    --border:   rgba(255,255,255,0.13);
    --gold:     #d4a843;
    --gold-dim: rgba(212,168,67,0.13);
    --green:    #2d6a4f;
    --green-lt: #6abf8e;
    --text:     #eeeae0;
    --muted:    rgba(238,234,224,0.62);
    --danger:   #e06060;
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

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    animation: grain 0.4s steps(1) infinite;
  }
  @keyframes grain {
    0%   { background-position: 0 0; }
    25%  { background-position: -40px 20px; }
    50%  { background-position: 30px -30px; }
    75%  { background-position: -60px 50px; }
    100% { background-position: 10px -10px; }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Nav ── */
  .ng-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 60px;
    background: rgba(14,26,16,0.94);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .ng-nav-logo {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gold);
    cursor: pointer;
  }
  .ng-nav-logo span { color: var(--green-lt); font-style: italic; }
  .ng-nav-links { display: flex; align-items: center; gap: 12px; }
  .ng-nav-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 9px 20px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    transition: border-color 0.25s, color 0.25s;
  }
  .ng-nav-btn:hover { border-color: var(--green-lt); color: var(--green-lt); }
  .ng-nav-logout {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.25s;
  }
  .ng-nav-logout:hover { color: var(--danger); }

  /* ── Page ── */
  .ng-page {
    position: relative;
    z-index: 1;
    padding-top: 88px;
    min-height: 100vh;
  }

  /* ── Header band ── */
  .ng-header {
    background: linear-gradient(135deg, #1c3a2a 0%, #102518 60%, #1c3a2a 100%);
    border-bottom: 1px solid var(--border);
    padding: 60px 60px 56px;
    position: relative;
    overflow: hidden;
  }
  .ng-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%232d6a4f' fill-opacity='0.09'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8; pointer-events: none;
  }
  .ng-header::after {
    content: '';
    position: absolute;
    right: -80px; top: -80px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .ng-header-inner {
    position: relative; z-index: 1;
    max-width: 1080px; margin: 0 auto;
  }
  .ng-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 16px;
    opacity: 0;
    animation: fadeUp 0.6s 0.1s forwards;
  }
  .ng-title {
    font-family: 'Lora', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 14px;
    text-shadow: 0 3px 24px rgba(0,0,0,0.55);
    opacity: 0;
    animation: fadeUp 0.6s 0.2s forwards;
  }
  .ng-title em { font-style: italic; color: var(--gold); }
  .ng-subtitle {
    font-size: 16px;
    line-height: 1.75;
    color: var(--muted);
    max-width: 560px;
    opacity: 0;
    animation: fadeUp 0.6s 0.32s forwards;
  }

  /* ── Body layout ── */
  .ng-body {
    max-width: 1080px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    align-items: start;
  }

  /* ── Section label ── */
  .ng-section-eyebrow {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 6px;
  }
  .ng-section-title {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.2px;
    margin-bottom: 24px;
  }
  .ng-section-title em { font-style: italic; color: var(--gold); }

  /* ── Add form card ── */
  .ng-form-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-top: 2px solid var(--gold);
    margin-bottom: 40px;
    animation: fadeUp 0.5s 0.25s both;
  }
  .ng-form-head {
    padding: 22px 28px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ng-form-head-icon { font-size: 16px; }
  .ng-form-head-title {
    font-family: 'Lora', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
  }
  .ng-form-body { padding: 28px; }
  .ng-form-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 28px;
  }

  /* ── Form fields ── */
  .ng-field { margin-bottom: 22px; }
  .ng-label {
    display: block;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 9px;
  }
  .ng-input, .ng-select, .ng-textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 2px;
    padding: 12px 14px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s, background 0.25s;
    appearance: none;
  }
  .ng-input:focus, .ng-select:focus, .ng-textarea:focus {
    border-color: var(--green-lt);
    background: rgba(106,191,142,0.06);
  }
  .ng-input::placeholder, .ng-textarea::placeholder { color: rgba(238,234,224,0.28); }
  .ng-select option { background: #1c2e1e; color: var(--text); }
  .ng-textarea { min-height: 90px; resize: vertical; line-height: 1.6; }

  /* Category chips row */
  .ng-cat-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 0;
  }
  .ng-cat-chip {
    padding: 7px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 40px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .ng-cat-chip:hover { border-color: var(--green-lt); color: var(--green-lt); }
  .ng-cat-chip.selected {
    background: rgba(106,191,142,0.13);
    border-color: var(--green-lt);
    color: var(--green-lt);
  }

  /* Submit button */
  .ng-submit {
    width: 100%;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 14px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .ng-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .ng-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Message banner ── */
  .ng-banner {
    padding: 13px 18px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 2px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-left: 3px solid;
  }
  .ng-banner.success {
    background: rgba(106,191,142,0.1);
    border-color: var(--green-lt);
    color: var(--green-lt);
  }
  .ng-banner.error {
    background: rgba(224,96,96,0.1);
    border-color: var(--danger);
    color: var(--danger);
  }

  /* ── Wishlist list ── */
  .ng-wishlist-section { animation: fadeUp 0.5s 0.35s both; }

  .ng-wishlist-grid { display: grid; gap: 12px; }

  .ng-wish-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 20px 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: border-color 0.25s, background 0.25s;
    animation: fadeUp 0.4s ease both;
  }
  .ng-wish-card:hover { border-color: rgba(255,255,255,0.22); background: var(--bg4); }

  .ng-wish-icon-wrap {
    width: 44px; height: 44px;
    background: var(--bg4);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    border-radius: 2px;
    transition: border-color 0.25s;
  }
  .ng-wish-card:hover .ng-wish-icon-wrap { border-color: var(--green-lt); }

  .ng-wish-body { flex: 1; min-width: 0; }
  .ng-wish-category {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--green-lt);
    margin-bottom: 7px;
  }
  .ng-wish-url {
    font-size: 14px;
    color: var(--muted);
    word-break: break-all;
    line-height: 1.6;
  }
  .ng-wish-url a {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(212,168,67,0.25);
    transition: color 0.2s, border-color 0.2s;
  }
  .ng-wish-url a:hover { color: var(--text); border-color: var(--text); }

  /* ── Sidebar cards ── */
  .ng-sidebar { display: flex; flex-direction: column; gap: 20px; }

  .ng-info-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-top: 2px solid var(--green-lt);
    padding: 26px 24px;
    animation: fadeUp 0.5s 0.3s both;
  }
  .ng-info-card-title {
    font-family: 'Lora', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 16px;
  }
  .ng-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ng-info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .ng-info-row:first-of-type { padding-top: 0; }
  .ng-info-key { font-size: 12px; color: var(--muted); font-weight: 500; }
  .ng-info-val { font-size: 13px; color: var(--text); font-weight: 700; }
  .ng-info-val.green { color: var(--green-lt); }
  .ng-info-val.gold  { color: var(--gold); }

  /* Tips card */
  .ng-tips-card {
    background: rgba(45,106,79,0.1);
    border: 1px solid rgba(106,191,142,0.2);
    padding: 24px;
    animation: fadeUp 0.5s 0.45s both;
  }
  .ng-tips-card-title {
    font-family: 'Lora', serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--green-lt);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ng-tip {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }
  .ng-tip:last-child { margin-bottom: 0; }
  .ng-tip-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green-lt);
    margin-top: 7px;
    flex-shrink: 0;
  }

  /* Quick actions */
  .ng-actions-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 24px;
    animation: fadeUp 0.5s 0.5s both;
  }
  .ng-actions-title {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
    margin-bottom: 14px;
  }
  .ng-action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 13px 16px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 2px;
    margin-bottom: 8px;
    text-align: left;
    transition: border-color 0.25s, background 0.25s, color 0.25s;
  }
  .ng-action-btn:last-child { margin-bottom: 0; }
  .ng-action-btn:hover { border-color: var(--green-lt); background: rgba(106,191,142,0.06); color: var(--green-lt); }
  .ng-action-btn-icon { font-size: 16px; line-height: 1; }
  .ng-action-btn-arrow { margin-left: auto; font-size: 14px; opacity: 0.5; }

  /* ── Empty wishlist ── */
  .ng-empty {
    text-align: center;
    padding: 56px 32px;
    background: var(--bg3);
    border: 1px dashed rgba(255,255,255,0.12);
  }
  .ng-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.45; }
  .ng-empty-text {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
  }

  /* ── Loading state ── */
  .ng-state {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
  }
  .ng-spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--green-lt);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .ng-state-text {
    font-size: 12px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .ng-nav { padding: 18px 24px; }
    .ng-header { padding: 44px 24px 40px; }
    .ng-body {
      grid-template-columns: 1fr;
      padding: 32px 24px 60px;
      gap: 24px;
    }
    .ng-sidebar { order: -1; }
    .ng-cat-row { gap: 6px; }
  }
`

/* ── Category map ── */
const CATEGORIES = [
  { value: 'food',      label: 'Food & Groceries',       icon: '🥗' },
  { value: 'medical',   label: 'Medical Supplies',        icon: '💊' },
  { value: 'education', label: 'Educational Materials',   icon: '📚' },
  { value: 'clothing',  label: 'Clothing & Shoes',        icon: '👕' },
  { value: 'bedding',   label: 'Bedding & Blankets',      icon: '🛏️' },
  { value: 'utensils',  label: 'Kitchen Utensils',        icon: '🍳' },
  { value: 'other',     label: 'Other',                   icon: '📦' },
]

function getCatMeta(value) {
  return CATEGORIES.find(c => c.value === value) || { label: value, icon: '📦' }
}

/* ═══════════════════════════════════════════════════ */
export default function NGOHome() {
  const nav = useNavigate()
  const [wishlistUrl, setWishlistUrl] = useState('')
  const [category, setCategory]       = useState('food')
  const [wishlists, setWishlists]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [message, setMessage]         = useState(null)
  const [msgType, setMsgType]         = useState('success')

  useEffect(() => {
    const token = getToken()
    if (!token) { nav('/login'); return }
    fetchWishlists()
  }, [nav])

  async function fetchWishlists() {
    try {
      const token = getToken()
      const res   = await fetch('http://localhost:5000/api/ngo/wishlists', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setWishlists(data || [])
    } catch {}
    setLoading(false)
  }

  async function addWishlist(e) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)
    try {
      const token = getToken()
      const res   = await fetch('http://localhost:5000/api/ngo/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: category, url: wishlistUrl })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsgType('error')
        setMessage(data.message || 'Failed to add wishlist item')
      } else {
        setMsgType('success')
        setMessage('Wishlist item added successfully!')
        setWishlistUrl('')
        setCategory('food')
        setWishlists(data.wishlists || [])
        setTimeout(() => setMessage(null), 3500)
      }
    } catch { setMsgType('error'); setMessage('Network error') }
    setSubmitting(false)
  }

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="ng-state">
        <div className="ng-spinner" />
        <p className="ng-state-text">Loading your dashboard</p>
      </div>
    </>
  )

  /* ── Category breakdown for sidebar ── */
  const catCounts = CATEGORIES.map(c => ({
    ...c,
    count: wishlists.filter(w => w.title === c.value).length
  })).filter(c => c.count > 0)

  // logout helper (similar to App.jsx global nav)
  function handleLogout() {
    localStorage.removeItem('auth')
    nav('/login')
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Nav ── */}
      <nav className="ng-nav">
        <div className="ng-nav-logo" onClick={() => nav('/')}>Food<span>Bridge</span></div>
        <div className="ng-nav-links">
          <button className="ng-nav-btn" onClick={() => nav('/donations')}>Browse Donations</button>
          <button className="ng-nav-btn" onClick={() => nav('/')}>← Home</button>
        </div>
        <button className="ng-nav-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="ng-page">

        {/* ── Header ── */}
        <div className="ng-header">
          <div className="ng-header-inner">
            <p className="ng-eyebrow">💛 NGO Partner Program</p>
            <h1 className="ng-title">Manage Your <em>Needs</em></h1>
            <p className="ng-subtitle">
              Share your organisation's requirements with donors. Build a transparent wishlist so the right resources reach you faster.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ng-body">

          {/* ── Left column ── */}
          <div>

            {/* Add form */}
            <div className="ng-form-card">
              <div className="ng-form-head">
                <span className="ng-form-head-icon">➕</span>
                <span className="ng-form-head-title">Add a Wishlist Item</span>
              </div>
              <div className="ng-form-body">
                <p className="ng-form-desc">
                  Post items or resources your organisation needs. Donors browse these and can fulfil them directly.
                </p>

                {message && (
                  <div className={`ng-banner ${msgType}`}>
                    <span>{msgType === 'success' ? '✓' : '!'}</span>
                    {message}
                  </div>
                )}

                <form onSubmit={addWishlist}>
                  <div className="ng-field">
                    <label className="ng-label">Category</label>
                    <div className="ng-cat-row">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          className={`ng-cat-chip${category === c.value ? ' selected' : ''}`}
                          onClick={() => setCategory(c.value)}
                        >
                          {c.icon} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ng-field">
                    <label className="ng-label">Link or Description</label>
                    <textarea
                      className="ng-textarea"
                      value={wishlistUrl}
                      onChange={e => setWishlistUrl(e.target.value)}
                      placeholder="Paste a product link, Amazon wishlist URL, or describe what you need in detail…"
                      required
                    />
                  </div>

                  <button type="submit" className="ng-submit" disabled={submitting}>
                    {submitting ? 'Adding…' : '+ Add to Wishlist'}
                  </button>
                </form>
              </div>
            </div>

            {/* Wishlist items */}
            <div className="ng-wishlist-section">
              <p className="ng-section-eyebrow">Your Requests</p>
              <h2 className="ng-section-title">
                Current <em>Wishlist</em>
                {wishlists.length > 0 && (
                  <span style={{ fontSize:14, color:'var(--muted)', fontFamily:'Source Sans 3,sans-serif', fontStyle:'normal', fontWeight:500, marginLeft:10 }}>
                    ({wishlists.length} {wishlists.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>

              {wishlists.length === 0 ? (
                <div className="ng-empty">
                  <div className="ng-empty-icon">📋</div>
                  <p className="ng-empty-text">No wishlist items yet.<br/>Add your first item above to let donors know what you need.</p>
                </div>
              ) : (
                <div className="ng-wishlist-grid">
                  {wishlists.map((w, i) => {
                    const meta = getCatMeta(w.title)
                    const isUrl = w.url && (w.url.startsWith('http://') || w.url.startsWith('https://'))
                    return (
                      <div
                        key={i}
                        className="ng-wish-card"
                        style={{ animationDelay: `${0.06 * i}s` }}
                      >
                        <div className="ng-wish-icon-wrap">{meta.icon}</div>
                        <div className="ng-wish-body">
                          <span className="ng-wish-category">{meta.label}</span>
                          <div className="ng-wish-url">
                            {isUrl
                              ? <a href={w.url} target="_blank" rel="noopener noreferrer">{w.url}</a>
                              : w.url
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="ng-sidebar">

            {/* Stats card */}
            <div className="ng-info-card">
              <div className="ng-info-card-title">Dashboard Overview</div>
              <div className="ng-info-row">
                <span className="ng-info-key">Total items</span>
                <span className="ng-info-val gold">{wishlists.length}</span>
              </div>
              {catCounts.map(c => (
                <div className="ng-info-row" key={c.value}>
                  <span className="ng-info-key">{c.icon} {c.label}</span>
                  <span className="ng-info-val green">{c.count}</span>
                </div>
              ))}
              {wishlists.length === 0 && (
                <div className="ng-info-row">
                  <span className="ng-info-key">Status</span>
                  <span className="ng-info-val" style={{ color:'var(--muted)' }}>No items yet</span>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="ng-tips-card">
              <div className="ng-tips-card-title">
                <span>💡</span> Tips for Better Reach
              </div>
              {[
                'Be specific — mention quantity, size, or brand if relevant.',
                'Paste direct product links so donors can act immediately.',
                'Update your list regularly to reflect current needs.',
                'Prioritise urgent items by adding them first.',
              ].map((tip, i) => (
                <div key={i} className="ng-tip">
                  <span className="ng-tip-dot" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="ng-actions-card">
              <div className="ng-actions-title">Quick Actions</div>
              <button className="ng-action-btn" onClick={() => nav('/donations')}>
                <span className="ng-action-btn-icon">🍲</span>
                Browse Available Donations
                <span className="ng-action-btn-arrow">→</span>
              </button>
              <button className="ng-action-btn" onClick={() => nav('/')}>
                <span className="ng-action-btn-icon">🏠</span>
                Back to Home
                <span className="ng-action-btn-arrow">→</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}