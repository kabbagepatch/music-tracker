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
      <br />
      <button>
        <router-link to="/tracker">
          <title-card
            title="Spotify Stats"
            iconName="award-transparent"
            :subtitles="['Explore your Spotify Music History.']"
          />
        </router-link>
      </button>
      <br />
      <button @click="connectToSpotifyClick">
        <title-card
          :title="(user ? 'Reconnect' : 'Connect') + ' To Spotify'"
          iconName="network-transparent"
          :subtitles="
            ['Current Status: ' + (user ? 'Connected' : 'Not Connected')]
          "
        />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

import TitleCard from "./components/TitleCard.vue";
import Header from "./Header.vue";

import { conntectToSpotify } from "./services/connectToSpotify";
import { getUser } from "./services/spotify";
import { useUserStore } from "./stores/user";

const connectToSpotifyClick = () => {
  conntectToSpotify();
};

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

const { user } = storeToRefs(userStore);

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

.button-container {
  width: 100%;
  height: 124px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.homeButton {
  position: absolute;
  right: 0;
  margin-right: 10px;
  margin-top: -5px;
}

.card-title {
  font-size: 32px;
}

.theme-toggle {
  background-color: var(--primary-color);
  width: 37px;
  height: 30px;
  border-radius: 5px;
  margin-right: 5px;
}

</style>