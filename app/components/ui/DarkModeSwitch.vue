<template>
  <ClientOnly>
    <div class="card flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
        <svg v-if="isDark" class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <svg v-else class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ subtitle }}</p>
      </div>

      <!-- Pill toggle -->
      <button
        type="button"
        role="switch"
        :aria-checked="isDark"
        :aria-label="title"
        class="relative inline-flex flex-shrink-0 !w-[52px] h-[30px] rounded-full transition-colors duration-300 focus:outline-none"
        :class="isDark ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'"
        @click="onToggle"
      >
        <span
          class="absolute top-[2px] left-[2px] w-[26px] h-[26px] rounded-full bg-white shadow-md transition-transform duration-300 ease-out"
          :class="isDark ? 'translate-x-[22px]' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- SSR/yuklanish paytida joy band qilib turish uchun zaxira -->
    <template #fallback>
      <div class="card flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.lightMode') }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('profile.lightModeSub') }}</p>
        </div>
        <div class="!w-[52px] h-[30px] rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme()
const { haptic } = useTelegram()
const { t } = useI18n()

// Holatga qarab: qorong'u → "Tungi rejim", yorug' → "Kunduzgi rejim"
const title = computed(() => (isDark.value ? t('profile.darkMode') : t('profile.lightMode')))
const subtitle = computed(() => (isDark.value ? t('profile.darkModeSub') : t('profile.lightModeSub')))

function onToggle() {
  haptic('light')
  toggleTheme()
}
</script>
