/**
 * rieltor middleware — Faqat rieltor roliga ruxsat beradi.
 * Rieltor tab ko'rsatilishi uchun ishlatiladi.
 * Agar rieltor bo'lmasa — login sahifasiga yo'naltiradi.
 */
export default defineNuxtRouteMiddleware(() => {
  const { isRieltor, isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isRieltor.value) {
    return navigateTo('/')
  }
})
