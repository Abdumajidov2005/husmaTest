<template>
  <div>
    <label class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
      <svg class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 16 16" aria-hidden="true">
        <template v-if="icon === 'user'">
          <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M2 14c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </template>
        <template v-else-if="icon === 'phone'">
          <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="8" cy="12" r="0.75" fill="currentColor"/>
        </template>
        <template v-else-if="icon === 'lock'">
          <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </template>
        <template v-else-if="icon === 'rooms'">
          <path d="M2 8V14h5V10h2v4h5V8L8 2 2 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </template>
        <template v-else-if="icon === 'location'">
          <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.5"/>
        </template>
        <template v-else-if="icon === 'city'">
          <path d="M2 14V4l3.5-1.5V14M9 14V6l4.5-1.5V14M2 14h12M9 9h.01M9 11.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
        <template v-else-if="icon === 'home'">
          <path d="M2 8.5L8 3l6 5.5V14H10v-4H6v4H2V8.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </template>
        <template v-else-if="icon === 'money'">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 4.5v7M6 6h3a1 1 0 010 2H7a1 1 0 000 2h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </template>
        <template v-else-if="icon === 'note'">
          <path d="M3 3h10v10H3V3zM6 6h4M6 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </template>
      </svg>
      {{ label }}
    </label>

    <slot />

    <p v-if="error" role="alert" class="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
      <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="6"/>
        <path d="M6 3.5v3M6 8.5v.5" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  icon:  { type: String, required: true },
  error: { type: String, default: undefined },
})
</script>
