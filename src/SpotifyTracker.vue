<template>
  <div>
    <div v-if="curComponent === 'TopTracks'">
      <div class="titleContainer">
        <h1 @click="switchItemType">{{ itemType === 'artists' ? 'Artists' : 'Tracks' }}</h1>
        <h1 @click="switchTimeRange">{{ timeRange === 'long_term' ? '1 Year' : (timeRange === 'medium_term' ? '6 Months' : '4 Weeks') }}</h1>
        <h1 @click="switchLimit">{{ limit }}</h1>
      </div>
      <TrackList title="Top Tracks" :tracks="tracks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue"
import TrackList from "./components/TrackList.vue";
import { getTopItems } from './services/spotify';

const curComponent = ref('TopTracks');
const itemType : (Ref<'tracks' | 'artists'>) = ref('tracks');
const timeRange : (Ref<'short_term' | 'medium_term' | 'long_term'>) = ref('short_term');
const limit = ref(10);

const tracks: any = ref([]);
// short_term, medium_term, long_term
// tracks, artists
const setTopItems = () => {
  getTopItems(itemType.value, timeRange.value, limit.value).then(data => {
    tracks.value = data.items;
    console.log("Top tracks fetched:", data.items);
  }).catch(err => {
    console.error("Error fetching top tracks:", err);
  });
}
setTopItems();

const switchItemType = () => {
  if (itemType.value === 'tracks') {
    itemType.value = 'artists';
  } else {
    itemType.value = 'tracks';
  }
  setTopItems();
};

const switchTimeRange = () => {
  if (timeRange.value === 'long_term') {
    timeRange.value = 'short_term';
  } else if (timeRange.value === 'medium_term') {
    timeRange.value = 'long_term';
  } else {
    timeRange.value = 'medium_term';
  }
  setTopItems();
};

const switchLimit = () => {
  if (limit.value === 10) {
    limit.value = 20;
  } else if (limit.value === 20) {
    limit.value = 50;
  } else {
    limit.value = 10;
  }
  setTopItems();
}

</script>

<style scoped>
.titleContainer {
  display: flex;
  width: 340px;
}

h1 {
  margin-right: 25px;
  margin-bottom: 10px;
  font-size: 32px;
  color: white;
  cursor: pointer;
}

h1:nth-child(1) {
  flex: 3;
}

h1:nth-child(2) {
  flex: 4;
}

h1:nth-child(3) {
  flex: 1;
}
</style>