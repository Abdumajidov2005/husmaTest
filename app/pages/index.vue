<template>
  <div class="relative min-h-screen">
    <AppHeader
      :active-tab="activeTab"
      :show-rieltor="isRieltor"
      @tab="handleTabChange"
    />

    <main>
      <Transition :name="transitionName" mode="out-in">
        <!-- Ariza form -->
        <div v-if="showForm" key="form">
          <div
            v-if="!supportsBackButton"
            class="flex items-center gap-2 px-3 pt-3"
          >
            <UiButton
              variant="ghost"
              size="sm"
              haptic="light"
              class="!w-8 !h-8 !p-0 rounded-xl"
              :aria-label="t('common.backAria')"
              @click="showForm = false"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </UiButton>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{
              t("common.back")
            }}</span>
          </div>
          <ApplicationForm @submit="handleFormSubmit" />
        </div>

        <!-- Home tab -->
        <HomeTab
          v-else-if="activeTab === 'home'"
          key="home"
          @apply="showForm = true"
        />

        <!-- Rieltor tab — faqat rieltor ko'radi -->
        <RieltorTab
          v-else-if="activeTab === 'rieltor' && isRieltor"
          key="rieltor"
        />
      </Transition>
    </main>

    <AppFooter />
    <UiSuccessModal :show="showSuccess" @close="showSuccess = false" />
  </div>
</template>

<script setup>
const { t } = useI18n();
const {
  ready,
  haptic,
  notificationHaptic,
  supportsBackButton,
  showBackButton,
  hideBackButton,
  onBackButton,
  offBackButton,
} = useTelegram();
const { isRieltor } = useAuth();
const route = useRoute();

const activeTab = ref("home");
const showForm = ref(false);
const showSuccess = ref(false);
const transitionName = ref("slide-right");

// Telegram tabiiy "Orqaga" tugmasi — forma ochiq bo'lganda ko'rinadi
let formBackCb = null;
watch(showForm, (open) => {
  // Forma ochilganda sahifani tepaga ko'taramiz (pastdan "Ariza qoldirish" bosilsa ham)
  if (open) scrollToTop();

  if (!supportsBackButton.value) return;
  if (open) {
    formBackCb = () => {
      showForm.value = false;
    };
    onBackButton(formBackCb);
    showBackButton();
  } else {
    if (formBackCb) offBackButton(formBackCb);
    hideBackButton();
    formBackCb = null;
  }
});

function scrollToTop() {
  if (!import.meta.client) return;
  // Body/window scroll qiladi (header sticky) — tepaga silliq ko'tariladi
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onBeforeUnmount(() => {
  if (formBackCb) offBackButton(formBackCb);
});

onMounted(() => {
  ready();

  // Profil sahifasidan kelgan havolalar: /?apply=1, /?tab=rieltor
  if (route.query.apply) {
    showForm.value = true;
  } else if (route.query.tab === "rieltor" && isRieltor.value) {
    activeTab.value = "rieltor";
  }
});

function handleTabChange(tab) {
  haptic("light");

  // Rieltor tab — login yo'q bo'lsa bosh sahifaga qaytaradi
  if (tab === "rieltor" && !isRieltor.value) {
    navigateTo("/login");
    return;
  }

  transitionName.value = tab === "rieltor" ? "slide-right" : "slide-left";
  activeTab.value = tab;
  showForm.value = false;
}

function handleFormSubmit() {
  notificationHaptic("success");
  showForm.value = false;
  showSuccess.value = true;
}
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.22s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-18px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(18px);
}
</style>
