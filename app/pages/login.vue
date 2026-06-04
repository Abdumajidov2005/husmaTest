<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">

    <!-- Ortga tugmasi (Telegram ichida tabiiy tugma ishlatiladi) -->
    <div v-if="!isNativeBack" class="absolute top-4 left-4">
      <UiButton
        variant="ghost"
        size="sm"
        haptic="light"
        class="!w-9 !h-9 !p-0 rounded-xl"
        :aria-label="t('common.backAria')"
        @click="goBack"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12 4L6 10l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </UiButton>
    </div>

    <!-- Logo -->
    <div class="mb-8 text-center">
      <div class="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <img src="/imgs/logo.jpg" alt="Husma Estate" class="w-full h-full object-cover" />
      </div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">HUSMA ESTATE</h1>
      <p class="text-xs text-gray-400 mt-0.5">{{ t('login.subtitle') }}</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm card shadow-sm">
      <!-- Rejim almashtirish: Kirish / Ro'yxatdan o'tish -->
      <div class="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-5">
        <button
          type="button"
          class="rounded-lg py-2 text-sm font-semibold transition-colors"
          :class="mode === 'login'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'bg-transparent text-gray-500 dark:text-gray-400'"
          @click="switchMode('login')"
        >
          {{ t('login.signin') }}
        </button>
        <button
          type="button"
          class="rounded-lg py-2 text-sm font-semibold transition-colors"
          :class="mode === 'register'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'bg-transparent text-gray-500 dark:text-gray-400'"
          @click="switchMode('register')"
        >
          {{ t('login.signup') }}
        </button>
      </div>

      <h2 class="text-base font-bold text-gray-900 dark:text-white mb-1">
        {{ isRegister ? t('login.signup') : t('login.signin') }}
      </h2>
      <p class="text-xs text-gray-400 mb-5">
        {{ isRegister ? t('login.signupSub') : t('login.signinSub') }}
      </p>

      <form novalidate class="space-y-3" @submit.prevent="handleSubmit">
        <!-- Ism (faqat ro'yxatdan o'tishda) -->
        <UiFormField v-if="isRegister" :label="t('login.nameLabel')" icon="user" :error="errors.name">
          <input
            v-model.trim="form.name"
            type="text"
            :placeholder="t('login.namePh')"
            autocomplete="name"
            class="input-field"
            :class="{ 'border-red-400 dark:border-red-500': errors.name }"
          />
        </UiFormField>

        <!-- Telefon (faqat ro'yxatdan o'tishda) -->
        <UiFormField v-if="isRegister" :label="t('login.phoneLabel')" icon="phone" :error="errors.phone">
          <input
            :value="form.phone"
            type="tel"
            placeholder="+998 (__) __-__-__"
            autocomplete="tel"
            inputmode="tel"
            maxlength="19"
            class="input-field"
            :class="{ 'border-red-400 dark:border-red-500': errors.phone }"
            @input="onPhoneInput($event, (v) => (form.phone = v))"
          />
        </UiFormField>

        <!-- Login -->
        <UiFormField :label="t('login.loginLabel')" icon="user" :error="errors.login">
          <input
            v-model.trim="form.login"
            type="text"
            :placeholder="t('login.loginPh')"
            autocomplete="username"
            class="input-field"
            :class="{ 'border-red-400 dark:border-red-500': errors.login }"
          />
        </UiFormField>

        <!-- Parol -->
        <UiFormField :label="t('login.passwordLabel')" icon="lock" :error="errors.password">
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••"
              :autocomplete="isRegister ? 'new-password' : 'current-password'"
              class="input-field pr-10"
              :class="{ 'border-red-400 dark:border-red-500': errors.password }"
            />
            <button
              type="button"
              class="!w-auto flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              :aria-label="showPassword ? t('login.hidePassword') : t('login.showPassword')"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <path d="M3 3l14 14M8.5 8.6A3 3 0 0111.4 11.5M6.3 6.4A7 7 0 003.1 10c1.2 2.8 4 5 7 5a7 7 0 003.6-1M10.8 5.1A7 7 0 0117 10c-.4.9-1 1.8-1.7 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <path d="M10 4C6 4 3.1 6.8 2 10c1.1 3.2 4 6 8 6s6.9-2.8 8-6c-1.1-3.2-4-6-8-6z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>
        </UiFormField>

        <!-- Global error -->
        <div v-if="errors.global" role="alert" class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5">
          <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="text-xs text-red-600 dark:text-red-400">{{ errors.global }}</span>
        </div>

        <UiButton
          type="submit"
          variant="primary"
          size="md"
          haptic="medium"
          block
          :loading="isLoading"
          class="mt-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 10h14M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ isRegister ? t('login.signup') : t('login.signin') }}
        </UiButton>
      </form>

      <!-- Demo hint (faqat kirish rejimida) -->
      <div v-if="!isRegister" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p class="text-[11px] text-gray-400 text-center">
          {{ t('login.demo') }} <span class="font-mono font-semibold text-gray-600 dark:text-gray-300">rieltor / 1234</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const { t } = useI18n()
const { signIn, signUp, isAuthenticated, hydrate } = useAuth()
const { notificationHaptic, ready } = useTelegram()
const { onPhoneInput, isPhoneComplete } = useInputMask()
const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/', { replace: true })
  }
}

// Telegram ning tabiiy "Orqaga" tugmasi
const { isNativeBack } = useBackButton(goBack)

const mode         = ref('login') // 'login' | 'register'
const isRegister   = computed(() => mode.value === 'register')
const form         = reactive({ name: '', phone: '', login: '', password: '' })
const errors       = reactive({})
const isLoading    = ref(false)
const showPassword = ref(false)

function switchMode(next) {
  if (mode.value === next) return
  mode.value = next
  Object.keys(errors).forEach((k) => delete errors[k])
}

onMounted(() => {
  hydrate()
  ready()
  // Allaqachon kirgan bo'lsa — bosh sahifaga
  if (isAuthenticated.value) {
    navigateTo('/', { replace: true })
  }
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (isRegister.value) {
    if (!form.name) errors.name = t('login.errNameRequired')
    if (!form.phone) errors.phone = t('login.errPhoneRequired')
    else if (!isPhoneComplete(form.phone)) errors.phone = t('login.errPhoneInvalid')
  }

  if (!form.login) errors.login = t('login.errLoginRequired')
  if (!form.password) errors.password = t('login.errPasswordRequired')
  else if (isRegister.value && form.password.length < 4) {
    errors.password = t('login.errPasswordShort')
  }

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  delete errors.global

  try {
    await new Promise((r) => setTimeout(r, 400))

    const result = isRegister.value
      ? signUp({ name: form.name, phone: form.phone, login: form.login, password: form.password })
      : signIn({ login: form.login, password: form.password })

    if (result.ok) {
      notificationHaptic('success')
      await navigateTo('/', { replace: true })
    } else {
      errors.global = t(result.errorKey)
      notificationHaptic('error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>