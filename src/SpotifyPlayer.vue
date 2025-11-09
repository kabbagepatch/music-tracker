<template>
  <div>
    <div v-if="curComponent === 'NowPlaying'">
      <h1>Now Playing</h1>
      <div class="albumart">
        <img :src="curTrack?.album?.images[1].url" alt="Album Art" />
      </div>
    </div>
    <div v-else-if="curComponent === 'Playlist'">
      <Playlist :playlist="playlist" :curIndex="curIndex" :trackClick="trackClick" />
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
import NowPlaying from "./components/NowPlaying.vue";
import Playlist from "./components/Playlist.vue";
import { getUserPlaybackState, getUserQueue, skipToNextTrack, skipToPreviousTrack, togglePlayPause } from './services/spotify';

const curComponent = ref('NowPlaying');

const playlist: any = ref({});
const playState: any = ref({});
const tracks: any = ref([]);
const curIndex = ref(0);
const curTrack: any = ref();

// getPlaylist('1uRFGSIGuNELeRkNktwHRR').then(playlistres => {
//   playlist.value = playlistres;
//   tracks.value = playlistres.tracks.items
//     .filter((item: any) => item.track.id)
//     .map((item: any) => item.track);
//   curTrack.value = tracks.value[curIndex.value];
// }).catch(err => {
//   console.error("Error fetching Spotify access token:", err);
// });

const getPlaybackState = () => {
  getUserPlaybackState().then(playbackRes => {
    console.log("User playback state:", playbackRes);
    playState.value = playbackRes;
    curTrack.value = playbackRes.item;
  }).catch(err => {
    console.error("Error fetching user playback state:", err);
  });
}

const getQueue = () => {
  getUserQueue().then(queueRes => {
    console.log("User queue:", queueRes);
    tracks.value = [queueRes.currently_playing, ...queueRes.queue];
  }).catch(err => {
    console.error("Error fetching user queue:", err);
  });
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
      }, 300);
    }
    setTimeout(() => {
      getPlaybackState();
    }, 300);
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
    }, 300);
  }).catch(err => {
    console.error("Error skipping to previous track:", err);
  });
};

const playClick = () => {
  togglePlayPause(playState?.value.is_playing).then(() => {
    console.log("Toggled play/pause successfully");
    setTimeout(() => {
      getQueue(true);
      getPlaybackState();
    }, 300);
  }).catch(err => {
    console.error("Error toggling play/pause:", err);
  });
  playState.value.is_playing = !playState.value.is_playing;
};

// const nowPlayingClick = () => {
//   curComponent.value = 'NowPlaying';
// };

const trackClick = (track: any, index: number) => {
  curIndex.value = index;
  curTrack.value = track;
};

</script>

<style scoped>
.albumart {
  max-width: 800px;
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