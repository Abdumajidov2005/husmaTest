
const sliderCards = ref([])
const isLoaded    = ref(false)
const isLoading   = ref(false)

export function useSlider() {
  const { apiFetch } = useAuth()

  async function fetchSlider() {
    if (isLoaded.value || isLoading.value) return sliderCards.value
    isLoading.value = true
    try {
      const { ok, data } = await apiFetch('/api/slider/?page_size=10')
      if (ok && Array.isArray(data?.results)) {
        sliderCards.value = [...data.results].sort((a, b) => (a.tartib ?? 0) - (b.tartib ?? 0))
        isLoaded.value = true
      }
    } catch {}
    isLoading.value = false
    return sliderCards.value
  }

  return {
    sliderCards: readonly(sliderCards),
    isLoaded:    readonly(isLoaded),
    fetchSlider,
  }
}
