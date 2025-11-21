<template>
  <div class="container">
    <Header :titleOverride="trackKey.split(' - ')[0]" />
    <div class="summary">
      <div>Track Name: <span class="summary-title">{{ track.info?.trackName }}</span></div>
      <div>Artist: <span class="summary-title">{{ track.info?.artistName }}</span></div>
      <div>Album: <span class="summary-title">{{ track.info?.albumName }}</span></div>
      <div>Number of times played: <span class="summary-title">{{ track.plays?.length }}</span></div>
      <div>First Played on: <span class="summary-title">{{ new Date(track.plays?.[0].timeStamp).toLocaleDateString() }}</span></div>
    </div>
    <card class="plays-card">
      <h1>Plays</h1>
      <div class="plays" v-for="play in track.plays?.reverse()">
        On {{ new Date(play.timeStamp).toLocaleDateString() }} at {{ new Date(play.timeStamp).toLocaleTimeString() }} for {{ (play.msPlayed / 60000).toFixed(2) }} mins
      </div>
    </card>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useRoute } from "vue-router";
import Header from "../Header.vue";
import Card from "../components/Card.vue";

const route = useRoute();
const trackKey = route.params.track as string;

type TrackData = {
  id?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
}
type TrackStats = {
  [key: string]: {
    info?: TrackData,
    plays?: {
      timeStamp: string;
      msPlayed: number;
    }[]
  }
}

const track : Ref<TrackStats['']> = ref({})
import('../assets/data/processed/fullSongStats.json').then((module : any) => {
  track.value = module.default[trackKey];
});

</script>

<style scoped>
.summary {
  font-size: 18px;
  line-height: 28px;
  margin-bottom: 10px;
}

.summary-title {
  color: var(--primary-color);
}

.plays-card {
  text-align: left;
  font-weight: bold;
}

.plays-card h1 {
  margin-left: 5px;
}

.plays {
  color: var(--background-color);
  margin-bottom: 5px;  
}
</style>