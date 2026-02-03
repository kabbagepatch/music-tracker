<script setup lang="ts">
import PWABadge from './components/PWABadge.vue'
</script>

<template>
  <div :style="{ display: 'flex', alignItems: 'center', height: '50px', marginBottom: '20px', gap: '10px' }">
    <img :style="{ width: '50px', height: '50px' }" src="./assets/vinyl.png" />
    <h1>Vinyl Tracker</h1>
  </div>
  <RouterView :key="$route.fullPath" />
  <PWABadge />
</template>

<style scoped>
</style>
