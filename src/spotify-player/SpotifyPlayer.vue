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

    <now-playing
      :artists="curTrack?.artists.map((a: any) => a.name).join(',')"
      :songName="curTrack?.name"
      :backClick="backClick"
      :forwardClick="forwardClick"
      :menuClick="menuClick"
      :nowPlayingClick="nowPlayingClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import NowPlaying from "../components/NowPlaying.vue";
import Playlist from "../components/Playlist.vue";
import { getPlaylist } from '../services/spotify';

const curComponent = ref('NowPlaying');

const playlist: any = ref({});
const tracks: any = ref([]);
const curIndex = ref(0);
const curTrack: any = ref();

getPlaylist('1uRFGSIGuNELeRkNktwHRR').then(playlistres => {
  playlist.value = playlistres;
  tracks.value = playlistres.tracks.items
    .filter((item: any) => item.track.id)
    .map((item: any) => item.track);
  curTrack.value = tracks.value[curIndex.value];
}).catch(err => {
  console.error("Error fetching Spotify access token:", err);
});

const forwardClick = () => {
  curIndex.value = (curIndex.value + 1) % tracks.value.length;
  curTrack.value = tracks.value[curIndex.value];
};

const backClick = () => {
  curIndex.value = (curIndex.value - 1 + tracks.value.length) % tracks.value.length;
  curTrack.value = tracks.value[curIndex.value];
};

const menuClick = () => {
  curComponent.value = 'Playlist';
};

const nowPlayingClick = () => {
  curComponent.value = 'NowPlaying';
};

const trackClick = (track: any, index: number) => {
  curIndex.value = index;
  curTrack.value = track;
};

</script>

<style scoped>
h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 24px;
  width: 100%;
  color: white;
}

.albumart {
  max-width: 800px;
  display: flex;
  border-radius: 28px;
  margin-bottom: 10px;
  padding: 3px;
  background: #ffb3c6;
  filter: drop-shadow(0 0 0.15em #cc7296);
  justify-content: center;
}

.albumart img {
  width: 356px;
  height: 356px;
  will-change: filter;
  transition: 0.75s;
  border-radius: 28px;
  border: 1px solid #ff67a4;
}

.albumart:hover {
  filter: drop-shadow(0 0 2em #cc7296);
}
</style>