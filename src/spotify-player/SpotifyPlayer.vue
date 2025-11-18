<template>
  <div>
    <div v-if="curComponent === 'NowPlaying'">
      <h1>Now Playing</h1>
      <div class="albumart">
        <img v-if="curTrack?.album?.images[1].url" :src="curTrack?.album?.images[1].url" alt="Album Art" />
      </div>
    </div>

    <!-- :artists="curTrack?.artists.map((a: any) => a.name).join(',')" -->
    <now-playing
      :artists="curTrack?.artists[0].name"
      :songName="curTrack?.name"
      :backClick="backClick"
      :forwardClick="forwardClick"
      :playClick="playClick"
      :playing="playState?.is_playing"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import NowPlaying from "./NowPlaying.vue";
import { getDevices, getUserPlaybackState, getUserQueue, getUserRecentlyPlayed, skipToNextTrack, skipToPreviousTrack, togglePlayPause } from '../services/spotify';

const curComponent = ref('NowPlaying');

const playState: any = ref({});
const tracks: any = ref([]);
const curIndex = ref(0);
const curTrack: any = ref();

const getPlaybackState = () => {
  getUserPlaybackState().then(res => {
    console.log("User playback state:", res);
    playState.value = res;
    curTrack.value = res.item;
    if (!res || !res.item) {
      getRecentlyPlayed();
    }
  }).catch(err => {
    console.error("Error fetching user playback state:", err);
  });
}

const getQueue = () => {
  getUserQueue().then(res => {
    console.log("User queue:", res);
    tracks.value = [res.currently_playing, ...res.queue];
    curIndex.value = 0;
  }).catch(err => {
    console.error("Error fetching user queue:", err);
  });
}

const getRecentlyPlayed = () => {
  getUserRecentlyPlayed().then(res => {
    if (!res.items || res.items.length === 0) return;
    console.log("User recently played:", res.items[0]);
    curTrack.value = res.items[0].track;
    curIndex.value = 0;
  }).catch(err => {
    console.error("Error getting recently played:", err);
  })
}

getQueue();
getPlaybackState();

const forwardClick = () => {
  curTrack.value = tracks.value[(curIndex.value + 1) % tracks.value.length];
  curIndex.value = (curIndex.value + 1) % tracks.value.length;
  skipToNextTrack().then(() => {
    console.log("Skipped to next track successfully");
    if (curIndex.value > 15) {
      setTimeout(() => {
        getQueue();
      }, 500);
    }
    setTimeout(() => {
      getPlaybackState();
    }, 500);
  }).catch(err => {
    console.error("Error skipping to next track:", err);
  });
};

const backClick = () => {
  if (curIndex.value > 0) {
    curIndex.value = (curIndex.value - 1 + tracks.value.length) % tracks.value.length;
    curTrack.value = tracks.value[curIndex.value];
  }
  skipToPreviousTrack().then(() => {
    console.log("Skipped to previous track successfully");
    setTimeout(() => {
      getQueue();
      getPlaybackState();
    }, 500);
  }).catch(err => {
    console.error("Error skipping to previous track:", err);
  });
};

const playClick = () => {
  togglePlayPause(playState?.value.is_playing).then(() => {
    console.log("Toggled play/pause successfully");
    setTimeout(() => {
      getQueue();
      getPlaybackState();
    }, 500);
  }).catch(err => {
    console.error("Error toggling play/pause:", err);
  });
  playState.value.is_playing = !playState.value.is_playing;
};

</script>

<style scoped>
.albumart {
  max-width: 800px;
  height: 358px;
  display: flex;
  border-radius: 28px;
  margin-bottom: 10px;
  padding: 3px;
  background: var(--primary-color);
  filter: drop-shadow(0 0 0.5em var(--primary-color-shadow));
  justify-content: center;
}

.albumart img {
  width: 356px;
  height: 356px;
  will-change: filter;
  transition: 0.75s;
  border-radius: 28px;
  border: 1px solid var(--secondary-color);
}

.albumart:hover {
  filter: drop-shadow(0 0 2em var(--primary-color-shadow));
}
</style>