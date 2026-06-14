
const myApplications      = ref([])
const rieltorApplications = ref([])
const myLoaded            = ref(false)
const rieltorLoaded       = ref(false)

const HOLAT_TO_STATUS  = { yangi: 'new', korilmoqda: 'in_progress', yopilgan: 'done' }
const TURI_TO_DEAL     = { ijara: 'arenda', sotib_olish: 'sotib' }
const DEAL_TO_TURI     = { arenda: 'ijara', sotib: 'sotib_olish' }
const MULK_TO_PROPERTY = { uy: 'uy', kvartira: 'kvartira' }
const PROPERTY_TO_MULK = { uy: 'uy', kvartira: 'kvartira' }

function mapAriza(a) {
  return {
    id: a.id,
    name: a.user_full_name || a.ism || '',
    phone: a.telefon || '',
    dealType: TURI_TO_DEAL[a.ariza_turi] || null,
    propertyType: MULK_TO_PROPERTY[a.mulk_turi?.kod || a.mulk_turi] || null,
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

  async function fetchMyApplications(holat = null) {
    try {
      const qs = holat ? `?holat=${holat}&page_size=50` : '?page_size=50'
      const { ok, data } = await apiFetch(`/api/arizalar/mening/${qs}`)
      if (ok && Array.isArray(data?.results)) {
        myApplications.value = data.results.map(mapAriza)
        myLoaded.value = true
      }
    } catch {}
    return myApplications.value
  }

  async function fetchRieltorApplications(holat = null) {
    try {
      const qs = holat ? `?holat=${holat}&page_size=50` : '?page_size=50'
      const { ok, data } = await apiFetch(`/api/rieltor/arizalar/${qs}`)
      if (ok && Array.isArray(data?.results)) {
        rieltorApplications.value = data.results.map(mapAriza)
        rieltorLoaded.value = true
      }
    } catch {}
    return rieltorApplications.value
  }

  async function addApplication(form) {
    const body = {
      hudud: form.district || null,
      ariza_turi: DEAL_TO_TURI[form.dealType] || 'ijara',
      mulk_turi: PROPERTY_TO_MULK[form.propertyType] || null,
      xonalar_soni: String(form.rooms),
      narx_min: form.budgetMin || 0,
      narx_max: form.budgetMax || 0,
      telefon: form.phone || null,
      ism: form.name || null,
      qoshimcha_izoh: form.notes || null,
    }
    try {
      const { ok, status, data } = await apiFetch('/api/arizalar/', { method: 'POST', body })
      if (ok && data) {
        myApplications.value.unshift(mapAriza(data))
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'form.errServer', detail: data }
      if (status === 401) return { ok: false, errorKey: 'form.errAuth' }
    } catch {}
    return { ok: false, errorKey: 'form.errServer' }
  }

  async function removeApplication(id) {
    try {
      const { ok } = await apiFetch(`/api/arizalar/${id}/`, { method: 'DELETE' })
      if (ok) {
        const i = myApplications.value.findIndex((a) => a.id === id)
        if (i !== -1) myApplications.value.splice(i, 1)
        return true
      }
    } catch {}
    return false
  }

  async function acceptApplication(id) {
    try {
      const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/qabul/`, { method: 'POST' })
      if (ok) {
        const i = rieltorApplications.value.findIndex((a) => a.id === id)
        if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled' }
      if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    } catch {}
    return { ok: false, errorKey: 'form.errServer' }
  }

  async function closeApplication(id) {
    try {
      const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/yopish/`, { method: 'POST' })
      if (ok) {
        const i = rieltorApplications.value.findIndex((a) => a.id === id)
        if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled' }
      if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    } catch {}
    return { ok: false, errorKey: 'form.errServer' }
  }

  function formatBudget(num) {
    if (!num || isNaN(num)) return '—'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' ' + t('units.budgetMlrd')
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + ' ' + t('units.budgetMln')
    return new Intl.NumberFormat(intlLocale.value).format(num)
  }

  function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1_000)
    if (diff < 60)     return t('units.timeS', { n: diff })
    if (diff < 3_600)  return t('units.timeM', { n: Math.floor(diff / 60) })
    if (diff < 86_400) return t('units.timeH', { n: Math.floor(diff / 3_600) })
    return t('units.timeD', { n: Math.floor(diff / 86_400) })
  }

  function formatDate(date) {
    try {
      return new Intl.DateTimeFormat(intlLocale.value, {
        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit',
      }).format(new Date(date))
    } catch { return '' }
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
