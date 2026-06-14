<template>
  <div class="pb-8">
    <div
      class="mx-3 mt-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 rounded-2xl p-4"
    >
      <h2 class="text-base font-bold text-gray-900 dark:text-white">
        {{ t("form.title") }}
      </h2>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {{ t("form.subtitle") }}
      </p>
    </div>

    <form class="px-3 mt-3 space-y-3" novalidate @submit.prevent="handleSubmit">
      <!-- Name -->
      <UiFormField
        :label="t('form.nameLabel')"
        icon="user"
        :error="errors.name"
      >
        <input
          v-model.trim="form.name"
          type="text"
          :placeholder="t('form.namePh')"
          autocomplete="name"
          class="input-field"
          :class="{ 'border-red-400': errors.name }"
        />
      </UiFormField>

      <!-- Phone -->
      <UiFormField
        :label="t('form.phoneLabel')"
        icon="phone"
        :error="errors.phone"
      >
        <input
          :value="form.phone"
          type="tel"
          placeholder="+998 (__) __-__-__"
          autocomplete="tel"
          inputmode="tel"
          maxlength="19"
          class="input-field"
          :class="{ 'border-red-400': errors.phone }"
          @input="onPhoneInput($event, (v) => (form.phone = v))"
        />
      </UiFormField>

      <!-- Bitim turi: Arenda / Sotib olish -->
      <UiFormField :label="t('form.dealLabel')" icon="money">
        <div
          class="grid grid-cols-2 gap-2"
          role="group"
          :aria-label="t('form.dealLabel')"
        >
          <UiButton
            v-for="opt in DEAL_TYPES"
            :key="opt.value"
            type="button"
            haptic="light"
            :variant="form.dealType === opt.value ? 'primary' : 'secondary'"
            size="sm"
            class="!rounded-xl !py-2.5 !font-semibold"
            :aria-pressed="form.dealType === opt.value"
            @click="form.dealType = opt.value"
          >
            {{ opt.label }}
          </UiButton>
        </div>
      </UiFormField>

      <!-- Mulk turi: Kvartira / Uy -->
      <UiFormField :label="t('form.propertyTypeLabel')" icon="home">
        <div
          class="grid grid-cols-2 gap-2"
          role="group"
          :aria-label="t('form.propertyTypeLabel')"
        >
          <UiButton
            v-for="opt in PROPERTY_TYPES"
            :key="opt.value"
            type="button"
            haptic="light"
            :variant="form.propertyType === opt.value ? 'primary' : 'secondary'"
            size="sm"
            class="!rounded-xl !py-2.5 !font-semibold"
            :aria-pressed="form.propertyType === opt.value"
            @click="form.propertyType = opt.value"
          >
            {{ opt.label }}
          </UiButton>
        </div>
      </UiFormField>

      <!-- Rooms -->
      <UiFormField :label="t('form.roomsLabel')" icon="rooms">
        <div
          class="grid grid-cols-4 gap-2"
          role="group"
          :aria-label="t('form.roomsLabel')"
        >
          <UiButton
            v-for="r in ROOM_OPTIONS"
            :key="r"
            type="button"
            :haptic="form.rooms === r ? 'light' : 'light'"
            :variant="form.rooms === r ? 'primary' : 'secondary'"
            size="sm"
            class="!rounded-xl !py-2.5 !font-semibold"
            :aria-pressed="form.rooms === r"
            @click="form.rooms = r"
          >
            {{ r }}
          </UiButton>
        </div>
      </UiFormField>

      <!-- Shahar (viloyat) -->
      <UiFormField
        :label="t('form.cityLabel')"
        icon="city"
        :error="errors.city"
      >
        <select
          v-model="form.city"
          class="input-field appearance-none"
          :class="{ 'border-red-400': errors.city }"
          :disabled="hudLoading"
        >
          <option value="" disabled>
            {{ hudLoading ? t("form.districtLoading") : t("form.cityPh") }}
          </option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>
      </UiFormField>

      <!-- District (tuman) -->
      <UiFormField
        :label="t('form.districtLabel')"
        icon="location"
        :error="errors.district"
      >
        <select
          v-model="form.district"
          class="input-field appearance-none"
          :class="{ 'border-red-400': errors.district }"
          :disabled="hudLoading || !form.city"
        >
          <option value="" disabled>
            {{ hudLoading ? t("form.districtLoading") : t("form.districtPh") }}
          </option>
          <option v-for="d in filteredHududlar" :key="d.id" :value="d.id">
            {{ d.nomi }}
          </option>
        </select>
      </UiFormField>

      <!-- Budget -->
      <UiFormField :label="t('form.budgetLabel')" icon="money">
        <div class="grid grid-cols-2 gap-2">
          <input
            :value="budgetMinDisplay"
            type="text"
            :placeholder="t('form.budgetFrom')"
            inputmode="numeric"
            class="input-field"
            @input="
              onPriceInput($event, (display, num) => {
                budgetMinDisplay = display;
                form.budgetMin = num;
              })
            "
          />
          <input
            :value="budgetMaxDisplay"
            type="text"
            :placeholder="t('form.budgetTo')"
            inputmode="numeric"
            class="input-field"
            @input="
              onPriceInput($event, (display, num) => {
                budgetMaxDisplay = display;
                form.budgetMax = num;
              })
            "
          />
        </div>
      </UiFormField>

      <!-- Notes -->
      <UiFormField :label="t('form.notesLabel')" icon="note">
        <textarea
          v-model.trim="form.notes"
          :placeholder="t('form.notesPh')"
          rows="3"
          class="input-field resize-none"
        />
      </UiFormField>

      <!-- Global error -->
      <div
        v-if="errors.global"
        role="alert"
        class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5"
      >
        <svg
          class="w-4 h-4 text-red-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 16 16"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            stroke-width="1.3"
          />
          <path
            d="M8 5v3.5M8 10.5v.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <span class="text-xs text-red-600 dark:text-red-400">{{
          errors.global
        }}</span>
      </div>

      <UiButton
        type="submit"
        variant="primary"
        size="md"
        haptic="medium"
        block
        :loading="isSubmitting"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M3 10l14-7-7 14-2-5-5-2z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        {{ t("form.submit") }}
      </UiButton>
    </form>

    <!-- Tips -->
    <div class="px-3 mt-3 space-y-3">
      <UiInfoCard
        icon="tip"
        :title="t('form.tipTitle')"
        :desc="t('form.tipDesc')"
      />
      <UiInfoCard
        icon="shield"
        :title="t('form.safetyTitle')"
        :desc="t('form.safetyDesc')"
        :badge="t('form.safetyBadge')"
        variant="brand"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["submit"]);

const { t } = useI18n();
const { onPhoneInput, onPriceInput, isPhoneComplete } = useInputMask();
const { addApplication } = useApplications();
const { hududlar, isLoading: hudLoading, fetchHududlar } = useHududlar();

const ROOM_OPTIONS = [1, 2, 3, "4+"];

const DEAL_TYPES = computed(() => [
  { value: "arenda", label: t("form.dealRent") },
  { value: "sotib", label: t("form.dealBuy") },
]);

const PROPERTY_TYPES = computed(() => [
  { value: "kvartira", label: t("form.propertyApartment") },
  { value: "uy", label: t("form.propertyHouse") },
]);

const initialForm = () => ({
  name: "",
  phone: "",
  dealType: "arenda", // standart: ijara
  propertyType: "kvartira", // standart: kvartira
  rooms: 1,
  city: "",
  district: "",
  budgetMin: null,
  budgetMax: null,
  notes: "",
});

const form = reactive(initialForm());
const errors = reactive({});
const isSubmitting = ref(false);

// Hududlar ro'yxatidan shaharlar ro'yxatini chiqaramiz (takrorlanmas)
const cities = computed(() => {
  const set = new Set();
  hududlar.value.forEach((h) => {
    if (h.shahar) set.add(h.shahar);
  });
  return Array.from(set).sort();
});

// Tanlangan shaharga qarab tumanlarni filtrlaymiz (shahar tanlanmaguncha bo'sh)
const filteredHududlar = computed(() => {
  if (!form.city) return [];
  return hududlar.value.filter((h) => h.shahar === form.city);
});

// Shahar o'zgarganda — yangi shaharga tegishli bo'lmagan tumanni tozalaymiz
watch(
  () => form.city,
  () => {
    if (
      form.district &&
      !filteredHududlar.value.some((h) => h.id === form.district)
    ) {
      form.district = "";
    }
  },
);

// Narx inputlari uchun formatlangan ko'rinish (form.budgetMin/Max — toza Number)
const budgetMinDisplay = ref("");
const budgetMaxDisplay = ref("");

onMounted(() => {
  fetchHududlar();
});

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);

  if (!form.name) errors.name = t("form.errNameRequired");
  if (!form.phone) errors.phone = t("form.errPhoneRequired");
  else if (!isPhoneComplete(form.phone))
    errors.phone = t("form.errPhoneInvalid");
  if (!form.city) errors.city = t("form.errCityRequired");
  if (!form.district) errors.district = t("form.errDistrictRequired");

  return Object.keys(errors).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;
  delete errors.global;
  try {
    const result = await addApplication({ ...form });
    if (result.ok) {
      emit("submit", { ...form });
      Object.assign(form, initialForm());
      budgetMinDisplay.value = "";
      budgetMaxDisplay.value = "";
    } else {
      errors.global = t(result.errorKey);
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
