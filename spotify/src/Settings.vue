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
      <label class="file-upload" for="file-input">
        <title-card
          title="Upload Spotify History"
          iconName="cells"
          :subtitles="[
            'Upload a zip file containing the Spotify Extended Streaming History folder',
            `Last Uploaded: ${lastUpload}`
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
import * as taurifs from '@tauri-apps/plugin-fs';
import * as tauristore from '@tauri-apps/plugin-store';

import TitleCard from "./components/TitleCard.vue";
import Header from "./Header.vue";

import { conntectToSpotify } from "./services/connectToSpotify.ts";
import { useUserStore } from "./stores/user.ts";
import { setTheme } from "./themes.ts";
import { ref } from "vue";
import { processExtendedData } from "./spotify-data-explorer.ts";

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

const lastUpload = ref('Never');
const getLastUpload = async () => {
  const store = await tauristore.load('store.json');
  const lastUploadValue = await store.get<number>('last-upload-history');
  if (lastUploadValue) {
    lastUpload.value = `${new Date(lastUploadValue).toDateString()}`;
  }
}
getLastUpload();

const uploadZip = async (e: Event) => {
  const store = await tauristore.load('store.json');
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  const file = input.files[0];
  const files = (await JSZip.loadAsync(file)).files;
  const exists = await taurifs.exists('rawExtendedHistory', { baseDir: taurifs.BaseDirectory.AppData })
  if (!exists) {
    await taurifs.mkdir('rawExtendedHistory', { baseDir: taurifs.BaseDirectory.AppData })
  }
  const date = Date.now();
  await store.set('last-upload-history', date);
  await store.set('full-history-processed', false);
  lastUpload.value = `${new Date(date).toDateString()}`;
  for (const [fileName, fileData] of Object.entries(files)) {
    if (!fileName.endsWith('.json')) continue;
    const name = fileName.split('/').pop();
    if (!name) continue;
    const data = await fileData.async('uint8array');
    store.save()
    await taurifs.writeFile(`rawExtendedHistory/${name}`, data, { baseDir: taurifs.BaseDirectory.AppData });
  }
  await store.save();

  processExtendedData();
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

.file-upload {
  cursor: pointer;
}
</style>