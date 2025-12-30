<script setup lang="ts">

defineProps({
  vinyl: {
    type: Object,
    default: {}
  }
})

</script>

<template>
  <div class="vinyl-header">
    <img class="vinyl-art" :src="vinyl.imageUrl" :alt="vinyl.album">
    <div class="vinyl-details">
        <div class="album">{{ vinyl.album }}</div>
        <div class="artist">{{ vinyl.artist }}</div>
        <div class="artist">{{ vinyl.published }}</div>
    </div>
  </div>
</template>

<style scoped>
</style>
