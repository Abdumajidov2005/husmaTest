

const BASE_URL = 'https://husma.pythonanywhere.com'
const SESSION_KEY = 'husma_session'   // user obyekti (UI uchun)
const TOKEN_KEY   = 'husma_tokens'    // { access, refresh }

const user       = ref(null)
const isHydrated = ref(false)

// --- Token saqlash ---
function loadTokens() {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveTokens(tokens) {
  if (!import.meta.client) return
  try { localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)) } catch {}
}

function clearTokens() {
  if (!import.meta.client) return
  localStorage.removeItem(TOKEN_KEY)
}

function persistSession(sessionData) {
  user.value = sessionData
  if (import.meta.client) localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
}


async function apiFetch(path, { method = 'GET', body, auth = true, _retried = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const tokens = loadTokens()
    if (tokens?.access) headers['Authorization'] = `Bearer ${tokens.access}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    return { ok: false, status: 0, data: null, networkError: true }
  }

  // Token muddati tugagan bo'lsa — refresh qilib bir marta qayta urinamiz
  if (res.status === 401 && auth && !_retried) {
    const refreshed = await refreshToken()
    if (refreshed) return apiFetch(path, { method, body, auth, _retried: true })
  }

  let data = null
  try { data = await res.json() } catch {}
  return { ok: res.ok, status: res.status, data }
}

/**
 * POST /api/auth/refresh/ — access tokenni yangilaydi.
 * @returns {Promise<boolean>}
 */
async function refreshToken() {
  const tokens = loadTokens()
  if (!tokens?.refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (!data.access) return false
    saveTokens({ ...tokens, access: data.access })
    return true
  } catch {
    return false
  }
}


async function fetchMe() {
  const { ok, data } = await apiFetch('/api/users/me/')
  if (!ok || !data) return null
  return {
    id: data.id,
    name: data.full_name || data.telegram_username || 'Foydalanuvchi',
    phone: data.phone,
    role: data.role === 'makler' ? 'rieltor' : data.role, // 'user' | 'rieltor' | 'admin'
    telegram_id: data.telegram_id,
    telegram_username: data.telegram_username,
    full_name: data.full_name,
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => isHydrated.value && !!user.value)
  const isRieltor       = computed(() => isHydrated.value && user.value?.role === 'rieltor')
  const isClient        = computed(() => isHydrated.value && user.value?.role === 'user')
  const isAdmin         = computed(() => isHydrated.value && user.value?.role === 'admin')

 
  function hydrate() {
    if (isHydrated.value || !import.meta.client) return
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      user.value = raw ? JSON.parse(raw) : null
    } catch {
      user.value = null
    } finally {
      isHydrated.value = true
    }
  }

  /**
   
   * @param {string} initData — window.Telegram.WebApp.initData (xom satr)
   * @returns {{ ok: boolean, errorKey?: string }}
   */
  async function telegramLogin(initData) {
    if (!initData) return { ok: false, errorKey: 'auth.telegramRequired' }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/telegram/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ init_data: initData }),
      })

      let data = null
      try { data = await res.json() } catch {}

      if (res.ok) {
        if (data?.access || data?.refresh) {
          saveTokens({ access: data.access, refresh: data.refresh })
        }
        const profile = await fetchMe()
        if (profile) persistSession(profile)
        return { ok: true }
      }

      if (res.status === 400) return { ok: false, errorKey: 'auth.validationError' }
      if (res.status === 401) return { ok: false, errorKey: 'auth.telegramFailed' }
      return { ok: false, errorKey: 'auth.serverError' }
    } catch {
      return { ok: false, errorKey: 'auth.networkError' }
    }
  }

  /**
 
   * @param {{ login: string, password: string }} credentials
   * @returns {{ ok: boolean, errorKey?: string }}
   */
  async function signIn({ login, password }) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/rieltor/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, password }),
      })

      let data = null
      try { data = await res.json() } catch {}

      if (res.ok) {
        if (data?.access || data?.refresh) {
          saveTokens({ access: data.access, refresh: data.refresh })
        }
        const profile = await fetchMe()
        persistSession(profile || { name: login, role: 'rieltor' })
        return { ok: true }
      }

      if (res.status === 401) return { ok: false, errorKey: 'auth.invalid' }
      if (res.status === 403) return { ok: false, errorKey: 'auth.noProfile' }
      return { ok: false, errorKey: 'auth.serverError' }
    } catch {
      return { ok: false, errorKey: 'auth.networkError' }
    }
  }

  /**
 
   * @param {{ full_name: string, phone: string, username: string, password: string, hududlar?: number[], mulk_turlari?: number[] }} data
   * @returns {{ ok: boolean, errorKey?: string, detail?: string }}
   */
  async function requestOtp({ full_name, phone, username, password, hududlar, mulk_turlari }) {
    const { ok, status, data, networkError } = await apiFetch('/api/auth/rieltor/otp-sorov/', {
      method: 'POST',
      body: {
        full_name,
        phone,
        username,
        password,
        hududlar: Array.isArray(hududlar) ? hududlar : (hududlar ? [hududlar] : []),
        mulk_turlari: Array.isArray(mulk_turlari) ? mulk_turlari : (mulk_turlari ? [mulk_turlari] : []),
      },
    })

    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) return { ok: true }

    if (status === 400) {
      const detail =
        data?.username?.[0] || data?.phone?.[0] || data?.password?.[0] ||
        data?.detail || data?.error || ''
      if (typeof detail === 'string' && detail.toLowerCase().includes('rieltor')) {
        return { ok: false, errorKey: 'auth.alreadyRieltor' }
      }
      return { ok: false, errorKey: 'auth.validationError', detail }
    }
    if (status === 403) return { ok: false, errorKey: 'auth.telegramRequired' }
    if (status === 503) return { ok: false, errorKey: 'auth.telegramFailed' }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  /**

   * @param {string} kode — 6 xonali kod
   * @returns {{ ok: boolean, errorKey?: string }}
   */
  async function verifyOtp(kode) {
    const { ok, status, networkError } = await apiFetch('/api/auth/rieltor/otp-verify/', {
      method: 'POST',
      body: { kode },
    })

    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) {
      // Rieltor yaratildi — profilni yangilab olamiz (role endi 'makler')
      const profile = await fetchMe()
      if (profile) persistSession(profile)
      return { ok: true }
    }
    if (status === 400) return { ok: false, errorKey: 'auth.invalidOtp' }
    if (status === 403) return { ok: false, errorKey: 'auth.telegramRequired' }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  /**
   * @returns {Promise<{ ok: boolean, data?: object, errorKey?: string }>}
   */
  async function checkFaollik() {
    const { ok, status, data, networkError } = await apiFetch('/api/auth/rieltor/faollik/')
    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) return { ok: true, data }
    if (status === 403) return { ok: false, errorKey: 'auth.noProfile' }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  function logout() {
    user.value = null
    isHydrated.value = false
    if (import.meta.client) {
      localStorage.removeItem(SESSION_KEY)
      clearTokens()
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isRieltor,
    isClient,
    isAdmin,
    isHydrated: readonly(isHydrated),
    hydrate,
    telegramLogin,
    signIn,
    requestOtp,
    verifyOtp,
    checkFaollik,
    fetchMe,
    apiFetch,
    logout,
  }
}

// ===== OBUNA COMPOSABLE =====
export function useObuna() {
  const { apiFetch } = useAuth()

  async function fetchTariflar() {
    try {
      const res = await fetch('https://husma.pythonanywhere.com/api/obuna/tariflar/', {
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) return { ok: false, errorKey: 'auth.serverError' }
      const data = await res.json()
      return { ok: true, data }
    } catch { return { ok: false, errorKey: 'auth.networkError' } }
  }

  async function fetchMeningObuna() {
    const { ok, data, networkError } = await apiFetch('/api/obuna/mening/')
    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) return { ok: true, data }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  async function sotibOlish({ tarif_id, provayder = 'payme' }) {
    const { ok, status, data, networkError } = await apiFetch('/api/obuna/sotib-olish/', {
      method: 'POST',
      body: { tarif_id, provayder },
    })
    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) return { ok: true, data }
    if (status === 400) return { ok: false, errorKey: 'auth.validationError', detail: data?.detail || '' }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  async function bekorQilish(id) {
    const { ok, status, networkError } = await apiFetch(`/api/obuna/${id}/bekor/`, { method: 'POST' })
    if (networkError) return { ok: false, errorKey: 'auth.networkError' }
    if (ok) return { ok: true }
    if (status === 400) return { ok: false, errorKey: 'obuna.cantCancel' }
    if (status === 404) return { ok: false, errorKey: 'obuna.notFound' }
    return { ok: false, errorKey: 'auth.serverError' }
  }

  return { fetchTariflar, fetchMeningObuna, sotibOlish, bekorQilish }
}
