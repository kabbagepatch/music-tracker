<template>
  <div class="container">
    <Header title="Yearly Stats" icon="year" />
    <TimeStats
      :title="year"
      :topSongs="topTracks"
      :topArtists="topArtists"
      :totalSongs="totalSongs"
      :totalTime="totalTime"
      :back="back"
      :forward="forward"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../Header.vue";
import TimeStats from "../components/TimeStats.vue";
import { TrackTotals, useTrackerStore } from "../stores/tracker";

const router = useRouter();
const route = useRoute();
const year = route.params.year as string;

const trackerStore = useTrackerStore();

const topTracks = ref<[ string, TrackTotals ][]>([]);
const topArtists = ref<[ string, TrackTotals ][]>([]);
const totalSongs = ref(0);
const totalTime = ref(0);
trackerStore.getTopTracks(year).then(data => {
  topTracks.value = data;
  topTracks.value.forEach(song => {
    totalSongs.value += song[1].playCount;
    totalTime.value += song[1].msPlayed;
  });
});
trackerStore.getTopArtists(year).then(data => {
  topArtists.value = data;
});

const forward = () => {
  const nextYear = parseInt(year, 10) + 1;
  if (nextYear > 2025) return;
  router.replace(`/tracker/extended/year/${nextYear}`)
}

const back = () => {
  const prevYear = parseInt(year, 10) - 1;
  if (prevYear < 2012) return;
  router.replace(`/tracker/extended/year/${prevYear}`)
}

</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.header h1 {
  text-align: center;
  margin: 0;
}

h1 {
  margin-bottom: 5px;
}

.summary {
  margin-bottom: 10px;
}

.summary-title {
  color: var(--primary-color);
}

.title {
  text-align: left;
  margin-left: 0;
}

.entry {
  text-align: left;
  text-shadow: none;
  color: var(--background-color);
  margin: 0;
  font-weight: bold;
}
</style>