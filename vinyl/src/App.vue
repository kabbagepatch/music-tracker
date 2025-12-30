<script setup lang="ts">
import PWABadge from './components/PWABadge.vue'
</script>

<template>
  <RouterView :key="$route.fullPath" />
  <PWABadge />
</template>

<style scoped>
</style>
