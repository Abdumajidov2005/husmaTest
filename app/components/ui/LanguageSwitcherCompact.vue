<template>
  <button
    type="button"
    class="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
    :title="t('profile.language')"
    :aria-label="t('profile.language')"
    @click="cycle"
  >
    <UiFlag :code="locale" />
  </button>
</template>

<script setup>
import { LOCALE_META } from '../../i18n/messages'

const { locale, setLocale, t } = useI18n()
const { haptic } = useTelegram()

function cycle() {
  haptic('light')
  const idx = LOCALE_META.findIndex((l) => l.code === locale.value)
  const next = LOCALE_META[(idx + 1) % LOCALE_META.length]
  setLocale(next.code)
}
</script>
