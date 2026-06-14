/**
 
 * 
 * @param {Object} options
 * @param {Ref<number>} options.current    - faol slide index
 * @param {number}      options.total      - jami slide soni
 * @param {Ref<string>} options.direction  - 'next' | 'prev'
 * @param {Function}    options.onNext     - keyingi slide callback
 * @param {Function}    options.onPrev     - oldingi slide callback
 * @param {Function}    options.onPause    - autoplay pause
 * @param {Function}    options.onResume   - autoplay resume
 * @param {number}      [options.threshold=40] - drag threshold px
 */
export function useDragCarousel({ onNext, onPrev, onPause, onResume, threshold = 40 }) {
  const dragX      = ref(0)       // real-time drag offset
  const isDragging = ref(false)
  const startX     = ref(0)

  // --- Touch ---
  function onTouchStart(e) {
    startX.value = e.touches[0].clientX
    isDragging.value = true
    dragX.value = 0
    onPause?.()
  }

  function onTouchMove(e) {
    if (!isDragging.value) return
    dragX.value = e.touches[0].clientX - startX.value
  }

  function onTouchEnd() {
    if (!isDragging.value) return
    commit()
    onResume?.()
  }

  // --- Mouse ---
  function onMouseDown(e) {
    startX.value = e.clientX
    isDragging.value = true
    dragX.value = 0
    onPause?.()
    // Global listeners — slide tashqarisiga chiqib ketsa ham ishlaydi
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e) {
    if (!isDragging.value) return
    dragX.value = e.clientX - startX.value
  }

  function onMouseUp() {
    if (!isDragging.value) return
    commit()
    onResume?.()
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  function commit() {
    const delta = dragX.value
    isDragging.value = false
    dragX.value = 0

    if (delta < -threshold) onNext?.()
    else if (delta > threshold) onPrev?.()
  }

  // Visual drag style — faqat drag paytida ishlaydi
  const dragStyle = computed(() => {
    if (!isDragging.value || dragX.value === 0) return {}
    // Rubber-band effect: chetga yetganda qarshilik ko'rsatadi
    const resistance = 0.35
    const offset = dragX.value * resistance
    return {
      transform: `translateX(${offset}px)`,
      transition: 'none',
      cursor: 'grabbing',
    }
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  })

  return {
    isDragging,
    dragX,
    dragStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  }
}
