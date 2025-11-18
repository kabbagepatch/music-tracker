<template>
  <main class="container">
    <div v-if="curComponent === 'Home'" class="home">
      <div class="header">
        <img class="icon" src="./assets/vinyl-transparent.png" />
        <h1 class="title">Music Player and Tracker</h1>
        <div class="theme-toggle" @click="toggleTheme" />
      </div>
      <button @click="spotifyPlayerClick">
        <title-card title="Spotify Player" iconName="note-transparent" />
      </button>
      <br />
      <button @click="spotifyTrackerClick">
        <title-card title="Spotify Stats" iconName="award-transparent" />
      </button>
      <br />
      <button @click="connectToSpotifyClick">
        <title-card title="Connect To Spotify" iconName="network-transparent" />
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
import SpotifyPlayer from "./spotify-player/SpotifyPlayer.vue";
import SpotifyTracker from "./spotify-tracker/SpotifyTracker.vue";
import TitleCard from "./components/TitleCard.vue";

import { conntectToSpotify } from "./services/connectToSpotify";
import { getUser } from "./services/spotify";
import { AxiosError } from "axios";

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

getUser().then((data) => {
  console.log("User data:", data);
}).catch((err: AxiosError) => {
  if (err.response && err.response.status === 401) {
    console.log("User is not authorized. Please connect to Spotify.");
    localStorage.removeItem('access_token');
  }
});

const backToHome = () => {
  curComponent.value = 'Home';
};

let curTheme = 'Coffee';
const setTheme = (vars : { [key: string]: string }) => {
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

const toggleTheme = () => {
  if (curTheme === 'Coffee') {
    setTheme({
      'primary-color': 'hsl(336, 89%, 93%)',
      'primary-color-shadow': 'hsl(336, 47%, 62%)',
      'secondary-color': 'hsl(336, 100%, 70%)',
      'tertiary-color': 'hsl(58, 55%, 86%)',
      'background-color': 'hsl(282, 56%, 84%)',
      'text-color': 'white',
      'text-outline': 'hsl(276, 100%, 25%)'
    });
    curTheme = 'Pink';
  } else if (curTheme === 'Forest') {
    setTheme({
      'primary-color': 'hsl(39, 59%, 78%)',
      'primary-color-shadow': 'hsl(39, 59%, 58%)',
      'secondary-color': 'hsl(18, 71%, 27%)',
      'tertiary-color': 'hsl(31, 51%, 34%)',
      'background-color': 'hsl(26, 42%, 19%)',
      'text-color': 'hsl(0, 0%, 100%)',
      'text-outline': 'hsl(26, 42%, 19%)',
    });
    curTheme = 'Coffee';
  } else {
    setTheme({
      'primary-color': 'hsl(60, 63%, 89%)',
      'primary-color-shadow': 'hsl(60, 63%, 69%)',
      'secondary-color': 'hsl(77, 14%, 45%)',
      'tertiary-color': 'hsl(31, 43%, 53%)',
      'background-color': 'hsl(227, 8%, 22%)',
      'text-color': 'hsl(0, 0%, 100%)',
      'text-outline': 'hsl(26, 62%, 18%)'
    });
    curTheme = 'Forest';
  }
}

</script>

<style scoped>
.home {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.header .icon {
  display: block;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}

.header .title {
  margin: 0;
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
  margin-top: -5px;
}

.card-title {
  font-size: 32px;
}

.theme-toggle {
  background-color: var(--primary-color);
  width: 37px;
  height: 30px;
  border-radius: 5px;
  margin-right: 5px;
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
  text-shadow: -1.5px -1.5px 0 var(--text-outline), 1.5px -1.5px 0 var(--text-outline), -1.5px 1.5px 0 var(--text-outline), 1.5px 1.5px 0 var(--text-outline);
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

  --primary-color: hsl(60, 63%, 89%);
  --primary-color-shadow: hsl(60, 63%, 69%);
  --secondary-color: hsl(77, 14%, 45%);
  --tertiary-color: hsl(31, 43%, 53%);
  --background-color: hsl(227, 8%, 22%);
  --text-color: hsl(0, 0%, 100%);
  --text-outline: hsl(26, 62%, 18%);

  --primary-color: hsl(39, 59%, 78%);
  --primary-color-shadow: hsl(39, 59%, 58%);
  --secondary-color: hsl(18, 71%, 27%);
  --tertiary-color: hsl(31, 51%, 34%);
  --background-color: hsl(26, 42%, 19%);
  --text-color: hsl(0, 0%, 100%);
  --text-outline: hsl(26, 42%, 19%);
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
  text-shadow: -1.5px -1.5px 0 var(--text-outline), 1.5px -1.5px 0 var(--text-outline), -1.5px 1.5px 0 var(--text-outline), 1.5px 1.5px 0 var(--text-outline);
  font-size: 24px;
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
}
</style>