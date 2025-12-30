<script setup lang="ts">

defineProps<{
  vinyls: any[]
}>()

</script>

<template>
  <div class="albums">
    <div class="album-tile" v-for="vinyl in vinyls" @click="$router.push(`/catalog/${vinyl.id}`)">
      <img v-if="vinyl.imageUrl" class="album-art" :src="vinyl.imageUrl" :alt="vinyl.album">
      <div v-else class="album-art" :style="{ marginBottom: '10px', backgroundColor: vinyl.discColor }" />
      <div class="album">{{ vinyl.album.length > 13 ? vinyl.album.slice(0, 12).trim() + '..' : vinyl.album }}</div>
      <div class="artist">{{ vinyl.artist.length > 13 ? vinyl.artist.slice(0, 12).trim() + '..' : vinyl.artist }}</div>
    </div>
  </div>
</template>

<style scoped>
  .albums {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    padding: 16px 0;
  }

  .album-tile {
    width: 100px;
    height: 160px;
    background-color: rgb(41, 41, 41);
    padding: 6px;
    border-radius: 5px;
    cursor: pointer;
    transition: box-shadow 0.25s;
  }

  .album-tile:hover {
    box-shadow: 0 0 3px rgb(223, 223, 223), 0 0 2px rgb(167, 167, 167);
  }

  .album-art {
    width: 100px;
    height: 100px;
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
