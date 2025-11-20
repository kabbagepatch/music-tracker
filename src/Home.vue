<template>
  <main class="container">
    <div class="home">
      <Header :rightButtonClick="goToSettings" />
      <button>
        <router-link to="/player">
          <title-card
            title="Spotify Player"
            iconName="note-transparent"
            :subtitles="[
              'Control your Spotify music.',
              'Requires an already active Spotify device'
            ]"
          />
        </router-link>
      </button>
      <button>
        <router-link to="/tracker">
          <title-card
            title="Spotify Stats"
            iconName="award-transparent"
            :subtitles="['Explore your Spotify Music History.']"
          />
        </router-link>
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

import TitleCard from "./components/TitleCard.vue";
import Header from "./Header.vue";

import { getUser } from "./services/spotify";
import { useUserStore } from "./stores/user";

const router = useRouter();
const goToSettings = () => {
  router.push('/settings');
}

const userStore = useUserStore();
userStore.setLoading(true);
getUser().then(user => {
  userStore.setUser(user);
  userStore.setLoading(false);
}).catch((err: AxiosError) => {
  if (err.response && err.response.status === 401) {
    const error = "User is not authorized. Please connect to Spotify.";
    userStore.setError(error);
    console.log(error);
    localStorage.removeItem('access_token');
  } else {
    userStore.setError(err.message);
  }
});

</script>

<style scoped>
.home {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.header .icon {
  display: block;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}

.header .title {
  margin: 0;
}

button {
  margin-top: 20px;
}
</style>