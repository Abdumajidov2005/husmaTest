<template>
  <button
    role="tab"
    :aria-selected="isActive"
    :class="[
      'w-auto flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[16px] font-medium transition-all duration-200 whitespace-nowrap',
      isActive
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
    ]"
    @click="emit('click')"
  >
    <svg v-if="tab.icon === 'home'" class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 6.5L8 2l6 4.5V14H10v-4H6v4H2V6.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
    <svg v-else-if="tab.icon === 'users'" class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M10.5 4a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM2 13c0-2.76 2.686-5 6-5s6 2.24 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    {{ tab.label }}

    <span
      v-if="badge"
      class="bg-brand-600 text-white text-[9px] font-bold w-4 h-4 rounded-full
             flex items-center justify-center tabular-nums flex-shrink-0"
      :aria-label="t('header.newBadgeAria', { n: badge })"
    >
      {{ badge > 99 ? '99+' : badge }}
    </span>
  </button>
</template>

<script setup>
const { t } = useI18n()

defineProps({
  tab:      { type: Object,  required: true },
  isActive: { type: Boolean, default: false },
  badge:    { type: Number,  default: undefined },
})

const emit = defineEmits(['click'])
</script>