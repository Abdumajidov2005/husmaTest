<template>
  <div class="pb-8">
    <div class="mx-3 mt-3 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 rounded-2xl p-4">
      <h2 class="text-base font-bold text-gray-900 dark:text-white">{{ t('form.title') }}</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {{ t('form.subtitle') }}
      </p>
    </div>

    <form class="px-3 mt-3 space-y-3" novalidate @submit.prevent="handleSubmit">
      <!-- Name -->
      <UiFormField :label="t('form.nameLabel')" icon="user" :error="errors.name">
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
      <UiFormField :label="t('form.phoneLabel')" icon="phone" :error="errors.phone">
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
        <div class="grid grid-cols-2 gap-2" role="group" :aria-label="t('form.dealLabel')">
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

      <!-- Rooms -->
      <UiFormField :label="t('form.roomsLabel')" icon="rooms">
        <div class="grid grid-cols-4 gap-2" role="group" :aria-label="t('form.roomsLabel')">
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

      <!-- District -->
      <UiFormField :label="t('form.districtLabel')" icon="location" :error="errors.district">
        <select
          v-model="form.district"
          class="input-field appearance-none"
          :class="{ 'border-red-400': errors.district }"
        >
          <option value="" disabled>{{ t('form.districtPh') }}</option>
          <option v-for="d in DISTRICTS" :key="d" :value="d">{{ d }}</option>
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
            @input="onPriceInput($event, (display, num) => { budgetMinDisplay = display; form.budgetMin = num })"
          />
          <input
            :value="budgetMaxDisplay"
            type="text"
            :placeholder="t('form.budgetTo')"
            inputmode="numeric"
            class="input-field"
            @input="onPriceInput($event, (display, num) => { budgetMaxDisplay = display; form.budgetMax = num })"
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

      <UiButton type="submit" variant="primary" size="md" haptic="medium" block :loading="isSubmitting">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 10l14-7-7 14-2-5-5-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
        {{ t('form.submit') }}
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
const emit = defineEmits(['submit'])

const { t } = useI18n()
const { onPhoneInput, onPriceInput, isPhoneComplete } = useInputMask()

const ROOM_OPTIONS = [1, 2, 3, '4+']

const DEAL_TYPES = computed(() => [
  { value: 'arenda', label: t('form.dealRent') },
  { value: 'sotib', label: t('form.dealBuy') },
])

const DISTRICTS = [
  'Yunusobod', 'Chilonzor', 'Mirzo Ulugbek', 'Uchtepa', 'Sergeli',
  'Yakkasaroy', 'Shayxontohur', 'Olmazar', 'Bektemir', 'Mirobod',
]

const initialForm = () => ({
  name: '',
  phone: '',
  dealType: 'arenda', // standart: ijara
  rooms: 1,
  district: '',
  budgetMin: null,
  budgetMax: null,
  notes: '',
})

const form = reactive(initialForm())
const errors = reactive({})
const isSubmitting = ref(false)

// Narx inputlari uchun formatlangan ko'rinish (form.budgetMin/Max — toza Number)
const budgetMinDisplay = ref('')
const budgetMaxDisplay = ref('')

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!form.name) errors.name = t('form.errNameRequired')
  if (!form.phone) errors.phone = t('form.errPhoneRequired')
  else if (!isPhoneComplete(form.phone)) errors.phone = t('form.errPhoneInvalid')
  if (!form.district) errors.district = t('form.errDistrictRequired')

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  isSubmitting.value = true
  try {
    // Real API bo'lsa: await $fetch('/api/applications', { method: 'POST', body: form })
    await new Promise((r) => setTimeout(r, 400)) // simulate network
    emit('submit', { ...form })
    Object.assign(form, initialForm())
    budgetMinDisplay.value = ''
    budgetMaxDisplay.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>