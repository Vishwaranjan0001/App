import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import NGOHome from './pages/NGOHome'
import Login from './pages/Login'
import Register from './pages/Register'
import ImpactPage from './pages/Impact'
import DonationsList from './pages/DonationsList'
import DonationDetail from './pages/DonationDetail'
import NGOWishlists from './pages/NGOWishlists'
import { getToken, getAuth } from './utils/auth'

function HomeRouter() {
  const auth = getAuth()
  if (!auth) return <Login />
  return auth.role === 'ngo' ? <NGOHome /> : <Home />
}

export default function App() {
  const nav = useNavigate()
  const [auth, setAuth] = useState(getAuth())

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth(getAuth())
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  function handleLogout() {
    localStorage.removeItem('auth')
    setAuth(null)
    nav('/login')
  }

  return (
    <div>
      <nav className="app-nav" style={{position:'fixed', top:0, left:0, right:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', background:'rgba(14,26,16,0.98)', backdropFilter:'blur(10px)', transition:'backdrop-filter 0.4s'}}>
        <Link to="/" style={{fontSize:'18px', fontWeight:600, color:'#d4a843', textDecoration:'none', fontFamily:"'Lora', serif"}}>Food<span style={{fontStyle:'italic', color:'#6abf8e'}}>ForSmiles</span></Link>
        <div style={{display:'flex', gap:'32px', alignItems:'center'}}>
          {auth ? (
            <>
              <button onClick={() => nav('/donations')} style={{background:'none', border:'none', fontSize:'13px', letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(238,234,224,0.65)', cursor:'pointer', textDecoration:'none', transition:'color 0.25s', fontFamily:"'Source Sans 3', sans-serif", fontWeight:500}} onMouseEnter={(e) => e.target.style.color='#eeeae0'} onMouseLeave={(e) => e.target.style.color='rgba(238,234,224,0.65)'}>
                {auth.role === 'ngo' ? 'Accepted' : 'My Donations'}
              </button>
              {auth.role === 'donor' && (
                <button onClick={() => nav('/ngo-wishlists')} style={{background:'none', border:'none', fontSize:'13px', letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(238,234,224,0.65)', cursor:'pointer', textDecoration:'none', transition:'color 0.25s', fontFamily:"'Source Sans 3', sans-serif", fontWeight:500}} onMouseEnter={(e) => e.target.style.color='#eeeae0'} onMouseLeave={(e) => e.target.style.color='rgba(238,234,224,0.65)'}>
                  NGO Needs
                </button>
              )}
              <span style={{fontSize:'13px', color:'rgba(238,234,224,0.65)', fontFamily:"'Source Sans 3', sans-serif"}}>👤 {auth.name}</span>
              <button onClick={handleLogout} style={{background:'none', border:'none', fontSize:'13px', letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(238,234,224,0.65)', cursor:'pointer', fontFamily:"'Source Sans 3', sans-serif", fontWeight:500, transition:'color 0.25s'}} onMouseEnter={(e) => e.target.style.color='#e06060'} onMouseLeave={(e) => e.target.style.color='rgba(238,234,224,0.65)'}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => nav('/login')} style={{background:'none', border:'none', fontSize:'13px', letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(238,234,224,0.65)', cursor:'pointer', textDecoration:'none', transition:'color 0.25s', fontFamily:"'Source Sans 3', sans-serif", fontWeight:500}} onMouseEnter={(e) => e.target.style.color='#eeeae0'} onMouseLeave={(e) => e.target.style.color='rgba(238,234,224,0.65)'}>
                Login
              </button>
              <button onClick={() => nav('/register')} style={{background:'none', border:'none', fontSize:'13px', letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(238,234,224,0.65)', cursor:'pointer', textDecoration:'none', transition:'color 0.25s', fontFamily:"'Source Sans 3', sans-serif", fontWeight:500}} onMouseEnter={(e) => e.target.style.color='#eeeae0'} onMouseLeave={(e) => e.target.style.color='rgba(238,234,224,0.65)'}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomeRouter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/impact" element={auth?.role === 'donor' ? <ImpactPage /> : <Login />} />
          <Route path="/donations" element={auth ? <DonationsList /> : <Login />} />
          <Route path="/donations/:id" element={auth ? <DonationDetail /> : <Login />} />
          <Route path="/ngo-wishlists" element={auth?.role === 'donor' ? <NGOWishlists /> : <Login />} />
        </Routes>
      </main>
    </div>
  )
}
