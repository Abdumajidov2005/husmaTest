<template>
  <div class="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950">

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-3 px-4 py-3">
        <UiButton
          v-if="!isNativeBack"
          variant="ghost"
          size="sm"
          haptic="light"
          class="!w-9 !h-9 !p-0 rounded-xl"
          :aria-label="t('common.backAria')"
          @click="goBack"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <path d="M12 4L6 10l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </UiButton>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('obuna.title') }}</h1>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"/>
    </div>

    <template v-else>

      <!-- ===== Joriy holat kartochkasi ===== -->
      <section class="px-4 pt-5">

        <!-- Bepul muddat — faol -->
        <div
          v-if="obunaHolat?.faol && !obunaHolat?.obuna_faol && obunaHolat?.bepul_muddat_tugash"
          class="card p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl mb-4"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-800/40 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.8"/>
                <path d="M10 6v4l2.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-green-800 dark:text-green-300">{{ t('obuna.freeActive') }}</p>
              <p class="text-xs text-green-700 dark:text-green-400 mt-0.5">
                {{ t('obuna.freeTugash') }}: {{ formatDate(obunaHolat.bepul_muddat_tugash) }}
              </p>
            </div>
          </div>
          <div class="mt-3 h-2 rounded-full bg-green-200 dark:bg-green-800/50 overflow-hidden">
            <div
              class="h-full rounded-full bg-green-500 dark:bg-green-400 transition-all"
              :style="{ width: bepulProgress + '%' }"
            />
          </div>
          <p class="text-xs text-green-600 dark:text-green-500 mt-1.5">{{ t('obuna.daysLeft', { n: bepulQolganKun }) }}</p>
        </div>

        <!-- Obuna faol -->
        <div
          v-else-if="obunaHolat?.obuna_faol && obunaHolat?.joriy_obuna"
          class="card p-4 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl mb-4"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-800/40 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 20 20">
                <path d="M5 10l3.5 3.5L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-brand-800 dark:text-brand-300">{{ obunaHolat.joriy_obuna.tarif_nomi }}</p>
              <p class="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
                {{ t('obuna.tugashSana') }}: {{ formatDate(obunaHolat.joriy_obuna.tugash_vaqti) }}
              </p>
            </div>
            <span class="text-xs font-bold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              {{ t('obuna.active') }}
            </span>
          </div>
        </div>

        <!-- Faol emas -->
        <div
          v-else-if="obunaHolat && !obunaHolat.faol"
          class="card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl mb-4"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-800/40 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 10h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-red-700 dark:text-red-400">{{ t('obuna.inactive') }}</p>
              <p class="text-xs text-red-600 dark:text-red-500 mt-0.5">{{ t('obuna.inactiveSub') }}</p>
            </div>
          </div>
        </div>

      </section>

      <!-- ===== 7 kun bepul banner (obuna yo'q va bepul muddat ham tugagan) ===== -->
      <section v-if="!obunaHolat?.faol" class="px-4 mb-2">
        <div class="rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 p-4">
          <div class="flex items-center gap-2 mb-1">
            <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1l1.5 3 3.3.3-2.5 2.1.8 3.2L8 8.2 4.9 9.9l.8-3.2L3.2 4.6 6.5 4 8 1z"/>
            </svg>
            <span class="text-xs font-bold text-amber-700 dark:text-amber-400">{{ t('obuna.freeBadge') }}</span>
          </div>
          <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">{{ t('obuna.freeBannerTitle') }}</p>
          <p class="text-xs text-amber-600 dark:text-amber-500 mt-0.5">{{ t('obuna.freeBannerSub') }}</p>
        </div>
      </section>

      <!-- ===== Tariflar ===== -->
      <section class="px-4 mt-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white mb-3">{{ t('obuna.tariflar') }}</h2>

        <div v-if="tariflarLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"/>
        </div>

        <div v-else class="space-y-3">
          <button
            v-for="tarif in tariflar"
            :key="tarif.id"
            type="button"
            class="w-full text-left rounded-2xl border-2 p-4 transition-all"
            :class="selectedTarif === tarif.id
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700'"
            @click="selectedTarif = tarif.id"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ tarif.nomi }}</span>
                  <span
                    v-if="tarif.tartib === 1"
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  >
                    {{ t('obuna.popular') }}
                  </span>
                </div>
                <p v-if="tarif.izoh" class="text-xs text-gray-400 mt-0.5">{{ tarif.izoh }}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ t('obuna.davomiylik', { n: tarif.davomiylik_kun }) }}
                </p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                  {{ formatSum(tarif.narx) }}
                </p>
                <p class="text-xs text-gray-400">{{ t('common.currency') }}</p>
              </div>
            </div>
            <!-- Radio indikator -->
            <div class="flex items-center gap-2 mt-3">
              <div
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                :class="selectedTarif === tarif.id
                  ? 'border-brand-500'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <div
                  v-if="selectedTarif === tarif.id"
                  class="w-2 h-2 rounded-full bg-brand-500"
                />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('obuna.selectTarif') }}</span>
            </div>
          </button>
        </div>
      </section>

      <!-- ===== To'lov usuli ===== -->
      <section v-if="tariflar.length" class="px-4 mt-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white mb-3">{{ t('obuna.tolovUsuli') }}</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="p in provayderlar"
            :key="p.id"
            type="button"
            class="rounded-2xl border-2 p-3 flex flex-col items-center gap-1.5 transition-all"
            :class="selectedProvayder === p.id
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'"
            @click="selectedProvayder = p.id"
          >
            <span class="text-xl">{{ p.icon }}</span>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ p.label }}</span>
          </button>
        </div>
      </section>

      <!-- ===== Buyurtma berish tugmasi ===== -->
      <section v-if="tariflar.length" class="px-4 mt-6">
        <div v-if="buyurtmaError" role="alert" class="mb-3 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5">
          <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="text-xs text-red-600 dark:text-red-400">{{ buyurtmaError }}</span>
        </div>

        <UiButton
          variant="primary"
          size="md"
          haptic="medium"
          block
          :loading="buyurtmaLoading"
          :disabled="!selectedTarif"
          @click="handleBuyurtma"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <path d="M3 10h14M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ t('obuna.sotibOlish') }}
        </UiButton>
      </section>

      <!-- ===== Obuna tarixi ===== -->
      <section v-if="tarix.length" class="px-4 mt-6 mb-4">
        <h2 class="text-sm font-bold text-gray-900 dark:text-white mb-3">{{ t('obuna.tarix') }}</h2>
        <div class="space-y-2">
          <div
            v-for="ob in tarix"
            :key="ob.id"
            class="card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3"
          >
            <div
              class="w-2 h-2 rounded-full flex-shrink-0"
              :class="{
                'bg-green-500': ob.holat === 'faol',
                'bg-gray-400': ob.holat === 'tugagan',
                'bg-red-400': ob.holat === 'bekor',
                'bg-amber-400': ob.holat === 'kutilmoqda',
              }"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{{ ob.tarif_nomi }}</p>
              <p class="text-xs text-gray-400">
                {{ ob.boshlanish_vaqti ? formatDate(ob.boshlanish_vaqti) : '—' }}
                <span v-if="ob.tugash_vaqti"> → {{ formatDate(ob.tugash_vaqti) }}</span>
              </p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ formatSum(ob.narx) }} so'm</p>
              <span
                class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                :class="{
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400': ob.holat === 'faol',
                  'bg-gray-100 dark:bg-gray-800 text-gray-500': ob.holat === 'tugagan',
                  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400': ob.holat === 'bekor',
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400': ob.holat === 'kutilmoqda',
                }"
              >
                {{ t('obuna.holat_' + ob.holat) }}
              </span>
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['rieltor'] })

const { t } = useI18n()
const { notificationHaptic, ready } = useTelegram()
const { apiFetch } = useAuth()
const router = useRouter()

function goBack() {
  if (import.meta.client && window.history.length > 1) router.back()
  else navigateTo('/profile', { replace: true })
}

const { isNativeBack } = useBackButton(goBack)

// --- State ---
const isLoading       = ref(true)
const tariflarLoading = ref(true)
const tariflar        = ref([])
const obunaHolat      = ref(null)
const tarix           = ref([])
const selectedTarif   = ref(null)
const selectedProvayder = ref('payme')
const buyurtmaLoading = ref(false)
const buyurtmaError   = ref('')

const provayderlar = [
  { id: 'payme',  label: 'Payme',  icon: '💳' },
  { id: 'click',  label: 'Click',  icon: '📱' },
]

// --- Computed ---
const bepulQolganKun = computed(() => {
  if (!obunaHolat.value?.bepul_muddat_tugash) return 0
  const diff = new Date(obunaHolat.value.bepul_muddat_tugash) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const bepulProgress = computed(() => {
  const qolgan = bepulQolganKun.value
  return Math.min(100, Math.round((qolgan / 7) * 100))
})

// --- Utils ---
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatSum(n) {
  if (!n) return '0'
  return Number(n).toLocaleString('uz-UZ')
}

// --- Fetch ---
async function fetchAll() {
  isLoading.value = true
  tariflarLoading.value = true

  try {
    const [holatRes, tarifRes] = await Promise.all([
      apiFetch('/api/obuna/mening/'),
      fetch('https://husma.pythonanywhere.com/api/obuna/tariflar/').then(r => r.json()),
    ])

    if (holatRes.ok) {
      obunaHolat.value = holatRes.data
      tarix.value = holatRes.data?.tarix || []
    }

    tariflar.value = Array.isArray(tarifRes) ? tarifRes : (tarifRes.results || [])
    if (tariflar.value.length && !selectedTarif.value) {
      selectedTarif.value = tariflar.value[0].id
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
    tariflarLoading.value = false
  }
}

async function handleBuyurtma() {
  if (!selectedTarif.value) return
  buyurtmaError.value = ''
  buyurtmaLoading.value = true

  try {
    const { ok, data, errorKey } = await apiFetch('/api/obuna/sotib-olish/', {
      method: 'POST',
      body: { tarif_id: selectedTarif.value, provayder: selectedProvayder.value },
    })

    if (ok && data?.tolov_url) {
      notificationHaptic('success')
      window.open(data.tolov_url, '_blank')
      setTimeout(() => fetchAll(), 2000)
    } else if (ok) {
      notificationHaptic('success')
      buyurtmaError.value = t('obuna.tolovUrlYoq')
      fetchAll()
    } else {
      buyurtmaError.value = t(errorKey || 'auth.serverError')
      notificationHaptic('error')
    }
  } finally {
    buyurtmaLoading.value = false
  }
}

onMounted(() => {
  ready()
  fetchAll()
})
</script>
