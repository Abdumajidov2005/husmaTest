
// --- Telegram WebApp obyekti uchun REAKTIV holat ---
// MUHIM: window.Telegram reaktiv emas, shuning uchun uni computed ichida
// o'qish bir marta keshlanib qoladi (skript kech yuklansa — null bo'lib qoladi).
// Buning o'rniga shallowRef ishlatamiz va skript tayyor bo'lishi bilan yangilaymiz.
const tgRef = shallowRef(null)

function syncTg() {
  if (import.meta.client && !tgRef.value && window.Telegram?.WebApp) {
    tgRef.value = window.Telegram.WebApp
  }
}

// Klient tomonda darhol sinxronlashga urinamiz; skript hali yuklanmagan bo'lsa,
// qisqa interval bilan tayyor bo'lishini kutamiz (defer/sekin tarmoq holatlari uchun).
if (import.meta.client) {
  syncTg()
  if (!tgRef.value) {
    let tries = 0
    const id = setInterval(() => {
      syncTg()
      if (tgRef.value || ++tries > 60) clearInterval(id)
    }, 50)
  }
}

export function useTelegram() {
  // Har bir chaqiruvda window dan o'qib refni yangilashga urinamiz
  syncTg()
  const tg = tgRef

  const user = computed(() => tg.value?.initDataUnsafe?.user ?? null)
  // Backendga yuborish uchun xom (raw) initData satri
  const initData = computed(() => tg.value?.initData ?? '')
  const colorScheme = computed(() => tg.value?.colorScheme ?? 'light')
  const isReady = computed(() => !!tg.value)

  // HapticFeedback faqat Telegram 6.1+ da mavjud
  const supportsHaptic = computed(() => {
    const version = tg.value?.version ?? '0'
    return parseFloat(version) >= 6.1
  })

  function ready() {
    syncTg()
    tg.value?.ready()
    tg.value?.expand()
  }

  /**
   * @param {'light'|'medium'|'heavy'|'rigid'|'soft'} style
   */
  function hapticImpact(style = 'light') {
    if (!supportsHaptic.value) return
    tg.value?.HapticFeedback?.impactOccurred(style)
  }

  const haptic = hapticImpact

  /**
   * @param {'error'|'success'|'warning'} type
   */
  function notificationHaptic(type = 'success') {
    if (!supportsHaptic.value) return
    tg.value?.HapticFeedback?.notificationOccurred(type)
  }

  function close() {
    tg.value?.close()
  }

  // --- BackButton (Telegram WebApp 6.1+) ---
  const supportsBackButton = computed(() => {
    const version = tg.value?.version ?? '0'
    return parseFloat(version) >= 6.1 && !!tg.value?.BackButton
  })

  function showBackButton() {
    if (supportsBackButton.value) tg.value.BackButton.show()
  }

  function hideBackButton() {
    if (supportsBackButton.value) tg.value.BackButton.hide()
  }

  function onBackButton(cb) {
    if (supportsBackButton.value) tg.value.BackButton.onClick(cb)
  }

  function offBackButton(cb) {
    if (supportsBackButton.value) tg.value.BackButton.offClick(cb)
  }

  const setHeaderColor = (color) => {
    if (tg.value) {
      tg.value?.setHeaderColor(color);
    }
  };

  return {
    tg,
    user,
    initData,
    colorScheme,
    isReady,
    supportsHaptic,
    setHeaderColor,
    ready,
    haptic,
    hapticImpact,
    notificationHaptic,
    close,
    supportsBackButton,
    showBackButton,
    hideBackButton,
    onBackButton,
    offBackButton,
  }
}
