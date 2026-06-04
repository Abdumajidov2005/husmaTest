<template>
  <article class="card border-l-2 border-l-brand-500">
    <!-- Header -->
    <div class="flex items-center gap-2.5 mb-3">
      <div
        class="w-9 h-9 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {{ application.name }}
        </p>
        <time
          :datetime="application.createdAt.toISOString()"
          class="flex items-center gap-1 mt-0.5"
        >
          <svg class="w-3 h-3 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 12 12" aria-hidden="true">
            <circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1.2"/>
            <path d="M6 3.5v2.5l1.5 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="text-xs text-brand-600 dark:text-brand-400 font-medium">
            {{ timeAgo(application.createdAt) }}
          </span>
        </time>
      </div>

      <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
        {{ t('rieltor.newBadge') }}
      </span>
    </div>

    <!-- Bitim turi (Arenda / Sotib olish) -->
    <div v-if="dealMeta" class="mb-2.5">
      <span
        class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
        :class="dealMeta.class"
      >
        {{ dealMeta.label }}
      </span>
    </div>

    <!-- Details grid -->
    <dl class="grid grid-cols-2 gap-2 mb-2.5 text-xs text-gray-600 dark:text-gray-300">
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M2 7V12h4V9h2v3h4V7L7 2 2 7z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
        <dt class="sr-only">{{ t('rieltor.roomsLabel') }}</dt>
        <dd>{{ t('rieltor.roomsValue', { n: application.rooms }) }}</dd>
      </div>
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 1C4.8 1 3 2.8 3 5c0 3.3 4 7.5 4 7.5S11 8.3 11 5c0-2.2-1.8-4-4-4z" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="7" cy="5" r="1.3" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        <dt class="sr-only">{{ t('rieltor.districtLabel') }}</dt>
        <dd class="truncate">{{ application.district }}</dd>
      </div>
    </dl>

    <div class="flex items-center gap-1.5 mb-2.5 text-xs text-gray-600 dark:text-gray-300">
      <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M7 4v3M5.5 5.5h2a1 1 0 010 2H6a1 1 0 000 2h2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <span>
        {{ formatBudget(application.budgetMin) }} — {{ formatBudget(application.budgetMax) }} {{ t('common.currency') }}
      </span>
    </div>

    <div v-if="application.notes" class="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 mb-3">
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ application.notes }}</p>
    </div>

    <!-- Call — UiButton link rejimida (tel: uchun semantik <a>, ripple + haptic bilan) -->
    <UiButton
      tag="link"
      :to="telHref"
      external
      variant="primary"
      size="md"
      custom-class="w-full !rounded-2xl !text-sm font-semibold"
      :aria-label="t('rieltor.callAria', { name: application.name })"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M2 3.5C2 2.67 2.67 2 3.5 2h2.1c.72 0 1.35.5 1.47 1.2l.6 3a1.5 1.5 0 01-.84 1.6l-.9.45a10.52 10.52 0 005.32 5.32l.45-.9a1.5 1.5 0 011.6-.84l3 .6c.7.12 1.2.75 1.2 1.47v2.1c0 .83-.67 1.5-1.5 1.5A16.5 16.5 0 012 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      {{ t('rieltor.call', { phone: application.phone }) }}
    </UiButton>
  </article>
</template>

<script setup>
const { formatBudget, timeAgo } = useApplications()
const { t } = useI18n()

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

// tel: uchun toza havola — faqat + va raqamlar (eski/aralash formatlar uchun ham)
const telHref = computed(
  () => `tel:${String(props.application.phone || '').replace(/[^\d+]/g, '')}`
)

// Bitim turi yorlig'i (eski arizalarda bo'lmasligi mumkin → null)
const dealMeta = computed(() => {
  switch (props.application.dealType) {
    case 'arenda':
      return { label: t('anketa.dealRent'), class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' }
    case 'sotib':
      return { label: t('anketa.dealBuy'), class: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' }
    default:
      return null
  }
})
</script>
