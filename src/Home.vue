<template>
  <main class="container">
    <div class="home">
      <Header :rightButtonClick="toggleTheme" />
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
import TitleCard from "./components/TitleCard.vue";
import Header from "./Header.vue";

import { conntectToSpotify } from "./services/connectToSpotify";
import { getUser } from "./services/spotify";
import { useUserStore } from "./stores/user";
import { AxiosError } from "axios";

const connectToSpotifyClick = () => {
  conntectToSpotify();
};

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

let curTheme = 'Coffee';
const setTheme = (vars : { [key: string]: string }) => {
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

const toggleTheme = () => {
  if (curTheme === 'Coffee') {
    setTheme({
      'primary-color': 'hsl(336, 89%, 93%)',
      'primary-color-shadow': 'hsl(336, 47%, 62%)',
      'secondary-color': 'hsl(336, 100%, 70%)',
      'tertiary-color': 'hsl(58, 55%, 86%)',
      'background-color': 'hsl(282, 56%, 84%)',
      'text-color': 'white',
      'text-outline': 'hsl(276, 100%, 25%)'
    });
    curTheme = 'Pink';
  } else if (curTheme === 'Forest') {
    setTheme({
      'primary-color': 'hsl(39, 59%, 78%)',
      'primary-color-shadow': 'hsl(39, 59%, 58%)',
      'secondary-color': 'hsl(18, 71%, 27%)',
      'tertiary-color': 'hsl(31, 51%, 34%)',
      'background-color': 'hsl(26, 42%, 19%)',
      'text-color': 'hsl(0, 0%, 100%)',
      'text-outline': 'hsl(26, 42%, 19%)',
    });
    curTheme = 'Coffee';
  } else {
    setTheme({
      'primary-color': 'hsl(60, 63%, 89%)',
      'primary-color-shadow': 'hsl(60, 63%, 69%)',
      'secondary-color': 'hsl(77, 14%, 45%)',
      'tertiary-color': 'hsl(31, 43%, 53%)',
      'background-color': 'hsl(227, 8%, 22%)',
      'text-color': 'hsl(0, 0%, 100%)',
      'text-outline': 'hsl(26, 62%, 18%)'
    });
    curTheme = 'Forest';
  }
}

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