<script setup >
defineProps({
  number: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ""
  }
})
</script>

<template>
  <div class="border rounded p-2">
    <p>{{ title }}: <span class="font-bold text-lg">{{ number }}</span></p>
  </div>
</template>

<style scoped>

</style>