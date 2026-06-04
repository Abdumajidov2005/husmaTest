<template>
  <div class="card flex items-center gap-3">
    <div
      class="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0"
    >
      <svg
        class="w-5 h-5 text-brand-600 dark:text-brand-400"
        fill="none"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <!-- badge -->
        <path
          v-if="icon === 'badge'"
          d="M10 2l2.4 5H18l-4.2 3.2 1.6 5.3L10 12.8l-5.4 2.7 1.6-5.3L2 7h5.6L10 2z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <!-- percent -->
        <path
          v-else-if="icon === 'percent'"
          d="M6 14L14 6M7 6.5a.5.5 0 110-1 .5.5 0 010 1zm6 6a.5.5 0 110-1 .5.5 0 010 1z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <!-- shield -->
        <path
          v-else-if="icon === 'shield'"
          d="M10 2l7 3v5c0 3.5-2.8 6.7-7 8-4.2-1.3-7-4.5-7-8V5l7-3z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, required: true },
});
</script>
