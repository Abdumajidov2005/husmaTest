<template>
  <span
    class="inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 dark:ring-white/15 leading-none"
    aria-hidden="true"
  >
    <!-- O'zbekiston -->
    <svg v-if="code === 'uz'" viewBox="0 0 24 16" class="block w-6 h-4">
      <rect width="24" height="16" fill="#0099b5" />
      <rect y="5.33" width="24" height="5.34" fill="#ffffff" />
      <rect y="10.67" width="24" height="5.33" fill="#1eb53a" />
      <rect y="5.06" width="24" height="0.55" fill="#ce1126" />
      <rect y="10.39" width="24" height="0.55" fill="#ce1126" />
      <!-- yarim oy -->
      <circle cx="4.3" cy="2.7" r="1.7" fill="#ffffff" />
      <circle cx="5.1" cy="2.7" r="1.45" fill="#0099b5" />
      <!-- yulduzlar -->
      <g fill="#ffffff">
        <circle cx="7.1" cy="1.7" r="0.32" />
        <circle cx="7.1" cy="3.4" r="0.32" />
        <circle cx="8.5" cy="2.55" r="0.32" />
        <circle cx="9.9" cy="1.7" r="0.32" />
        <circle cx="9.9" cy="3.4" r="0.32" />
      </g>
    </svg>

    <!-- Rossiya -->
    <svg v-else-if="code === 'ru'" viewBox="0 0 24 16" class="block w-6 h-4">
      <rect width="24" height="16" fill="#ffffff" />
      <rect y="5.33" width="24" height="5.34" fill="#0039a6" />
      <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
    </svg>

    <!-- AQSh (English) -->
    <svg v-else viewBox="0 0 24 16" class="block w-6 h-4">
      <rect width="24" height="16" fill="#ffffff" />
      <g fill="#b22234">
        <rect y="0" width="24" height="1.23" />
        <rect y="2.46" width="24" height="1.23" />
        <rect y="4.92" width="24" height="1.23" />
        <rect y="7.38" width="24" height="1.23" />
        <rect y="9.85" width="24" height="1.23" />
        <rect y="12.31" width="24" height="1.23" />
        <rect y="14.77" width="24" height="1.23" />
      </g>
      <rect width="10" height="8.62" fill="#3c3b6e" />
      <g fill="#ffffff">
        <circle cx="1.4" cy="1.5" r="0.42" />
        <circle cx="3.5" cy="1.5" r="0.42" />
        <circle cx="5.6" cy="1.5" r="0.42" />
        <circle cx="7.7" cy="1.5" r="0.42" />
        <circle cx="2.45" cy="3.1" r="0.42" />
        <circle cx="4.55" cy="3.1" r="0.42" />
        <circle cx="6.65" cy="3.1" r="0.42" />
        <circle cx="1.4" cy="4.7" r="0.42" />
        <circle cx="3.5" cy="4.7" r="0.42" />
        <circle cx="5.6" cy="4.7" r="0.42" />
        <circle cx="7.7" cy="4.7" r="0.42" />
        <circle cx="2.45" cy="6.3" r="0.42" />
        <circle cx="4.55" cy="6.3" r="0.42" />
        <circle cx="6.65" cy="6.3" r="0.42" />
      </g>
    </svg>
  </span>
</template>

<script setup>
defineProps({
  code: { type: String, required: true },
})
</script>
