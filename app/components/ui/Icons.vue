<template>
  <svg fill="none" aria-hidden="true">
    <use :href="`/icons.svg#${name}`" />
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
});
</script>
