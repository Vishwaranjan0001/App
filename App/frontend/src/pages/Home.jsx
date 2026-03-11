import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, getRole } from '../utils/auth'

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
    opacity: 0.28;
  }

  /* ── Page wrapper ── */
  .page { position: relative; z-index: 1; }

  /* ── Nav ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 60px;
    background: linear-gradient(to bottom, rgba(14,26,16,0.95), transparent);
    backdrop-filter: blur(0px);
    transition: backdrop-filter 0.4s;
  }
  .nav.scrolled {
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
  }
  .nav-logo span { color: var(--green-lt); font-style: italic; }
  .nav-links { display: flex; gap: 36px; }
  .nav-link {
    font-size: 13px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    text-decoration: none;
    transition: color 0.25s;
    background: none;
    border: none;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 500;
  }
  .nav-link:hover { color: var(--text); }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 120px 40px 80px;
    position: relative;
    overflow: hidden;
  }

  /* radial glow behind hero */
  .hero::after {
    content: '';
    position: absolute;
    width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,106,79,0.14) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hero-eyebrow {
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    margin-bottom: 28px;
    opacity: 0;
    font-weight: 600;
    text-shadow: 0 0 24px rgba(106,191,142,0.4);
    animation: fadeUp 0.8s 0.2s forwards;
  }

  .hero-title {
    font-family: 'Lora', serif;
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -1px;
    max-width: 860px;
    margin-bottom: 12px;
    color: var(--text);
    opacity: 0;
    text-shadow: 0 4px 40px rgba(0,0,0,0.7);
    animation: fadeUp 0.9s 0.35s forwards;
  }
  .hero-title em {
    font-style: italic;
    color: var(--gold);
    font-weight: 600;
  }

  .hero-subtitle-italic {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: clamp(20px, 3.2vw, 34px);
    font-weight: 500;
    color: var(--green-lt);
    margin-bottom: 36px;
    opacity: 0;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
    animation: fadeUp 0.9s 0.5s forwards;
  }

  .hero-desc {
    font-size: 17px;
    line-height: 1.8;
    color: var(--muted);
    max-width: 520px;
    margin-bottom: 56px;
    opacity: 0;
    font-weight: 400;
    animation: fadeUp 0.9s 0.65s forwards;
  }

  .hero-cta-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 0.9s 0.8s forwards;
  }

  /* ── Buttons ── */
  .btn-primary {
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 15px 36px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.15);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(232,168,56,0.35); }
  .btn-primary:hover::before { opacity: 1; }

  .btn-secondary {
    background: transparent;
    color: var(--text);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 15px 36px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, transform 0.2s;
  }
  .btn-secondary:hover { border-color: var(--green-lt); color: var(--green-lt); transform: translateY(-2px); }

  /* ── Scroll indicator ── */
  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0;
    animation: fadeIn 1s 1.5s forwards;
  }
  .scroll-hint span {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--green-lt), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.5); opacity: 0.4; }
  }

  /* ── Stats bar ── */
  .stats-bar {
    display: flex;
    justify-content: center;
    gap: 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: rgba(28, 46, 30, 0.85);
    backdrop-filter: blur(10px);
    overflow: hidden;
  }
  .stat-item {
    flex: 1;
    max-width: 260px;
    padding: 40px 32px;
    text-align: center;
    border-right: 1px solid var(--border);
    transition: background 0.3s;
  }
  .stat-item:last-child { border-right: none; }
  .stat-item:hover { background: var(--gold-dim); }
  .stat-num {
    font-family: 'Lora', serif;
    font-size: 46px;
    font-weight: 600;
    color: var(--gold);
    display: block;
    line-height: 1;
    margin-bottom: 10px;
    text-shadow: 0 2px 16px rgba(212,168,67,0.3);
  }
  .stat-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
  }

  /* ── Section ── */
  .section {
    padding: 120px 60px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    margin-bottom: 20px;
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 600;
  }

  .section-title {
    font-family: 'Lora', serif;
    font-size: clamp(32px, 4.5vw, 58px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 20px;
  }
  .section-title em { font-style: italic; color: var(--gold); font-weight: 600; }

  .section-lead {
    font-size: 17px;
    line-height: 1.8;
    color: var(--muted);
    max-width: 500px;
    margin-bottom: 72px;
    font-weight: 400;
  }

  /* ── Module grid ── */
  .module-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .module-card {
    background: var(--bg3);
    padding: 56px 44px;
    position: relative;
    overflow: hidden;
    transition: background 0.35s;
    cursor: default;
  }
  .module-card::before {
    content: '';
    position: absolute;
    bottom: -60px; right: -60px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%);
    transition: transform 0.5s ease, opacity 0.5s;
    opacity: 0;
  }
  .module-card:hover { background: rgba(45,106,79,0.18); }
  .module-card:hover::before { opacity: 1; transform: scale(1.4); }

  .module-icon-wrap {
    width: 52px; height: 52px;
    border: 1px solid rgba(255,255,255,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 28px;
    background: rgba(255,255,255,0.04);
    transition: border-color 0.3s, background 0.3s;
  }
  .module-card:hover .module-icon-wrap { border-color: var(--green-lt); background: rgba(106,191,142,0.1); }

  .module-card h3 {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 14px;
    letter-spacing: -0.2px;
  }
  .module-card p {
    font-size: 15px;
    line-height: 1.8;
    color: rgba(238,234,224,0.7);
    font-family: 'Source Sans 3', sans-serif;
  }

  .module-num {
    position: absolute;
    top: 20px; right: 24px;
    font-family: 'Playfair Display', serif;
    font-size: 72px;
    font-weight: 900;
    color: rgba(255,255,255,0.03);
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 0 60px;
  }

  /* ── Impact band ── */
  .impact-band {
    background: linear-gradient(135deg, #1c3a2a 0%, #102518 50%, #1c3a2a 100%);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 100px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .impact-band::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d6a4f' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.7;
  }
  .impact-band-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
  .impact-band h2 {
    font-family: 'Lora', serif;
    font-size: clamp(30px, 4.5vw, 54px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin-bottom: 20px;
    color: var(--text);
    text-shadow: 0 2px 24px rgba(0,0,0,0.5);
  }
  .impact-band p {
    font-size: 17px;
    color: rgba(238,234,224,0.72);
    line-height: 1.8;
    margin-bottom: 40px;
    font-family: 'Source Sans 3', sans-serif;
  }

  /* ── Message ── */
  .alert {
    margin-top: 24px;
    padding: 14px 24px;
    border-left: 3px solid var(--gold);
    background: var(--gold-dim);
    font-size: 13px;
    color: var(--gold);
    letter-spacing: 0.2px;
    display: inline-block;
  }
  .alert.error {
    border-color: #e06060;
    background: rgba(224,96,96,0.12);
    color: #e06060;
  }

  /* ── Modal overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(8,16,9,0.75);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s;
  }

  .modal {
    background: #162419;
    border: 1px solid rgba(255,255,255,0.15);
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 56px 52px;
    position: relative;
    animation: modalSlide 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
  }
  @keyframes modalSlide {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-title {
    font-family: 'Lora', serif;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: var(--text);
    margin-bottom: 6px;
  }
  .modal-subtitle {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 40px;
    letter-spacing: 0.1px;
    line-height: 1.6;
  }

  .form-field { margin-bottom: 24px; }
  .form-label {
    display: block;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--green-lt);
    margin-bottom: 10px;
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
  }
  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 2px;
    padding: 13px 16px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s, background 0.25s;
  }
  .form-input:focus {
    border-color: var(--green-lt);
    background: rgba(106,191,142,0.07);
  }
  .form-input::placeholder { color: rgba(238,234,224,0.3); }

  .input-row { display: flex; gap: 10px; }
  .input-row .form-input { flex: 1; }

  .gps-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    padding: 13px 18px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    white-space: nowrap;
    transition: border-color 0.25s, color 0.25s;
    flex-shrink: 0;
    font-weight: 600;
  }
  .gps-btn:hover { border-color: var(--green-lt); color: var(--green-lt); }

  .form-error { font-size: 12px; color: #e06060; margin-top: 6px; }

  .modal-actions { display: flex; gap: 12px; margin-top: 36px; }

  .btn-submit {
    flex: 1;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 15px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 2px;
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    padding: 15px 24px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    cursor: pointer;
    border-radius: 2px;
    transition: border-color 0.25s, color 0.25s;
  }
  .btn-cancel:hover { border-color: var(--muted); color: var(--text); }

  .modal-close {
    position: absolute;
    top: 20px; right: 20px;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
    padding: 4px;
  }
  .modal-close:hover { color: var(--text); }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid var(--border);
    padding: 40px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-logo { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: var(--gold); }
  .footer-copy { font-size: 12px; color: var(--muted); letter-spacing: 0.5px; font-family: 'Source Sans 3', sans-serif; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @media (max-width: 900px) {
    .module-grid { grid-template-columns: 1fr; }
    .stats-bar { flex-wrap: wrap; }
    .stat-item { border-right: none; border-bottom: 1px solid var(--border); min-width: 50%; }
    .nav { padding: 18px 24px; }
    .nav-links { display: none; }
    .section { padding: 80px 24px; }
    .impact-band { padding: 80px 24px; }
    .footer { flex-direction: column; gap: 12px; text-align: center; padding: 32px 24px; }
    .modal { padding: 40px 28px; }
  }
`

/* ─── Particle canvas (floating seeds) ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, particles, raf

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

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
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.hue
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas id="particle-canvas" ref={canvasRef} />
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const dur = 1600
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1)
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
          setVal(Math.floor(ease * to))
          if (t < 1) requestAnimationFrame(tick)
          else setVal(to)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [to])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ═══════════════════════════════════════════════════ */
export default function Home() {
  const nav = useNavigate()
  const [showForm, setShowForm]     = useState(false)
  const [location, setLocation]     = useState('')
  const [capacity, setCapacity]     = useState('')
  const [foodDesc, setFoodDesc]     = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [loading, setLoading]       = useState(false)
  const [message, setMessage]       = useState(null)
  const [msgType, setMsgType]       = useState('info')
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError]     = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) nav('/login')
  }, [nav])

  const openDonate = () => {
    const role  = getRole()
    const token = getToken()
    if (!token) return nav('/login')
    if (role !== 'donor' && role !== 'user') {
      setMsgType('error')
      setMessage('Only donors may create donations. Please login as a donor.')
      return
    }
    setMessage(null)
    setShowForm(true)
  }

  async function submitDonation(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = getToken()
      const res   = await fetch('http://localhost:5000/api/donation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ location, capacity: Number(capacity), foodDesc, pickupTime })
      })
      const data = await res.json()
      if (!res.ok) {
        setMsgType('error')
        setMessage(data.message || 'Unable to create donation')
      } else {
        setMsgType('info')
        setMessage('Donation created successfully — thank you!')
        setShowForm(false)
        setLocation(''); setCapacity(''); setFoodDesc(''); setPickupTime('')
        setTimeout(() => nav('/donations'), 1800)
      }
    } catch { setMsgType('error'); setMessage('Network error') }
    setLoading(false)
  }

  const useGPS = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported'); return }
    setLocError('')
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation(`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`)
        setLocLoading(false)
      },
      err => { setLocError(err.message || 'Unable to get location'); setLocLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <ParticleCanvas />

      <div className="page">
        {/* ── Hero ── */}
        <section className="hero">
          <p className="hero-eyebrow">🌾 Zero Waste · Maximum Impact</p>
          <h1 className="hero-title">
            Fighting<br/><em>Hunger,</em><br/>One Meal
          </h1>
          <p className="hero-subtitle-italic">at a time.</p>
          <p className="hero-desc">
            Connecting donors and NGOs,Old Age Homes,Orphanage Homes to rescue surplus food and meet urgent needs.
            Every meal matters. Every donation counts.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={openDonate}>🍲 Donate Food</button>
            <button className="btn-secondary" onClick={() => nav('/ngo-wishlists')}>💛 View Needs</button>
            <button className="btn-secondary" onClick={() => nav('/impact')}>❤️ See Impact</button>
          </div>
          {message && (
            <div className={`alert${msgType === 'error' ? ' error' : ''}`}>{message}</div>
          )}
          <div className="scroll-hint">
            <div className="scroll-line" />
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-bar">
          {[
            { num: 48200, suffix: '+', label: 'Meals Rescued' },
            { num: 312,   suffix: '',  label: 'Active Donors' },
            { num: 89,    suffix: '',  label: 'NGO Partners' },
            { num: 97,    suffix: '%', label: 'Utilisation Rate' },
          ].map(s => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num">
                <Counter to={s.num} suffix={s.suffix} />
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Modules ── */}
        <div className="section" id="modules">
          <p className="section-eyebrow">Platform Modules</p>
          <h2 className="section-title">Everything you need<br/>to make an <em>impact</em></h2>
          <p className="section-lead">
            A seamless pipeline from surplus food to shelter tables —
            built for speed, trust, and dignity.
          </p>
          <div className="module-grid">
            {[
              { icon: '🍲', num: '01', title: 'Surplus Food Rescue',  desc: 'Donate excess food from restaurants, weddings, and stores. Smart geo-matching connects you with nearby NGOs instantly.' },
              { icon: '📋', num: '02', title: 'NGO Requirements',     desc: 'See real-time needs from orphanages, shelters, and old-age homes. Fulfill requests before they become crises.' },
              { icon: '❤️', num: '03', title: 'Impact Stories',       desc: 'Photos and verified stories from beneficiaries — see exactly who your donation fed and how it changed a day.' },
            ].map(m => (
              <div className="module-card" key={m.num}>
                <div className="module-num">{m.num}</div>
                <div className="module-icon-wrap">{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* ── Impact band ── */}
        <div className="impact-band">
          <div className="impact-band-inner">
            <h2>Ready to rescue your<br/><em style={{color:'var(--gold)'}}>next meal?</em></h2>
            <p>Join hundreds of donors and NGOs already on the platform. Setup takes under two minutes.</p>
            <button className="btn-primary" onClick={openDonate} style={{fontSize:'15px', padding:'16px 44px'}}>
              Start Donating Today
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-logo">FoodForSmiles</div>
          <div className="footer-copy">© 2026 · Fighting hunger, one meal at a time.</div>
        </footer>
      </div>

      {/* ── Donation modal ── */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setLocError('') } }}>
          <div className="modal">
            <button className="modal-close" onClick={() => { setShowForm(false); setLocError('') }}>✕</button>
            <div className="modal-title">Create Donation</div>
            <div className="modal-subtitle">Fill in the details below and we'll match you with nearby NGOs.</div>

            <form onSubmit={submitDonation}>
              <div className="form-field">
                <label className="form-label">Location</label>
                <div className="input-row">
                  <input
                    className="form-input"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="lat,lng or address"
                    required
                  />
                  <button type="button" className="gps-btn" onClick={useGPS}>
                    {locLoading ? '…' : '📍 GPS'}
                  </button>
                </div>
                {locError && <div className="form-error">{locError}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Capacity (meals)</label>
                <input
                  className="form-input"
                  type="number"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  placeholder="Number of people it can serve"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Food Description</label>
                <input
                  className="form-input"
                  value={foodDesc}
                  onChange={e => setFoodDesc(e.target.value)}
                  placeholder="What food is available"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Pickup Time</label>
                <input
                  className="form-input"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  placeholder="e.g. 2026-02-27 14:30"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Create Donation'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setLocError('') }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}