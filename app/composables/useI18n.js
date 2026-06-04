/**
 * useI18n — Yengil ko'p tillilik (i18n) tizimi.
 *
 * Boshqa composable'lar (useAuth, useApplications) kabi module-level ref
 * orqali singleton holatda ishlaydi — barcha komponentlar bir xil
 * reaktiv `locale` ni ulashadi.
 *
 * Birinchi til quyidagicha aniqlanadi:
 *  1) localStorage da saqlangan tanlov
 *  2) Telegram foydalanuvchisining language_code (ru/en/uz)
 *  3) Standart — 'uz'
 *
 * Tanlangan til localStorage da saqlanadi va sahifa yangilansa ham
 * o'sha tilda ochiladi.
 */

import { messages, SUPPORTED_LOCALES, INTL_LOCALE } from '../i18n/messages'

const STORAGE_KEY = 'husma-locale'
const DEFAULT_LOCALE = 'uz'

// Module-level singleton holat
const locale = ref(DEFAULT_LOCALE)
let initialized = false

function detectInitial() {
  if (!import.meta.client) return DEFAULT_LOCALE
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved

    const tgCode = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code
    if (tgCode) {
      const short = String(tgCode).slice(0, 2).toLowerCase()
      if (SUPPORTED_LOCALES.includes(short)) return short
    }
  } catch {
    /* localStorage yoki Telegram mavjud emas — standart bilan davom */
  }
  return DEFAULT_LOCALE
}

function applyHtmlLang(code) {
  if (import.meta.client) {
    try {
      document.documentElement.lang = code
    } catch {
      /* jim o'tkazamiz */
    }
  }
}

function init() {
  if (initialized || !import.meta.client) return
  initialized = true
  locale.value = detectInitial()
  applyHtmlLang(locale.value)
}

/**
 * Nuqtali kalit bo'yicha lug'atdan qiymat oladi.
 * String bo'lsa {placeholder} larni almashtiradi; massiv/obyekt bo'lsa
 * o'zini qaytaradi (ro'yxatlar uchun).
 */
function resolve(dict, path) {
  return path.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), dict)
}

function interpolate(str, params) {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined && params[key] !== null ? String(params[key]) : `{${key}}`
  )
}

export function useI18n() {
  init()

  /**
   * @param {string} path — masalan 'profile.title'
   * @param {Record<string, any>} [params] — {placeholder} qiymatlari
   */
  function t(path, params) {
    const dict = messages[locale.value] || messages[DEFAULT_LOCALE]
    let val = resolve(dict, path)

    // Joriy tilda topilmasa — o'zbekchaga qaytamiz
    if (val === undefined && locale.value !== DEFAULT_LOCALE) {
      val = resolve(messages[DEFAULT_LOCALE], path)
    }
    if (val === undefined) return path

    return typeof val === 'string' ? interpolate(val, params) : val
  }

  /** @param {'uz'|'ru'|'en'} code */
  function setLocale(code) {
    if (!SUPPORTED_LOCALES.includes(code) || code === locale.value) return
    locale.value = code
    applyHtmlLang(code)
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, code)
      } catch {
        /* kvota to'lgan bo'lishi mumkin — jim o'tkazamiz */
      }
    }
  }

  /** Joriy til uchun Intl locale kodi (uz-UZ / ru-RU / en-US) */
  const intlLocale = computed(() => INTL_LOCALE[locale.value] || 'uz-UZ')

  return {
    locale: readonly(locale),
    intlLocale,
    t,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  }
}
