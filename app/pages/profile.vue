<template>
  <div class="relative min-h-screen pb-12 bg-gray-50/50 dark:bg-gray-950/50">
    <header
      v-if="false"
      class="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800"
    >
      <div class="flex items-center gap-3 px-4 py-3">
        <UiButton
          v-if="!isNativeBack"
          variant="ghost"
          size="sm"
          haptic="light"
          class="!w-10 !h-10 !p-0 rounded-xl"
          :aria-label="t('common.backAria')"
          @click="goBack"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M12 4L6 10l6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </UiButton>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t("profile.title") }}
        </h1>
      </div>
    </header>

    <section class="px-4 pt-5">
      <div
        class="card p-4 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div class="relative flex-shrink-0">
          <img
            v-if="photoUrl"
            :src="photoUrl"
            :alt="name"
            class="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
          />
          <div
            v-else
            class="w-20 h-20 rounded-2xl flex items-center justify-center bg-brand-600 text-white text-2xl font-bold select-none"
            aria-hidden="true"
          >
            {{ initials }}
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p
            class="text-xl font-bold text-gray-900 dark:text-white truncate leading-snug"
          >
            {{ name }}
          </p>
          <p
            v-if="username"
            class="text-sm text-gray-400 dark:text-gray-500 truncate mt-0.5"
          >
            @{{ username }}
          </p>
          <span
            class="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-1 rounded-full"
            :class="
              isRieltor
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            "
          >
            <svg
              v-if="isRieltor"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M6 1l1.5 3 3.3.3-2.5 2.1.8 3.2L6 8.2 2.9 9.9l.8-3.2L1.2 4.6 4.5 4 6 1z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="isTelegram"
              class="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M10.5 2L1 5.6l3.2 1 1.3 3.4 1.7-1.8L10 10.5 10.5 2z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>
            {{ roleLabel }}
          </span>
        </div>
      </div>

      <div
        v-if="phone"
        class="card p-4 mt-3 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <div
          class="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M2 3C2 2.45 2.45 2 3 2h1.6c.53 0 .99.37 1.09.89l.44 2.2a1 1 0 01-.6 1.1l-.72.36a7.6 7.6 0 003.64 3.64l.36-.72a1 1 0 011.1-.6l2.2.44c.52.1.89.56.89 1.09V12c0 .55-.45 1-1 1A12.5 12.5 0 012 3z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p
            class="text-xs text-gray-400 dark:text-gray-500 mb-0.5 font-medium"
          >
            {{ t("profile.phone") }}
          </p>
          <p
            class="text-base font-bold text-gray-900 dark:text-white tracking-wide"
          >
            {{ phone }}
          </p>
        </div>
      </div>
    </section>

    <section
      v-if="isRieltor && rieltorProfil"
      class="grid grid-cols-3 gap-3 mx-4 mt-4"
    >
      <div
        class="card bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm"
      >
        <p
          class="font-black text-xl text-gray-900 dark:text-white tabular-nums"
        >
          {{ rieltorProfil.ortacha_reyting || "0.0" }}
        </p>
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
          {{ t("profile.rating") }}
        </p>
      </div>

      <div
        class="card bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm"
      >
        <p
          class="font-black text-xl text-gray-900 dark:text-white tabular-nums"
        >
          {{ rieltorProfil.jami_bitimlar ?? 0 }}
        </p>
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
          {{ t("profile.deals") }}
        </p>
      </div>

      <div
        class="card bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col justify-center items-center shadow-sm"
      >
        <span
          class="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full text-center"
          :class="verifyMeta.class"
        >
          {{ verifyMeta.label }}
        </span>
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1.5">
          {{ t("profile.verifyStatus") }}
        </p>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3 mx-4 mt-4">
      <div
        class="card bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex flex-col justify-between"
      >
        <div class="flex items-center justify-between w-full mb-1">
          <p
            class="font-black text-2xl text-gray-900 dark:text-white tabular-nums"
          >
            {{ myApplications.length }}
          </p>
          <div
            class="w-9 h-9 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-brand-600 dark:text-brand-400"
              fill="none"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                d="M5 3h10v14l-5-3-5 3V3z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500">
          {{ t("profile.total") }}
        </p>
      </div>

      <div
        class="card bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex flex-col justify-between"
      >
        <div class="flex items-center justify-between w-full mb-1">
          <p
            class="font-black text-2xl text-gray-900 dark:text-white tabular-nums"
          >
            {{ activeMine }}
          </p>
          <div
            class="w-9 h-9 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M10 6v4l2.5 1.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500">
          {{ t("profile.pending") }}
        </p>
      </div>
    </section>

    <section class="px-4 mt-5 space-y-3">
      <NuxtLink
        to="/my-applications"
        class="card p-4 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-5 h-5 text-brand-600 dark:text-brand-400"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M4 3h12v14H4V3zM7 7h6M7 10h6M7 13h4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ t("profile.myApps") }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {{ t("profile.myAppsSub") }}
          </p>
        </div>
        <span
          v-if="myApplications.length"
          class="bg-brand-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums flex-shrink-0"
        >
          {{ myApplications.length }}
        </span>
        <svg
          class="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>

      <NuxtLink
        to="/?apply=1"
        class="card p-4 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ t("profile.newApp") }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {{ t("profile.newAppSub") }}
          </p>
        </div>
        <svg
          class="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>

      <NuxtLink
        v-if="isRieltor"
        to="/?tab=rieltor"
        class="card p-4 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ t("profile.rieltorPanel") }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {{ t("profile.rieltorPanelSub") }}
          </p>
        </div>
        <svg
          class="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>

      <!-- Obuna (faqat rieltor uchun) -->
      <NuxtLink
        v-if="isRieltor"
        to="/obuna"
        class="card p-4 flex items-center gap-4 rounded-2xl border shadow-sm active:scale-[0.99] transition-transform"
        :class="obunaFaolmi
          ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700'
          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'"
      >
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="obunaFaolmi
            ? 'bg-brand-50 dark:bg-brand-900/30'
            : 'bg-amber-100 dark:bg-amber-800/40'"
        >
          <svg
            class="w-5 h-5"
            :class="obunaFaolmi ? 'text-brand-600 dark:text-brand-400' : 'text-amber-600 dark:text-amber-400'"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M8 1l1.5 3 3.3.3-2.5 2.1.8 3.2L8 8.2 4.9 9.9l.8-3.2L3.2 4.6 6.5 4 8 1z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ t("profile.obuna") }}
          </p>
          <p class="text-sm mt-0.5" :class="obunaFaolmi ? 'text-gray-400 dark:text-gray-500' : 'text-amber-600 dark:text-amber-400'">
            {{ obunaFaolmi ? t('profile.obunaFaol') : t('profile.obunaFaolEmas') }}
          </p>
        </div>
        <svg
          class="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>

      <NuxtLink
        to="https://t.me/javohirazam0v"
        class="card p-4 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform hover:border-brand-200 dark:hover:border-brand-700"
      >
        <div
          class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M14 10a4 4 0 00-8 0v1a1 1 0 001 1h1a1 1 0 001-1v-1a2 2 0 014 0v1a1 1 0 001 1h1a1 1 0 001-1v-1z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ t("profile.support") }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {{ t("profile.supportSub") }}
          </p>
        </div>
        <svg
          class="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>
    </section>

    <section class="px-4 mt-5 space-y-3">
      <UiLanguageSwitcher class="w-full" />
      <UiDarkModeSwitch class="w-full" />
    </section>

    <section v-if="isRieltor" class="px-4 mt-6">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50/10 dark:bg-red-950/10 text-red-600 dark:text-red-400 font-bold text-base active:scale-[0.99] transition-transform"
        @click="handleLogout"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ t("profile.logout") }}
      </button>
    </section>
  </div>
</template>

<script setup>
const router = useRouter();
const { t } = useI18n();
const { ready, haptic } = useTelegram();
const { logout, isRieltor, isAuthenticated, apiFetch } = useAuth();
const { name, username, photoUrl, phone, initials, isTelegram, roleLabel } =
  useCurrentUser();
const { myApplications, fetchMyApplications } = useApplications();

const activeMine = computed(
  () => myApplications.value.filter((a) => a.status === "new").length,
);

// Rieltor profil ma'lumotlari — GET /api/rieltor/profil/
const rieltorProfil = ref(null);

const VERIFY_STYLE = {
  pending: {
    labelKey: "profile.verifyPending",
    class:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  },
  verified: {
    labelKey: "profile.verifyVerified",
    class:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  rejected: {
    labelKey: "profile.verifyRejected",
    class: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

const verifyMeta = computed(() => {
  const s =
    VERIFY_STYLE[rieltorProfil.value?.verify_holat] ?? VERIFY_STYLE.pending;
  return { ...s, label: t(s.labelKey) };
});

// Obuna holati
const obunaFaolmi = ref(true);

onMounted(async () => {
  ready();
  if (isAuthenticated.value) fetchMyApplications();
  if (isRieltor.value) {
    const [profilRes, obunaRes] = await Promise.all([
      apiFetch("/api/rieltor/profil/"),
      apiFetch("/api/obuna/mening/"),
    ]);
    if (profilRes.ok) rieltorProfil.value = profilRes.data;
    if (obunaRes.ok) obunaFaolmi.value = obunaRes.data?.faol ?? true;
  }
});

function goBack() {
  haptic("light");
  if (import.meta.client && window.history.length > 1) {
    router.back();
  } else {
    navigateTo("/", { replace: true });
  }
}

// Telegram ning tabiiy "Orqaga" tugmasi (brauzerda — yuqoridagi maxsus tugma)
const { isNativeBack } = useBackButton(goBack);

async function handleLogout() {
  haptic("medium");
  logout();
  await navigateTo("/login");
}
</script>
