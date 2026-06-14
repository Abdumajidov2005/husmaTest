

const myApplications      = ref([]) // user — o'z arizalari
const rieltorApplications = ref([]) // rieltor — barcha arizalar

const myLoaded      = ref(false)
const rieltorLoaded = ref(false)

const HOLAT_TO_STATUS = { yangi: 'new', korilmoqda: 'in_progress', yopilgan: 'done' }
const TURI_TO_DEAL    = { ijara: 'arenda', sotib_olish: 'sotib' }
const DEAL_TO_TURI    = { arenda: 'ijara', sotib: 'sotib_olish' }
const MULK_TO_PROPERTY = { uy: 'uy', kvartira: 'kvartira' }
const PROPERTY_TO_MULK = { uy: 'uy', kvartira: 'kvartira' }

/**
 * Backend Ariza/MaklerAriza obyektini UI uchun normallashtiradi.
 */
function mapAriza(a) {
  return {
    id: a.id,
    name: a.user_full_name || a.ism || '',
    phone: a.telefon || '',
    dealType: TURI_TO_DEAL[a.ariza_turi] || null,
    propertyType: MULK_TO_PROPERTY[a.mulk_turi] || null,
    rooms: /^\d+$/.test(String(a.xonalar_soni)) ? Number(a.xonalar_soni) : a.xonalar_soni,
    district: a.hudud?.nomi || '',
    budgetMin: a.narx_min ?? 0,
    budgetMax: a.narx_max ?? 0,
    notes: a.qoshimcha_izoh || '',
    createdAt: a.created_at ? new Date(a.created_at) : new Date(),
    status: HOLAT_TO_STATUS[a.holat] || 'new',
    vaqtOldin: a.vaqt_oldin || null,
  }
}

export function useApplications() {
  const { t, intlLocale } = useI18n()
  const { apiFetch } = useAuth()

  const activeCount = computed(
    () => rieltorApplications.value.filter((a) => a.status === 'new').length
  )

  /**
   * User — o'z arizalarini yuklash.
   * @param {string|null} holat — 'yangi' | 'korilmoqda' | 'yopilgan'
   */
  async function fetchMyApplications(holat = null) {
    const qs = holat ? `?holat=${holat}&page_size=50` : '?page_size=50'
    const { ok, data } = await apiFetch(`/api/arizalar/mening/${qs}`)
    if (ok && Array.isArray(data?.results)) {
      myApplications.value = data.results.map(mapAriza)
      myLoaded.value = true
    }
    return myApplications.value
  }

  /**
   * Rieltor — barcha arizalarni yuklash.
   * @param {string|null} holat
   */
  async function fetchRieltorApplications(holat = null) {
    const qs = holat ? `?holat=${holat}&page_size=50` : '?page_size=50'
    const { ok, data } = await apiFetch(`/api/rieltor/arizalar/${qs}`)
    if (ok && Array.isArray(data?.results)) {
      rieltorApplications.value = data.results.map(mapAriza)
      rieltorLoaded.value = true
    }
    return rieltorApplications.value
  }

  /**
   * Yangi ariza yuborish.
   * @param {object} form — {name, phone, dealType, rooms, district (hudud id), budgetMin, budgetMax, notes}
   * @returns {{ ok: boolean, errorKey?: string, detail?: object }}
   */
  async function addApplication(form) {
    const body = {
      hudud: form.district || null,
      ariza_turi: DEAL_TO_TURI[form.dealType] || 'ijara',
      mulk_turi: PROPERTY_TO_MULK[form.propertyType] || 'kvartira',
      xonalar_soni: String(form.rooms),
      narx_min: form.budgetMin || 0,
      narx_max: form.budgetMax || 0,
      telefon: form.phone || null,
      ism: form.name || null,
      qoshimcha_izoh: form.notes || null,
    }

    const { ok, status, data } = await apiFetch('/api/arizalar/', {
      method: 'POST',
      body,
    })

    if (ok && data) {
      myApplications.value.unshift(mapAriza(data))
      return { ok: true }
    }
    if (status === 400) return { ok: false, errorKey: 'form.errServer', detail: data }
    if (status === 401) return { ok: false, errorKey: 'form.errAuth' }
    return { ok: false, errorKey: 'form.errServer' }
  }

  /**
   * User — o'z arizasini o'chirish.
   * @param {number} id
   */
  async function removeApplication(id) {
    const { ok } = await apiFetch(`/api/arizalar/${id}/`, { method: 'DELETE' })
    if (ok) {
      const i = myApplications.value.findIndex((a) => a.id === id)
      if (i !== -1) myApplications.value.splice(i, 1)
    }
    return ok
  }

  /**
   * Rieltor — arizani qabul qilish.
   * @param {number} id
   * @returns {{ ok: boolean, errorKey?: string }}
   */
  async function acceptApplication(id) {
    const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/qabul/`, {
      method: 'POST',
    })
    if (ok) {
      const i = rieltorApplications.value.findIndex((a) => a.id === id)
      if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
      return { ok: true }
    }
    if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled', detail: data?.error }
    if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    return { ok: false, errorKey: 'form.errServer' }
  }

  /**
   * Rieltor — ish bilan ishni yakunlash (arizani yopish).
   * @param {number} id
   * @returns {{ ok: boolean, errorKey?: string }}
   */
  async function closeApplication(id) {
    const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/yopish/`, {
      method: 'POST',
    })
    if (ok) {
      const i = rieltorApplications.value.findIndex((a) => a.id === id)
      if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
      return { ok: true }
    }
    if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled', detail: data?.error }
    if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    return { ok: false, errorKey: 'form.errServer' }
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
    myApplications: readonly(myApplications),
    rieltorApplications: readonly(rieltorApplications),
    myLoaded: readonly(myLoaded),
    rieltorLoaded: readonly(rieltorLoaded),
    activeCount,
    fetchMyApplications,
    fetchRieltorApplications,
    addApplication,
    removeApplication,
    acceptApplication,
    closeApplication,
    formatBudget,
    timeAgo,
    formatDate,
  }
}
