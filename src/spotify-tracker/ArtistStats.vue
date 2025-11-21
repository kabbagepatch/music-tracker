<template>
  <div class="container">
    <Header :titleOverride="artistKey" />
    <div class="summary">
      <div>Artist: <span class="summary-title">{{ artistKey }}</span></div>
      <div>Number of distinct tracks played: <span class="summary-title">{{ Object.keys(artist).length }}</span></div>
    </div>
    <card class="plays-card">
      <h1>Top Tracks</h1>
      <div class="plays" v-for="track in topTracks">
        {{ track }}
      </div>
    </card>
    <br />
    <card class="plays-card">
      <h1>First Tracks</h1>
      <div class="plays" v-for="track in firstTracks">
        {{ track }}
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
const artistKey = route.params.artist as string;

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
type ArtistStats = { [artistName: string]: TrackStats };

const allArtists : Ref<ArtistStats> = ref({});
const artist : Ref<ArtistStats['']> = ref({});
const topTracks : Ref<String[]> = ref([]);
const firstTracks : Ref<String[]> = ref([]);
import('../assets/data/processed/fullArtistStats.json').then((module : any) => {
  allArtists.value = module.default;
  artist.value = allArtists.value[artistKey];

  Object.entries(artist.value).sort((a, b) => b[1].plays.length - a[1].plays.length).slice(0, 5).forEach(([key, entry]) => {
    if (!entry?.plays) return;
    topTracks.value.push(`${key.split(' - ')[0]} - ${entry.plays.length} plays`);
  });

  let firstTimestamps : { [key : string]: number } = {};
  Object.keys(artist.value).forEach(key => {
    const songData = artist.value[key];
    if (!songData?.info?.trackName || !songData.plays) return;
    firstTimestamps[songData.info.trackName] = songData.plays.map(play => new Date(play.timeStamp).getTime()).sort((a, b) => a - b)[0];
  });
  
  Object.entries(firstTimestamps).sort((a, b) => (a[1] - b[1])).slice(0, 5).forEach(([key, timeStamp]) => {
    const date = new Date(timeStamp);
    firstTracks.value.push(`${key} - ${date.toDateString()}`);
  });
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
  margin-left: 2px;
}

.plays {
  color: var(--background-color);
  margin-bottom: 2px;  
}
</style>