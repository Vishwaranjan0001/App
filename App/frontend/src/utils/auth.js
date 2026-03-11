export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem('auth') || 'null')
  } catch (e) {
    return null
  }
}

export function getToken() {
  const a = getAuth()
  return a && a.token ? a.token : null
}

export function getRole() {
  const a = getAuth()
  if (!a) return null
  // frontend uses 'donor'/'ngo' labels; map 'donor' to 'user' for clarity if needed
  return a.role || null
}
