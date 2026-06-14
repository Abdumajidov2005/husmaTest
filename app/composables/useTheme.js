// --- TOKEN DEFINITIONS ---

export const COLORS = {
  brand: {
    50: '#fff1f1',
    100: '#ffe0e0',
    300: '#ff9d9d',
    400: '#ff6363',
    500: '#f83131',
    600: '#e51313',  // asosiy
    700: '#c10a0a',
    800: '#a00c0c',
    900: '#840f0f',
  },
}

export const SIZES = {
  btn: {
    sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-3 text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2',
  },
  icon: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
}

export const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
  outline: 'border-2 border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20',
  ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}


const STORAGE_KEY = 'husma-color-mode'

// Modul darajasidagi yagona (singleton) holat — har bir useTheme()
// chaqirilganda qayta yaratilmaydi, shu bilan saqlangan tanlovni
// boshqa sahifaga o'tib-qaytganda ham yo'qotmaydi.
const isDark = ref(false)
let initialized = false

function applyClass(dark) {
  if (!import.meta.client) return
  try {
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    /* jim o'tkazamiz */
  }
}

function detectInitial() {
  if (!import.meta.client) return false

  // 1) Foydalanuvchi ilgari aniq tanlov qilgan bo'lsa — uni ustun qo'yamiz
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark') return true
    if (saved === 'light') return false
  } catch {
    /* localStorage mavjud emas — davom etamiz */
  }

  // 2) Telegram mavzusi
  try {
    const tgScheme = window.Telegram?.WebApp?.colorScheme
    if (tgScheme === 'dark' || tgScheme === 'light') return tgScheme === 'dark'
  } catch {
    /* jim o'tkazamiz */
  }

  // 3) Tizim (brauzer) mavzusi
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  } catch {
    return false
  }
}

function init() {
  if (initialized || !import.meta.client) return
  initialized = true
  isDark.value = detectInitial()
  applyClass(isDark.value)
}

export function useTheme() {
  init()

  function setDark(value) {
    isDark.value = value
    applyClass(value)
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
      } catch {
        /* kvota to'lgan bo'lishi mumkin — jim o'tkazamiz */
      }
    }
  }

  function toggleTheme() {
    setDark(!isDark.value)
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    COLORS,
    SIZES,
    VARIANTS,
  }
}