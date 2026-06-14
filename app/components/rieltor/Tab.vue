<template>
  <div class="pb-8">
    <!-- Hero Carousel -->
    <RieltorCarousel />

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-2 mx-3 mt-3">
      <div class="card text-center py-3">
        <div
          class="w-8 h-8 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-2"
        >
          <svg
            class="w-4 h-4 text-brand-600 dark:text-brand-400"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <p class="font-bold text-xl text-gray-900 dark:text-white tabular-nums">
          {{ faolArizalar }}
        </p>
        <p class="text-xs text-gray-400">{{ t("rieltor.active") }}</p>
      </div>
      <div class="card text-center py-3">
        <div
          class="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2"
        >
          <svg
            class="w-4 h-4 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M3 12L8 4l5 8H3z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="font-bold text-xl text-gray-900 dark:text-white tabular-nums">
          {{ konversiya }}%
        </p>
        <p class="text-xs text-gray-400">{{ t("rieltor.conversion") }}</p>
      </div>
    </div>

    <!-- Tip -->
    <div class="px-3 mt-3">
      <UiInfoCard
        icon="tip"
        :title="t('rieltor.tipTitle')"
        :desc="t('rieltor.tipDesc')"
      />
    </div>

    <!-- Filter -->
    <section class="px-3 mt-4">
      <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
        <button
          v-for="f in FILTERS"
          :key="f.value"
          type="button"
          class="!w-auto flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          :class="
            filter === f.value
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          "
          @click="setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white">
          {{ t("rieltor.newApps") }}
        </h2>
        <span
          class="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
        >
          {{ applications.length }}
        </span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {{ t("rieltor.newAppsSub") }}
      </p>

      <div v-if="isLoading" class="text-center py-12 text-gray-400 text-sm">
        {{ t("common.loading") }}
      </div>

      <TransitionGroup v-else name="list" tag="div" class="space-y-3">
        <RieltorApplicationCard
          v-for="app in applications"
          :key="app.id"
          :application="app"
          @accept="handleAccept"
          @close="handleClose"
        />
      </TransitionGroup>

      <div
        v-if="!isLoading && applications.length === 0"
        class="text-center py-12 text-gray-400 text-sm"
      >
        {{ t("rieltor.empty") }}
      </div>
    </section>
  </div>
</template>

<script setup>
const {
  rieltorApplications: applications,
  fetchRieltorApplications,
  acceptApplication,
  closeApplication,
} = useApplications();
const { rieltorStats, fetchRieltorStatistika } = useStatistika();
const { t } = useI18n();
const { notificationHaptic } = useTelegram();

const isLoading = ref(false);
const filter = ref(""); // '' | 'yangi' | 'korilmoqda' | 'yopilgan'

const FILTERS = computed(() => [
  { value: "", label: t("rieltor.filterAll") },
  { value: "yangi", label: t("anketa.statusNew") },
  { value: "korilmoqda", label: t("anketa.statusInProgress") },
  { value: "yopilgan", label: t("anketa.statusDone") },
]);

const faolArizalar = computed(() => rieltorStats.value?.faol_arizalar ?? 0);
const konversiya = computed(() => {
  const k = rieltorStats.value?.konversiya;
  return k != null ? Math.round(k) : 0;
});

async function load() {
  isLoading.value = true;
  try {
    await fetchRieltorApplications(filter.value || null);
  } finally {
    isLoading.value = false;
  }
}

function setFilter(value) {
  if (filter.value === value) return;
  filter.value = value;
  load();
}

async function handleAccept(id) {
  const result = await acceptApplication(id);
  if (result.ok) {
    notificationHaptic("success");
    fetchRieltorStatistika();
  } else {
    notificationHaptic("error");
  }
}

async function handleClose(id) {
  const result = await closeApplication(id);
  if (result.ok) {
    notificationHaptic("success");
    fetchRieltorStatistika();
  } else {
    notificationHaptic("error");
  }
}

onMounted(() => {
  load();
  fetchRieltorStatistika();
});
</script>

<style scoped>
.list-enter-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.list-leave-active {
  transition: all 0.2s ease;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
