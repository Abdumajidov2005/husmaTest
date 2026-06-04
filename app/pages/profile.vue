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
        <h1 class="text-base font-bold text-gray-900 dark:text-white">{{ t('profile.title') }}</h1>
      </div>
    </header>

    <!-- Avatar / identity -->
    <section class="px-3 pt-4">
      <div class="card flex items-center gap-4">
        <div class="relative flex-shrink-0">
          <img
            v-if="photoUrl"
            :src="photoUrl"
            :alt="name"
            class="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
          />
          <div
            v-else
            class="w-16 h-16 rounded-2xl flex items-center justify-center bg-brand-600 text-white text-xl font-bold select-none"
            aria-hidden="true"
          >
            {{ initials }}
          </div>
        </div>

        <div class="min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white truncate">{{ name }}</p>
          <p v-if="username" class="text-xs text-gray-400 dark:text-gray-500 truncate">@{{ username }}</p>
          <span
            class="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
            :class="isRieltor
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
          >
            <svg v-if="isRieltor" class="w-3 h-3" fill="none" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M6 1l1.5 3 3.3.3-2.5 2.1.8 3.2L6 8.2 2.9 9.9l.8-3.2L1.2 4.6 4.5 4 6 1z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="isTelegram" class="w-3 h-3" fill="none" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M10.5 2L1 5.6l3.2 1 1.3 3.4 1.7-1.8L10 10.5 10.5 2z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
            </svg>
            {{ roleLabel }}
          </span>
        </div>
      </div>

      <!-- Phone (rieltor) -->
      <div v-if="phone" class="card mt-3 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 3C2 2.45 2.45 2 3 2h1.6c.53 0 .99.37 1.09.89l.44 2.2a1 1 0 01-.6 1.1l-.72.36a7.6 7.6 0 003.64 3.64l.36-.72a1 1 0 011.1-.6l2.2.44c.52.1.89.56.89 1.09V12c0 .55-.45 1-1 1A12.5 12.5 0 012 3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-[11px] text-gray-400 leading-none mb-0.5">{{ t('profile.phone') }}</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ phone }}</p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="grid grid-cols-2 gap-2 mx-3 mt-3">
      <div class="card text-center py-3">
        <div class="w-8 h-8 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 3h10v14l-5-3-5 3V3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="font-bold text-xl text-gray-900 dark:text-white tabular-nums">{{ myApplications.length }}</p>
        <p class="text-xs text-gray-400">{{ t('profile.total') }}</p>
      </div>
      <div class="card text-center py-3">
        <div class="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg class="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 6v4l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="font-bold text-xl text-gray-900 dark:text-white tabular-nums">{{ activeMine }}</p>
        <p class="text-xs text-gray-400">{{ t('profile.pending') }}</p>
      </div>
    </section>

    <!-- Navigatsiya -->
    <section class="px-3 mt-4 space-y-2">
      <NuxtLink
        to="/my-applications"
        class="card flex items-center gap-3 active:scale-[0.98] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div class="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 3h12v14H4V3zM7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.myApps') }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('profile.myAppsSub') }}</p>
        </div>
        <span
          v-if="myApplications.length"
          class="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full tabular-nums flex-shrink-0"
        >
          {{ myApplications.length }}
        </span>
        <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink>

      <NuxtLink
        to="/?apply=1"
        class="card flex items-center gap-3 active:scale-[0.98] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div class="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.newApp') }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('profile.newAppSub') }}</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink>

      <!-- Rieltor paneli — faqat rieltor ko'radi -->
      <NuxtLink
        v-if="isRieltor"
        to="/?tab=rieltor"
        class="card flex items-center gap-3 active:scale-[0.98] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.rieltorPanel') }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ t('profile.rieltorPanelSub') }}</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink>
    </section>

    <!-- Sozlamalar: til va tungi rejim -->
    <section class="px-3 mt-4 space-y-2">
      <UiLanguageSwitcher />
      <UiDarkModeSwitch />
    </section>

    <!-- Logout — faqat rieltor -->
    <section v-if="isRieltor" class="px-3 mt-4">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-semibold text-sm active:scale-[0.98] transition-transform"
        @click="handleLogout"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('profile.logout') }}
      </button>
    </section>
  </div>
</template>

<script setup>
const router = useRouter()
const { t } = useI18n()
const { ready, haptic } = useTelegram()
const { logout, isRieltor } = useAuth()
const {
  name, username, photoUrl, phone, initials, isTelegram, roleLabel, id: ownerId,
} = useCurrentUser()
const { getApplicationsByOwner } = useApplications()

const myApplications = getApplicationsByOwner(ownerId)
const activeMine = computed(
  () => myApplications.value.filter((a) => a.status === 'new').length
)

onMounted(() => ready())

function goBack() {
  haptic('light')
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/', { replace: true })
  }
}

// Telegram ning tabiiy "Orqaga" tugmasi (brauzerda — yuqoridagi maxsus tugma)
const { isNativeBack } = useBackButton(goBack)

async function handleLogout() {
  haptic('medium')
  logout()
  await navigateTo('/login')
}
</script>
