import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    --gold-dim: rgba(212,168,67,0.14);
    --green:    #2d6a4f;
    --green-lt: #6abf8e;
    --text:     #eeeae0;
    --muted:    rgba(238,234,224,0.62);
    --danger:   #e06060;
    --surface:  rgba(255,255,255,0.05);
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

  /* ── Nav ── */
  .dd-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 60px;
    background: rgba(14,26,16,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .dd-nav-logo {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--gold);
    cursor: pointer;
    letter-spacing: 0.2px;
  }
  .dd-nav-logo span { color: var(--green-lt); font-style: italic; }
  .dd-back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
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
  .dd-back-btn:hover { border-color: var(--green-lt); color: var(--green-lt); }

  /* ── Page wrapper ── */
  .dd-page {
    position: relative;
    z-index: 1;
    padding-top: 88px;
    min-height: 100vh;
  }

  /* ── Header band ── */
  .dd-header {
    background: linear-gradient(135deg, #1c3a2a 0%, #102518 60%, #1c3a2a 100%);
    border-bottom: 1px solid var(--border);
    padding: 60px 60px 56px;
    position: relative;
    overflow: hidden;
  }
  .dd-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%232d6a4f' fill-opacity='0.09'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8;
    pointer-events: none;
  }
  .dd-header::after {
    content: '';
    position: absolute;
    right: -100px; top: -100px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .dd-header-inner {
    position: relative;
    z-index: 1;
    max-width: 1080px;
    margin: 0 auto;
  }
  .dd-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 16px;
    opacity: 0;
    animation: fadeUp 0.7s 0.1s forwards;
  }
  .dd-title {
    font-family: 'Lora', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 20px;
    text-shadow: 0 3px 30px rgba(0,0,0,0.6);
    opacity: 0;
    animation: fadeUp 0.7s 0.2s forwards;
  }
  .dd-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 18px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeUp 0.7s 0.35s forwards;
  }
  .dd-status-pill.available {
    background: rgba(106,191,142,0.15);
    border: 1px solid rgba(106,191,142,0.35);
    color: var(--green-lt);
  }
  .dd-status-pill.accepted {
    background: rgba(212,168,67,0.13);
    border: 1px solid rgba(212,168,67,0.3);
    color: var(--gold);
  }
  .dd-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
  .available .dd-status-dot { background: var(--green-lt); box-shadow: 0 0 6px var(--green-lt); }
  .accepted  .dd-status-dot { background: var(--gold);     box-shadow: 0 0 6px var(--gold); }

  /* ── Main layout ── */
  .dd-body {
    max-width: 1080px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    align-items: start;
  }

  /* ── Card base ── */
  .dd-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
  }
  .dd-card-header {
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dd-card-header-icon {
    font-size: 16px;
    line-height: 1;
  }
  .dd-card-title {
    font-family: 'Lora', serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.2px;
  }
  .dd-card-body { padding: 28px; }

  /* ── Info rows ── */
  .dd-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .dd-info-item {}
  .dd-info-label {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 7px;
    display: block;
  }
  .dd-info-value {
    font-size: 16px;
    color: var(--text);
    font-weight: 500;
    line-height: 1.4;
  }
  .dd-info-value a {
    color: var(--green-lt);
    text-decoration: none;
    border-bottom: 1px solid rgba(106,191,142,0.3);
    padding-bottom: 1px;
    transition: border-color 0.2s, color 0.2s;
  }
  .dd-info-value a:hover { color: var(--text); border-color: var(--text); }

  /* ── Sidebar ── */
  .dd-sidebar { display: flex; flex-direction: column; gap: 20px; }

  /* ── Action card ── */
  .dd-action-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-top: 2px solid var(--gold);
    padding: 28px;
  }
  .dd-action-label {
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 14px;
  }
  .dd-action-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 24px;
  }
  .dd-btn-accept {
    width: 100%;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 14px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 2px;
    margin-bottom: 10px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .dd-btn-accept:hover { opacity: 0.88; transform: translateY(-1px); }
  .dd-btn-decline {
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    padding: 13px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 2px;
    transition: border-color 0.2s, color 0.2s;
  }
  .dd-btn-decline:hover { border-color: var(--danger); color: var(--danger); }

  /* ── Meta card ── */
  .dd-meta-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 24px 28px;
  }
  .dd-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .dd-meta-row:last-child { border-bottom: none; padding-bottom: 0; }
  .dd-meta-row:first-child { padding-top: 0; }
  .dd-meta-key {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
  }
  .dd-meta-val {
    font-size: 13px;
    color: var(--text);
    font-weight: 600;
    text-align: right;
  }

  /* ── Message banner ── */
  .dd-banner {
    padding: 14px 20px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 2px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-left: 3px solid;
  }
  .dd-banner.success {
    background: rgba(106,191,142,0.1);
    border-color: var(--green-lt);
    color: var(--green-lt);
  }
  .dd-banner.error {
    background: rgba(224,96,96,0.1);
    border-color: var(--danger);
    color: var(--danger);
  }

  /* ── Feedback button ── */
  .dd-feedback-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    background: rgba(212,168,67,0.08);
    border: 1px solid rgba(212,168,67,0.25);
    color: var(--gold);
    padding: 16px 20px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s, border-color 0.2s;
    letter-spacing: 0.3px;
  }
  .dd-feedback-trigger:hover {
    background: rgba(212,168,67,0.14);
    border-color: rgba(212,168,67,0.5);
  }

  /* ── Feedback form ── */
  .dd-feedback-form {
    background: var(--bg4);
    border: 1px solid var(--border);
    border-top: 2px solid var(--gold);
    padding: 28px;
    animation: fadeUp 0.35s ease;
  }
  .dd-feedback-form-title {
    font-family: 'Lora', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 24px;
  }
  .ff-label {
    display: block;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 9px;
  }
  .ff-field { margin-bottom: 20px; }
  .ff-select, .ff-textarea, .ff-file {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 2px;
    padding: 12px 14px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s;
    appearance: none;
  }
  .ff-select:focus, .ff-textarea:focus { border-color: var(--green-lt); }
  .ff-select option { background: #1c2e1e; color: var(--text); }
  .ff-textarea { min-height: 90px; resize: vertical; line-height: 1.6; }
  .ff-textarea::placeholder { color: rgba(238,234,224,0.28); }

  /* Star rating */
  .ff-stars {
    display: flex;
    gap: 6px;
    margin-bottom: 0;
  }
  .ff-star {
    font-size: 26px;
    cursor: pointer;
    transition: transform 0.15s;
    line-height: 1;
    filter: grayscale(1) opacity(0.35);
  }
  .ff-star.active { filter: none; transform: scale(1.1); }
  .ff-star:hover { transform: scale(1.2); filter: none; }

  .ff-file-area {
    border: 1px dashed rgba(255,255,255,0.2);
    border-radius: 2px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    position: relative;
  }
  .ff-file-area:hover { border-color: var(--green-lt); background: rgba(106,191,142,0.04); }
  .ff-file-area input[type=file] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .ff-file-icon { font-size: 24px; margin-bottom: 6px; }
  .ff-file-text { font-size: 13px; color: var(--muted); }
  .ff-file-hint { font-size: 11px; color: rgba(238,234,224,0.35); margin-top: 4px; }
  .ff-file-count { font-size: 12px; color: var(--green-lt); margin-top: 10px; font-weight: 600; }

  .ff-actions { display: flex; gap: 10px; margin-top: 8px; }
  .ff-submit {
    flex: 1;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 13px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 2px;
    transition: opacity 0.2s;
  }
  .ff-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .ff-submit:hover:not(:disabled) { opacity: 0.88; }
  .ff-cancel {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    padding: 13px 20px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    cursor: pointer;
    border-radius: 2px;
    transition: border-color 0.2s, color 0.2s;
  }
  .ff-cancel:hover { border-color: var(--muted); color: var(--text); }

  /* ── Feedbacks section ── */
  .dd-feedbacks-section {
    margin-top: 36px;
  }
  .dd-section-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 6px;
  }
  .dd-section-title {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 24px;
    letter-spacing: -0.2px;
  }
  .dd-section-title span {
    font-style: italic;
    color: var(--gold);
    font-size: 18px;
    font-weight: 500;
    margin-left: 8px;
  }

  .dd-feedback-list { display: grid; gap: 16px; }

  .dd-feedback-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 24px 28px;
    transition: border-color 0.25s;
    animation: fadeUp 0.4s ease;
  }
  .dd-feedback-card:hover { border-color: rgba(255,255,255,0.22); }

  .dfc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
  }
  .dfc-name {
    font-family: 'Lora', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }
  .dfc-date {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.5px;
  }
  .dfc-stars {
    display: flex;
    gap: 2px;
    font-size: 14px;
  }
  .dfc-comment {
    font-size: 15px;
    color: rgba(238,234,224,0.75);
    line-height: 1.75;
    margin-bottom: 16px;
  }
  .dfc-images {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .dfc-img {
    width: 80px; height: 80px;
    object-fit: cover;
    border-radius: 2px;
    cursor: pointer;
    border: 1px solid var(--border);
    transition: transform 0.2s, border-color 0.2s;
  }
  .dfc-img:hover { transform: scale(1.06); border-color: var(--green-lt); }

  /* ── Lightbox ── */
  .dd-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(8,16,9,0.88);
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
    animation: fadeIn 0.2s;
  }
  .dd-lightbox img {
    max-width: 88vw;
    max-height: 88vh;
    border-radius: 2px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    border: 1px solid var(--border);
  }
  .dd-lightbox-close {
    position: absolute;
    top: 24px; right: 28px;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    width: 40px; height: 40px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s, border-color 0.2s;
  }
  .dd-lightbox-close:hover { color: var(--text); border-color: var(--text); }

  /* ── Loading / Error states ── */
  .dd-state {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
  }
  .dd-spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--green-lt);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .dd-state-text {
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }
  .dd-error-text {
    font-family: 'Lora', serif;
    font-size: 18px;
    color: var(--danger);
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .dd-nav { padding: 18px 24px; }
    .dd-header { padding: 44px 24px 40px; }
    .dd-body {
      grid-template-columns: 1fr;
      padding: 32px 24px 60px;
      gap: 24px;
    }
    .dd-info-grid { grid-template-columns: 1fr; gap: 16px; }
    .dd-sidebar { order: -1; }
  }
`

/* ─── Helper ─── */
function getGoogleMapsLink(location) {
  if (!location) return '#'
  return `https://www.google.com/maps?q=${location}`
}

/* ─── Star row ─── */
function StarRow({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="ff-stars">
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={`ff-star${(hover || value) >= s ? ' active' : ''}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >⭐</span>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════ */
export default function DonationDetail() {
  const { id }   = useParams()
  const nav      = useNavigate()
  const auth     = getAuth()

  const [donation, setDonation]           = useState(null)
  const [feedbacks, setFeedbacks]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [message, setMessage]             = useState(null)
  const [msgType, setMsgType]             = useState('success')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [submitting, setSubmitting]       = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [feedbackData, setFeedbackData]   = useState({ rating: 5, comment: '', images: [] })

  useEffect(() => {
    const token = getToken()
    if (!token) { nav('/login'); return }
    async function load() {
      try {
        const r1 = await fetch(`http://localhost:5000/api/donation/${id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        const d1 = await r1.json()
        if (!r1.ok) { setError(d1.message || 'Unable to retrieve donation') }
        else setDonation(d1)

        const r2 = await fetch(`http://localhost:5000/api/feedback/donation/${id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        const d2 = await r2.json()
        if (r2.ok) setFeedbacks(d2)
      } catch { setError('Network error') }
      setLoading(false)
    }
    load()
  }, [id, nav])

  const handleClaim = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res  = await fetch(`http://localhost:5000/api/donation/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) { setMsgType('error'); setMessage(data.message || 'Unable to claim donation') }
      else { setDonation(data.donation); setMsgType('success'); setMessage('Donation claimed successfully!') }
    } catch { setMsgType('error'); setMessage('Network error') }
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const token = getToken()
    if (!token) return
    try {
      const fd = new FormData()
      fd.append('donation', id)
      fd.append('rating', feedbackData.rating)
      fd.append('comment', feedbackData.comment)
      feedbackData.images.forEach(img => fd.append('images', img))
      const res  = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const data = await res.json()
      if (!res.ok) { setMsgType('error'); setMessage(data.message || 'Failed to submit feedback') }
      else {
        setMsgType('success'); setMessage('Feedback submitted — thank you!')
        setFeedbacks([data.feedback, ...feedbacks])
        setFeedbackData({ rating: 5, comment: '', images: [] })
        setShowFeedbackForm(false)
        setTimeout(() => setMessage(null), 4000)
      }
    } catch { setMsgType('error'); setMessage('Network error') }
    setSubmitting(false)
  }

  /* ── States ── */
  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="dd-state">
        <div className="dd-spinner" />
        <p className="dd-state-text">Loading donation</p>
      </div>
    </>
  )

  if (error) return (
    <>
      <style>{STYLES}</style>
      <div className="dd-state">
        <p className="dd-error-text">{error}</p>
        <button className="dd-back-btn" onClick={() => nav('/donations')}>← Back to donations</button>
      </div>
    </>
  )

  if (!donation) return null

  const canAct           = auth?.role === 'ngo' && donation.status === false
  const canGiveFeedback  = auth?.role === 'ngo' && donation.status === true && String(donation.reciever) === String(auth._id)
  
  const formatPickupDate = () => {
    if (!donation.pickupTime) return null
    try {
      // Try ISO format with T separator
      let date = new Date(donation.pickupTime.replace(' ', 'T'))
      // If invalid, try parsing manually
      if (isNaN(date.getTime())) {
        const parts = donation.pickupTime.split(' ')
        if (parts.length === 2) {
          const [dateStr] = parts
          date = new Date(dateStr)
        }
      }
      // If still invalid, return null
      if (isNaN(date.getTime())) return null
      return date
    } catch {
      return null
    }
  }
  
  const pickupDate = formatPickupDate()

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Nav ── */}
      <nav className="dd-nav">
        <div className="dd-nav-logo" onClick={() => nav('/')}>Food<span>Bridge</span></div>
        <button className="dd-back-btn" onClick={() => nav('/donations')}>
          ← All Donations
        </button>
      </nav>

      <div className="dd-page">

        {/* ── Header band ── */}
        <div className="dd-header">
          <div className="dd-header-inner">
            <p className="dd-eyebrow">🍲 Donation Detail</p>
            <h1 className="dd-title">{donation.foodDesc}</h1>
            <div className={`dd-status-pill ${donation.status ? 'accepted' : 'available'}`}>
              <span className="dd-status-dot" />
              {donation.status ? 'Accepted' : 'Available'}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="dd-body">

          {/* ── Left column ── */}
          <div>
            {/* Message */}
            {message && (
              <div className={`dd-banner ${msgType}`}>
                <span>{msgType === 'success' ? '✓' : '!'}</span>
                {message}
              </div>
            )}

            {/* Info card */}
            <div className="dd-card" style={{ marginBottom: 24, animation: 'fadeUp 0.5s 0.2s both' }}>
              <div className="dd-card-header">
                <span className="dd-card-header-icon">📋</span>
                <span className="dd-card-title">Donation Information</span>
              </div>
              <div className="dd-card-body">
                <div className="dd-info-grid">
                  <div className="dd-info-item">
                    <span className="dd-info-label">Location</span>
                    <div className="dd-info-value">
                      <a href={getGoogleMapsLink(donation.location)} target="_blank" rel="noopener noreferrer">
                        📍 View on Google Maps
                      </a>
                    </div>
                  </div>
                  <div className="dd-info-item">
                    <span className="dd-info-label">Capacity</span>
                    <div className="dd-info-value">🍽️ {donation.capacity} meals</div>
                  </div>
                  <div className="dd-info-item">
                    <span className="dd-info-label">Pickup Time</span>
                    <div className="dd-info-value">
                      ⏰ {pickupDate
                        ? pickupDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                        : donation.pickupTime || 'N/A'}
                    </div>
                  </div>
                  <div className="dd-info-item">
                    <span className="dd-info-label">Status</span>
                    <div className="dd-info-value">{donation.status ? '✅ Accepted' : '⏳ Awaiting pickup'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback trigger / form */}
            {canGiveFeedback && (
              <div style={{ marginBottom: 24, animation: 'fadeUp 0.5s 0.35s both' }}>
                {!showFeedbackForm ? (
                  <button className="dd-feedback-trigger" onClick={() => setShowFeedbackForm(true)}>
                    ⭐ Leave Feedback for this donation
                  </button>
                ) : (
                  <div className="dd-feedback-form">
                    <div className="dd-feedback-form-title">Share Your Experience</div>
                    <form onSubmit={handleSubmitFeedback}>
                      <div className="ff-field">
                        <label className="ff-label">Rating</label>
                        <StarRow value={feedbackData.rating} onChange={r => setFeedbackData(p => ({...p, rating: r}))} />
                      </div>
                      <div className="ff-field">
                        <label className="ff-label">Comment</label>
                        <textarea
                          className="ff-textarea"
                          value={feedbackData.comment}
                          onChange={e => setFeedbackData(p => ({...p, comment: e.target.value}))}
                          placeholder="Describe the quality, quantity, and overall experience..."
                          required
                        />
                      </div>
                      <div className="ff-field">
                        <label className="ff-label">Images (up to 2)</label>
                        <div className="ff-file-area">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={e => setFeedbackData(p => ({...p, images: Array.from(e.target.files).slice(0,2)}))}
                          />
                          <div className="ff-file-icon">🖼️</div>
                          <div className="ff-file-text">Click to upload photos</div>
                          <div className="ff-file-hint">PNG, JPG up to 5 MB each</div>
                        </div>
                        {feedbackData.images.length > 0 && (
                          <div className="ff-file-count">✓ {feedbackData.images.length} image(s) selected</div>
                        )}
                      </div>
                      <div className="ff-actions">
                        <button type="submit" className="ff-submit" disabled={submitting}>
                          {submitting ? 'Submitting…' : 'Submit Feedback'}
                        </button>
                        <button type="button" className="ff-cancel" onClick={() => setShowFeedbackForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Feedbacks list */}
            {feedbacks.length > 0 && (
              <div className="dd-feedbacks-section" style={{ animation: 'fadeUp 0.5s 0.45s both' }}>
                <p className="dd-section-label">Community</p>
                <h2 className="dd-section-title">
                  Feedback
                  <span>({feedbacks.length})</span>
                </h2>
                <div className="dd-feedback-list">
                  {feedbacks.map(fb => (
                    <div key={fb._id} className="dd-feedback-card">
                      <div className="dfc-top">
                        <div>
                          <div className="dfc-name">{fb.ngo?.name || 'Anonymous'}</div>
                          <div className="dfc-date">
                            {new Date(fb.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </div>
                        </div>
                        <div className="dfc-stars">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ opacity: s <= fb.rating ? 1 : 0.2 }}>⭐</span>
                          ))}
                        </div>
                      </div>
                      <p className="dfc-comment">{fb.comment}</p>
                      {fb.images?.length > 0 && (
                        <div className="dfc-images">
                          {fb.images.map((img, i) => (
                            <img
                              key={i}
                              src={`http://localhost:5000${img}`}
                              alt="Feedback"
                              className="dfc-img"
                              onClick={() => setSelectedImage(`http://localhost:5000${img}`)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="dd-sidebar">

            {/* Action card */}
            {canAct && (
              <div className="dd-action-card" style={{ animation: 'fadeUp 0.5s 0.3s both' }}>
                <div className="dd-action-label">Action Required</div>
                <p className="dd-action-desc">
                  This donation is available for pickup. Accept it to claim and coordinate with the donor.
                </p>
                <button className="dd-btn-accept" onClick={handleClaim}>
                  ✓ Accept Donation
                </button>
                <button className="dd-btn-decline" onClick={() => nav('/donations')}>
                  Decline & Go Back
                </button>
              </div>
            )}

            {/* Quick facts */}
            <div className="dd-meta-card" style={{ animation: 'fadeUp 0.5s 0.4s both' }}>
              <div className="dd-card-header" style={{ padding: '0 0 16px 0', marginBottom: 4 }}>
                <span className="dd-card-header-icon">📊</span>
                <span className="dd-card-title">Quick Facts</span>
              </div>
              <div className="dd-meta-row">
                <span className="dd-meta-key">Serves</span>
                <span className="dd-meta-val">{donation.capacity} people</span>
              </div>
              <div className="dd-meta-row">
                <span className="dd-meta-key">Status</span>
                <span className="dd-meta-val" style={{ color: donation.status ? 'var(--gold)' : 'var(--green-lt)' }}>
                  {donation.status ? 'Claimed' : 'Open'}
                </span>
              </div>
              <div className="dd-meta-row">
                <span className="dd-meta-key">Feedbacks</span>
                <span className="dd-meta-val">{feedbacks.length}</span>
              </div>
              {pickupDate && (
                <div className="dd-meta-row">
                  <span className="dd-meta-key">Pickup date</span>
                  <span className="dd-meta-val">
                    {pickupDate.toLocaleDateString('en-IN', { day:'numeric', month:'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              {feedbacks.length > 0 && (
                <div className="dd-meta-row">
                  <span className="dd-meta-key">Avg. rating</span>
                  <span className="dd-meta-val" style={{ color: 'var(--gold)' }}>
                    {(feedbacks.reduce((s,f) => s + f.rating, 0) / feedbacks.length).toFixed(1)} ⭐
                  </span>
                </div>
              )}
            </div>

            {/* Map hint */}
            <a
              href={getGoogleMapsLink(donation.location)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:'block', background:'var(--bg4)', border:'1px solid var(--border)', padding:'20px 24px', textDecoration:'none', transition:'border-color 0.25s', animation:'fadeUp 0.5s 0.5s both' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--green-lt)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ fontSize:13, letterSpacing:2, textTransform:'uppercase', color:'var(--green-lt)', fontWeight:600, marginBottom:8 }}>
                Location
              </div>
              <div style={{ fontSize:14, color:'var(--muted)', marginBottom:10, lineHeight:1.5 }}>
                {donation.location || 'Coordinates provided'}
              </div>
              <div style={{ fontSize:12, color:'var(--green-lt)', fontWeight:600, letterSpacing:1 }}>
                Open in Google Maps →
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {selectedImage && (
        <div className="dd-lightbox" onClick={() => setSelectedImage(null)}>
          <button className="dd-lightbox-close" onClick={() => setSelectedImage(null)}>✕</button>
          <img src={selectedImage} alt="Full size" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
