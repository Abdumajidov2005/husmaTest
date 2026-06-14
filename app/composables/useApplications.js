
const myApplications      = ref([])
const rieltorApplications = ref([])
const myLoaded            = ref(false)
const rieltorLoaded       = ref(false)

const HOLAT_TO_STATUS  = { yangi: 'new', korilmoqda: 'in_progress', yopilgan: 'done' }
const TURI_TO_DEAL     = { ijara: 'arenda', sotib_olish: 'sotib' }
const DEAL_TO_TURI     = { arenda: 'ijara', sotib: 'sotib_olish' }
const MULK_TO_PROPERTY = { uy: 'uy', kvartira: 'kvartira' }
const PROPERTY_TO_MULK = { uy: 'uy', kvartira: 'kvartira' }

// Demo arizalar — server javob bermasa ko'rsatiladi
const DEMO_MY_APPLICATIONS = [
  {
    id: 1001,
    name: 'Jasur Toshmatov',
    phone: '+998901234567',
    dealType: 'arenda',
    propertyType: 'kvartira',
    rooms: 2,
    district: 'Yunusobod tumani',
    budgetMin: 3000000,
    budgetMax: 5000000,
    notes: "Ta'mirlangan, lift bo'lsin",
    createdAt: new Date(Date.now() - 3600000),
    status: 'new',
    vaqtOldin: '1s oldin',
  },
  {
    id: 1002,
    name: 'Malika Yusupova',
    phone: '+998901234568',
    dealType: 'sotib',
    propertyType: 'kvartira',
    rooms: 3,
    district: 'Chilonzor tumani',
    budgetMin: 80000000,
    budgetMax: 120000000,
    notes: 'Metro yaqinida',
    createdAt: new Date(Date.now() - 86400000),
    status: 'in_progress',
    vaqtOldin: '1k oldin',
  },
]

const DEMO_RIELTOR_APPLICATIONS = [
  {
    id: 2001,
    name: 'Bobur Rahimov',
    phone: '+998901112233',
    dealType: 'arenda',
    propertyType: 'kvartira',
    rooms: 1,
    district: 'Mirzo Ulug\'bek tumani',
    budgetMin: 2000000,
    budgetMax: 3500000,
    notes: '',
    createdAt: new Date(Date.now() - 1800000),
    status: 'new',
    vaqtOldin: '30m oldin',
  },
  {
    id: 2002,
    name: 'Nilufar Karimova',
    phone: '+998909998877',
    dealType: 'sotib',
    propertyType: 'kvartira',
    rooms: 2,
    district: 'Yunusobod tumani',
    budgetMin: 60000000,
    budgetMax: 90000000,
    notes: "Yangi bino bo'lsin",
    createdAt: new Date(Date.now() - 7200000),
    status: 'new',
    vaqtOldin: '2s oldin',
  },
  {
    id: 2003,
    name: 'Sanjar Umarov',
    phone: '+998901234500',
    dealType: 'arenda',
    propertyType: 'kvartira',
    rooms: 3,
    district: 'Shayxontohur tumani',
    budgetMin: 5000000,
    budgetMax: 8000000,
    notes: 'Mebelli',
    createdAt: new Date(Date.now() - 172800000),
    status: 'in_progress',
    vaqtOldin: '2k oldin',
  },
]

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

let _demoIdCounter = 3000

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
        return myApplications.value
      }
    } catch {}
    // Demo fallback
    if (!myLoaded.value) {
      myApplications.value = [...DEMO_MY_APPLICATIONS]
      myLoaded.value = true
    }
    return myApplications.value
  }

  async function fetchRieltorApplications(holat = null) {
    try {
      const qs = holat ? `?holat=${holat}&page_size=50` : '?page_size=50'
      const { ok, data } = await apiFetch(`/api/rieltor/arizalar/${qs}`)
      if (ok && Array.isArray(data?.results)) {
        rieltorApplications.value = data.results.map(mapAriza)
        rieltorLoaded.value = true
        return rieltorApplications.value
      }
    } catch {}
    // Demo fallback
    let list = [...DEMO_RIELTOR_APPLICATIONS]
    if (holat === 'yangi')      list = list.filter((a) => a.status === 'new')
    if (holat === 'korilmoqda') list = list.filter((a) => a.status === 'in_progress')
    if (holat === 'yopilgan')   list = list.filter((a) => a.status === 'done')
    rieltorApplications.value = list
    rieltorLoaded.value = true
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
      const { ok, status, data } = await apiFetch('/api/arizalar/', {
        method: 'POST',
        body,
      })
      if (ok && data) {
        myApplications.value.unshift(mapAriza(data))
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'form.errServer', detail: data }
      if (status === 401) {
        // 401 — demo rejimda saqlash
      }
    } catch {}

    // Demo rejim — localda saqlaymiz
    const demoAriza = {
      id: ++_demoIdCounter,
      name: form.name || '',
      phone: form.phone || '',
      dealType: form.dealType,
      propertyType: form.propertyType,
      rooms: form.rooms,
      district: '',
      budgetMin: form.budgetMin || 0,
      budgetMax: form.budgetMax || 0,
      notes: form.notes || '',
      createdAt: new Date(),
      status: 'new',
      vaqtOldin: 'Hozirgina',
    }
    myApplications.value.unshift(demoAriza)
    return { ok: true }
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
    // Demo — localdan o'chiramiz
    const i = myApplications.value.findIndex((a) => a.id === id)
    if (i !== -1) myApplications.value.splice(i, 1)
    return true
  }

  async function acceptApplication(id) {
    try {
      const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/qabul/`, {
        method: 'POST',
      })
      if (ok) {
        const i = rieltorApplications.value.findIndex((a) => a.id === id)
        if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
        else if (i !== -1) rieltorApplications.value[i] = { ...rieltorApplications.value[i], status: 'in_progress' }
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled' }
      if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    } catch {}
    // Demo — holatni o'zgartiramiz
    const i = rieltorApplications.value.findIndex((a) => a.id === id)
    if (i !== -1) rieltorApplications.value[i] = { ...rieltorApplications.value[i], status: 'in_progress' }
    return { ok: true }
  }

  async function closeApplication(id) {
    try {
      const { ok, status, data } = await apiFetch(`/api/rieltor/arizalar/${id}/yopish/`, {
        method: 'POST',
      })
      if (ok) {
        const i = rieltorApplications.value.findIndex((a) => a.id === id)
        if (i !== -1 && data?.ariza) rieltorApplications.value[i] = mapAriza(data.ariza)
        else if (i !== -1) rieltorApplications.value[i] = { ...rieltorApplications.value[i], status: 'done' }
        return { ok: true }
      }
      if (status === 400) return { ok: false, errorKey: 'rieltor.errAlreadyHandled' }
      if (status === 404) return { ok: false, errorKey: 'rieltor.errNotFound' }
    } catch {}
    // Demo — holatni o'zgartiramiz
    const i = rieltorApplications.value.findIndex((a) => a.id === id)
    if (i !== -1) rieltorApplications.value[i] = { ...rieltorApplications.value[i], status: 'done' }
    return { ok: true }
  }

  function formatBudget(num) {
    if (!num || isNaN(num)) return '—'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' ' + t('units.budgetMlrd')
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + ' ' + t('units.budgetMln')
    return new Intl.NumberFormat(intlLocale.value).format(num)
  }

  function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1_000)
    if (diff < 60)    return t('units.timeS', { n: diff })
    if (diff < 3_600) return t('units.timeM', { n: Math.floor(diff / 60) })
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
