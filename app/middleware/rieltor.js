
export default defineNuxtRouteMiddleware(() => {
  const { isRieltor, isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!isRieltor.value) {
    return navigateTo('/')
  }
})
