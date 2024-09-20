<script setup>
  defineProps({
    to: {
      type: String,
      default: "/admin"
    }
  })
</script>

<template>
    <NuxtLink :to="to" class="py-4 px-2 border">
      <slot/>
    </NuxtLink>
</template>
