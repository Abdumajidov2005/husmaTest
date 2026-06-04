export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Telegram Mini App — faqat client-side render
  ssr: false,

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    // localStorage da saqlaydi — SSR mismatch oldini oladi
    storageKey: 'husma-color-mode',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Husma Estate — Kvartira Qidiruv',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        { name: 'theme-color', content: '#dc2626' },
      ],
      script: [
        { src: 'https://telegram.org/js/telegram-web-app.js', defer: true },
      ],
    },
  },
})
