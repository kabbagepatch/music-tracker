<template>
  <div class="container">
    <div class="header">
      <button @click="back"><</button>
      <h1>{{ title }}</h1>
      <button @click="forward">></button>
    </div>
    <Stats
      :summary="[
        { key: 'Total Number of Song Plays', value: totalSongs },
        { key: 'Total Time Listened', value: (totalTime / 3600000).toFixed(2) + ' hrs' },
        { key: 'Number of Distinct Songs', value: topSongs.length },
        { key: 'Number of Distinct Artists', value: topArtists.length },
      ]"
      :cardOne="{ title: 'Top Songs', entries: topSongs.map(song => ({ left: song[0], right: song[1].playCount, link: song[0] })), linkType: 'tracks' }"
      :cardTwo="{ title: 'Top Artists', entries: topArtists.map(artist => ({ left: artist[0], right: artist[1].playCount, link: artist[0] })), linkType: 'artists' }"
    />
  </div>
</template>

<script setup lang="ts">
import Stats from "../components/Stats.vue";

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

.summary {
  margin-bottom: 10px;
  margin-left: 10px;
}

.summary-title {
  color: var(--primary-color);
}

.section {
  margin-bottom: 20px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
}

.title-button {
  display: block;
  height: 30px;
  width: 105%;
  margin-top: -5px;
  margin-left: -10px;
  margin-bottom: 5px;
  border-radius: 15px;
}

.title-button:hover {
  background-color: hsla(227, 8%, 22%, 25%);
}

.title {
  text-align: left;
  margin-left: 10px;
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

.entry a {
  color: var(--background-color);
}

.entry a:hover {
  background-color: hsla(227, 8%, 22%, 5%);
  color: hsl(227, 8%, 42%);
}
</style>