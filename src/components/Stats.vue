<template>
  <div class="container">
    <div class="header">
      <button @click="back"><</button>
      <h1>{{ title }}</h1>
      <button @click="forward">></button>
    </div>
    <div v-if="displaySummary" class="summary">
      <div>Total Number of Song Plays: <span class="summary-title">{{ totalSongs }}</span></div>
      <div>Total Time Listened: <span class="summary-title">{{ (totalTime / 3600000).toFixed(2) }} hrs</span></div>
      <div>Number of Distinct Songs: <span class="summary-title">{{ topSongs.length }}</span></div>
      <div>Number of Distinct Artists: <span class="summary-title">{{ topArtists.length }}</span></div>
    </div>
    <div class="section" v-if="displaySongs">
      <card>
        <button class="title-button" @click="toggleSongs"><h1 class="title">Top Songs</h1></button>
        <div v-for="song in (displaySummary ? topSongs.slice(0, 5) : topSongs)">
          <div class="entry">
            <router-link :to="`/tracker/extended/tracks/${song[0]}`">{{ song[0].length > 35 ? song[0].slice(0,35) + '...' : song[0] }}</router-link>
            <div>{{ song[1].playCount }}</div>
          </div>
        </div>
      </card>
    </div>
    <div class="section" v-if="displayArtists">
      <card>
        <button class="title-button" @click="toggleArtists"><h1 class="title">Top Artists</h1></button>
        <div v-for="artist in (displaySummary ? topArtists.slice(0, 5) : topArtists)">
          <div class="entry">
            <router-link :to="`/tracker/extended/artists/${artist[0]}`">{{ artist[0] }}</router-link>
            <div>{{ artist[1].playCount }}</div>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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

const displaySummary = ref(!localStorage.getItem("displaySummary") || localStorage.getItem("displaySummary") === "true");
const displaySongs = ref(!localStorage.getItem("displaySongs") || localStorage.getItem("displaySongs") === "true");
const displayArtists = ref(!localStorage.getItem("displayArtists") || localStorage.getItem("displayArtists") === "true");

const toggleSongs = () => {
  displaySummary.value = !displaySummary.value;
  displayArtists.value = !displayArtists.value;
  localStorage.setItem('displaySummary', displaySummary.value.toString())
  localStorage.setItem('displayArtists', displayArtists.value.toString())
}

const toggleArtists = () => {
  displaySummary.value = !displaySummary.value;
  displaySongs.value = !displaySongs.value;
  localStorage.setItem('displaySummary', displaySummary.value.toString())
  localStorage.setItem('displaySongs', displaySongs.value.toString())
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

.summary {
  margin-bottom: 10px;
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
  float: left;
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