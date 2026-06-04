<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <div class="mx-auto w-full flex flex-col flex-1" style="max-width: 430px;">
      <NuxtPage class="flex-1" />
    </div>
  </div>
</template>

<script setup>
const { hydrate } = useAuth()
const {tg} = useTelegram()
useTheme()

// hydrate faqat client-side da, onMounted ichida
onMounted(() => {
  tg.value?.setHeaderColor('#dc2626')
  hydrate()
})
</script>
