<template>
  <div class="relative min-h-screen pb-10">
    <!-- Top bar -->
    <header class="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-2 px-3 py-2.5">
        <UiButton
          v-if="!isNativeBack"
          variant="ghost"
          size="sm"
          haptic="light"
          class="!w-9 !h-9 !p-0 rounded-xl"
          :aria-label="t('common.backAria')"
          @click="goBack"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12 4L6 10l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </UiButton>
        <h1 class="text-base font-bold text-gray-900 dark:text-white">{{ t('myApps.title') }}</h1>
      </div>
    </header>

    <!-- List -->
    <section class="px-3 pt-4">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ t('myApps.subtitle') }}
        </p>
        <span
          v-if="myApplications.length"
          class="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full tabular-nums flex-shrink-0"
          :aria-label="t('myApps.countAria', { n: myApplications.length })"
        >
          {{ myApplications.length }}
        </span>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-gray-400 text-sm">
        {{ t('common.loading') }}
      </div>

      <TransitionGroup v-else name="list" tag="div" class="space-y-3">
        <ProfileAnketaCard
          v-for="app in myApplications"
          :key="app.id"
          :application="app"
          @cancel="handleCancel"
        />
      </TransitionGroup>

      <!-- Bo'sh holat -->
      <div v-if="!isLoading && myApplications.length === 0" class="text-center pt-14 px-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 4h12v16l-6-3.5L6 20V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ t('myApps.emptyTitle') }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-5">
          {{ t('myApps.emptyDesc') }}
        </p>
        <NuxtLink
          to="/?apply=1"
          class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 text-white font-semibold text-sm active:scale-95 transition-transform"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('myApps.leave') }}
        </NuxtLink>
      </div>

      <!-- Pastki CTA (anketalar bor bo'lganda) -->
      <NuxtLink
        v-if="myApplications.length"
        to="/?apply=1"
        class="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium text-sm active:scale-[0.98] transition-transform"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ t('myApps.leaveMore') }}
      </NuxtLink>
    </section>

    <UiSuccessModal
      :show="showCancelled"
      :title="t('myApps.cancelledTitle')"
      :desc="t('myApps.cancelledDesc')"
      @close="showCancelled = false"
    />
  </div>
</template>

<script setup>
const router = useRouter()
const { t } = useI18n()
const { ready, haptic, notificationHaptic } = useTelegram()
const { myApplications, fetchMyApplications, removeApplication } = useApplications()

const isLoading = ref(false)
const showCancelled = ref(false)

onMounted(async () => {
  ready()
  isLoading.value = true
  try {
    await fetchMyApplications()
  } finally {
    isLoading.value = false
  }
})

function goBack() {
  haptic('light')
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/profile', { replace: true })
  }
}

// Telegram ning tabiiy "Orqaga" tugmasi
const { isNativeBack } = useBackButton(goBack)

async function handleCancel(id) {
  const ok = await removeApplication(id)
  if (ok) {
    showCancelled.value = true
  } else {
    notificationHaptic('error')
  }
}
</script>

<style scoped>
.list-enter-active { transition: all 0.3s ease; }
.list-enter-from   { opacity: 0; transform: translateY(-8px); }
.list-leave-active { transition: all 0.2s ease; }
.list-leave-to     { opacity: 0; transform: translateX(20px); }
</style>
