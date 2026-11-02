// Guarda de autenticação para páginas que exigem conta aprovada.
export async function checkAuth(redirectTo = '/login') {
  const goToLogin = () => {
    const returnTo = `${window.location.pathname}${window.location.search}`
    window.location.replace(`${redirectTo}?returnTo=${encodeURIComponent(returnTo)}`)
  }

  const token = localStorage.getItem('jwt')
  if (!token) return goToLogin()

  try {
    const response = await fetch('/api/auth/status', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const session = response.ok ? await response.json() : null
    if (session?.status !== 'approved') {
      localStorage.removeItem('jwt')
      document.cookie = 'infinity_session=; Path=/; Max-Age=0; SameSite=Lax'
      return goToLogin()
    }
    return session
  } catch (error) {
    console.error('Não foi possível validar a sessão:', error)
    return goToLogin()
  }
}
