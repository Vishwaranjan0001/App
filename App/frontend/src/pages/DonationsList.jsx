import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, getAuth } from '../utils/auth'

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

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Nav ── */
  .dl-nav {
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
  .dl-nav-logo {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gold);
    cursor: pointer;
    letter-spacing: 0.2px;
  }
  .dl-nav-logo span { color: var(--green-lt); font-style: italic; }
  .dl-nav-right { display: flex; align-items: center; gap: 14px; }
  .dl-nav-btn {
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
  .dl-nav-btn:hover { border-color: var(--green-lt); color: var(--green-lt); }
  .dl-nav-btn.primary {
    background: var(--gold);
    color: #0d1a0e;
    border-color: var(--gold);
    font-weight: 700;
  }
  .dl-nav-btn.primary:hover { opacity: 0.88; color: #0d1a0e; border-color: var(--gold); }

  /* ── Page ── */
  .dl-page {
    position: relative;
    z-index: 1;
    padding-top: 88px;
    min-height: 100vh;
  }

  /* ── Header band ── */
  .dl-header {
    background: linear-gradient(135deg, #1c3a2a 0%, #102518 60%, #1c3a2a 100%);
    border-bottom: 1px solid var(--border);
    padding: 52px 60px 48px;
    position: relative;
    overflow: hidden;
  }
  .dl-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%232d6a4f' fill-opacity='0.09'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8; pointer-events: none;
  }
  .dl-header::after {
    content: '';
    position: absolute;
    right: -80px; top: -80px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 65%);
    pointer-events: none;
  }
  .dl-header-inner {
    position: relative; z-index: 1;
    max-width: 1140px; margin: 0 auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .dl-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 12px;
    opacity: 0;
    animation: fadeUp 0.6s 0.1s forwards;
  }
  .dl-title {
    font-family: 'Lora', serif;
    font-size: clamp(26px, 3.5vw, 46px);
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.1;
    color: var(--text);
    text-shadow: 0 3px 24px rgba(0,0,0,0.55);
    opacity: 0;
    animation: fadeUp 0.6s 0.2s forwards;
  }
  .dl-title em { font-style: italic; color: var(--gold); }
  .dl-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    background: rgba(106,191,142,0.1);
    border: 1px solid rgba(106,191,142,0.25);
    border-radius: 2px;
    font-size: 13px;
    font-weight: 600;
    color: var(--green-lt);
    letter-spacing: 0.5px;
    white-space: nowrap;
    opacity: 0;
    animation: fadeUp 0.6s 0.3s forwards;
  }

  /* ── Filters bar ── */
  .dl-filters {
    max-width: 1140px;
    margin: 0 auto;
    padding: 22px 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
  }
  .dl-filter-label {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
    margin-right: 4px;
  }
  .dl-filter-chip {
    padding: 7px 18px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 40px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: all 0.2s;
  }
  .dl-filter-chip:hover { border-color: var(--green-lt); color: var(--green-lt); }
  .dl-filter-chip.active {
    background: rgba(106,191,142,0.12);
    border-color: var(--green-lt);
    color: var(--green-lt);
  }
  .dl-filter-chip.active-gold {
    background: var(--gold-dim);
    border-color: rgba(212,168,67,0.4);
    color: var(--gold);
  }
  .dl-search-wrap {
    margin-left: auto;
    position: relative;
  }
  .dl-search-icon {
    position: absolute;
    left: 13px; top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    pointer-events: none;
  }
  .dl-search {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 9px 14px 9px 36px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    color: var(--text);
    width: 220px;
    outline: none;
    transition: border-color 0.25s;
  }
  .dl-search:focus { border-color: var(--green-lt); }
  .dl-search::placeholder { color: rgba(238,234,224,0.3); }

  /* ── Main grid ── */
  .dl-body {
    max-width: 1140px;
    margin: 0 auto;
    padding: 36px 60px 80px;
  }

  /* ── Stats row ── */
  .dl-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 36px;
    animation: fadeUp 0.5s 0.3s both;
  }
  .dl-stat {
    background: var(--bg3);
    padding: 22px 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: background 0.25s;
  }
  .dl-stat:hover { background: var(--bg4); }
  .dl-stat-icon { font-size: 22px; line-height: 1; }
  .dl-stat-num {
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 3px;
  }
  .dl-stat-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  /* ── Donation card ── */
  .dl-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
    animation: fadeUp 0.4s ease both;
    display: flex;
    flex-direction: column;
  }
  .dl-card:hover {
    border-color: rgba(255,255,255,0.24);
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
  }
  .dl-card-top {
    padding: 26px 28px 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }
  .dl-card-food {
    font-family: 'Lora', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.2px;
    margin-bottom: 14px;
    line-height: 1.3;
    flex: 1;
  }
  .dl-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 13px;
    border-radius: 40px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .dl-status-pill.accepted {
    background: var(--gold-dim);
    border: 1px solid rgba(212,168,67,0.3);
    color: var(--gold);
  }
  .dl-status-pill.available {
    background: rgba(106,191,142,0.1);
    border: 1px solid rgba(106,191,142,0.28);
    color: var(--green-lt);
  }
  .dl-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    display: inline-block;
  }
  .accepted .dl-status-dot { background: var(--gold); }
  .available .dl-status-dot { background: var(--green-lt); box-shadow: 0 0 5px var(--green-lt); }

  .dl-card-meta {
    padding: 0 28px 22px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 20px;
  }
  .dl-meta-item {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .dl-meta-icon { font-size: 13px; line-height: 1; flex-shrink: 0; }
  .dl-meta-text { font-size: 13px; color: var(--muted); line-height: 1.4; }
  .dl-meta-text a {
    color: var(--green-lt);
    text-decoration: none;
    border-bottom: 1px solid rgba(106,191,142,0.25);
    transition: color 0.2s;
  }
  .dl-meta-text a:hover { color: var(--text); }

  /* ── Feedback strip ── */
  .dl-feedback-strip {
    border-top: 1px solid var(--border);
    padding: 16px 28px;
    background: rgba(255,255,255,0.02);
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: auto;
  }
  .dl-feedback-strip:hover { background: rgba(212,168,67,0.07); }
  .dl-feedback-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.5px;
  }
  .dl-feedback-stars {
    display: flex;
    gap: 2px;
    font-size: 12px;
  }
  .dl-feedback-thumbs {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .dl-thumb {
    width: 36px; height: 36px;
    object-fit: cover;
    border-radius: 2px;
    border: 1px solid var(--border);
  }
  .dl-thumb-more {
    width: 36px; height: 36px;
    background: var(--bg4);
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
  }

  /* ── Card grid ── */
  .dl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }

  /* ── Empty state ── */
  .dl-empty {
    text-align: center;
    padding: 100px 40px;
    animation: fadeUp 0.5s ease;
  }
  .dl-empty-icon { font-size: 56px; margin-bottom: 20px; opacity: 0.5; }
  .dl-empty-title {
    font-family: 'Lora', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12px;
  }
  .dl-empty-desc { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 380px; margin: 0 auto 32px; }
  .dl-empty-btn {
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 14px 32px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    border-radius: 2px;
    transition: opacity 0.2s;
  }
  .dl-empty-btn:hover { opacity: 0.88; }

  /* ── Feedback modal ── */
  .dl-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8,16,9,0.8);
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: 20px;
    animation: fadeIn 0.2s;
  }
  .dl-modal {
    background: #162419;
    border: 1px solid rgba(255,255,255,0.15);
    border-top: 2px solid var(--gold);
    width: 100%;
    max-width: 580px;
    max-height: 82vh;
    overflow-y: auto;
    padding: 0;
    position: relative;
    animation: modalSlide 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes modalSlide {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dl-modal-head {
    padding: 28px 32px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: #162419;
    z-index: 2;
  }
  .dl-modal-title {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
  }
  .dl-modal-close {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 2px;
    transition: color 0.2s, border-color 0.2s;
  }
  .dl-modal-close:hover { color: var(--text); border-color: var(--text); }
  .dl-modal-body { padding: 24px 32px 32px; display: flex; flex-direction: column; gap: 24px; }
  .dl-fb-item { padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  .dl-fb-item:last-child { border-bottom: none; padding-bottom: 0; }
  .dl-fb-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .dl-fb-name {
    font-family: 'Lora', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
  }
  .dl-fb-stars { font-size: 14px; display: flex; gap: 2px; }
  .dl-fb-comment {
    font-size: 14px;
    color: rgba(238,234,224,0.72);
    line-height: 1.75;
    margin-bottom: 14px;
  }
  .dl-fb-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
  }
  .dl-fb-img {
    width: 100%; height: 110px;
    object-fit: cover;
    border-radius: 2px;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
  }
  .dl-fb-img:hover { transform: scale(1.04); border-color: var(--green-lt); }

  /* ── States ── */
  .dl-state {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
  }
  .dl-spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--green-lt);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .dl-state-text {
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
    .dl-nav { padding: 18px 24px; }
    .dl-header { padding: 40px 24px 36px; }
    .dl-filters { padding: 16px 24px; }
    .dl-body { padding: 28px 24px 60px; }
    .dl-grid { grid-template-columns: 1fr; }
    .dl-stats-row { grid-template-columns: 1fr; }
    .dl-search-wrap { margin-left: 0; width: 100%; }
    .dl-search { width: 100%; }
    .dl-card-meta { grid-template-columns: 1fr; }
    .dl-modal-head { padding: 20px 20px 16px; }
    .dl-modal-body { padding: 20px 20px 24px; }
  }
`

function getGoogleMapsLink(location) {
  if (!location) return '#'
  return `https://www.google.com/maps?q=${location}`
}

/* ═══════════════════════════════════════════════════ */
export default function DonationsList() {
  const nav  = useNavigate()
  const auth = getAuth()

  const [donations, setDonations]             = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState(null)
  const [feedbacksMap, setFeedbacksMap]       = useState({})
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [filter, setFilter]                   = useState('all')
  const [search, setSearch]                   = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) { nav('/login'); return }

    async function fetchAll() {
      try {
        const res  = await fetch('http://localhost:5000/api/donation/', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) { setError(data.message || 'Unable to fetch donations') }
        else {
          setDonations(data || [])
          const map = {}
          for (const d of (data || [])) {
            try {
              const r = await fetch(`http://localhost:5000/api/feedback/donation/${d._id}`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
              })
              const fd = await r.json()
              if (r.ok) map[d._id] = fd
            } catch {}
          }
          setFeedbacksMap(map)
        }
      } catch { setError('Network error') }
      setLoading(false)
    }
    fetchAll()
  }, [nav])

  /* ── Derived data ── */
  const isNgo    = auth?.role === 'ngo'
  const title    = isNgo ? 'Accepted Donations' : 'My Donations'
  const emptyMsg = isNgo ? 'No donations accepted yet.' : 'No donations yet. Start donating!'

  const totalMeals    = donations.reduce((s, d) => s + (d.capacity || 0), 0)
  const acceptedCount = donations.filter(d => d.status).length
  const feedbackCount = Object.values(feedbacksMap).reduce((s, fb) => s + fb.length, 0)

  const filtered = donations.filter(d => {
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'accepted' ? d.status === true :
      filter === 'pending'  ? d.status === false : true
    const matchSearch = !search ||
      d.foodDesc?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  /* ── Loading / Error ── */
  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="dl-state">
        <div className="dl-spinner" />
        <p className="dl-state-text">Loading donations</p>
      </div>
    </>
  )

  if (error) return (
    <>
      <style>{STYLES}</style>
      <div className="dl-state">
        <p style={{ fontFamily:'Lora,serif', fontSize:18, color:'var(--danger)' }}>{error}</p>
      </div>
    </>
  )

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Nav ── */}
      <nav className="dl-nav">
        <div className="dl-nav-logo" onClick={() => nav('/')}>Food<span>Bridge</span></div>
        <div className="dl-nav-right">
          <button className="dl-nav-btn" onClick={() => nav('/')}>← Home</button>
          {!isNgo && (
            <button className="dl-nav-btn primary" onClick={() => nav('/')}>
              + Donate
            </button>
          )}
        </div>
      </nav>

      <div className="dl-page">

        {/* ── Header ── */}
        <div className="dl-header">
          <div className="dl-header-inner">
            <div>
              <p className="dl-eyebrow">🌾 {isNgo ? 'NGO Dashboard' : 'Donor Dashboard'}</p>
              <h1 className="dl-title">
                {isNgo ? <>Accepted <em>Donations</em></> : <>My <em>Donations</em></>}
              </h1>
            </div>
            <div className="dl-count-badge">
              <span>🍲</span>
              {donations.length} {donations.length === 1 ? 'donation' : 'donations'}
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="dl-filters">
          <span className="dl-filter-label">Filter</span>
          {[
            { key: 'all',      label: 'All' },
            { key: 'accepted', label: '✓ Accepted' },
            { key: 'pending',  label: '⏳ Pending' },
          ].map(f => (
            <button
              key={f.key}
              className={`dl-filter-chip${filter === f.key ? (f.key === 'accepted' ? ' active-gold' : ' active') : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
          <div className="dl-search-wrap">
            <span className="dl-search-icon">🔍</span>
            <input
              className="dl-search"
              placeholder="Search food or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="dl-body">

          {/* ── Stats row ── */}
          {donations.length > 0 && (
            <div className="dl-stats-row">
              {[
                { icon:'🍽️', num: totalMeals,    label: 'Total Meals'     },
                { icon:'✅', num: acceptedCount, label: 'Accepted'        },
                { icon:'💬', num: feedbackCount, label: 'Feedback Received'},
              ].map(s => (
                <div className="dl-stat" key={s.label}>
                  <span className="dl-stat-icon">{s.icon}</span>
                  <div>
                    <div className="dl-stat-num">{s.num.toLocaleString()}</div>
                    <div className="dl-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className="dl-empty">
              <div className="dl-empty-icon">🌾</div>
              <div className="dl-empty-title">{emptyMsg}</div>
              <p className="dl-empty-desc">
                {isNgo
                  ? 'Browse available donations and accept them to feed those in need.'
                  : 'Your surplus food can feed hundreds. Every meal you donate makes a real difference.'}
              </p>
              {!isNgo && (
                <button className="dl-empty-btn" onClick={() => nav('/')}>
                  🍲 Donate Food
                </button>
              )}
            </div>
          ) : (
            <div className="dl-grid">
              {filtered.map((d, i) => {
                const feedbacks    = feedbacksMap[d._id] || []
                const allImgs      = feedbacks.flatMap(fb => fb.images || [])
                const avgRating    = feedbacks.length
                  ? (feedbacks.reduce((s,f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
                  : null
                
                const formatPickupDate = () => {
                  if (!d.pickupTime) return 'N/A'
                  try {
                    // Try ISO format with T separator
                    let date = new Date(d.pickupTime.replace(' ', 'T'))
                    // If invalid, try parsing manually
                    if (isNaN(date.getTime())) {
                      const parts = d.pickupTime.split(' ')
                      if (parts.length === 2) {
                        const [dateStr, timeStr] = parts
                        date = new Date(dateStr)
                      }
                    }
                    // If still invalid, return raw string
                    if (isNaN(date.getTime())) return d.pickupTime
                    return date.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                  } catch {
                    return d.pickupTime
                  }
                }

                return (
                  <div
                    key={d._id}
                    className="dl-card"
                    style={{ animationDelay: `${0.05 * i}s` }}
                    onClick={() => nav(`/donations/${d._id}`)}
                  >
                    {/* Top section */}
                    <div className="dl-card-top">
                      <div style={{ flex: 1 }}>
                        <div className="dl-card-food">{d.foodDesc}</div>
                      </div>
                      <div className={`dl-status-pill ${d.status ? 'accepted' : 'available'}`}>
                        <span className="dl-status-dot" />
                        {d.status ? 'Accepted' : (isNgo ? 'Available' : 'Pending')}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="dl-card-meta">
                      <div className="dl-meta-item">
                        <span className="dl-meta-icon">📍</span>
                        <span className="dl-meta-text">
                          <a
                            href={getGoogleMapsLink(d.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >
                            View on Map
                          </a>
                        </span>
                      </div>
                      <div className="dl-meta-item">
                        <span className="dl-meta-icon">🍽️</span>
                        <span className="dl-meta-text">{d.capacity} meals</span>
                      </div>
                      <div className="dl-meta-item">
                        <span className="dl-meta-icon">⏰</span>
                        <span className="dl-meta-text">{formatPickupDate()}</span>
                      </div>
                      {avgRating && (
                        <div className="dl-meta-item">
                          <span className="dl-meta-icon">⭐</span>
                          <span className="dl-meta-text" style={{ color:'var(--gold)', fontWeight:600 }}>
                            {avgRating} avg
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Feedback strip */}
                    {feedbacks.length > 0 && (
                      <div
                        className="dl-feedback-strip"
                        onClick={e => { e.stopPropagation(); setSelectedFeedback(feedbacks) }}
                      >
                        <span className="dl-feedback-label">
                          💬 {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
                        </span>
                        <div className="dl-feedback-stars">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ opacity: avgRating && s <= Math.round(avgRating) ? 1 : 0.25 }}>⭐</span>
                          ))}
                        </div>
                        {allImgs.length > 0 && (
                          <div className="dl-feedback-thumbs">
                            {allImgs.slice(0, 3).map((img, i) => (
                              <img key={i} src={`http://localhost:5000${img}`} className="dl-thumb" alt="" />
                            ))}
                            {allImgs.length > 3 && (
                              <div className="dl-thumb-more">+{allImgs.length - 3}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Feedback Modal ── */}
      {selectedFeedback && selectedFeedback.length > 0 && (
        <div className="dl-modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="dl-modal" onClick={e => e.stopPropagation()}>
            <div className="dl-modal-head">
              <div className="dl-modal-title">💬 Feedback Details</div>
              <button className="dl-modal-close" onClick={() => setSelectedFeedback(null)}>✕</button>
            </div>
            <div className="dl-modal-body">
              {selectedFeedback.map((fb, i) => (
                <div key={i} className="dl-fb-item">
                  <div className="dl-fb-item-top">
                    <div className="dl-fb-name">{fb.ngo?.name || 'Anonymous'}</div>
                    <div className="dl-fb-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ opacity: s <= fb.rating ? 1 : 0.22 }}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <p className="dl-fb-comment">{fb.comment}</p>
                  {fb.images?.length > 0 && (
                    <div className="dl-fb-images">
                      {fb.images.map((img, j) => (
                        <img
                          key={j}
                          className="dl-fb-img"
                          src={`http://localhost:5000${img}`}
                          alt="Feedback"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}