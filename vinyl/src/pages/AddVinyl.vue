<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import VinylDetails from '../components/VinylDetails.vue';
import * as service from '../services/vinyls';
import type { Vinyl } from '../types';

const route = useRoute();
const router = useRouter();
const vinylId = route.params.id as string;

const vinyl = ref<Vinyl>();

const getDiscogsVinyl = async (id: string) => {
  try {
    vinyl.value = await service.getDiscogsVinyl(id);
    console.log(vinyl.value);
  } catch (e) {
    console.log(e);
  }
}
watch(() => vinylId, getDiscogsVinyl)
getDiscogsVinyl(vinylId);

const onAddVinyl = async () => {
  if (!vinyl.value) return;

  try {
    await service.createVinyl(vinyl.value.discogsId);
    localStorage.removeItem('search-term');
    router.push('/catalog');
  } catch (e) {
    console.log(e);
  }
}

</script>

<template>
  <VinylDetails :vinyl="vinyl" :onAdd="onAddVinyl" />
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
