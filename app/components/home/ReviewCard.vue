<template>
  <article class="card">
    <div class="flex gap-0.5 mb-2" :aria-label="t('common.ratingAria', { n: rating })">
      <svg
        v-for="i in 5"
        :key="i"
        class="w-4 h-4"
        :class="i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </div>
    <blockquote class="text-sm text-gray-600 dark:text-gray-300 italic">
      "{{ text }}"
    </blockquote>
    <footer class="mt-2">
      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ name }}</p>
      <p class="text-xs text-gray-400">{{ detail }}</p>
    </footer>
  </article>
</template>

<script setup>
const { t } = useI18n()
defineProps({
  text:   { type: String, required: true },
  name:   { type: String, required: true },
  detail: { type: String, required: true },
  rating: { type: Number, default: 5 },
})
</script>
