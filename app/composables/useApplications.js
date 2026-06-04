/**
 * Module-level state — singleton pattern.
 * ref() tashqarida bo'lgani uchun barcha komponentlar
 * bir xil reaktiv state ni ulashadi.
 *
 * Yangilik:
 *  - localStorage da saqlanadi (sahifa yangilansa ham anketalar yo'qolmaydi)
 *  - har bir anketa `ownerId` ga ega → "User bergan anketalar" sahifasi
 *    faqat shu foydalanuvchining arizalarini ko'rsatadi
 */

const STORAGE_KEY = 'husma_applications'

const SEED = [
  {
    id: 1,
    name: 'Alisher',
    phone: '+998 90 123-45-67',
    rooms: 2,
    district: 'Yunusobod',
    budgetMin: 300_000_000,
    budgetMax: 450_000_000,
    notes: "Ta'mirlangan, yangi bino kerak",
    createdAt: new Date(Date.now() - 2_000),
    status: 'new',
    ownerId: null, // demo — boshqa mijozning arizasi
  },
  {
    id: 2,
    name: 'Madina',
    phone: '+998 91 234-56-78',
    rooms: 1,
    district: 'Chilonzor',
    budgetMin: 200_000_000,
    budgetMax: 280_000_000,
    notes: 'Metro yaqinida, yuqori qavat',
    createdAt: new Date(Date.now() - 5_000),
    status: 'new',
    ownerId: null,
  },
]

const applications = ref(SEED)

// localStorage hydration — faqat client da, bir marta
let loaded = false

function reviveDates(list) {
  return list.map((a) => ({
    ownerId: null,
    status: 'new',
    ...a,
    createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
  }))
}

function load() {
  if (loaded || !import.meta.client) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        applications.value = reviveDates(parsed)
        return
      }
    }
    // Birinchi ishga tushirish — seed ni saqlab qo'yamiz
    save()
  } catch {
    /* buzilgan ma'lumot — seed bilan davom etamiz */
  }
}

function save() {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications.value))
  } catch {
    /* kvota to'lgan bo'lishi mumkin — jim o'tkazib yuboramiz */
  }
}

/**
 * @typedef {Object} Application
 * @property {number}  id
 * @property {string}  name
 * @property {string}  phone
 * @property {number|string} rooms
 * @property {string}  district
 * @property {number}  budgetMin
 * @property {number}  budgetMax
 * @property {string}  notes
 * @property {Date}    createdAt
 * @property {'new'|'in_progress'|'done'} status
 * @property {string|null} ownerId
 */

export function useApplications() {
  load()

  const { t, intlLocale } = useI18n()

  const activeCount = computed(
    () => applications.value.filter((a) => a.status === 'new').length
  )

  /**
   * @param {Omit<Application, 'id'|'createdAt'|'status'|'ownerId'>} data
   * @param {string|null} ownerId — anketani yuborgan foydalanuvchi
   */
  function addApplication(data, ownerId = null) {
    applications.value.unshift({
      id: Date.now(),
      ...data,
      createdAt: new Date(),
      status: 'new',
      ownerId,
    })
    save()
  }

  /**
   * Foydalanuvchi o'z anketasini o'chiradi.
   * @param {number} id
   */
  function removeApplication(id) {
    const i = applications.value.findIndex((a) => a.id === id)
    if (i !== -1) {
      applications.value.splice(i, 1)
      save()
    }
  }

  /**
   * Berilgan foydalanuvchiga tegishli anketalar (eng yangisi birinchi).
   * @param {import('vue').Ref<string|null>|string|null} owner
   */
  function getApplicationsByOwner(owner) {
    return computed(() => {
      const ownerId = unref(owner)
      if (!ownerId) return []
      return applications.value.filter((a) => a.ownerId === ownerId)
    })
  }

  /** @param {number} num */
  function formatBudget(num) {
    if (!num || isNaN(num)) return '—'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' ' + t('units.budgetMlrd')
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + ' ' + t('units.budgetMln')
    return new Intl.NumberFormat(intlLocale.value).format(num)
  }

  /** @param {Date|string} date */
  function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1_000)
    if (diff < 60) return t('units.timeS', { n: diff })
    if (diff < 3_600) return t('units.timeM', { n: Math.floor(diff / 60) })
    if (diff < 86_400) return t('units.timeH', { n: Math.floor(diff / 3_600) })
    return t('units.timeD', { n: Math.floor(diff / 86_400) })
  }

  /** @param {Date|string} date */
  function formatDate(date) {
    try {
      return new Intl.DateTimeFormat(intlLocale.value, {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date))
    } catch {
      return ''
    }
  }

  return {
    applications: readonly(applications),
    activeCount,
    addApplication,
    removeApplication,
    getApplicationsByOwner,
    formatBudget,
    timeAgo,
    formatDate,
  }
}
