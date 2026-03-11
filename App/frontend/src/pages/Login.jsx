import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

  /* ── Login page layout ── */
  .login-page {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Left panel ── */
  .login-left {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 64px;
    margin-top: 20px;
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  /* decorative radial glow */
  .login-left::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45,106,79,0.18) 0%, transparent 65%);
    bottom: -100px; left: -100px;
    pointer-events: none;
  }

  /* cross-hatch pattern top-right */
  .login-left::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 260px; height: 260px;
    background-image:
      linear-gradient(rgba(212,168,67,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,168,67,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .left-logo {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gold);
    letter-spacing: 0.2px;
    position: relative;
    z-index: 1;
    opacity: 0;
    animation: fadeUp 0.7s 0.1s forwards;
  }
  .left-logo span { color: var(--green-lt); font-style: italic; }

  .left-main {
    position: relative;
    z-index: 1;
  }

  .left-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.8s 0.2s forwards;
  }

  .left-headline {
    font-family: 'Lora', serif;
    font-size: clamp(36px, 4.5vw, 58px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.9s 0.35s forwards;
  }
  .left-headline em { font-style: italic; color: var(--gold); }

  .left-body {
    font-size: 16px;
    line-height: 1.8;
    color: var(--muted);
    max-width: 380px;
    margin-bottom: 52px;
    opacity: 0;
    animation: fadeUp 0.9s 0.5s forwards;
  }

  /* ── Testimonial card ── */
  .testimonial {
    background: rgba(28,46,30,0.7);
    border: 1px solid var(--border);
    border-left: 3px solid var(--gold);
    padding: 28px 32px;
    max-width: 400px;
    opacity: 0;
    animation: fadeUp 0.9s 0.65s forwards;
  }
  .testimonial-quote {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 16px;
    line-height: 1.7;
    color: var(--text);
    margin-bottom: 18px;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .author-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--green), var(--gold));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .author-info { display: flex; flex-direction: column; }
  .author-name { font-size: 13px; font-weight: 600; color: var(--text); letter-spacing: 0.3px; }
  .author-role { font-size: 11px; color: var(--muted); letter-spacing: 0.5px; margin-top: 2px; }

  .left-footer {
    position: relative;
    z-index: 1;
    opacity: 0;
    animation: fadeIn 0.8s 1s forwards;
  }
  .left-footer-text {
    font-size: 12px;
    color: rgba(238,234,224,0.3);
    letter-spacing: 0.3px;
  }

  /* ── Right panel ── */
  .login-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 52px 64px;
    position: relative;
  }

  /* subtle top-right corner accent */
  .login-right::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 180px; height: 3px;
    background: linear-gradient(to left, var(--gold), transparent);
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    opacity: 0;
    animation: fadeUp 0.9s 0.3s forwards;
  }

  .card-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 14px;
    font-family: 'Source Sans 3', sans-serif;
  }

  .card-title {
    font-family: 'Lora', serif;
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: var(--text);
    margin-bottom: 8px;
  }

  .card-subtitle {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 44px;
  }
  .card-subtitle a {
    color: var(--green-lt);
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }
  .card-subtitle a:hover { color: var(--gold); }

  /* ── Role toggle ── */
  .role-toggle {
    display: flex;
    background: rgba(45,106,79,0.2);
    border: 1px solid var(--green-lt);
    border-radius: 2px;
    padding: 4px;
    margin-bottom: 32px;
    position: relative;
  }
  .role-btn {
    flex: 1;
    padding: 11px 20px;
    border: none;
    background: none;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    position: relative;
    z-index: 1;
    transition: color 0.3s;
    border-radius: 1px;
  }
  .role-btn.active { color: #0d1a0e; }

  .role-slider {
    position: absolute;
    top: 4px; bottom: 4px;
    background: var(--gold);
    border-radius: 1px;
    transition: left 0.3s cubic-bezier(0.22,1,0.36,1), width 0.3s;
    z-index: 0;
  }

  /* ── Form fields ── */
  .form-field { margin-bottom: 22px; }

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

  .form-input-wrap {
    position: relative;
  }

  .form-input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.45;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 2px;
    padding: 13px 16px 13px 44px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  }
  .form-input:focus {
    border-color: var(--green-lt);
    background: rgba(106,191,142,0.07);
    box-shadow: 0 0 0 3px rgba(106,191,142,0.08);
  }
  .form-input::placeholder { color: rgba(238,234,224,0.28); }

  .password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    padding: 4px;
    transition: color 0.2s;
  }
  .password-toggle:hover { color: var(--text); }

  /* ── Error alert ── */
  .error-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(224,96,96,0.1);
    border: 1px solid rgba(224,96,96,0.3);
    border-left: 3px solid #e06060;
    margin-bottom: 24px;
    animation: shake 0.4s ease;
  }
  .error-alert-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
  .error-alert-text { font-size: 13px; color: #e09090; line-height: 1.5; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }

  /* ── Submit button ── */
  .btn-submit {
    width: 100%;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 16px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.25s, opacity 0.2s;
  }
  .btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.15);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(212,168,67,0.3);
  }
  .btn-submit:hover:not(:disabled)::before { opacity: 1; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* loading spinner inside button */
  .btn-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(13,26,14,0.3);
    border-top-color: #0d1a0e;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .or-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 28px 0;
  }
  .or-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .or-text {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(238,234,224,0.3);
    font-weight: 600;
  }

  /* ── Register link ── */
  .register-prompt {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin-top: 24px;
  }
  .register-prompt a {
    color: var(--green-lt);
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }
  .register-prompt a:hover { color: var(--gold); }

  /* ── Stats strip at bottom of right panel ── */
  .mini-stats {
    position: absolute;
    bottom: 40px;
    left: 64px; right: 64px;
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    overflow: hidden;
    opacity: 0;
    animation: fadeUp 0.8s 1.1s forwards;
  }
  .mini-stat {
    flex: 1;
    padding: 18px 20px;
    text-align: center;
    border-right: 1px solid var(--border);
    transition: background 0.3s;
  }
  .mini-stat:last-child { border-right: none; }
  .mini-stat:hover { background: var(--gold-dim); }
  .mini-stat-num {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gold);
    display: block;
    line-height: 1;
    margin-bottom: 4px;
  }
  .mini-stat-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
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

  /* ── Mobile ── */
  @media (max-width: 860px) {
    .login-page { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 48px 28px 160px; align-items: flex-start; padding-top: 80px; }
    .mini-stats { left: 28px; right: 28px; }
  }
`

/* ─── Particle canvas (same as Home) ─── */
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

/* ═══════════════════════════════════════════════════ */
export default function Login() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const res  = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      localStorage.setItem('auth', JSON.stringify({ ...data, role: 'donor' }))
      setTimeout(() => { window.location.href = '/' }, 100)
    } catch (err) {
      setErrorMsg(err.message || 'Network error — please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <ParticleCanvas />

      <div className="login-page">

        {/* ── Left ── */}
        <div className="login-left">

          <div className="left-main">
            <p className="left-eyebrow">🌾 Welcome Back</p>
            <h1 className="left-headline">
              Every login<br/>feeds a <em>life.</em>
            </h1>
            <p className="left-body">
              You're part of a network rescuing surplus food and delivering it to those who need it most.
              Sign in to continue your impact.
            </p>

            <div className="testimonial">
              <p className="testimonial-quote">
                "FoodBridge helped our shelter receive hot meals within the hour. It changed everything for our families."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">🏠</div>
                <div className="author-info">
                  <span className="author-name">Priya Menon</span>
                  <span className="author-role">Director, Hope Shelter NGO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <p className="left-footer-text">© 2026 FoodBridge · Fighting hunger, one meal at a time.</p>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="login-right">
          <div className="login-card">

            <p className="card-eyebrow">Secure Access</p>
            <h2 className="card-title">Sign In</h2>
            <p className="card-subtitle">
              New to FoodBridge?{' '}
              <a onClick={() => nav('/register')}>Create an account →</a>
            </p>

            {/* Error */}
            {errorMsg && (
              <div className="error-alert">
                <span className="error-alert-icon">⚠️</span>
                <span className="error-alert-text">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">✉️</span>
                  <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <p className="register-prompt">
              Don't have an account?{' '}
              <a onClick={() => nav('/register')}>Join FoodBridge today</a>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}