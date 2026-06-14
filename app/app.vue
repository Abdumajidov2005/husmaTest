<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <div class="mx-auto w-full flex flex-col flex-1" style="max-width: 430px">
      <NuxtPage class="flex-1" />
    </div>
  </div>
</template>

<script setup>
const { hydrate, telegramLogin, isAuthenticated } = useAuth();
const { tg, initData } = useTelegram();
useTheme();

// hydrate faqat client-side da, onMounted ichida
onMounted(async () => {
  tg.value?.setHeaderColor("#dc2626");

  // Avval localStorage dagi sessiyani tiklaymiz (tezkor render uchun)
  hydrate();

  // Telegram Mini App ichida ochilgan bo'lsa va hali login qilinmagan bo'lsa —
  // backendga initData yuborib avtomatik JWT olamiz (POST /api/auth/telegram/)
  if (initData.value && !isAuthenticated.value) {
    await telegramLogin(initData.value);
  }
});
</script>
