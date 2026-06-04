/**
 * useBackButton — Sahifa uchun Telegram WebApp ning tabiiy "Orqaga" tugmasi.
 *
 * Telegram ichida  → tabiiy BackButton ko'rsatiladi, bosilganda onBack() ishlaydi.
 * Brauzerda (Telegram yo'q) → hech narsa qilinmaydi; `isNativeBack` false bo'lib,
 * sahifadagi maxsus tugma zaxira sifatida ko'rinadi.
 *
 * @param {() => void} onBack — orqaga qaytish ishlovchisi
 * @returns {{ isNativeBack: import('vue').Ref<boolean> }}
 */
export function useBackButton(onBack) {
  const {
    supportsBackButton,
    showBackButton,
    hideBackButton,
    onBackButton,
    offBackButton,
  } = useTelegram()

  const isNativeBack = ref(false)
  let handler = null

  function activate() {
    if (!import.meta.client || !supportsBackButton.value || handler) return
    handler = () => {
      try { onBack?.() } catch { /* xatoga yo'l qo'ymaymiz */ }
    }
    onBackButton(handler)
    showBackButton()
    isNativeBack.value = true
  }

  function deactivate() {
    if (handler) offBackButton(handler)
    hideBackButton()
    handler = null
    isNativeBack.value = false
  }

  onMounted(() => {
    if (supportsBackButton.value) {
      activate()
    } else {
      // Telegram skripti kechroq yuklansa — tayyor bo'lishi bilan ulaymiz
      const stop = watch(supportsBackButton, (ok) => {
        if (ok) { activate(); stop() }
      })
    }
  })

  onBeforeUnmount(deactivate)

  return { isNativeBack }
}
