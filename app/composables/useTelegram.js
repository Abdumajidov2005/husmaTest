/**
 * Telegram WebApp composable.
 * SSR-safe: window ga faqat client-side da murojaat qilinadi.
 */
export function useTelegram() {
  const tg = computed(() =>
    import.meta.client ? window.Telegram?.WebApp ?? null : null
  )

  const user = computed(() => tg.value?.initDataUnsafe?.user ?? null)
  const colorScheme = computed(() => tg.value?.colorScheme ?? 'light')
  const isReady = computed(() => !!tg.value)

  // HapticFeedback faqat Telegram 6.1+ da mavjud
  const supportsHaptic = computed(() => {
    const version = tg.value?.version ?? '0'
    return parseFloat(version) >= 6.1
  })

  function ready() {
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

  // haptic — alias (orqaga mos)
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
