<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import VinylDetails from './components/VinylDetails.vue';
import AddVinylModal from './components/AddVinylModal.vue';
import PlayVinylModal from './components/PlayVinylModal.vue';

const router = useRouter();
const route = useRoute();
const vinylId = route.params.id as string;

const vinyl: any = ref({});
const showEditModal = ref(false);
const showPlayModal = ref(false);

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

const updateVinyl = (data: any) => {
  axios.put(`${apiUrl}/vinyls/${vinylId}`, data).then(result => {
    vinyl.value = result.data;
    showEditModal.value = false;
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

const openPlayModal = () => {
  showPlayModal.value = true;
}

const playVinyl = async (sides: Boolean[]) => {
  const sidesPlayed = sides.map((_, i) => i)
  await axios.post(`${apiUrl}/vinyls/${vinylId}/plays`, { sides: sidesPlayed }).catch(e => { console.log(e); });
  router.push('/');
}

</script>

<template>
  <AddVinylModal v-if="showEditModal" @close="showEditModal = false" :selected-vinyl="vinyl" @save-vinyl="updateVinyl" />
  <PlayVinylModal v-if="showPlayModal" @close="showPlayModal = false" :vinyl="vinyl" @play-vinyl="playVinyl" />
  <div class="header">
    <h1>Catalog</h1>
    <div>
      <button class="header-button" id="back" @click="$router.back()">←</button>
      <button class="header-button" id="edit" @click="showEditModal = true">✎</button>
      <button class="header-button" id="delete" @click="deleteVinyl">🗑</button>
    </div>
  </div>
  <VinylDetails v-if="vinyl.album" :vinyl="vinyl" @play="openPlayModal" />
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
</style>
