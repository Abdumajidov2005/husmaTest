<template>
  <header class="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <div class="flex items-center justify-between px-3 py-2.5 gap-2">
      <AppLogo />

      <div class="flex items-center gap-2 flex-shrink-0">
        <nav class="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5 gap-0.5" role="tablist">
          <AppHeaderTab
            v-for="tab in visibleTabs"
            :key="tab.id"
            :tab="tab"
            :is-active="activeTab === tab.id"
            :badge="tab.id === 'rieltor' ? activeCount : undefined"
            @click="emit('tab', tab.id)"
          />
        </nav>

        <!-- Logout — faqat rieltor ko'radi -->
        <UiButton
          v-if="isRieltor"
          variant="ghost"
          size="sm"
          haptic="light"
          class="!w-8 !h-8 !p-0 rounded-xl text-gray-400 hover:text-red-500"
          :title="t('header.logoutTitle')"
          :aria-label="t('header.logoutAria')"
          @click="handleLogout"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </UiButton>
      </div>

      <NuxtLink
        to="/profile"
        class="profile-photo block w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 active:scale-95 transition-transform"
        :aria-label="t('header.profileAria')"
      >
        <img
          v-if="photoUrl"
          class="w-[45px] h-[45px] rounded-full object-cover"
          :src="photoUrl"
          :alt="name"
        >
        <span
          v-else
          class="w-[45px] h-[45px] rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center select-none"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
const { activeCount } = useApplications()
const { isRieltor, logout } = useAuth()
const { photoUrl, name, initials } = useCurrentUser()
const { t } = useI18n()

defineProps({
  activeTab:   { type: String,  required: true },
  showRieltor: { type: Boolean, default: false },
})

const emit = defineEmits(['tab'])

// Rieltor tab — har doim ko'rinadi (login sahifasi boshqaradi)
const visibleTabs = computed(() => [
  { id: 'home',    label: t('header.homeTab'),    icon: 'home'  },
  { id: 'rieltor', label: t('header.rieltorTab'), icon: 'users' },
])

async function handleLogout() {
  logout()
  await navigateTo('/login')
}
</script>
