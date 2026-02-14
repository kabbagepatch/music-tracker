<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue';
import { getPlayHistory } from '../services/vinyls';

let playHistory: any = ref([]);

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;
getPlayHistory().then(result => {
  playHistory.value = result.map((a: any) => {
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
  <h2>Activity</h2>
  <div class="plays">
    <div class="play-item" v-for="row in playHistory" :style="{ backgroundColor: row?.albumColors?.length ? row.albumColors[0] + '10' : 'rgb(41, 41, 41)' }">
      <div class="album-info" @click="$router.push(`/catalog/${row.vinylId}`)">
        <img class="album-art" :src="row.imageUrl" :alt="row.album">
        <div>
          <div class="album">
            <span class="album-name">{{ row.album.length > 30 ? row.album.slice(0, 28) + '..' : row.album }}</span>
            <span class="album-sides" v-if="row.sides.length < row.nSides">{{ row.sides.join(', ') }}</span>
          </div>
          <div class="artist">{{ row.artist }}</div>
        </div>
      </div>
      <div>
        <div class="date" :style="{ color: row?.albumColors?.length ? row.albumColors[0] : 'white' }">{{ row.dateString }}</div>
        <div class="time">{{ row.timeString }}</div>
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

  .album-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .album-art {
    height: 40px;
  }

  .album {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .album-name {
    font-weight: bold;
  }

  .album-sides {
    color: #b3b3b3;
    font-size: 14px;
  }

  .artist {
    color: rgb(190, 190, 190);
    font-size: 15px;
  }

  .date, .time {
    text-align: right;
    margin-left: 4px;
    font-size: 15px;
  }

  .time {
    color: #b3b3b3;
    font-size: 14px;
  }
</style>
