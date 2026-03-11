import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  html, body { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Source Sans 3', sans-serif;
    font-weight: 400;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* grain */
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

  /* ── Layout ── */
  .rg-root {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Left panel ── */
  .rg-left {
    background: linear-gradient(160deg, #1c3a2a 0%, #0e2016 55%, #162a1a 100%);
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    border-right: 1px solid var(--border);
  }
  .rg-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%232d6a4f' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8; pointer-events: none;
  }
  .rg-left::after {
    content: '';
    position: absolute;
    bottom: -120px; left: -60px;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .rg-left-inner { position: relative; z-index: 1; }

  .rg-logo {
    font-family: 'Lora', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gold);
    cursor: pointer;
    display: inline-block;
    margin-bottom: 80px;
  }
  .rg-logo span { color: var(--green-lt); font-style: italic; }

  .rg-left-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.15s forwards;
  }
  .rg-left-title {
    font-family: 'Lora', serif;
    font-size: clamp(30px, 3.5vw, 48px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    color: var(--text);
    margin-bottom: 20px;
    text-shadow: 0 3px 24px rgba(0,0,0,0.5);
    opacity: 0;
    animation: fadeUp 0.6s 0.25s forwards;
  }
  .rg-left-title em { font-style: italic; color: var(--gold); }
  .rg-left-desc {
    font-size: 15px;
    line-height: 1.8;
    color: var(--muted);
    max-width: 380px;
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 0.6s 0.35s forwards;
  }

  /* Feature list */
  .rg-features {
    display: flex;
    flex-direction: column;
    gap: 18px;
    opacity: 0;
    animation: fadeUp 0.6s 0.45s forwards;
  }
  .rg-feature {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }
  .rg-feat-dot {
    width: 32px; height: 32px;
    border: 1px solid rgba(106,191,142,0.3);
    background: rgba(106,191,142,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
    border-radius: 2px;
    margin-top: 1px;
  }
  .rg-feat-text { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .rg-feat-text strong { color: var(--text); font-weight: 600; display: block; margin-bottom: 2px; }

  .rg-left-bottom {
    position: relative; z-index: 1;
    margin-top: 60px;
    font-size: 13px;
    color: rgba(238,234,224,0.35);
  }
  .rg-left-bottom a {
    color: var(--green-lt);
    cursor: pointer;
    text-decoration: none;
    border-bottom: 1px solid rgba(106,191,142,0.25);
    transition: color 0.2s;
  }
  .rg-left-bottom a:hover { color: var(--text); }

  /* ── Right panel (form) ── */
  .rg-right {
    background: var(--bg2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
    overflow-y: auto;
  }
  .rg-form-wrap {
    width: 100%;
    max-width: 440px;
    animation: fadeUp 0.6s 0.1s both;
  }

  .rg-form-eyebrow {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 10px;
  }
  .rg-form-title {
    font-family: 'Lora', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.4px;
    margin-bottom: 6px;
  }
  .rg-form-sub {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 36px;
    line-height: 1.6;
  }
  .rg-form-sub a {
    color: var(--green-lt);
    cursor: pointer;
    text-decoration: none;
    border-bottom: 1px solid rgba(106,191,142,0.25);
    transition: color 0.2s;
  }
  .rg-form-sub a:hover { color: var(--text); }

  /* Role toggle */
  .rg-role-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 28px;
  }
  .rg-role-opt {
    background: var(--bg3);
    padding: 13px 10px;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    font-family: 'Source Sans 3', sans-serif;
    color: var(--muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .rg-role-opt.active {
    background: rgba(106,191,142,0.14);
    color: var(--green-lt);
  }
  .rg-role-opt:hover:not(.active) { background: var(--bg4); color: var(--text); }

  /* Fields */
  .rg-field { margin-bottom: 20px; }
  .rg-label {
    display: block;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--green-lt);
    font-weight: 600;
    margin-bottom: 9px;
  }
  .rg-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 2px;
    padding: 13px 15px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 15px;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s, background 0.25s;
  }
  .rg-input:focus {
    border-color: var(--green-lt);
    background: rgba(106,191,142,0.06);
  }
  .rg-input::placeholder { color: rgba(238,234,224,0.28); }

  /* Password wrapper with show/hide */
  .rg-input-row { position: relative; }
  .rg-pw-toggle {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted);
    font-size: 14px;
    cursor: pointer;
    padding: 2px;
    transition: color 0.2s;
    font-family: inherit;
  }
  .rg-pw-toggle:hover { color: var(--text); }

  /* Location row */
  .rg-loc-row { display: flex; gap: 8px; }
  .rg-loc-row .rg-input { flex: 1; }
  .rg-gps-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--muted);
    padding: 13px 16px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    white-space: nowrap;
    flex-shrink: 0;
    transition: border-color 0.25s, color 0.25s;
  }
  .rg-gps-btn:hover { border-color: var(--green-lt); color: var(--green-lt); }

  /* NGO reveal — slide in */
  .rg-ngo-fields {
    overflow: hidden;
    animation: slideDown 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes slideDown {
    from { opacity: 0; max-height: 0; transform: translateY(-8px); }
    to   { opacity: 1; max-height: 200px; transform: translateY(0); }
  }

  /* Field hint */
  .rg-field-hint {
    font-size: 12px;
    color: rgba(238,234,224,0.35);
    margin-top: 6px;
  }
  .rg-field-hint.error { color: var(--danger); }

  /* Divider */
  .rg-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border), transparent);
    margin: 8px 0 24px;
  }

  /* Error banner */
  .rg-error {
    padding: 13px 18px;
    background: rgba(224,96,96,0.1);
    border-left: 3px solid var(--danger);
    color: var(--danger);
    font-size: 13px;
    font-weight: 500;
    border-radius: 2px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Submit */
  .rg-submit {
    width: 100%;
    background: var(--gold);
    color: #0d1a0e;
    border: none;
    padding: 15px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .rg-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Loading shimmer on button */
  .rg-submit.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
    animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  /* Password strength */
  .rg-pw-strength {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }
  .rg-pw-bar {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s;
  }
  .rg-pw-bar.weak   { background: var(--danger); }
  .rg-pw-bar.fair   { background: var(--gold); }
  .rg-pw-bar.strong { background: var(--green-lt); }
  .rg-pw-label {
    font-size: 11px;
    color: var(--muted);
    margin-top: 5px;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 860px) {
    .rg-root { grid-template-columns: 1fr; }
    .rg-left { display: none; }
    .rg-right { padding: 48px 24px; align-items: flex-start; padding-top: 60px; }
    .rg-form-wrap { max-width: 100%; }
  }
`

/* ── Password strength ── */
function pwStrength(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_CLASS = ['', 'weak', 'fair', 'fair', 'strong']

/* ═══════════════════════════════════════════════════ */
export default function Register() {
  const nav = useNavigate()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [location, setLocation]   = useState('')
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError]   = useState('')
  const [role, setRole]           = useState('donor')
  const [capacity, setCapacity]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')

  const strength = pwStrength(password)

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

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const endpoint = role === 'ngo'
        ? 'http://localhost:5000/api/ngo/register'
        : 'http://localhost:5000/api/user/register'
      const payload = { name, email, password, location }
      if (role === 'ngo') payload.capacity = capacity

      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.message || 'Registration failed'); setLoading(false); return }

      localStorage.setItem('auth', JSON.stringify({ ...data, role }))
      setTimeout(() => { window.location.href = '/' }, 100)
    } catch (err) {
      setErrorMsg(err.message || 'Network error')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="rg-root">

        {/* ── Left panel ── */}
        <div className="rg-left">
          <div className="rg-left-inner">
            <div className="rg-logo" onClick={() => nav('/')}>Food<span>Bridge</span></div>
            <p className="rg-left-eyebrow">🌾 Join the movement</p>
            <h2 className="rg-left-title">
              Every meal<br/>saved is a life<br/><em>nourished.</em>
            </h2>
            <p className="rg-left-desc">
              Create your account and start connecting surplus food with the people who need it most. Zero waste. Real impact.
            </p>
            <div className="rg-features">
              {[
                { icon: '🍲', title: 'Donate Surplus Food',   desc: 'List excess food in under 2 minutes and get matched with nearby NGOs instantly.' },
                { icon: '🤝', title: 'NGO Network',           desc: 'Connect with verified shelters, orphanages and community kitchens across the city.' },
                { icon: '❤️', title: 'Track Your Impact',     desc: 'See photos and stories from the people your donations have reached.' },
              ].map(f => (
                <div className="rg-feature" key={f.title}>
                  <div className="rg-feat-dot">{f.icon}</div>
                  <div className="rg-feat-text">
                    <strong>{f.title}</strong>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rg-left-bottom">
            Already have an account?{' '}
            <a onClick={() => nav('/login')}>Sign in here →</a>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="rg-right">
          <div className="rg-form-wrap">
            <p className="rg-form-eyebrow">Get started</p>
            <h1 className="rg-form-title">Create your account</h1>
            <p className="rg-form-sub">
              Already registered?{' '}
              <a onClick={() => nav('/login')}>Sign in instead</a>
            </p>

            {/* Role toggle */}
            <div className="rg-role-row">
              <button
                type="button"
                className={`rg-role-opt${role === 'donor' ? ' active' : ''}`}
                onClick={() => { setRole('donor'); setCapacity('') }}
              >
                🍲 Donor
              </button>
              <button
                type="button"
                className={`rg-role-opt${role === 'ngo' ? ' active' : ''}`}
                onClick={() => setRole('ngo')}
              >
                💛 NGO / Organisation
              </button>
            </div>

            {errorMsg && (
              <div className="rg-error">
                <span>!</span> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="rg-field">
                <label className="rg-label">{role === 'ngo' ? 'Organisation Name' : 'Full Name'}</label>
                <input
                  className="rg-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'ngo' ? 'e.g. Hope Foundation' : 'Your full name'}
                  required
                />
              </div>

              {/* Email */}
              <div className="rg-field">
                <label className="rg-label">Email Address</label>
                <input
                  className="rg-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="rg-field">
                <label className="rg-label">Password</label>
                <div className="rg-input-row">
                  <input
                    className="rg-input"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className="rg-pw-toggle"
                    onClick={() => setShowPw(p => !p)}
                    tabIndex={-1}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {password && (
                  <>
                    <div className="rg-pw-strength">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={`rg-pw-bar${strength >= i ? ` ${STRENGTH_CLASS[strength]}` : ''}`}
                        />
                      ))}
                    </div>
                    <div className="rg-pw-label">
                      {STRENGTH_LABEL[strength]} password
                    </div>
                  </>
                )}
              </div>

              {/* NGO-only: capacity */}
              {role === 'ngo' && (
                <div className="rg-ngo-fields">
                  <div className="rg-field">
                    <label className="rg-label">Daily Capacity</label>
                    <input
                      className="rg-input"
                      value={capacity}
                      onChange={e => setCapacity(e.target.value)}
                      placeholder="e.g. 100 meals/day"
                      required
                    />
                    <div className="rg-field-hint">How many people can your organisation feed per day?</div>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="rg-field">
                <label className="rg-label">Location</label>
                <div className="rg-loc-row">
                  <input
                    className="rg-input"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="City, address or lat,lng"
                    required
                  />
                  <button type="button" className="rg-gps-btn" onClick={useGPS}>
                    {locLoading ? '…' : '📍 GPS'}
                  </button>
                </div>
                {locError && <div className="rg-field-hint error">{locError}</div>}
              </div>

              <div className="rg-divider" />

              <button
                type="submit"
                className={`rg-submit${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating account…' : `Create ${role === 'ngo' ? 'NGO' : 'Donor'} Account →`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}