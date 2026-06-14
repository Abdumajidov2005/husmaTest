<template>
  <article class="card border-l-2" :class="meta.border">
    <!-- Header: holat + vaqt -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <span
        class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
        :class="meta.badge"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="meta.dot"
          aria-hidden="true"
        />
        {{ meta.label }}
      </span>

      <time
        :datetime="new Date(application.createdAt).toISOString()"
        class="text-xs text-gray-400 dark:text-gray-500"
      >
        {{ timeAgo(application.createdAt) }}
      </time>
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

    <!-- Tafsilotlar -->
    <dl
      class="grid grid-cols-2 gap-2 mb-2.5 text-xs text-gray-600 dark:text-gray-300"
    >
      <div class="flex items-center gap-1.5">
        <svg
          class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <path
            d="M2 7V12h4V9h2v3h4V7L7 2 2 7z"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linejoin="round"
          />
        </svg>
        <dt class="sr-only">{{ t("anketa.roomsLabel") }}</dt>
        <dd>{{ t("anketa.roomsValue", { n: application.rooms }) }}</dd>
      </div>
      <!-- <div class="flex items-center gap-1.5">
        <svg
          class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 14 14"
          aria-hidden="true"
        >
          <path
            d="M7 1C4.8 1 3 2.8 3 5c0 3.3 4 7.5 4 7.5S11 8.3 11 5c0-2.2-1.8-4-4-4z"
            stroke="currentColor"
            stroke-width="1.2"
          />
          <circle
            cx="7"
            cy="5"
            r="1.3"
            stroke="currentColor"
            stroke-width="1.2"
          />
        </svg>
        <dt class="sr-only">{{ t("anketa.districtLabel") }}</dt>
        <dd class="truncate">{{ application.district }}</dd>
      </div> -->
    </dl>

    <div
      class="flex items-center gap-1.5 mb-2.5 text-xs text-gray-600 dark:text-gray-300"
    >
      <svg
        class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
        fill="none"
        viewBox="0 0 14 14"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2" />
        <path
          d="M7 4v3M5.5 5.5h2a1 1 0 010 2H6a1 1 0 000 2h2.5"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
        />
      </svg>
      <span>
        {{ formatBudget(application.budgetMin) }} —
        {{ formatBudget(application.budgetMax) }} {{ t("common.currency") }}
      </span>
    </div>

    <div
      v-if="application.notes"
      class="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 mb-3"
    >
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ application.notes }}
      </p>
    </div>

    <!-- Bekor qilish (ikki bosqichli tasdiq) — faqat 'yangi' holatda -->
    <div v-if="application.status === 'new'" class="pt-1">
      <Transition name="fade" mode="out-in">
        <div v-if="!confirming" key="action" class="flex justify-end">
          <button
            type="button"
            class="!w-auto inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            @click="confirming = true"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M3 4h10M6.5 4V3a1 1 0 011-1h1a1 1 0 011 1v1M4 4l.5 9a1 1 0 001 1h5a1 1 0 001-1L12 4"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ t("anketa.cancel") }}
          </button>
        </div>

        <div
          v-else
          key="confirm"
          class="flex items-center justify-between gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl px-3 py-2"
        >
          <span class="text-xs text-red-600 dark:text-red-400">{{
            t("anketa.confirm")
          }}</span>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              class="!w-auto px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 text-white active:scale-95 transition-transform"
              @click="confirmCancel"
            >
              {{ t("anketa.yes") }}
            </button>
            <button
              type="button"
              class="!w-auto px-3 py-1 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"
              @click="confirming = false"
            >
              {{ t("anketa.no") }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </article>
</template>

<script setup>
const { formatBudget, timeAgo } = useApplications();
const { haptic, notificationHaptic } = useTelegram();
const { t } = useI18n();

const props = defineProps({
  application: { type: Object, required: true },
});

const emit = defineEmits(["cancel"]);

const confirming = ref(false);

const STATUS_STYLE = {
  new: {
    labelKey: "anketa.statusNew",
    border: "border-l-amber-400",
    badge:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  in_progress: {
    labelKey: "anketa.statusInProgress",
    border: "border-l-blue-400",
    badge: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  done: {
    labelKey: "anketa.statusDone",
    border: "border-l-green-400",
    badge:
      "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
};

const meta = computed(() => {
  const s = STATUS_STYLE[props.application.status] ?? STATUS_STYLE.new;
  return { ...s, label: t(s.labelKey) };
});

// Bitim turi yorlig'i (eski arizalarda bo'lmasligi mumkin → null)
const dealMeta = computed(() => {
  switch (props.application.dealType) {
    case "arenda":
      return {
        label: t("anketa.dealRent"),
        class:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      };
    case "sotib":
      return {
        label: t("anketa.dealBuy"),
        class:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      };
    default:
      return null;
  }
});

function confirmCancel() {
  notificationHaptic("warning");
  emit("cancel", props.application.id);
  confirming.value = false;
}

watch(
  () => confirming.value,
  (v) => v && haptic("light"),
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
