<template>
  <main class="container">
    <div class="home">
      <Header />
      <button @click="toggleTheme">
        <div class="theme-button">
          <img class="icon" src="./assets/icons/paint-brush.png" />
          <div class="theme-button-text">Toggle Theme</div>
        </div>
      </button>
      <button @click="connectToSpotifyClick">
        <title-card
          :title="(user ? 'Reconnect' : 'Connect') + ' To Spotify'"
          iconName="network-transparent"
          :subtitles="
            ['Current Status: ' + (user ? 'Connected' : 'Not Connected')]
          "
        />
      </button>
      <label for="file-input">
        <title-card
          title="Upload Spotify History"
          iconName="cells"
          :subtitles="[
            'Upload a zip file containing the Spotify Extended Streaming History folder',
            'Last Uploaded: Never'
          ]"
        />
      </label>
      <input id="file-input" type="file" accept=".zip" hidden @change="uploadZip" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as JSZip from 'jszip'

import TitleCard from "./components/TitleCard.vue";
import Header from "./Header.vue";

import { conntectToSpotify } from "./services/connectToSpotify.ts";
import { useUserStore } from "./stores/user.ts";
import { setTheme } from "./themes.ts";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

let curTheme = localStorage.getItem('theme') || 'Coffee';
const toggleTheme = () => {
  if (curTheme === 'Coffee') {
    curTheme = 'Fairy';
  } else if (curTheme === 'Forest') {
    curTheme = 'Coffee';
  } else {
    curTheme = 'Forest';
  }
  setTheme(curTheme);
  localStorage.setItem('theme', curTheme);
}

const connectToSpotifyClick = () => {
  conntectToSpotify();
};

const uploadZip = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  const file = input.files[0];
  const files = (await JSZip.loadAsync(file)).files;
  Object.entries(files).filter(([fileName]) => fileName.endsWith('.json')).forEach(async ([fileName, fileData]) => {
    const data = JSON.parse(await fileData.async('string'));
    console.log(fileName);
    console.log(data.length);
    console.log(data[0].master_metadata_track_name);
    console.log(data[0].ts);
  })
}

</script>

<style scoped>
.home {
  width: 100%;
}

button, label {
  display: block;
  margin-top: 20px;
}

.theme-button {
  width: var(--width);
  display: flex;
  align-items: center;
  border-radius: 12px;
  background-color: var(--primary-color);
}

.icon {
  margin: 5px 10px;
  height: 30px;
}
</style>