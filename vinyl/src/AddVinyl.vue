<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import VinylList from './components/VinylList.vue';
import AddVinylModal from './components/AddVinylModal.vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const route = useRoute();

const showModal = ref(false);
const selectedVinyl = ref({ album: '', artist: '', imageUrl: '' });

const selectVinyl = (vinyl: any) => {
  selectedVinyl.value = vinyl;
  showModal.value = true;
  return;
}

const onSaveVinyl = (nSides: any, discColor: any) => {
  axios.post(`${apiUrl}/vinyls`, { nSides, discColor, ...selectedVinyl.value }).then(result => {
    console.log(result);
    showModal.value = false;
  }).catch(e => {
    console.log(e);
  });
}

const results: any = ref([]);
const search = ref(route.query?.search || localStorage.getItem('search-term') ||'Taylor Swift');
const searchAlbum = async () => {
  if (!search.value) return;
  localStorage.setItem('search-term', search.value as string);
  axios.get(`${apiUrl}/vinyls/album/search?album=${search.value}`).then(result => {
    results.value = result.data
  }).catch(e => {
    console.log(e);
  });
}
const onSearch = () => {
  if (search.value) {
    searchAlbum();
    router.replace(`/catalog/add?search=${search.value}`)
  } else {
    results.value = [];
    router.replace('/catalog/add')
  }
}
searchAlbum();

</script>

<template>
  <AddVinylModal
    :selectedVinyl="selectedVinyl"
    :onSaveVinyl="onSaveVinyl"
    v-if="showModal"
    v-on:close="showModal = false"
  />

  <div class="header">
    <h1>Add To Catalog</h1>
    <div><button @click="$router.back()">←</button></div>
  </div>
  <div class="action-bar">
    <input class="album-search" v-model="search" type="text" placeholder="Search for albums..." @change="onSearch" />
    <button class="search-button" @click="onSearch()">🔍</button>
  </div>
  <VinylList :vinyls="results" v-on:add="selectVinyl" />
  <NavBar />
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header button {
    margin-bottom: 20px;
  }

  .action-bar {
    display: flex;
    align-items: center;
  }

  .album-search {
    margin: 8px 0;
    width: calc(100% - 16px);
    padding: 8px 0;
    padding-left: 16px;
    font-size: 16px;
    border-radius: 20px;
    border: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .search-button {
    width: 40px;
    height: 40px;
    padding: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>