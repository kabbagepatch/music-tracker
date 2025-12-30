<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import VinylDetails from './components/VinylDetails.vue';
import AddVinylModal from './components/AddVinylModal.vue';

const router = useRouter();
const route = useRoute();
const vinylId = route.params.id as string;

const vinyl: any = ref({});
const showModal = ref(false);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const getVinyl = (id: string) => {
  axios.get(`${apiUrl}/vinyls/${id}`).then(result => {
    vinyl.value = result.data
  }).catch(e => {
    console.log(e);
  })
}
watch(() => vinylId, (newValue) => {
  getVinyl(newValue);
})
getVinyl(vinylId);

const updateVinyl = (nSides: any, disColor: any) => {
  axios.put(`${apiUrl}/vinyls/${vinylId}`, { nSides, disColor }).then(result => {
    vinyl.value = result.data;
    showModal.value = false;
  }).catch(e => {
    console.log(e);
  })
}

const deleteVinyl = () => {
  if (confirm('Are you sure you want to delete this vinyl from your catalog?\n\nAny listening history for vinyl will be deleted')) {
    axios.delete(`${apiUrl}/vinyls/${vinylId}`).then(_ => {
      router.replace('/catalog');
    }).catch(e => {
      console.log(e);
    });
  }
}

</script>

<template>
  <AddVinylModal v-if="showModal" v-on:close="showModal = false" :selected-vinyl="vinyl" v-on:save-vinyl="updateVinyl" />
  <div class="header">
    <h1>Catalog</h1>
    <div>
      <button class="header-button" id="back" @click="$router.back()">←</button>
      <button class="header-button" id="edit" @click="showModal = true">🖉</button>
      <button class="header-button" id="delete" @click="deleteVinyl">🗑</button>
    </div>
  </div>
  <VinylDetails v-if="vinyl.album" :vinyl="vinyl" />
  <NavBar />
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-button {
    margin-bottom: 20px;
    width: 40px;
    padding-left: 0;
    padding-right: 0;
  }

  #back {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #edit {
    background-color: rgb(48, 50, 121);
    border-radius: 0;
  }

  #delete {
    background-color: rgb(139, 46, 46);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  section {
    margin-bottom: 24px;
  }

  .vinyl-header {
    display: flex;
  }

  .vinyl-art {
    width: 150px;
    margin-right: 16px;
  }

  .album, .artist {
    margin: 0;
    line-height: 1.3em;
  }

  .album {
    margin-bottom: 10px;
  }

  .published {
    color: #b3b3b3
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .subheader {
    margin-top: 0;
    margin-bottom: 4px;
  }

  .tag {
    border: 1px solid white;
    font-size: 14px;
    padding: 0 12px;
    border-radius: 16px;
  }

  .track-index {
    color: #b3b3b3;
    margin-right: 8px;
  }
</style>
