
const homeStats    = ref(null)
const rieltorStats = ref(null)
const homeLoaded    = ref(false)
const rieltorLoaded = ref(false)

export function useStatistika() {
  const { apiFetch } = useAuth()

  async function fetchHomeStatistika() {
    if (homeLoaded.value) return homeStats.value
    try {
      const { ok, data } = await apiFetch('/api/statistika/', { auth: false })
      if (ok && data) {
        homeStats.value = data
        homeLoaded.value = true
      }
    } catch {}
    return homeStats.value
  }

  async function fetchRieltorStatistika() {
    try {
      const { ok, data } = await apiFetch('/api/rieltor/statistika/')
      if (ok && data) {
        rieltorStats.value = data
        rieltorLoaded.value = true
      }
    } catch {}
    return rieltorStats.value
  }

  return {
    homeStats:    readonly(homeStats),
    rieltorStats: readonly(rieltorStats),
    fetchHomeStatistika,
    fetchRieltorStatistika,
  }
}
