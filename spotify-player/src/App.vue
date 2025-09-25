<template>
  <main class="container">
    <h1>Now Playing</h1>

    <div class="albumart">
      <img :src="albumArts[curIndex]" alt="Album Art" />
    </div>

    <now-playing
      :songName="songTitles[curIndex]"
      :backClick="backClick"
      :forwardClick="forwardClick"
    />
  </main>
</template>

<script setup lang="ts">
import NowPlaying from "./components/NowPlaying.vue";

import { ref } from 'vue'

import art1 from './assets/bite_me.png';
import art2 from './assets/From_Zero.png';
import art3 from './assets/Imaginal_Disk.png';
import art4 from './assets/liminal_space.png';
import art5 from './assets/The_Loveliest_Time.png';

const albumArts = [art1, art2, art3, art4, art5];
const songTitles = [
  "Renee Rapp - Leave Me Alone",
  "Linkin Park - Heavy is the Crown",
  "Magdalena Bay - Tunnel Vision",
  "mxmtoon - rain",
  "Carly Rae Jepsen - Beach House"
];
const curIndex = ref(0);

const forwardClick = () => {
  curIndex.value = (curIndex.value + 1) % albumArts.length;
  console.log(curIndex);
};

const backClick = () => {
  curIndex.value = (curIndex.value - 1 + albumArts.length) % albumArts.length;
  console.log(curIndex);
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