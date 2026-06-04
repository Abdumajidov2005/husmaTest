/**
 * useCurrentUser — Joriy foydalanuvchining barqaror identifikatsiyasi.
 *
 * Telegram ichida ochilsa  → Telegram user (id, ism, username, foto).
 * Oddiy brauzerda ochilsa  → localStorage da saqlangan barqaror "device" id.
 *
 * Bu identifikator anketalar egasini (ownerId) belgilash uchun ishlatiladi —
 * shu orqali "User bergan anketalar" sahifasi faqat o'sha foydalanuvchining
 * arizalarini ko'rsatadi.
 */

const DEVICE_KEY = 'husma_device_id'

// Module-level — bir marta resolve qilinadi, barcha komponentlar ulashadi.
const deviceId = ref(null)

function ensureDeviceId() {
  if (!import.meta.client || deviceId.value) return
  try {
    let id = localStorage.getItem(DEVICE_KEY)
    if (!id) {
      id = 'device-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      localStorage.setItem(DEVICE_KEY, id)
    }
    deviceId.value = id
  } catch {
    deviceId.value = 'device-anon'
  }
}

export function useCurrentUser() {
  const { user: tgUser } = useTelegram()
  const { user: authUser, isRieltor } = useAuth()
  const { t } = useI18n()

  ensureDeviceId()

  /** Anketa egasini belgilash uchun barqaror kalit */
  const id = computed(() =>
    tgUser.value ? `tg-${tgUser.value.id}` : deviceId.value
  )

  const name = computed(() => {
    const u = tgUser.value
    if (u) {
      const full = [u.first_name, u.last_name].filter(Boolean).join(' ').trim()
      return full || u.username || t('roles.user')
    }
    // Rieltor sifatida kirgan bo'lsa — auth nomidan foydalanamiz
    if (authUser.value?.name) return authUser.value.name
    return t('roles.guest')
  })

  const username = computed(() => tgUser.value?.username ?? null)
  const photoUrl = computed(() => tgUser.value?.photo_url ?? null)
  const phone = computed(() => authUser.value?.phone ?? null)
  const isTelegram = computed(() => !!tgUser.value)

  /** Avatar uchun bosh harflar (foto bo'lmaganda) */
  const initials = computed(() => {
    const n = (name.value || '').trim()
    if (!n) return 'M'
    return n
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  /** Foydalanuvchi roli yorlig'i */
  const roleLabel = computed(() => {
    if (isRieltor.value) return t('roles.rieltor')
    if (isTelegram.value) return t('roles.telegramUser')
    return t('roles.guest')
  })

  return {
    id,
    name,
    username,
    photoUrl,
    phone,
    initials,
    isTelegram,
    isRieltor,
    roleLabel,
  }
}
