import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'
import './style.css'

import PlayHistory from './PlayHistory.vue'
import VinylCatalog from './VinylCatalog.vue'
import VinylPage from './VinylDetails.vue';

const routes = [
  { path: '/catalog', component: VinylCatalog },
  { path: '/catalog/:id', component: VinylPage },
  { path: '/', component: PlayHistory },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
