/**
 * Hero section uchun statik particle pozitsiyalari.
 * Math.random() template ichida emas, bu yerda — bir marta hisoblanadi.
 * onMounted ichida ishlaydi → SSR paytida muammo yo'q.
 */
export function useHeroParticles(count = 18) {
  const particles = ref([])

  onMounted(() => {
    particles.value = Array.from({ length: count }, (_, i) => ({
      id: i,
      width: Math.round(Math.random() * 50 + 15),
      left: Math.round(Math.random() * 95),
      top: Math.round(Math.random() * 95),
      opacity: +(Math.random() * 0.25 + 0.05).toFixed(2),
    }))
  })

  return { particles }
}
