<template>
  <div class="tracks-container">
    <div class="tracks">
      <div :class="`track ${curIndex === i ? 'selected' : ''}`" v-for="(item, i) in tracks.filter((item: any) => item.id)" :key="item.id" @click="trackClick(item, i)">
        <img class="track-thumbnail" :src="item.images ? item.images[2].url : item.album?.images[2].url" alt="Album Art" />
        <div class="track-name" >{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  tracks: {
    type: Array,
    default: () => ([]),
  },
  curIndex: {
    type: Number,
    default: -1,
  },
  trackClick: {
    type: Function,
    default: () => {},
  },
});

</script>

<style scoped>
.tracks-container {
  width: 364px;
  overflow-x: hidden;
  color: var(--text-color);
  margin-bottom: 8px;
}

.tracks {
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-radius: 12px;
}

.tracks::-webkit-scrollbar {
  display: none;
}

.track {
  display: flex;
  align-items: center;
  padding: 6px 0;
  background-color: var(--primary-color);
  border-bottom: 1px solid var(--secondary-color);
  width: 100%;
  cursor: pointer;
}

.track-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin: 0 12px;
}

.track-name {
  font-size: 24px;
}

.selected {
  color: var(--secondary-color);
  font-weight: bold;
  background-color: #31001438;
}
</style>
