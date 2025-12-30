<template>
  <Modal>
    <template #header>
      <div v-if="vinyl.album">
        <h2 class="modal-title">{{ vinyl.album }}</h2>
        <h3 class="modal-artist">{{ vinyl.artist }}</h3>
      </div>
      <div v-else>
        <h2 class="modal-title">Add Vinyl</h2>
      </div>
    </template>
    <template #body>
      <img v-if="vinyl.imageUrl" class="modal-image" :src="vinyl.imageUrl" />
      <div>
        <div class="checkbox-container" v-for="side in vinyl.nSides">
          <label :for="`side-${side}`">Side {{ side }}</label>
          <input :id="`side-${side}`" type="checkbox" v-model="sides[side - 1]" />
        </div>
      </div>
    </template>
    <template #footer>
      <button class="add-button" @click="onPlayVinyl(sides)">Play</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  vinyl: any,
  onPlayVinyl: any,
}>();

const sides = ref(new Array(props.vinyl.nSides).fill(true));
</script>

<style scoped>
  .modal-title {
    margin: 0;
  }

  .modal-artist {
    margin: 0;
  }

  .modal-image {
    width: 270px;
  }

  .checkbox-container {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .checkbox-container input {
    width: 20px;
    height: 20px;
  }

  .add-button {
    border: 1px solid white;
  }
</style>