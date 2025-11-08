<template>
  <div>
    <div v-if="curComponent === 'TopTracks'">
      <TrackList title="Top Artists" :tracks="tracks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import TrackList from "./components/TrackList.vue";
import { getTopItems } from './services/spotify';

const curComponent = ref('TopTracks');

const tracks: any = ref([]);
// short_term, medium_term, long_term
// tracks, artists
getTopItems('artists', 'long_term', 50).then(data => {
  tracks.value = data.items;
  console.log("Top tracks fetched:", data.items);
}).catch(err => {
  console.error("Error fetching top tracks:", err);
});

</script>

<style scoped>
h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 24px;
  width: 100%;
  color: white;
}
</style>