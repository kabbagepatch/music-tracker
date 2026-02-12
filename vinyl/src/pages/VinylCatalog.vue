<script setup lang="ts">
import { ref } from 'vue';

import VinylList from '../components/VinylList.vue';
import VinylTiles from '../components/VinylTiles.vue';
import NavBar from '../components/NavBar.vue';
import { getVinyls } from '../services/vinyls';
import type { Vinyl } from '../types';

const vinyls = ref<Vinyl[]>([]);
let vinylData: Vinyl[] = [];
getVinyls().then(data => {
  vinyls.value = data
  vinylData = ([] as Vinyl[]).concat(data);
});

const search = ref('');
const onSearch = () => {
  if (search.value)
    vinyls.value = vinylData.filter(v => (
      v.album.toLowerCase().includes(search.value.toLowerCase()) 
      || v.artist.toLowerCase().includes(search.value.toLowerCase())
    ));
  else {
    vinyls.value = ([] as Vinyl[]).concat(vinylData)
  }
}

const view = ref(localStorage.getItem('vinyl-catalog-view') || 'tile');
const toggleView = (v : 'tile' | 'list') => {
  view.value = v;
  localStorage.setItem('vinyl-catalog-view', v);
}

</script>

<template>
  <div class="content">
    <div class="action-bar">
      <input class="album-search" v-model="search" type="text" placeholder="Search catalog..." @input="onSearch" />
      <button :class="`view-toggle ${view === 'tile' ? 'selected' : ''}`" @click="toggleView('tile')">
        <img class="icon" src="../assets/icons/catalog.png" />
      </button>
      <button :class="`view-toggle ${view === 'list' ? 'selected'  : ''}`" @click="toggleView('list')">
        <img class="icon" src="../assets/icons/list.png" />
      </button>
    </div>
    <VinylList v-if="view == 'list'" :vinyls="vinyls" v-on:vinyl-select="(vinyl : any) => $router.push(`/catalog/${vinyl.id}`)" />
    <VinylTiles v-else :vinyls="vinyls" />
  </div>
  <NavBar />
</template>

<style scoped>
  .content {
    width: 100%;
    margin-bottom: 50px;
  }

  .action-bar {
    display: flex;
    align-items: center;
  }

  .album-search {
    width: 100%;
    margin: 8px 0;
    margin-right: 5px;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 20px;
    border: none;
  }

  .view-toggle {
    height: 35px;
    padding: 10px 12px;
    background-color: rgb(59, 59, 59);
  }

  .icon {
    width: 15px;
  }

  .view-toggle.selected {
    background-color: #1a1a1a;
  }

  .view-toggle:nth-of-type(1) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 1px solid rgb(236, 236, 236);
  }

  .view-toggle:nth-of-type(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>
