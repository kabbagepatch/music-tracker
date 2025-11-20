<template>
  <div class="container">
    <Header titleOverride="Yearly Stats" />
    <Stats
      :title="year"
      :topSongs="topSongs"
      :topArtists="topArtists"
      :totalSongs="totalSongs"
      :totalTime="totalTime"
      :back="back"
      :forward="forward"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "../Header.vue";
import Stats from "../components/Stats.vue";

const router = useRouter();
const route = useRoute();
const year = route.params.year as string;

type Entry = { msPlayed: number; playCount: number; }
const topSongs : Ref<[ string, Entry ][]> = ref([]);
const totalSongs = ref(0);
const totalTime = ref(0);
import(`../assets/data/processed/yearly/${year}/topSongs.json`).then(module => {
  topSongs.value = module.default;
  topSongs.value.forEach(song => {
    totalSongs.value += song[1].playCount;
    totalTime.value += song[1].msPlayed;
  });
});

const topArtists : Ref<[ string, Entry ][]> = ref([]);
import(`../assets/data/processed/yearly/${year}/topArtists.json`).then(module => {
  topArtists.value = module.default;
})

const forward = () => {
  const nextYear = parseInt(year, 10) + 1;
  if (nextYear > 2025) return;
  router.replace(`/tracker/extended/${nextYear}`)
}

const back = () => {
  const prevYear = parseInt(year, 10) - 1;
  if (prevYear < 2012) return;
  router.replace(`/tracker/extended/${prevYear}`)
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