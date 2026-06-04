<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @keydown.esc="emit('close')"
      >
        <div
          class="absolute inset-0 bg-black/50"
          aria-hidden="true"
          @click="emit('close')"
        />
        <div
          class="relative w-full bg-white dark:bg-gray-900 rounded-3xl p-6 text-center"
          style="max-width: 430px;"
        >
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M6 16l8 8L26 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 id="modal-title" class="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {{ displayTitle }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ displayDesc }}
          </p>
          <button class="btn-primary" @click="emit('close')">
            {{ t('modal.button') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  show:  { type: Boolean, required: true },
  title: { type: String, default: '' },
  desc:  { type: String, default: '' },
})
const emit = defineEmits(['close'])

const displayTitle = computed(() => props.title || t('modal.successTitle'))
const displayDesc = computed(() => props.desc || t('modal.successDesc'))
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from :deep(div[class*="relative w-full"]) { transform: translateY(20px); }
</style>
