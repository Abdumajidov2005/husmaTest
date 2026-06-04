<template>
  <div class="card">
    <!-- Sarlavha -->
    <div class="flex items-center gap-3 mb-3">
      <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M2.5 10h15M10 2.5c2 2.2 3 4.8 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.8-3-7.5s1-5.3 3-7.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.language') }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('profile.languageSub') }}</p>
      </div>
    </div>

    <!-- Tillar (segment tanlagich) -->
    <div class="grid grid-cols-3 gap-2" role="group" :aria-label="t('profile.language')">
      <button
        v-for="lang in LOCALE_META"
        :key="lang.code"
        type="button"
        :aria-pressed="locale === lang.code"
        :class="[
          'flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-all active:scale-[0.97]',
          locale === lang.code
            ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
            : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        ]"
        @click="choose(lang.code)"
      >
        <UiFlag :code="lang.code" />
        <span class="text-xs font-semibold leading-none">{{ t('langNames.' + lang.code) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { LOCALE_META } from '../../i18n/messages'

const { locale, setLocale, t } = useI18n()
const { haptic } = useTelegram()

function choose(code) {
  if (code === locale.value) return
  haptic('light')
  setLocale(code)
}
</script>
