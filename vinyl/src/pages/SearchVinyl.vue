<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import VinylList from '../components/VinylList.vue';
import { searchVinyls } from '../services/vinyls';

const router = useRouter();
const route = useRoute();

const selectVinyl = (vinyl: any) => {
  router.push(`/catalog/add/${vinyl.discogsId}`);
}

const results = ref<any>([]);
const search = ref(route.query?.search as string || localStorage.getItem('search-term'));
const searchAlbum = async () => {
  if (!search.value) return;
  localStorage.setItem('search-term', search.value as string);
  const vinylResults = await searchVinyls(search.value);
  results.value = vinylResults.map(v => ({
    discogsId: v.discogsId,
    album: v.title,
    artist: v.discColor,
    imageUrl: v.imageUrl,
  }));
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
  <div class="action-bar">
    <input class="album-search" v-model="search" type="text" placeholder="Search for albums..." @change="onSearch" />
    <button class="search-button" @click="onSearch()">🔍</button>
  </div>
  <VinylList :vinyls="results" @add="selectVinyl" @vinylSelect="selectVinyl" />
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

  .manual-add-row {
    background-color: rgb(41, 41, 41);
    padding: 6px 6px 6px 12px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-button {
    font-size: 24px;
    line-height: 1em;
    padding: 6px 12px;
  }
</style>