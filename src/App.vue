<template>
  <main class="container">
    <div v-if="curComponent === 'Home'" class="home">
      <h1>Music Player and Tracker</h1>
      <button @click="spotifyPlayerClick">
        <card><div class="button-container"><h1>Spotify Player</h1></div></card>
      </button>
      <br />
      <button @click="spotifyTrackerClick">
        <card><div class="button-container"><h1>Spotify Tracker</h1></div></card>
      </button>
      <br />
      <button @click="connectToSpotifyClick">
        <card><div class="button-container"><h1>Connect To Spotify</h1></div></card>
      </button>
    </div>
    <div v-else-if="curComponent === 'SpotifyPlayer'">
      <button class="homeButton" @click="backToHome">←</button>
      <spotify-player />
    </div>
    <div v-else-if="curComponent === 'SpotifyTracker'">
      <button class="homeButton" @click="backToHome">←</button>
      <spotify-tracker />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SpotifyPlayer from "./SpotifyPlayer.vue";
import SpotifyTracker from "./SpotifyTracker.vue";
import Card from "./components/Card.vue";

import { conntectToSpotify } from "./services/connectToSpotify";
import { getTopItems, getUser } from "./services/spotify";

const curComponent = ref('Home');

const spotifyPlayerClick = () => {
  curComponent.value = 'SpotifyPlayer';
};

const spotifyTrackerClick = () => {
  curComponent.value = 'SpotifyTracker';
};

const connectToSpotifyClick = () => {
  conntectToSpotify();
};

try {
  getUser().then((data) => {
    console.log("User data:", data);
  });
  getTopItems('tracks', 'medium_term', 10).then((data) => {
    console.log("Top tracks:", data.items.map((a : any) => a.name));
  });
  getTopItems('artists', 'medium_term', 10).then((data) => {
    console.log("Top artists:", data.items.map((a : any) => a.name));
  });
} catch (error) {
  console.log("Error fetching user data:", error);
}

const backToHome = () => {
  curComponent.value = 'Home';
};

</script>

<style scoped>
.home {
  width: 100%;
}

h1 {
  margin-bottom: 20px;
}

.button-container {
  width: 100%;
  height: 124px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.homeButton {
  position: absolute;
  right: 0;
  margin-right: 10px;
  margin-top: -10px;
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
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: 24px;
  font-weight: 400;
  text-shadow: -1px -1px 0 var(--text-outline), 1px -1px 0 var(--text-outline), -1px 1px 0 var(--text-outline), 1px 1px 0 var(--text-outline);
  background-color: var(--background-color);
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

  /* --primary-color: hsl(336, 100%, 94%);
  --primary-color-shadow: hsl(336, 47%, 62%);
  --secondary-color: hsl(336, 100%, 70%);
  --tertiary-color: hsl(58, 55%, 86%);
  --background-color: hsl(282, 56%, 84%);
  --text-color: white;
  --text-outline: hsl(276, 100%, 25%); */

  --primary-color: hsl(39, 59%, 78%);
  --primary-color-shadow: hsl(39, 59%, 58%);
  --secondary-color: #743014;
  --tertiary-color: #84592B;
  --background-color: #442D1C;
  --text-color: hsl(0, 0%, 100%);
  --text-outline: #442D1C;
}

.container {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 28px;
  width: 100%;
  color: var(--text-color);
}

button {
  display: block;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  color: var(--text-color);
  text-shadow: -1px -1px 0 var(--text-outline), 1px -1px 0 var(--text-outline), -1px 1px 0 var(--text-outline), 1px 1px 0 var(--text-outline);
  font-size: 24px;
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
}
</style>