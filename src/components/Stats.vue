<template>
  <div class="container">
    <div class="header">
      <button @click="back"><</button>
      <h1>{{ title }}</h1>
      <button @click="forward">></button>
    </div>
    <div class="summary">
      <div>Total Number of Song Plays: <span class="summary-title">{{ totalSongs }}</span></div>
      <div>Total Time Listened: <span class="summary-title">{{ (totalTime / 3600000).toFixed(2) }} hrs</span></div>
      <div>Number of Distinct Songs: <span class="summary-title">{{ topSongs.length }}</span></div>
      <div>Number of Distinct Artists: <span class="summary-title">{{ topArtists.length }}</span></div>
    </div>
    <card>
      <h1 class="title">Top Songs</h1>
      <div v-for="song in topSongs.slice(0, 5)">
        <div class="entry"><div>{{ song[0].length > 35 ? song[0].slice(0,35) + '...' : song[0] }}</div><div>{{ song[1].playCount }}</div></div>
      </div>
    </card>
    <br />
    <card>
      <h1 class="title">Top Artists</h1>
      <div v-for="artist in topArtists.slice(0, 5)">
        <div class="entry"><div>{{ artist[0] }}</div><div>{{ artist[1].playCount }}</div></div>
      </div>
    </card>
  </div>
</template>

<script setup lang="ts">
import Card from "../components/Card.vue";

type Entry = { msPlayed: number; playCount: number; }
defineProps<{
  title: string,
  totalSongs: number,
  totalTime: number,
  topSongs: [ string, Entry ][],
  topArtists: [ string, Entry ][],
  back: () => void,
  forward: () => void,
}>();

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
  display: flex;
  justify-content: space-between;
  text-align: left;
  text-shadow: none;
  color: var(--background-color);
  margin: 0;
  font-weight: bold;
}
</style>