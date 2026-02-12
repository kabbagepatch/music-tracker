<script setup lang="ts">
import axios, { AxiosError } from 'axios';
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import VinylDetails from '../components/VinylDetails.vue';
import AddVinylModal from '../components/AddVinylModal.vue';
import PlayVinylModal from '../components/PlayVinylModal.vue';
import * as service from '../services/vinyls';
import type { Vinyl } from '../types';

const router = useRouter();
const route = useRoute();
const vinylId = route.params.id as string;

const vinyl = ref<Vinyl>();
const showEditModal = ref(false);
const showPlayModal = ref(false);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const getVinyl = async (id: string) => {
  try {
    vinyl.value = await service.getVinyl(id);
  } catch (e) {
    console.log(e);
  }
}
watch(() => vinylId, getVinyl)
getVinyl(vinylId);

const updateVinyl = async (data: any) => {
  try {
    vinyl.value = await service.updateVinyl(vinylId, data);
  } catch (e) {
    console.log(e);
  }
}

const deleteVinyl = async () => {
  if (confirm('Are you sure you want to delete this vinyl from your catalog?')) {
    try {
      await service.deleteVinyl(vinylId);(`${apiUrl}/vinyls/${vinylId}`)
    } catch(e : any) {
      alert(e.response.data);
    };
  }
}

const openPlayModal = () => {
  showPlayModal.value = true;
}

const playVinyl = async (sides: Boolean[]) => {
  const sidesPlayed = sides.map((_, i) => i + 1)
  try {
    await service.playVinyl(vinylId, { sides: sidesPlayed });
    router.push('/');
  } catch (e) {
    console.log(e);
  }
}

</script>

<template>
  <AddVinylModal v-if="showEditModal && vinyl" @close="showEditModal = false" :selected-vinyl="vinyl" @save-vinyl="updateVinyl" />
  <PlayVinylModal v-if="showPlayModal && vinyl" @close="showPlayModal = false" :vinyl="vinyl" @play-vinyl="playVinyl" />
  <div class="header">
    <h2>Catalog</h2>
    <div class="button-container">
      <button class="header-button" id="back" @click="$router.back()">←</button>
      <button class="header-button" id="edit" @click="showEditModal = true">✎</button>
      <button class="header-button" id="delete" @click="deleteVinyl">🗑</button>
    </div>
  </div>
  <VinylDetails v-if="vinyl" :vinyl="vinyl" @play="openPlayModal" />
  <NavBar />
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .button-container {
    height: 30px;
    margin-bottom: 20px;
  }

  .header-button {
    width: 40px;
    height: 30px;
    padding: 0;
    line-height: 0;
  }

  #back {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 32px;
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
