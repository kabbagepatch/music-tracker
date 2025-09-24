<script setup lang="ts">
import NowPlaying from "./components/NowPlaying.vue";
</script>

<template>
  <main class="container">
    <h1>Now Playing</h1>

    <div class="albumart">
      <img src="./assets/bite_me.png" alt="Album Art" />
    </div>

    <now-playing />
  </main>
</template>

<style scoped>

h1 {
  margin: 5px;
  margin-bottom: 10px;
  font-size: 28px;
  width: 100%;
  color: white;
  letter-spacing: 3px;
}

.albumart {
  max-width: 800px;
  display: flex;
  border-radius: 28px;
  margin-bottom: 10px;
  padding: 3px;
  background: #ffb3c6;
  filter: drop-shadow(0 0 0.15em #cc7296);
}

.albumart img {
  width: 100%;
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
  src: url('./assets/Jersey10-Regular.ttf');;
}

:root {
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 2px;
  font-weight: 400;
  text-shadow: -1px -1px 0 #4c0080, 1px -1px 0 #4c0080, -1px 1px 0 #4c0080, 1px 1px 0 #4c0080;
  color: #0f0f0f;
  background-color: #f6f6f6;
  background-image: url('./assets/pretty.jpg');
  background-repeat: no-repeat;
  background-size: cover;

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

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

@media (max-width: 600px) {
  :root {
    background-size: 400px 600px;
  }
}

</style>