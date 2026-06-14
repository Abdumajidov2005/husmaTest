<template>
  <div
    class="mx-3 mt-3 rounded-2xl overflow-hidden relative h-40 select-none"
    :style="{ cursor: isDragging ? 'grabbing' : 'grab', ...dragStyle }"
    role="region"
    :aria-label="t('rieltor.panelAria')"
    aria-roledescription="carousel"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <TransitionGroup
      :name="direction === 'next' ? 'slide-next' : 'slide-prev'"
      tag="div"
      class="absolute inset-0"
    >
      <div
        v-for="(slide, i) in SLIDES"
        v-show="i === current"
        :key="slide.id"
        class="absolute inset-0"
        :aria-hidden="i !== current"
      >
        <div class="absolute inset-0" :class="slide.bg" />

        <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <span
            v-for="r in 9" :key="r"
            class="absolute rounded-full border border-white/10 block"
            :style="{ width: (r*55)+'px', height: (r*55)+'px', right: (-r*12)+'px', bottom: (-r*12)+'px' }"
          />
        </div>

        <div class="relative z-10 p-5 h-full flex flex-col justify-between">
          <div class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 w-fit" :class="slide.badgeBg">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="slide.badgeDot" />
            <span class="text-xs font-medium" :class="slide.badgeText">{{ slide.badge }}</span>
          </div>
          <div>
            <p class="text-white/70 text-xs font-medium mb-1">{{ slide.label }}</p>
            <div class="flex items-end justify-between">
              <h1 class="text-white font-bold text-xl leading-tight" v-html="slide.title" />
              <div v-if="slide.stat" class="text-right flex-shrink-0 ml-3">
                <p class="text-white font-black text-3xl tabular-nums leading-none">{{ slide.stat }}</p>
                <p class="text-white/50 text-[10px] mt-0.5">{{ slide.statLabel }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Dots -->
    <div class="absolute bottom-3 right-4 z-20 flex gap-1.5" role="tablist">
      <button
        v-for="(slide, i) in SLIDES"
        :key="slide.id"
        role="tab"
        :aria-selected="i === current"
        :aria-label="t('common.slideAria', { n: i + 1 })"
        class="rounded-full transition-all duration-300"
        :class="i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/55'"
        @click="goTo(i)"
      />
    </div>

    <!-- Progress bar -->
    <div class="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
      <div
        class="h-full bg-white/40 origin-left"
        :style="{ transform: `scaleX(${progress})`, transition: paused ? 'none' : 'transform 0.1s linear' }"
      />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

// Uslub + raqamli statistika komponentda; matn (badge/label/title/statLabel) i18n'dan
const SLIDE_STYLES = [
  {
    id: 1,
    bg: 'bg-gradient-to-br from-brand-700 to-brand-900',
    badgeBg: 'bg-white/10 border border-white/20',
    badgeDot: 'bg-brand-300',
    badgeText: 'text-brand-200',
    stat: null,
  },
  {
    id: 2,
    bg: 'bg-gradient-to-br from-brand-800 to-rose-900',
    badgeBg: 'bg-white/10 border border-white/20',
    badgeDot: 'bg-amber-400',
    badgeText: 'text-amber-300',
    stat: '2',
  },
  {
    id: 3,
    bg: 'bg-gradient-to-br from-rose-800 to-brand-900',
    badgeBg: 'bg-green-500/20 border border-green-400/30',
    badgeDot: 'bg-green-400',
    badgeText: 'text-green-300',
    stat: '87%',
  },
  {
    id: 4,
    bg: 'bg-gradient-to-br from-brand-900 to-slate-900',
    badgeBg: 'bg-blue-500/20 border border-blue-400/30',
    badgeDot: 'bg-blue-400',
    badgeText: 'text-blue-300',
    stat: '45%',
  },
]

const { sliderCards, fetchSlider } = useSlider()

const SLIDES = computed(() => {
  if (sliderCards.value.length) {
    return sliderCards.value.map((card, i) => {
      const style = SLIDE_STYLES[i % SLIDE_STYLES.length]
      return {
        ...style,
        id: card.id,
        badge: card.badge_matn,
        label: card.sarlavha || '',
        title: card.title,
        stat: null,
        statLabel: '',
      }
    })
  }
  return SLIDE_STYLES.map((s, i) => ({ ...s, ...t('rieltor.carousel')[i] }))
})

const INTERVAL = 4000

const current   = ref(0)
const paused    = ref(false)
const progress  = ref(0)
const direction = ref('next')
let timer = null
let progressTimer = null

function goTo(index) {
  direction.value = index > current.value ? 'next' : 'prev'
  current.value = index
  resetProgress()
}
function next() {
  direction.value = 'next'
  current.value = (current.value + 1) % SLIDES.value.length
  resetProgress()
}
function prev() {
  direction.value = 'prev'
  current.value = (current.value - 1 + SLIDES.value.length) % SLIDES.value.length
  resetProgress()
}
function resetProgress() {
  progress.value = 0
  clearInterval(progressTimer)
  if (!paused.value) startProgress()
}
function startProgress() {
  const step = 1 / (INTERVAL / 100)
  progressTimer = setInterval(() => {
    progress.value = Math.min(1, progress.value + step)
  }, 100)
}
function startAutoplay() {
  clearInterval(timer)
  timer = setInterval(() => { if (!paused.value) next() }, INTERVAL)
}
function pause()  { paused.value = true;  clearInterval(progressTimer) }
function resume() { paused.value = false; startProgress() }

const { isDragging, dragStyle, onTouchStart, onTouchMove, onTouchEnd, onMouseDown } =
  useDragCarousel({ onNext: next, onPrev: prev, onPause: pause, onResume: resume })

onMounted(() => { startAutoplay(); startProgress(); fetchSlider() })

watch(() => SLIDES.value.length, () => {
  if (current.value >= SLIDES.value.length) current.value = 0
})
onUnmounted(() => { clearInterval(timer); clearInterval(progressTimer) })
</script>

<style scoped>
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}
.slide-next-enter-from { opacity: 0; transform: translateX(100%); }
.slide-next-leave-to   { opacity: 0; transform: translateX(-100%); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-100%); }
.slide-prev-leave-to   { opacity: 0; transform: translateX(100%); }
</style>
