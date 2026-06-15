// Telegram avtomatik auth — sahifa komponentlari mount bo'lishidan OLDIN ishlaydi.
// MUHIM: bu plugin `await` qilinadi, shuning uchun slider va boshqa himoyalangan
// API chaqiruvlari (apiFetch, auth: true) JWT token olingandan keyingina ketadi.
// Aks holda HeroCarousel.fetchSlider() tokensiz so'rov yuborib 401 oladi.
export default defineNuxtPlugin(async () => {
  const { hydrate, telegramLogin, isAuthenticated } = useAuth()
  const { ready, initData } = useTelegram()

  // Telegram WebApp ni tayyorlaymiz (ready + expand) va tgRef ni sinxronlaymiz
  ready()

  // localStorage dagi mavjud sessiyani tiklaymiz (tezkor render uchun)
  hydrate()

  // Telegram ichida ochilgan bo'lsa va hali autentifikatsiya bo'lmagan bo'lsa —
  // initData ni backendga yuborib JWT olamiz. Sahifa render bo'lishidan oldin kutamiz.
  if (initData.value && !isAuthenticated.value) {
    await telegramLogin(initData.value)
  }
})
