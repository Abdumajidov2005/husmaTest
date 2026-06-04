<template>
  <div class="pb-8">
    <!-- Hero Carousel -->
    <HomeHeroCarousel />

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-2 mx-3 mt-4">
      <HomeStatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <!-- CTA -->
    <div class="mx-3 mt-5">
      <UiButton
        variant="primary"
        size="md"
        haptic="medium"
        block
        @click="emit('apply')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        {{ t('home.applyCta') }}
      </UiButton>
    </div>

    <!-- Why Us -->
    <section class="px-3 mt-5">
      <h2 class="text-base font-bold text-gray-900 dark:text-white mb-3">
        {{ t('home.whyUs') }}
      </h2>
      <div class="space-y-2.5">
        <HomeFeatureCard
          v-for="item in whyUs"
          :key="item.title"
          v-bind="item"
        />
      </div>
    </section>

    <!-- How it works -->
    <section class="px-3 mt-5">
      <h2 class="text-base font-bold text-gray-900 dark:text-white mb-3">
        {{ t('home.how') }}
      </h2>
      <ol class="space-y-3">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="flex items-start gap-3"
        >
          <div
            class="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
            :aria-label="t('home.stepAria', { n: i + 1 })"
          >
            {{ i + 1 }}
          </div>
          <div class="pt-1.5">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ step.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ step.desc }}
            </p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Reviews -->
    <section class="px-3 mt-5">
      <h2 class="text-base font-bold text-gray-900 dark:text-white mb-3">
        {{ t('home.reviewsTitle') }}
      </h2>
      <div class="space-y-3">
        <HomeReviewCard
          v-for="review in reviews"
          :key="review.name"
          v-bind="review"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const emit = defineEmits(["apply"]);
const { t } = useI18n();

// Ikona/uslub konfiguratsiyasi komponentda qoladi, matn i18n'dan keladi
const STAT_ICONS = ["check", "users", "clock"];
const WHY_ICONS = ["badge", "percent", "shield"];
const REVIEW_META = [
  { name: "Jamshid", rating: 5 },
  { name: "Dilnoza", rating: 5 },
];

const stats = computed(() =>
  t("home.stats").map((s, i) => ({ ...s, icon: STAT_ICONS[i] }))
);
const whyUs = computed(() =>
  t("home.whyList").map((item, i) => ({ ...item, icon: WHY_ICONS[i] }))
);
const steps = computed(() => t("home.steps"));
const reviews = computed(() =>
  t("home.reviews").map((r, i) => ({ ...r, ...REVIEW_META[i] }))
);
</script>
