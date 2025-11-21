<template>
  <div class="container">
    <Header titleOverride="Monthly Stats" />
    <Stats
      :title="`${monthString} ${year}`"
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
const month = route.params.month as string;
const monthString = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(month) - 1];
const year = route.params.year as string;

type Entry = { msPlayed: number; playCount: number; }
const topSongs : Ref<[ string, Entry ][]> = ref([]);
const totalSongs = ref(0);
const totalTime = ref(0);
import(`../assets/data/processed/yearly/${year}/${month}/topSongs.json`).then(module => {
  topSongs.value = module.default;
  topSongs.value.forEach(song => {
    totalSongs.value += song[1].playCount;
    totalTime.value += song[1].msPlayed;
  });
});

const topArtists : Ref<[ string, Entry ][]> = ref([]);
import(`../assets/data/processed/yearly/${year}/${month}/topArtists.json`).then(module => {
  topArtists.value = module.default;
})

const forward = () => {
  let newYear = parseInt(year, 10);
  let nextMonth = parseInt(month, 10) + 1;
  if (nextMonth > 12) {
    newYear += 1
    nextMonth = 1;
  };
  router.replace(`/tracker/extended/year/${newYear}/${nextMonth}`)
}

const back = () => {
  let newYear = parseInt(year, 10);
  let prevMonth = parseInt(month, 10) - 1;
  if (prevMonth < 1) {
    newYear -= 1
    prevMonth = 12;
  };
  router.replace(`/tracker/extended/year/${newYear}/${prevMonth}`)
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