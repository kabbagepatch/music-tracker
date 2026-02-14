<script setup lang="ts">
import { useRouter } from 'vue-router';
import PWABadge from './components/PWABadge.vue';
import { currentUser, userLoaded } from './firebaseApp';
import { signOut } from './services/users';

const router = useRouter();

const onLogout = async () => {
  try {
    console.log('SIgn out')
    await signOut();
    router.replace('/login');
  } catch (e) {
    console.log('There was an error signing out');
  }
}

</script>

<template>
  <div class="header">
    <div class="title">
      <img :style="{ width: '50px', height: '50px' }" src="./assets/vinyl.png" />
      <a href="/" :style="{ color: 'white' }"><h1>Vinyl Tracker</h1></a>
    </div>
    <button v-if="userLoaded && currentUser" class="icon-button" @click="onLogout"><img class="icon" src="./assets/icons/logout.png" /></button>
  </div>
  <RouterView :key="$route.fullPath" />
  <PWABadge />
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    height: 50px;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon-button {
    margin-top: -10px;
    margin-right: -10px;
  }
</style>
