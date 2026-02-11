import { createApp, watch } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'
import './style.css';

import PlayHistory from './PlayHistory.vue'
import VinylCatalog from './VinylCatalog.vue'
import VinylPage from './VinylPage.vue';
import AddVinyl from './AddVinyl.vue'
import { currentUser, userLoaded } from './firebaseApp';
import { signOut } from './services/users';

const routes = [
  { path: '/catalog', component: VinylCatalog, meta: { requiresAuth: true }, },
  { path: '/catalog/add', component: AddVinyl, meta: { requiresAuth: true }, },
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

  console.log(to.meta.requiresAuth);
  console.log(currentUser.value?.uid);
})

createApp(App).use(router).mount('#app')
