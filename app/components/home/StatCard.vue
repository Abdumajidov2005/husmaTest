<template>
  <div class="card text-center py-2.5 px-1">
    <div class="w-7 h-7 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-1.5">
      <svg class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20" aria-hidden="true">
        <path v-if="icon === 'check'" d="M17 5L8 15l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path v-else-if="icon === 'users'" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <template v-else-if="icon === 'clock'">
          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </template>
      </svg>
    </div>
    <p class="font-bold text-[20px] text-gray-900 dark:text-white tabular-nums leading-tight">{{ value }}</p>
    <p class="text-[12px] text-gray-400 mt-0.5 leading-tight">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  value: { type: String, required: true },
  label: { type: String, required: true },
  icon:  { type: String, required: true },
})
</script>
