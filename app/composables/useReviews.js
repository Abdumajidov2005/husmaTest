
const ijobiyReviews = ref([])
const ijobiyLoaded  = ref(false)

export function useReviews() {
  const { apiFetch } = useAuth()

  async function fetchIjobiyReviews() {
    if (ijobiyLoaded.value) return ijobiyReviews.value
    try {
      const { ok, data } = await apiFetch('/api/reviews/ijobiy/?page_size=6', { auth: false })
      if (ok && Array.isArray(data?.results)) {
        ijobiyReviews.value = data.results
        ijobiyLoaded.value = true
      }
    } catch {}
    return ijobiyReviews.value
  }

  async function fetchRieltorReviews(rieltorId) {
    try {
      const { ok, data } = await apiFetch(`/api/reviews/rieltor/${rieltorId}/`)
      return ok && Array.isArray(data?.results) ? data.results : []
    } catch { return [] }
  }

  async function fetchMyReviews() {
    try {
      const { ok, data } = await apiFetch('/api/reviews/mening/')
      return ok && Array.isArray(data?.results) ? data.results : []
    } catch { return [] }
  }

  async function createReview(payload) {
    try {
      const { ok, status, data } = await apiFetch('/api/reviews/', { method: 'POST', body: payload })
      if (ok) return { ok: true, data }
      if (status === 400) return { ok: false, errorKey: 'reviews.errValidation' }
      return { ok: false, errorKey: 'reviews.errServer' }
    } catch { return { ok: false, errorKey: 'auth.networkError' } }
  }

  return {
    ijobiyReviews: readonly(ijobiyReviews),
    fetchIjobiyReviews,
    fetchRieltorReviews,
    fetchMyReviews,
    createReview,
  }
}
