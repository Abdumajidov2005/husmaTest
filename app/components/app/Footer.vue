<template>
  <footer class="mt-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="px-3 pt-5 pb-4">
      <h2 class="text-sm font-bold text-center text-gray-900 dark:text-white mb-4">
        {{ t('footer.contactTitle') }}
      </h2>

      <div class="grid grid-cols-2 gap-2">
        <a
          v-for="item in CONTACTS"
          :key="item.label"
          :href="item.href"
          class="card flex items-start gap-3 hover:border-brand-200 dark:hover:border-brand-700 transition-colors active:scale-95"
        >
          <div class="mt-0.5 flex-shrink-0">
            <svg class="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 16 16" aria-hidden="true">
              <!-- phone -->
              <template v-if="item.icon === 'phone'">
                <path d="M2 3C2 2.45 2.45 2 3 2h1.6c.53 0 .99.37 1.09.89l.44 2.2a1 1 0 01-.6 1.1l-.72.36a7.6 7.6 0 003.64 3.64l.36-.72a1 1 0 011.1-.6l2.2.44c.52.1.89.56.89 1.09V12c0 .55-.45 1-1 1A12.5 12.5 0 012 3z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </template>
              <!-- mail -->
              <template v-else-if="item.icon === 'mail'">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
                <path d="M1.5 5l6.5 4.5L14.5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </template>
              <!-- telegram -->
              <template v-else-if="item.icon === 'telegram'">
                <path d="M14 2.5L1.5 7.2l4.3 1.4 1.7 4.9 2.2-2.3 3.5 2.6L14 2.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                <path d="M5.8 8.6l2.4 1.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </template>
              <!-- location -->
              <template v-else-if="item.icon === 'location'">
                <path d="M8 1.5C5.8 1.5 4 3.3 4 5.5c0 3.3 4 8 4 8s4-4.7 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" stroke-width="1.2"/>
                <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" stroke-width="1.2"/>
              </template>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-[10px] text-gray-400 dark:text-gray-500 leading-none mb-0.5">{{ item.label }}</p>
            <p class="text-xs font-semibold text-gray-900 dark:text-white leading-snug break-words">{{ item.value }}</p>
          </div>
        </a>
      </div>

      <p class="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-5">
        {{ t('footer.copyright', { year: currentYear }) }}
      </p>
    </div>
  </footer>
</template>

<script setup>
const { t } = useI18n()
const currentYear = new Date().getFullYear()

const CONTACTS = computed(() => [
  {
    label: t('footer.phone'),
    value: '+998 99 123-45-67',
    href: 'tel:+998991234567',
    icon: 'phone',
  },
  {
    label: t('footer.email'),
    value: 'info@kvartira.uz',
    href: 'mailto:info@kvartira.uz',
    icon: 'mail',
  },
  {
    label: t('footer.telegram'),
    value: '@kvartira_bot',
    href: 'https://t.me/kvartira_bot',
    icon: 'telegram',
  },
  {
    label: t('footer.office'),
    value: t('footer.officeValue'),
    href: 'https://maps.google.com/?q=Amir+Temur+ko\'chasi+1+Tashkent',
    icon: 'location',
  },
])
</script>
