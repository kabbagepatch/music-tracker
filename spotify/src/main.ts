import { createApp } from "vue";
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from "./App.vue";
import Home from "./Home.vue";
import { setTheme } from "./themes.ts";
import SpotifyPlayer from "./spotify-player/SpotifyPlayer.vue";
import SpotifyTracker from "./spotify-tracker/SpotifyTracker.vue";
import BasicStats from "./spotify-tracker/BasicStats.vue";
import ExtendedStats from "./spotify-tracker/ExtendedStats.vue";
import Settings from "./Settings.vue";
import YearlyStats from "./spotify-tracker/YearlyStats.vue";
import MonthlyStats from "./spotify-tracker/MonthlyStats.vue";
import TrackStats from "./spotify-tracker/TrackStats.vue";
import ArtistStats from "./spotify-tracker/ArtistStats.vue";
import CustomStats from "./spotify-tracker/CustomStats.vue";
import AlbumStats from "./spotify-tracker/AlbumStats.vue";

const routes = [
  { path: '/player', component: SpotifyPlayer },
  { path: '/tracker', component: SpotifyTracker },
  { path: '/tracker/basic', component: BasicStats },
  { path: '/tracker/extended', component: ExtendedStats },
  { path: '/tracker/extended/year/:year', component: YearlyStats },
  { path: '/tracker/extended/year/:year/:month', component: MonthlyStats },
  { path: '/tracker/extended/tracks/:track', component: TrackStats },
  { path: '/tracker/extended/artists/:artist', component: ArtistStats },
  { path: '/tracker/extended/albums/:album', component: AlbumStats },
  { path: '/tracker/extended/custom', component: CustomStats },
  { path: '/settings', component: Settings },
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

let curTheme = localStorage.getItem('theme') || 'Coffee';
setTheme(curTheme)
