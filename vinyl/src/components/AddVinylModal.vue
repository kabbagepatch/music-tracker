<template>
  <Modal>
    <template #header>
      <div v-if="selectedVinyl.album">
        <h2 class="modal-title">{{ selectedVinyl.album }}</h2>
        <h3 class="modal-artist">{{ selectedVinyl.artist }}</h3>
      </div>
      <div v-else>
        <h2 class="modal-title">Add Vinyl</h2>
      </div>
    </template>
    <template #body>
      <img v-if="selectedVinyl.imageUrl" class="modal-image" :src="selectedVinyl.imageUrl" />
      <div class="modal-inputs">
        <div v-if="!selectedVinyl.album" class="modal-input-container">
          <label for="album">Album</label>
          <input
            id="album"
            class="modal-input"
            v-model="album"
            type="text"
          />
        </div>
        <div v-if="!selectedVinyl.artist" class="modal-input-container">
          <label for="artist">Artist</label>
          <input
            id="artist"
            class="modal-input"
            v-model="artist"
            type="text"
          />
        </div>
        <div class="modal-input-container">
          <label for="n-sides"># Sides</label>
          <input
            id="n-sides"
            class="modal-input"
            v-model="nSides"
            type="text"
            placeholder="2"
          />
        </div>
        <div class="modal-input-container">
          <label for="disc-color">Disc Color</label>
          <input
            :style="{ background: 'black' }"
            id="disc-color"
            class="modal-input"
            v-model="discColor"
            type="color"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <button class="add-button" @click="onSaveVinyl({ album, artist, nSides, discColor })">Save</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  selectedVinyl: any,
  onSaveVinyl: any,
}>();

const album = ref(props.selectedVinyl?.album || '');
const artist = ref(props.selectedVinyl?.artist || '');
const nSides = ref(props.selectedVinyl?.nSides || '2');
const discColor = ref(props.selectedVinyl?.discColor || '#000000');
</script>

<style scoped>
  .modal-title {
    margin: 0;
  }

  .modal-artist {
    margin: 0;
  }

  .modal-image {
    width: 300px;
  }

  .modal-input-container {
    display: flex;
    align-items: center;
  }

  .modal-inputs {
    display: flex;
    flex-direction: column;
  }

  .modal-input {
    margin: 6px;
    border-radius: 20px;
    border: none;
  }

  #album, #artist {
    padding: 8px 16px;
    width: 100%;
  }

  #n-sides {
    padding: 8px 14px;
    width: 12px;
  }

  #disc-color {
    border-radius: 50px;
    background-color: transparent;
    width: 30px;
    height: 30px;
  }

  .add-button {
    border: 1px solid white;
  }
</style>