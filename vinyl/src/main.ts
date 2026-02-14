import { createApp, watch } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import { currentUser, userLoaded } from './firebaseApp';
import App from './App.vue'
import './style.css';

import PlayHistory from './pages/PlayHistory.vue'
import VinylCatalog from './pages/VinylCatalog.vue'
import VinylPage from './pages/VinylPage.vue';
import SearchVinyl from './pages/SearchVinyl.vue'
import Login from './pages/Login.vue';
import AddVinyl from './pages/AddVinyl.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/catalog', component: VinylCatalog, meta: { requiresAuth: true }, },
  { path: '/catalog/add', component: SearchVinyl, meta: { requiresAuth: true }, },
  { path: '/catalog/add/:id', component: AddVinyl, meta: { requiresAuth: true }, },
  { path: '/catalog/:id', component: VinylPage, meta: { requiresAuth: true }, },
  { path: '/', component: PlayHistory, meta: { requiresAuth: true }, },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (!userLoaded.value) {
    await new Promise(resolve => {
      const stop = watch(userLoaded, ready => {
        if (ready) {
          stop();
          resolve(true);
        }
      });
    });
  }

  if (to.meta.requiresAuth && !currentUser.value) {
    return '/login';
  }
})

createApp(App).use(router).mount('#app')
