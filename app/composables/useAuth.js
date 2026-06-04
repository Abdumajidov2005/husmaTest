/**
 * useAuth — Autentifikatsiya holati.
 *
 * SSR mismatch yechimi:
 * - Server: user = null (localStorage yo'q)
 * - Client: onMounted ichida localStorage o'qiladi
 * - Template: <ClientOnly> yoki isHydrated flag bilan auth-ga bog'liq UI yashiriladi
 */

const DEMO_CREDENTIALS = {
  rieltor: { login: 'rieltor', password: '1234' },
}

const SESSION_KEY = 'husma_session'
const USERS_KEY = 'husma_rieltors' // ro'yxatdan o'tgan rieltorlar ro'yxati

// --- Ro'yxatdan o'tgan foydalanuvchilar (localStorage) ---
function loadUsers() {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveUsers(list) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list))
  } catch {
    /* kvota to'lgan bo'lishi mumkin — jim o'tkazamiz */
  }
}

function persistSession(session) {
  user.value = session
  if (import.meta.client) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

// useState — Nuxt SSR-safe reactive state (server + client o'rtasida sync)
// Lekin localStorage faqat client da — shuning uchun useState null boshlaydi,
// keyin onMounted da hydrate() bilan to'ldiriladi.
const user       = ref(null)
const isHydrated = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => isHydrated.value && !!user.value)
  const isRieltor       = computed(() => isHydrated.value && user.value?.role === 'rieltor')
  const isClient        = computed(() => isHydrated.value && user.value?.role === 'client')

  /**
   * Client-side da bir marta chaqiriladi (onMounted ichida).
   * Server da hech narsa qilmaydi → mismatch yo'q.
   */
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
   * @param {{ login: string, password: string }} credentials
   * @returns {{ ok: boolean, error?: string }}
   */
  function signIn(credentials) {
    const login = credentials.login.trim()
    const demo = DEMO_CREDENTIALS.rieltor

    // 1) Demo hisob
    if (login === demo.login && credentials.password === demo.password) {
      persistSession({ name: 'Husma Rieltor', role: 'rieltor', phone: '+998 99 000-00-00' })
      return { ok: true }
    }

    // 2) Ro'yxatdan o'tgan rieltorlar
    const found = loadUsers().find(
      (u) => u.login === login && u.password === credentials.password
    )
    if (found) {
      persistSession({ name: found.name, role: 'rieltor', phone: found.phone })
      return { ok: true }
    }

    return { ok: false, errorKey: 'auth.invalid' }
  }

  /**
   * Yangi rieltor hisobini yaratish va avtomatik kiritish.
   * @param {{ name: string, phone: string, login: string, password: string }} data
   * @returns {{ ok: boolean, error?: string }}
   */
  function signUp(data) {
    const login = (data.login || '').trim()
    const name = (data.name || '').trim()
    const password = data.password || ''

    if (!login || !password) return { ok: false, errorKey: 'auth.fillFields' }

    // Login band emasligini tekshiramiz (demo + ro'yxatdan o'tganlar)
    if (login === DEMO_CREDENTIALS.rieltor.login) {
      return { ok: false, errorKey: 'auth.loginTaken' }
    }
    const users = loadUsers()
    if (users.some((u) => u.login === login)) {
      return { ok: false, errorKey: 'auth.loginExists' }
    }

    const newUser = {
      name: name || 'Rieltor',
      phone: data.phone || '',
      login,
      password,
      role: 'rieltor',
    }
    users.push(newUser)
    saveUsers(users)

    // Avtomatik kirish
    persistSession({ name: newUser.name, role: 'rieltor', phone: newUser.phone })
    return { ok: true }
  }

  function logout() {
    user.value = null
    isHydrated.value = false
    if (import.meta.client) localStorage.removeItem(SESSION_KEY)
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isRieltor,
    isClient,
    isHydrated: readonly(isHydrated),
    hydrate,
    signIn,
    signUp,
    logout,
  }
}
