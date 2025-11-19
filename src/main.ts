import { createApp } from "vue";
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from "./App.vue";
import Home from "./Home.vue";
import SpotifyPlayer from "./spotify-player/SpotifyPlayer.vue";
import SpotifyTracker from "./spotify-tracker/SpotifyTracker.vue";
import BasicStats from "./spotify-tracker/BasicStats.vue";

const routes = [
  { path: '/player', component: SpotifyPlayer },
  { path: '/tracker', component: SpotifyTracker },
  { path: '/tracker/basic', component: BasicStats },
  { path: '/tracker/extended', component: BasicStats },
  { path: '/', component: Home },
]

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes,
})
const app = createApp(App)

app.use(pinia);
app.use(router);
app.mount("#app");
