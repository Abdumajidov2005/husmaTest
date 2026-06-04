/**
 * useTheme — Markazlashtirilgan tema boshqaruvi.
 *
 * Barcha rang, o'lcham, radius va animatsiya tokenlarini
 * bir joydan boshqaradi. Komponentlar bu yerdan import qiladi —
 * hech qachon hardcode qilinmaydi.
 *
 * Telegram colorScheme bilan sinxronlanadi.
 */

// --- TOKEN DEFINITIONS ---

export const COLORS = {
  brand: {
    50:  '#fff1f1',
    100: '#ffe0e0',
    300: '#ff9d9d',
    400: '#ff6363',
    500: '#f83131',
    600: '#e51313',  // asosiy
    700: '#c10a0a',
    800: '#a00c0c',
    900: '#840f0f',
  },
}

export const SIZES = {
  btn: {
    sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-3 text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2',
  },
  icon: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
}

export const VARIANTS = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700',
  outline:   'border-2 border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20',
  ghost:     'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
  danger:    'bg-red-600 text-white hover:bg-red-700',
}

// --- COMPOSABLE ---

export function useTheme() {
  const colorMode = useColorMode()
  const { colorScheme } = useTelegram()

  // Telegram colorScheme bilan sinxronlashtirish
  watch(colorScheme, (scheme) => {
    if (scheme === 'dark' || scheme === 'light') {
      colorMode.preference = scheme
    }
  }, { immediate: true })

  const isDark = computed(() => colorMode.value === 'dark')

  function toggleTheme() {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  return {
    isDark,
    toggleTheme,
    colorMode,
    COLORS,
    SIZES,
    VARIANTS,
  }
}
