<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue';
import { deleteVinylPlay, getVinylActivity } from '../services/vinyls';

let vinylActivity: any = ref([]);

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const timeOptions = { hour: 'numeric', minute: '2-digit' } as const;
getVinylActivity().then(result => {
  vinylActivity.value = result.map((a: any) => {
    const date = new Date(a.timestamp);
    return {
      ...a,
      dateString: date.toLocaleDateString('en-US', dateOptions),
      timeString: date.toLocaleTimeString('en-US', timeOptions),
      showTrash: false,
    };
  });
})

const deletePlay = async (row: any) => {
  await deleteVinylPlay(row.vinylId, row.playId);
  vinylActivity.value = vinylActivity.value.filter((a: any) => a.playId != row.playId);
}

</script>

<template>
  <h2>Activity</h2>
  <div class="plays">
    <div
      class="play-item"
      v-for="row in vinylActivity"
      :style="{ backgroundColor: row?.albumColors?.length ? row.albumColors[0] + '30' : 'rgb(41, 41, 41)' }"
      @click="row.showTrash=!row.showTrash"
    >
      <div class="album-info" @click="$router.push(`/catalog/${row.vinylId}`)">
        <img class="album-art" :src="row.imageUrl" :alt="row.album">
        <div>
          <div class="album">
            <span class="album-name" :style="{ color: row?.albumColors?.length ? row.albumColors[0] : 'white' }">
              {{ row.album.length > 27 ? row.album.slice(0, 25) + '..' : row.album }}
            </span>
            <span class="album-sides" v-if="row.sides.length < row.nSides">
              {{ row.sides.join(', ') }}
            </span>
          </div>
          <div class="artist">{{ row.artist }}</div>
        </div>
      </div>
      <div class="play-item-right">
        <div>
          <div class="date">{{ row.dateString }}</div>
          <div class="time">{{ row.timeString }}</div>
        </div>
        <div v-if="row.showTrash">
          <button class="icon-button" @click="deletePlay(row)">
            <img class="icon" src="../assets/icons/delete.png" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <NavBar />
</template>

<style scoped>
  h2 {
    margin-bottom: 16px;
  }

  .icon-button {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    background: none;
  }

  .plays {
    margin-bottom: 60px;
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
    cursor: pointer;
  }

  .play-item-right {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    gap: 10px;
  }

  .album-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .album-art {
    height: 50px;
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
