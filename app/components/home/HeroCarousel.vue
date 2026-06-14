<template>
  <div
    class="mx-3 mt-3 rounded-2xl overflow-hidden relative h-44 select-none"
    :style="{ cursor: isDragging ? 'grabbing' : 'grab', ...dragStyle }"
    role="region"
    :aria-label="t('home.bannerAria')"
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
          <template v-if="slide.pattern === 'circles'">
            <span
              v-for="p in particles"
              :key="p.id"
              class="absolute rounded-full bg-white"
              :style="{ width: p.width+'px', height: p.width+'px', left: p.left+'%', top: p.top+'%', opacity: p.opacity }"
            />
          </template>
          <template v-else-if="slide.pattern === 'rings'">
            <span
              v-for="r in 8" :key="r"
              class="absolute rounded-full border border-white/10"
              :style="{ width: (r*60)+'px', height: (r*60)+'px', right: (-r*15)+'px', bottom: (-r*15)+'px' }"
            />
          </template>
          <template v-else-if="slide.pattern === 'grid'">
            <div class="absolute inset-0 opacity-10"
              style="background-image: linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px); background-size: 32px 32px;"
            />
          </template>
        </div>

        <div class="relative z-10 p-5 h-full flex flex-col justify-end">
          <div class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 mb-2 w-fit" :class="slide.badgeBg">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="slide.badgeDot" />
            <span class="text-xs font-medium" :class="slide.badgeText">{{ slide.badge }}</span>
          </div>
          <h1 class="text-white font-bold text-xl leading-tight" v-html="slide.title" />
          <p class="text-white/60 text-xs mt-1.5 leading-relaxed">{{ slide.desc }}</p>
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
        :class="i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'"
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

// Uslub konfiguratsiyasi komponentda; matn (badge/title/desc) i18n'dan keladi
const SLIDE_STYLES = [
  {
    id: 1,
    bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
    pattern: 'circles',
    badgeBg: 'bg-brand-600/20 border border-brand-500/30',
    badgeDot: 'bg-brand-400',
    badgeText: 'text-brand-300',
  },
  {
    id: 2,
    bg: 'bg-gradient-to-br from-brand-800 to-brand-950',
    pattern: 'rings',
    badgeBg: 'bg-white/10 border border-white/20',
    badgeDot: 'bg-amber-400',
    badgeText: 'text-amber-300',
  },
  {
    id: 3,
    bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    pattern: 'grid',
    badgeBg: 'bg-green-500/20 border border-green-400/30',
    badgeDot: 'bg-green-400',
    badgeText: 'text-green-300',
  },
  {
    id: 4,
    bg: 'bg-gradient-to-br from-zinc-800 to-zinc-950',
    pattern: 'rings',
    badgeBg: 'bg-blue-500/20 border border-blue-400/30',
    badgeDot: 'bg-blue-400',
    badgeText: 'text-blue-300',
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
        title: card.title,
        desc: card.description || '',
      }
    })
  }
  return SLIDE_STYLES.map((s, i) => ({ ...s, ...t('home.carousel')[i] }))
})

const INTERVAL = 4000
const { particles } = useHeroParticles(18)

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
