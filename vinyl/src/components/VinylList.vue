<script setup lang="ts">

defineProps<{
  vinyls: any[]
}>()

</script>

<template>
  <div class="albums">
    <div class="album-item" v-for="vinyl in vinyls" @click="$router.push(`/catalog/${vinyl.id}`)">
      <img class="album-art" :src="vinyl.thumbnailUrl.replace('34s', '64s')" :alt="vinyl.album">
      <div class="album-name">
        <div class="album">{{ vinyl.album }}</div>
        <div class="artist">{{ vinyl.artist }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .albums {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 20px;
    padding: 16px 0;
  }

  .album-item {
    width: 100%;
    height: 50px;
    background-color: rgb(41, 41, 41);
    padding: 6px;
    border-radius: 5px;
    display: flex;
    gap: 16px;
  }

  .album-art {
    height: 50px;
  }

  .album {
    width: 100%;
    white-space: nowrap;
    overflow-x: hidden;
  }

  .artist {
    color: rgb(190, 190, 190);
    white-space: nowrap;
    overflow-x: hidden;
    font-size: 15px;
  }
</style>
