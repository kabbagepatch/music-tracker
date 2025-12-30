<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue'
import NavBar from './components/NavBar.vue';

let playHistory: any = ref([]);

const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
axios.get(`${apiUrl}/vinyls/history`).then(r => {
  console.log(r.data)
  playHistory.value = r.data.map((a: any) => {
    const date = new Date(a.timestamp);
    return {
      ...a,
      dateString: date.toLocaleDateString('en-US', dateOptions),
      timeString: date.toLocaleTimeString('en-US', timeOptions),
    };
  });
})

</script>

<template>
  <h1>Activity</h1>
  <div class="plays">
    <div class="play-item play-item-header">
      <div class="vinyl-title">Vinyl</div>
      <div>Side</div>
      <div></div>
    </div>
    <div class="play-item" v-for="row in playHistory">
      <div class="album-info" @click="$router.push(`/catalog/${row.vinylId}`)">
        <img class="album-art" :src="row.thumbnailUrl" :alt="row.album">
        <div>
          <div class="album">{{ row.album.length > 20 ? row.album.slice(0, 18) + '..' : row.album }}</div>
          <div class="artist">{{ row.artist }}</div>
        </div>
      </div>
      <div>{{ row.side }}</div>
      <div>
        <div class="date">{{ row.dateString }}</div>
        <div class="date">{{ row.timeString }}</div>
      </div>
    </div>
  </div>
  <NavBar />
</template>

<style scoped>
  .plays {
    margin-bottom: 30px;
  }

  .vinyl-title {
    width: 110px;
    margin-left: 5px;
  }

  .play-item {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 4px;
    padding-right: 8px;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(41, 41, 41);
    margin-bottom: 8px;
  }

  .play-item-header {
    font-weight: bold;
    padding: 4px 45px;
  }

  .album-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 200px;
  }

  .album-art {
    height: 40px;
  }

  .artist {
    color: rgb(190, 190, 190);
    font-size: 15px;
  }

  .date {
    text-align: right;
    margin-left: 4px;
  }
</style>
