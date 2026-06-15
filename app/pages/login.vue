<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950"
  >
    <!-- Ortga tugmasi -->
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
          <path
            d="M12 4L6 10l6 6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </UiButton>
    </div>

    <!-- Logo -->
    <div class="mb-8 text-center">
      <div
        class="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <img
          src="/imgs/logo.jpg"
          alt="Husma Estate"
          class="w-full h-full object-cover"
        />
      </div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        HUSMA ESTATE
      </h1>
      <p class="text-xs text-gray-400 mt-0.5">{{ t("login.subtitle") }}</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm card shadow-sm">
      <!-- ===== OTP QADAM ===== -->
      <template v-if="step === 'otp'">
        <div class="flex items-center gap-3 mb-5">
          <button
            type="button"
            class="!w-auto flex items-center justify-center h-8 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            @click="backToRegister"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path
                d="M12 4L6 10l6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-white">
              {{ t("login.otpTitle") }}
            </h2>
            <p class="text-xs text-gray-400">{{ t("login.otpSub") }}</p>
          </div>
        </div>

        <div class="flex justify-center mb-4">
          <div
            class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.152.674-.553.838-1.12.521l-3.1-2.285-1.496 1.44c-.165.165-.304.304-.624.304l.223-3.165 5.754-5.198c.25-.222-.054-.346-.388-.124l-7.111 4.48-3.063-.957c-.666-.208-.68-.666.14-.986l11.963-4.614c.555-.2 1.04.136.862.971z"
              />
            </svg>
          </div>
        </div>

        <div
          class="mb-4 flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2.5"
        >
          <svg
            class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
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
              d="M5 8l2 2 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-xs text-green-700 dark:text-green-400">{{
            t("login.freeTrial")
          }}</span>
        </div>

        <!-- Demo OTP ko'rsatkichi -->
        <div
          v-if="demoOtp"
          class="mb-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2.5"
        >
          <svg
            class="w-4 h-4 text-blue-500 flex-shrink-0"
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
          <span class="text-xs text-blue-700 dark:text-blue-300">
            Kod (demo):
            <strong class="font-mono tracking-widest">{{ demoOtp }}</strong>
          </span>
        </div>

        <form novalidate class="space-y-3" @submit.prevent="handleOtpSubmit">
          <UiFormField
            :label="t('login.otpLabel')"
            icon="lock"
            :error="errors.otp"
          >
            <input
              v-model.trim="otpCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              :placeholder="t('login.otpPh')"
              class="input-field text-center text-lg tracking-[0.3em] font-mono"
              :class="{ 'border-red-400 dark:border-red-500': errors.otp }"
              @input="otpCode = otpCode.replace(/\D/g, '').slice(0, 6)"
            />
          </UiFormField>

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
            :loading="isLoading"
            class="mt-2"
          >
            {{ t("login.otpConfirm") }}
          </UiButton>
        </form>

        <div class="mt-4 text-center">
          <button
            v-if="resendCountdown === 0"
            type="button"
            class="!w-auto text-xs text-blue-500 hover:text-blue-600 font-medium"
            :disabled="isLoading"
            @click="resendOtp"
          >
            {{ t("login.otpResend") }}
          </button>
          <p v-else class="text-xs text-gray-400">
            {{ t("login.otpResendIn", { sec: resendCountdown }) }}
          </p>
        </div>
      </template>

      <!-- ===== KIRISH / RO'YXATDAN O'TISH ===== -->
      <template v-else>
        <div
          class="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-5"
        >
          <button
            type="button"
            class="rounded-lg py-2 text-sm font-semibold transition-colors"
            :class="
              mode === 'login'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'bg-transparent text-gray-500 dark:text-gray-400'
            "
            @click="switchMode('login')"
          >
            {{ t("login.signin") }}
          </button>
          <button
            type="button"
            class="rounded-lg py-2 text-sm font-semibold transition-colors"
            :class="
              mode === 'register'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'bg-transparent text-gray-500 dark:text-gray-400'
            "
            @click="switchMode('register')"
          >
            {{ t("login.signup") }}
          </button>
        </div>

        <h2 class="text-base font-bold text-gray-900 dark:text-white mb-1">
          {{ isRegister ? t("login.signup") : t("login.signin") }}
        </h2>
        <p class="text-xs text-gray-400 mb-5">
          {{ isRegister ? t("login.signupSub") : t("login.signinSub") }}
        </p>

        <form novalidate class="space-y-3" @submit.prevent="handleSubmit">
          <!-- Ism -->
          <UiFormField
            v-if="isRegister"
            :label="t('login.nameLabel')"
            icon="user"
            :error="errors.name"
          >
            <input
              v-model.trim="form.name"
              type="text"
              :placeholder="t('login.namePh')"
              autocomplete="name"
              class="input-field"
              :class="{ 'border-red-400 dark:border-red-500': errors.name }"
            />
          </UiFormField>

          <!-- Telefon -->
          <UiFormField
            v-if="isRegister"
            :label="t('login.phoneLabel')"
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
              :class="{ 'border-red-400 dark:border-red-500': errors.phone }"
              @input="onPhoneInput($event, (v) => (form.phone = v))"
            />
          </UiFormField>

          <!-- Viloyat -->
          <UiFormField
            v-if="isRegister"
            :label="t('form.cityLabel')"
            icon="city"
            :error="errors.city"
          >
            <select
              v-model="form.city"
              class="input-field appearance-none"
              :class="{ 'border-red-400 dark:border-red-500': errors.city }"
            >
              <option value="" disabled>{{ t("form.cityPh") }}</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </UiFormField>

          <!-- Tumanlar -->
          <div v-if="isRegister && form.city">
            <p
              class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t("login.districtsLabel") }}
              <span class="text-red-400 ml-0.5">*</span>
            </p>
            <div
              class="max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800"
              :class="{
                'border-red-400 dark:border-red-500': errors.districts,
              }"
            >
              <label
                v-for="d in filteredHududlar"
                :key="d.id"
                class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <input
                  v-model="form.districts"
                  type="checkbox"
                  :value="d.id"
                  class="w-4 h-4 rounded text-brand-600 accent-brand-600"
                />
                <span class="text-sm text-gray-800 dark:text-gray-200">{{
                  d.nomi
                }}</span>
              </label>
            </div>
            <p v-if="errors.districts" class="text-xs text-red-500 mt-1">
              {{ errors.districts }}
            </p>
          </div>

          <!-- Login -->
          <UiFormField
            :label="t('login.loginLabel')"
            icon="user"
            :error="errors.login"
          >
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
          <UiFormField
            :label="t('login.passwordLabel')"
            icon="lock"
            :error="errors.password"
          >
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••"
                :autocomplete="isRegister ? 'new-password' : 'current-password'"
                class="input-field pr-10"
                :class="{
                  'border-red-400 dark:border-red-500': errors.password,
                }"
              />
              <button
                type="button"
                class="!w-auto flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :aria-label="
                  showPassword
                    ? t('login.hidePassword')
                    : t('login.showPassword')
                "
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="showPassword"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 3l14 14M8.5 8.6A3 3 0 0111.4 11.5M6.3 6.4A7 7 0 003.1 10c1.2 2.8 4 5 7 5a7 7 0 003.6-1M10.8 5.1A7 7 0 0117 10c-.4.9-1 1.8-1.7 2.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M10 4C6 4 3.1 6.8 2 10c1.1 3.2 4 6 8 6s6.9-2.8 8-6c-1.1-3.2-4-6-8-6z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="2.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
              </button>
            </div>
          </UiFormField>

          <!-- Global xato -->
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
            :loading="isLoading"
            class="mt-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                d="M3 10h14M10 4l6 6-6 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ isRegister ? t("login.signup") : t("login.signin") }}
          </UiButton>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const { t } = useI18n();
// const { signIn, requestOtp, verifyOtp, isAuthenticated, hydrate } = useAuth();
const { signIn, requestOtp, verifyOtp, isAuthenticated, hydrate, telegramLogin } = useAuth();
// const { notificationHaptic, ready } = useTelegram();
const { notificationHaptic, ready, initData } = useTelegram();
const { onPhoneInput, isPhoneComplete } = useInputMask();
const { viloyatlar, fetchHududlar } = useHududlar();
const router = useRouter();

function goBack() {
  if (window.history.length > 1) router.back();
  else navigateTo("/", { replace: true });
}

const { isNativeBack } = useBackButton(goBack);

// --- State ---
const mode = ref("login");
const step = ref("form");
const isRegister = computed(() => mode.value === "register");
const form = reactive({
  name: "",
  phone: "",
  login: "",
  password: "",
  city: "",
  districts: [],
});
const errors = reactive({});
const isLoading = ref(false);
const showPassword = ref(false);
const demoOtp = ref("");

const cities = computed(() => viloyatlar.value.map((v) => v.nomi));

const filteredHududlar = computed(() => {
  if (!form.city) return [];
  const v = viloyatlar.value.find((v) => v.nomi === form.city);
  return v ? v.hududlar || [] : [];
});

watch(
  () => form.city,
  () => {
    form.districts = [];
  },
);

// OTP
const otpCode = ref("");
const resendCountdown = ref(0);
let resendTimer = null;

function switchMode(next) {
  if (mode.value === next) return;
  mode.value = next;
  step.value = "form";
  Object.keys(errors).forEach((k) => delete errors[k]);
}

function backToRegister() {
  step.value = "form";
  otpCode.value = "";
  clearCountdown();
  Object.keys(errors).forEach((k) => delete errors[k]);
}

function startCountdown(sec = 60) {
  resendCountdown.value = sec;
  clearCountdown();
  resendTimer = setInterval(() => {
    if (resendCountdown.value > 0) resendCountdown.value--;
    else clearCountdown();
  }, 1000);
}

function clearCountdown() {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
}

onUnmounted(clearCountdown);

onMounted(() => {
  hydrate();
  ready();
  fetchHududlar();
  if (isAuthenticated.value) navigateTo("/", { replace: true });
});

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (isRegister.value) {
    if (!form.name) errors.name = t("login.errNameRequired");
    if (!form.phone) errors.phone = t("login.errPhoneRequired");
    else if (!isPhoneComplete(form.phone))
      errors.phone = t("login.errPhoneInvalid");
    if (!form.city) errors.city = t("form.errCityRequired");
    if (!form.districts.length)
      errors.districts = t("login.errDistrictsRequired");
  }
  if (!form.login) errors.login = t("login.errLoginRequired");
  if (!form.password) errors.password = t("login.errPasswordRequired");
  else if (isRegister.value && form.password.length < 6) {
    errors.password = t("login.errPasswordShort");
  }
  return Object.keys(errors).length === 0;
}

// async function handleSubmit() {
//   if (!validate()) return;
//   isLoading.value = true;
//   delete errors.global;
//   try {
//     if (isRegister.value) {
//       const result = await requestOtp({
//         full_name: form.name,
//         phone: form.phone,
//         username: form.login,
//         password: form.password,
//         hududlar: form.districts,
//         mulk_turlari: [1],
//       });
//       if (result.ok) {
//         if (result.demoOtp) demoOtp.value = result.demoOtp;
//         notificationHaptic("success");
//         step.value = "otp";
//         otpCode.value = "";
//         startCountdown(60);
//       } else {
//         errors.global = result.detail || t(result.errorKey);
//         notificationHaptic("error");
//       }
//     } else {
//       const result = await signIn({
//         login: form.login,
//         password: form.password,
//       });
//       if (result.ok) {
//         notificationHaptic("success");
//         await navigateTo("/", { replace: true });
//       } else {
//         errors.global = t(result.errorKey);
//         notificationHaptic("error");
//       }
//     }
//   } finally {
//     isLoading.value = false;
//   }
// }

async function handleSubmit() {
  if (!validate()) return;
  isLoading.value = true;
  delete errors.global;
  try {
    if (isRegister.value) {
      // 1. Avval Telegram auth
      const tgResult = await signIn_telegram(); // pastda ko'rasiz
      if (!tgResult.ok) {
        errors.global = t("auth.telegramRequired");
        notificationHaptic("error");
        return;
      }

      // 2. Keyin OTP so'rash
      const result = await requestOtp({
        full_name: form.name,
        phone: form.phone,
        username: form.login,
        password: form.password,
        hududlar: form.districts,
        mulk_turlari: [1],
      });
      if (result.ok) {
        if (result.demoOtp) demoOtp.value = result.demoOtp;
        notificationHaptic("success");
        step.value = "otp";
        otpCode.value = "";
        startCountdown(60);
      } else {
        errors.global = result.detail || t(result.errorKey);
        notificationHaptic("error");
      }
    } else {
      // Login — o'zgarishsiz
      const result = await signIn({ login: form.login, password: form.password });
      if (result.ok) {
        notificationHaptic("success");
        await navigateTo("/", { replace: true });
      } else {
        errors.global = t(result.errorKey);
        notificationHaptic("error");
      }
    }
  } finally {
    isLoading.value = false;
  }
}

// Telegram login yordamchi funksiya
async function signIn_telegram() {
  if (!initData.value) return { ok: false };
  return await telegramLogin(initData.value);
}

async function handleOtpSubmit() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!otpCode.value || otpCode.value.length !== 6) {
    errors.otp = t("login.errOtpLength");
    return;
  }
  isLoading.value = true;
  try {
    const result = await verifyOtp(otpCode.value);
    if (result.ok) {
      notificationHaptic("success");
      await navigateTo("/", { replace: true });
    } else {
      errors.global = t(result.errorKey);
      notificationHaptic("error");
    }
  } finally {
    isLoading.value = false;
  }
}

async function resendOtp() {
  isLoading.value = true;
  delete errors.global;
  try {
    const result = await requestOtp({
      full_name: form.name,
      phone: form.phone,
      username: form.login,
      password: form.password,
      hududlar: form.districts,
      mulk_turlari: [1],
    });
    if (result.ok) {
      notificationHaptic("success");
      startCountdown(60);
    } else {
      errors.global = result.detail || t(result.errorKey);
      notificationHaptic("error");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
