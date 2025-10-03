<template>
  <main class="container">
    <h1>Now Playing</h1>

    <div class="albumart">
      <img :src="tracks[curIndex]?.album?.images[1].url" alt="Album Art" />
    </div>

    <now-playing
      :songName="`${tracks[curIndex]?.artists.map(a => a.name).join(',')} - ${tracks[curIndex]?.name}`"
      :backClick="backClick"
      :forwardClick="forwardClick"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NowPlaying from "./components/NowPlaying.vue";
import { getPlaylist } from './services/spotify';

const tracks: any = ref([]);
const curIndex = ref(0);

getPlaylist('1uRFGSIGuNELeRkNktwHRR').then(playlist => {
  tracks.value = playlist.tracks.items
    .filter((item: any) => item.track.id)
    .map((item: any) => item.track);
}).catch(err => {
  console.error("Error fetching Spotify access token:", err);
});

const forwardClick = () => {
  curIndex.value = (curIndex.value + 1) % tracks.value.length;
};

const backClick = () => {
  curIndex.value = (curIndex.value - 1 + tracks.value.length) % tracks.value.length;
};

</script>

<style scoped>
h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 24px;
  width: 100%;
  color: white;
}

.albumart {
  max-width: 800px;
  display: flex;
  border-radius: 28px;
  margin-bottom: 10px;
  padding: 3px;
  background: #ffb3c6;
  filter: drop-shadow(0 0 0.15em #cc7296);
  justify-content: center;
}

.albumart img {
  width: 356px;
  will-change: filter;
  transition: 0.75s;
  border-radius: 28px;
  border: 1px solid #ff67a4;
}

.albumart:hover {
  filter: drop-shadow(0 0 2em #cc7296);
}
</style>
<style>
@font-face {
  font-family: "Pixels";
  src: url('./assets/Jersey10-Regular.ttf');
}
@font-face {
  font-family: "Bubbly";
  src: url('./assets/Atop-R99O3.ttf');
}

:root {
  font-family: Bubbly, Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  text-shadow: -1px -1px 0 #4c0080, 1px -1px 0 #4c0080, -1px 1px 0 #4c0080, 1px 1px 0 #4c0080;
  color: #0f0f0f;
  background-color: #dfbfed;
  /* background-image: url('./assets/pretty.jpg'); */
  background-repeat: no-repeat;
  background-size: cover;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  color: #ffffff;
  text-shadow: -1px -1px 0 #4c0080, 1px -1px 0 #4c0080, -1px 1px 0 #4c0080, 1px 1px 0 #4c0080;
  font-size: 24px;
  font-family: Bubbly, Inter, Avenir, Helvetica, Arial, sans-serif;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  a:hover {
    color: #24c8db;
  }
}

@media (max-width: 600px) {
  :root {
    background-size: 400px 600px;
  }
}

</style>