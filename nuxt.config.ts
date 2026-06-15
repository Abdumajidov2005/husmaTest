export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Telegram Mini App — faqat client-side render
  ssr: false,

  modules: ['@nuxtjs/tailwindcss'],

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
        // Telegram hujjatlari tavsiyasi: skript <head> da sinxron yuklanadi,
        // shunda ilova mount bo'lishidan oldin window.Telegram.WebApp tayyor bo'ladi.
        { src: 'https://telegram.org/js/telegram-web-app.js' },
      ],
    },
  },
})
