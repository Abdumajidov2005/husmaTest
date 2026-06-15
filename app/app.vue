<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <div class="mx-auto w-full flex flex-col flex-1" style="max-width: 430px">
      <NuxtPage class="flex-1" />
    </div>
  </div>
</template>

<script setup>
// Telegram auth va sessiya tiklash `plugins/auth.client.js` da bajariladi
// (sahifalar mount bo'lishidan oldin), shuning uchun bu yerda takrorlanmaydi.
const { tg } = useTelegram();
useTheme();

onMounted(() => {
  tg.value?.setHeaderColor("#dc2626");
});
</script>
