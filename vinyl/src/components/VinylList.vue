<script setup lang="ts">

const props = defineProps<{
  vinyls: any[],
  onVinylSelect?: any,
  onAdd?: any
}>()

const addClick = (e: any, vinyl: any) => {
  e.stopPropagation();
  props.onAdd(vinyl);
}

</script>

<template>
  <div class="albums">
    <div class="album-item" v-for="vinyl in vinyls" @click="onVinylSelect(vinyl)">
      <div class="album-info">
        <img v-if="vinyl.imageUrl" class="album-art" :src="vinyl.imageUrl" :alt="vinyl.album">
        <div v-else class="album-art" :style="{ backgroundColor: 'black' }" />
        <div class="album-name">
          <div class="album">{{ vinyl.album }}</div>
          <div class="artist">{{ vinyl.artist }}</div>
        </div>
      </div>
      <button v-if="onAdd" class="add-button" @click="(e) => addClick(e, vinyl)">+</button>
    </div>
  </div>
</template>

<style scoped>
  .albums {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 0;
  }

  .album-item {
    background-color: rgb(41, 41, 41);
    padding: 6px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .album-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .album-art {
    width: 50px;
    height: 50px;
  }

  .artist {
    color: rgb(190, 190, 190);
    white-space: nowrap;
    overflow-x: hidden;
    font-size: 15px;
  }

  .add-button {
    font-size: 24px;
    line-height: 1em;
    padding: 6px 12px;
  }
</style>
