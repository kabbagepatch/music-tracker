<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';

const route = useRoute();
const vinylId = route.params.id as string;

const vinyl: any = ref([]);

const getVinyl = (id: string) => {
  axios.get(`${apiUrl}/vinyls/${id}`).then(result => {
    vinyl.value = result.data
  }).catch(e => {
    console.log(e);
  })
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;
watch(() => vinylId, (newValue) => {
  getVinyl(newValue);
})

getVinyl(vinylId);
</script>

<template>
  <div class="header">
    <h1>Catalog</h1>
    <div><button @click="$router.back()">←</button></div>
  </div>
  <section class="vinyl-header">
    <img class="vinyl-art" :src="vinyl.imageUrl" :alt="vinyl.album">
    <div class="vinyl-details">
        <h2 class="album">{{ vinyl.album }}</h2>
        <h3 class="artist" :style="{ color: vinyl.discColor === '#000' ? 'white' : vinyl.discColor }">{{ vinyl.artist }}</h3>
        <div class="published">Released: {{ vinyl.published }}</div>
    </div>
  </section>
  <section>
    <h3 class="subheader">Tags</h3>
    <div class="tags">
      <div v-for="tag in vinyl.tags">
        <div
          class="tag"
          :style="{
            color: vinyl.discColor === '#000' ? 'white' : vinyl.discColor,
            borderColor: vinyl.discColor === '#000' ? 'white' : vinyl.discColor
          }"
        >{{ tag }}</div>
      </div>
    </div>
  </section>
  <section>
    <h3 class="subheader">Track List</h3>
    <div class="tracks">
      <div v-for="(track, i) in vinyl.tracks">
        <div class="track">
          <span class="track-index">
            {{String.fromCharCode(65 + i / Math.ceil(vinyl.tracks.length / vinyl.nSides))}}{{(i % Math.ceil(vinyl.tracks.length / vinyl.nSides)) + 1}}.
          </span>
          <span>
            {{ track }}
          </span>
        </div>
      </div>
    </div>
  </section>
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
