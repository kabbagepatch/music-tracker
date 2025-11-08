<template>
  <div class="tracks-container">
    <h1>{{ title.length > 24 ? title.substr(0, 24) + '...' : title }}</h1>
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
  color: white;
  margin-bottom: 8px;
}

h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 20px;
  width: 100%;
}

.tracks {
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tracks::-webkit-scrollbar {
  display: none;
}

.track {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #ff97f1;
  width: 100%;
  padding-left: 5px;
  cursor: pointer;
}

.track-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 12px;
}

.track-name {
  font-size: 18px;
}

.selected {
  color: #ffb3c6;
  font-weight: bold;
  background-color: #31001438;
}
</style>