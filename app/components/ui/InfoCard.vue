<template>
  <div
    class="card flex items-start gap-3"
    :class="variant === 'brand'
      ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-100 dark:border-brand-800/50'
      : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30'"
  >
    <div
      class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      :class="variant === 'brand'
        ? 'bg-brand-600'
        : 'bg-amber-100 dark:bg-amber-900/30'"
    >
      <!-- shield -->
      <svg v-if="icon === 'shield'" class="w-5 h-5 text-white" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 2l7 3v5c0 3.5-2.8 6.7-7 8-4.2-1.3-7-4.5-7-8V5l7-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <!-- tip (bulb) -->
      <svg v-else-if="icon === 'tip'" class="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 2a6 6 0 016 6c0 2.5-1.5 4.7-3.5 5.7V16a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-2.3A6.001 6.001 0 0110 2zM7.5 17.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>

    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ title }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ desc }}</p>
      <p v-if="badge" class="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">{{ badge }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon:    { type: String, required: true },
  title:   { type: String, required: true },
  desc:    { type: String, required: true },
  badge:   { type: String, default: undefined },
  variant: { type: String, default: 'default' },
})
</script>
